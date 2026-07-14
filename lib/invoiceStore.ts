import fs from "fs";
import path from "path";
import manifestStatic from "@/data/invoices.json";
import type { Invoice, InvoiceStatus } from "@/data/invoices";
import { getSql } from "@/lib/db";
import { getPdfFromStorage, putPdfToStorage } from "@/lib/s3";

export interface Manifest {
  generatedAt: string;
  invoices: Invoice[];
}

const MANIFEST_FILE = path.join(process.cwd(), "data", "invoices.json");

/* ------------------------------------------------------------------ */
/* File fallback (used only when DATABASE_URL is not configured)       */
/* ------------------------------------------------------------------ */

function readManifest(): Manifest {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8")) as Manifest;
  } catch {
    return manifestStatic as unknown as Manifest;
  }
}

/* ------------------------------------------------------------------ */
/* Postgres row mapping                                                */
/* ------------------------------------------------------------------ */

interface Row {
  invoice_number: string;
  billable_id: string;
  ad_account_id: string;
  issue_date: Date | string;
  due_date: Date | string;
  amount_billed: string; // numeric comes back as string
  currency: string;
  status: InvoiceStatus;
  pdf_path: string;
}

function toIso(d: Date | string): string {
  return d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10);
}

function rowToInvoice(r: Row): Invoice {
  return {
    invoiceNumber: r.invoice_number,
    billableId: r.billable_id,
    adAccountId: r.ad_account_id,
    issueDate: toIso(r.issue_date),
    dueDate: toIso(r.due_date),
    amountBilled: parseFloat(r.amount_billed),
    currency: r.currency as Invoice["currency"],
    status: r.status,
    pdfPath: r.pdf_path,
  };
}

/* ------------------------------------------------------------------ */
/* Store API (DB-first, manifest fallback)                             */
/* ------------------------------------------------------------------ */

export async function getInvoices(): Promise<Invoice[]> {
  const sql = getSql();
  if (sql) {
    const rows = await sql<Row[]>`
      select invoice_number, billable_id, ad_account_id, issue_date, due_date,
             amount_billed, currency, status, pdf_path
      from public.invoices
      order by issue_date desc, invoice_number desc
    `;
    return rows.map(rowToInvoice);
  }
  return readManifest().invoices;
}

export async function getInvoice(
  invoiceNumber: string
): Promise<Invoice | undefined> {
  const sql = getSql();
  if (sql) {
    const rows = await sql<Row[]>`
      select invoice_number, billable_id, ad_account_id, issue_date, due_date,
             amount_billed, currency, status, pdf_path
      from public.invoices
      where invoice_number = ${invoiceNumber}
    `;
    return rows[0] ? rowToInvoice(rows[0]) : undefined;
  }
  return readManifest().invoices.find(
    (i) => i.invoiceNumber === invoiceNumber
  );
}

export async function updateStatus(
  invoiceNumber: string,
  status: InvoiceStatus
): Promise<Invoice> {
  const sql = getSql();
  if (sql) {
    const rows = await sql<Row[]>`
      update public.invoices
      set status = ${status}, updated_at = now()
      where invoice_number = ${invoiceNumber}
      returning invoice_number, billable_id, ad_account_id, issue_date,
                due_date, amount_billed, currency, status, pdf_path
    `;
    if (!rows[0]) throw new InvoiceNotFoundError(invoiceNumber);
    return rowToInvoice(rows[0]);
  }

  // File mode (local dev without a DB)
  const manifest = readManifest();
  const invoice = manifest.invoices.find(
    (i) => i.invoiceNumber === invoiceNumber
  );
  if (!invoice) throw new InvoiceNotFoundError(invoiceNumber);
  invoice.status = status;
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  return invoice;
}

/**
 * Insert an invoice from an uploaded PDF (admin panel).
 * DUPLICATES ARE REJECTED: if the invoice number already exists, this throws
 * DuplicateInvoiceError and nothing is written (not the DB row, not the PDF).
 * The PDF goes to Supabase Storage (primary) and Postgres bytea (backup).
 */
