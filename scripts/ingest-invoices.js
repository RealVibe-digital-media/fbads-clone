/**
 * Ingest invoice PDFs.
 *
 * Scans public/invoices/*.pdf, extracts the fields below from each PDF's text,
 * and writes data/invoices.json (the manifest the app serves from).
 *
 *   Invoice #:            -> invoiceNumber
 *   Account Id / Group:   -> billableId (+ adAccountId)
 *   Invoice Date:         -> issueDate (ISO)
 *   Invoice Total:        -> amountBilled
 *   Invoice Currency:     -> currency
 *   Payment Terms: NET n  -> dueDate = issueDate + n days
 *
 * `status` is MANUAL: existing statuses in the manifest are preserved on
 * re-ingest; new invoices default to "due".
 *
 * Run with:  npm run ingest
 */
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { loadEnvLocal } = require("./env");

const PDF_DIR = path.join(__dirname, "..", "public", "invoices");
const OUT_FILE = path.join(__dirname, "..", "data", "invoices.json");

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseInvoiceDate(raw) {
  // "02-Nov-2024" -> "2024-11-02"
  const m = raw.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) throw new Error(`Unrecognized date format: "${raw}"`);
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) throw new Error(`Unknown month: "${m[2]}"`);
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1]}`;
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function extract(text, fileName) {
  const grab = (label, pattern) => {
    const m = text.match(pattern);
    if (!m) throw new Error(`Could not find "${label}" in ${fileName}`);
    return m[1].trim();
  };

  const invoiceNumber = grab("Invoice #", /Invoice\s*#:\s*\n?\s*(\d+)/);
  const rawDate = grab("Invoice Date", /Invoice Date:\s*\n?\s*(\d{2}-[A-Za-z]{3}-\d{4})/);
  const billableId = grab("Account Id / Group", /Account Id \/ Group:\s*\n?\s*(\d+)/);
  const rawTotal = grab("Invoice Total", /Invoice Total:\s*([\d,]+\.\d{2})/);
  const currency = grab("Invoice Currency", /Invoice Currency:\s*([A-Z]{3})/);

  // Payment terms are optional; default NET 30 (Meta's standard)
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
    pdfPath: `/invoices/${path.basename(fileName)}`,
  };
}

async function main() {
  const files = fs
    .readdirSync(PDF_DIR)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  if (files.length === 0) {
    console.error(`No PDFs found in ${PDF_DIR}`);
    process.exit(1);
  }

  // Preserve manual statuses from a previous run
  let previous = {};
  if (fs.existsSync(OUT_FILE)) {
    try {
      for (const inv of JSON.parse(fs.readFileSync(OUT_FILE, "utf8")).invoices) {
        previous[inv.invoiceNumber] = inv;
      }
    } catch {
      console.warn("Warning: existing manifest unreadable, starting fresh.");
    }
  }

  const invoices = [];
  const pdfBuffers = {}; // invoiceNumber -> Buffer (for the DB upsert)
  for (const file of files) {
    const buf = fs.readFileSync(path.join(PDF_DIR, file));
    const { text } = await pdf(buf);
    const inv = extract(text, file);
    pdfBuffers[inv.invoiceNumber] = buf;

    const expectedName = `${inv.invoiceNumber}.pdf`;
    if (file !== expectedName) {
      console.warn(
        `Warning: ${file} contains Invoice # ${inv.invoiceNumber} (expected filename ${expectedName})`
      );
    }

    const prev = previous[inv.invoiceNumber];
    inv.status = prev?.status ?? "due"; // manual field — preserved across ingests
    invoices.push(inv);
    console.log(
      `✓ ${file}: #${inv.invoiceNumber}  ${inv.issueDate}  ${inv.currency} ${inv.amountBilled.toLocaleString("en-US")}  acct ${inv.billableId}  status=${inv.status}`
    );
  }

  // Newest first, like the real Ads Manager
  invoices.sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1));

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ generatedAt: new Date().toISOString(), invoices }, null, 2)
  );
  console.log(`\nWrote ${invoices.length} invoice(s) to data/invoices.json`);

  // Upsert into Supabase Postgres when configured. Field data is refreshed
  // from the PDF; `status` is manual so existing rows keep theirs (new rows
  // seed from the manifest value).
  loadEnvLocal();
  if (process.env.DATABASE_URL) {
    const postgres = require("postgres");
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: "require",
      prepare: false,
    });
    for (const inv of invoices) {
      await sql`
        insert into public.invoices
          (invoice_number, billable_id, ad_account_id, issue_date, due_date,
           amount_billed, currency, status, pdf_path, pdf_data)
        values
          (${inv.invoiceNumber}, ${inv.billableId}, ${inv.adAccountId},
           ${inv.issueDate}, ${inv.dueDate}, ${inv.amountBilled},
           ${inv.currency}, ${inv.status}, ${inv.pdfPath},
           ${pdfBuffers[inv.invoiceNumber]})
        on conflict (invoice_number) do update set
          billable_id   = excluded.billable_id,
          ad_account_id = excluded.ad_account_id,
          issue_date    = excluded.issue_date,
          due_date      = excluded.due_date,
          amount_billed = excluded.amount_billed,
          currency      = excluded.currency,
          pdf_path      = excluded.pdf_path,
          pdf_data      = excluded.pdf_data,
          updated_at    = now()
      `;
    }
    const [{ count }] =
      await sql`select count(*)::int as count from public.invoices`;
    await sql.end();
    console.log(`Upserted to Supabase Postgres — table now has ${count} row(s).`);
  } else {
    console.log("DATABASE_URL not set — skipped Supabase upsert (file mode).");
  }
}

main().catch((e) => {
  console.error("Ingest failed:", e.message);
  process.exit(1);
});
