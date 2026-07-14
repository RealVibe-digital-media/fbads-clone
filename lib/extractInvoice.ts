import pdfParse from "pdf-parse/lib/pdf-parse.js";
import type { Invoice } from "@/data/invoices";

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseInvoiceDate(raw: string): string {
  // "02-Nov-2024" -> "2024-11-02"
  const m = raw.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) throw new Error(`Unrecognized date format: "${raw}"`);
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) throw new Error(`Unknown month: "${m[2]}"`);
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1]}`;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type ExtractedInvoice = Omit<Invoice, "status" | "dueInDays">;

/**
 * Extract the billing fields from a Meta invoice PDF.
 * Layout (verified on real invoices): "Invoice #:", "Invoice Date:",
 * "Account Id / Group:", "Invoice Total:", "Invoice Currency:", "NET n".
 */
export async function extractInvoiceFromPdf(
  buf: Buffer,
  sourceName: string
): Promise<ExtractedInvoice> {
  const { text } = await pdfParse(buf);

  const grab = (label: string, pattern: RegExp): string => {
    const m = text.match(pattern);
    if (!m) throw new Error(`Could not find "${label}" in ${sourceName}`);
    return m[1].trim();
  };

  const invoiceNumber = grab("Invoice #", /Invoice\s*#:\s*\n?\s*(\d+)/);
  const rawDate = grab(
    "Invoice Date",
    /Invoice Date:\s*\n?\s*(\d{2}-[A-Za-z]{3}-\d{4})/
  );
  const billableId = grab(
    "Account Id / Group",
    /Account Id \/ Group:\s*\n?\s*(\d+)/
  );
  const rawTotal = grab("Invoice Total", /Invoice Total:\s*([\d,]+\.\d{2})/);
  const currency = grab(
    "Invoice Currency",
    /Invoice Currency:\s*([A-Z]{3})/
  ) as Invoice["currency"];

  const termsMatch = text.match(/Payment Terms:\s*\n?\s*NET\s*(\d+)/i);
  const netDays = termsMatch ? parseInt(termsMatch[1], 10) : 30;
  const issueDate = parseInvoiceDate(rawDate);

  return {
    invoiceNumber,
    billableId,
    adAccountId: billableId,
    issueDate,
    dueDate: addDays(issueDate, netDays),
    amountBilled: parseFloat(rawTotal.replace(/,/g, "")),
    currency,
    pdfPath: `/invoices/${invoiceNumber}.pdf`,
  };
}
