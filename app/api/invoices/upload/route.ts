import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { extractInvoiceFromPdf } from "@/lib/extractInvoice";
import {
  insertInvoice,
  replaceInvoice,
  withComputed,
  DuplicateInvoiceError,
} from "@/lib/invoiceStore";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // parsing many PDFs can take a moment

/**
 * POST /api/invoices/upload  (admin)
 * multipart/form-data with one or more `files` fields (PDF invoices).
 * Each PDF is parsed (invoice #, account ID, date, total) and inserted.
 * An invoice number that already exists is REJECTED (per-file error with
 * `duplicate: true`) — unless the request carries `replace=1`, in which case
 * the existing invoice's PDF and fields are replaced (status is kept).
 * The admin UI sends replace=1 only after the user confirms.
 */
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }

  const form = await req.formData();
  const replace = form.get("replace") === "1";
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No files provided (use multipart field `files`)" },
      { status: 400 }
    );
  }

  const results = [];
  for (const file of files) {
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      const extracted = await extractInvoiceFromPdf(buf, file.name);
      try {
        const invoice = await insertInvoice(extracted, buf);
        results.push({
          file: file.name,
          ok: true,
          invoice: withComputed(invoice),
        });
      } catch (e) {
        if (e instanceof DuplicateInvoiceError && replace) {
          // User confirmed the overwrite in the admin UI
          const invoice = await replaceInvoice(extracted, buf);
          results.push({
            file: file.name,
            ok: true,
            replaced: true,
            invoice: withComputed(invoice),
          });
        } else {
          throw e;
        }
      }
    } catch (e) {
      results.push({
        file: file.name,
        ok: false,
        duplicate: e instanceof DuplicateInvoiceError,
        error: e instanceof Error ? e.message : "Failed to process PDF",
      });
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  return NextResponse.json(
    { results, uploaded: results.length - failed, failed },
    { status: failed === results.length ? 422 : 200 }
  );
}