export async function insertInvoice(
  inv: Omit<Invoice, "status" | "dueInDays">,
  pdf: Buffer
): Promise<Invoice> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Uploads require DATABASE_URL to be configured");
  }

  const existing = await sql`
    select 1 from public.invoices where invoice_number = ${inv.invoiceNumber}
  `;
  if (existing.length > 0) {
    throw new DuplicateInvoiceError(inv.invoiceNumber);
  }

  await putPdfToStorage(inv.invoiceNumber, pdf); // no-op if S3 not configured
  const rows = await sql<Row[]>`
    insert into public.invoices
      (invoice_number, billable_id, ad_account_id, issue_date, due_date,
       amount_billed, currency, status, pdf_path, pdf_data)
    values
      (${inv.invoiceNumber}, ${inv.billableId}, ${inv.adAccountId},
       ${inv.issueDate}, ${inv.dueDate}, ${inv.amountBilled},
       ${inv.currency}, 'due', ${inv.pdfPath}, ${pdf})
    on conflict (invoice_number) do nothing
    returning invoice_number, billable_id, ad_account_id, issue_date,
              due_date, amount_billed, currency, status, pdf_path
  `;
  // Race-safety: if another request inserted it between our check and now
  if (!rows[0]) throw new DuplicateInvoiceError(inv.invoiceNumber);
  return rowToInvoice(rows[0]);
}

export class DuplicateInvoiceError extends Error {
  constructor(invoiceNumber: string) {
    super(
      `Invoice ${invoiceNumber} already exists — the same invoice number cannot be uploaded twice`
    );
  }
}

/**
 * Replace an existing invoice with a newly uploaded PDF (user-confirmed).
 * Refreshes the extracted fields and the stored PDF (Storage + bytea);
 * the manually-set status is kept.
 */
export async function replaceInvoice(
  inv: Omit<Invoice, "status" | "dueInDays">,
  pdf: Buffer
): Promise<Invoice> {
  const sql = getSql();
  if (!sql) {
    throw new Error("Uploads require DATABASE_URL to be configured");
  }
  await putPdfToStorage(inv.invoiceNumber, pdf);
  const rows = await sql<Row[]>`
    update public.invoices set
      billable_id   = ${inv.billableId},
      ad_account_id = ${inv.adAccountId},
      issue_date    = ${inv.issueDate},
      due_date      = ${inv.dueDate},
      amount_billed = ${inv.amountBilled},
      currency      = ${inv.currency},
      pdf_path      = ${inv.pdfPath},
      pdf_data      = ${pdf},
      updated_at    = now()
    where invoice_number = ${inv.invoiceNumber}
    returning invoice_number, billable_id, ad_account_id, issue_date,
              due_date, amount_billed, currency, status, pdf_path
  `;
  if (!rows[0]) throw new InvoiceNotFoundError(inv.invoiceNumber);
  return rowToInvoice(rows[0]);
}

/**
 * The PDF bytes for download.
 * Order: Supabase Storage (S3) → Postgres bytea → local static file.
 * Storage is primary — replacing a PDF in the Storage UI takes effect
 * immediately without touching the database.
 */
export async function getInvoicePdf(
  invoiceNumber: string
): Promise<Buffer | null> {
  const fromStorage = await getPdfFromStorage(invoiceNumber);
  if (fromStorage) return fromStorage;

  const sql = getSql();
  if (sql) {
    const rows = await sql<{ pdf_data: Buffer | null }[]>`
      select pdf_data from public.invoices
      where invoice_number = ${invoiceNumber}
    `;
    if (rows[0]?.pdf_data) return Buffer.from(rows[0].pdf_data);
  }
  // Fallback: static file shipped in public/invoices/
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "public", "invoices", `${invoiceNumber}.pdf`)
    );
  } catch {
    return null;
  }
}

export class InvoiceNotFoundError extends Error {
  constructor(invoiceNumber: string) {
    super(`Invoice ${invoiceNumber} not found`);
  }
}

/* ------------------------------------------------------------------ */
/* Computed fields                                                     */
/* ------------------------------------------------------------------ */

/** Days from today (UTC) until the invoice's due date; negative = past due. */
export function daysUntilDue(dueDate: string): number {
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const due = new Date(dueDate + "T00:00:00Z").getTime();
  return Math.round((due - todayUtc) / 86_400_000);
}

/**
 * Decorate an invoice with computed fields:
 *  - dueInDays (relative to today)
 *  - status auto-escalates "due" -> "overdue" once past the due date
 *    (manual statuses like paid / partially_paid are never overridden)
 */
export function withComputed(invoice: Invoice): Invoice {
  const dueInDays = daysUntilDue(invoice.dueDate);
  const status =
    invoice.status === "due" && dueInDays < 0 ? "overdue" : invoice.status;
  return { ...invoice, dueInDays, status };
}
