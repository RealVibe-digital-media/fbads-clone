import { NextRequest, NextResponse } from "next/server";
import {
  getInvoice,
  updateStatus,
  withComputed,
  InvoiceNotFoundError,
} from "@/lib/invoiceStore";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["due", "partially_paid", "paid", "overdue"] as const;

/** GET /api/invoices/[invoiceNumber] — one invoice with computed fields */
export async function GET(
  _req: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  const invoice = await getInvoice(params.invoiceNumber);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json({ invoice: withComputed(invoice) });
}

/** PATCH /api/invoices/[invoiceNumber] — body: { status } (manual status set) */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = body.status as (typeof VALID_STATUSES)[number];
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const invoice = await updateStatus(params.invoiceNumber, status);
    return NextResponse.json({ invoice: withComputed(invoice) });
  } catch (e) {
    if (e instanceof InvoiceNotFoundError) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    console.error("PATCH /api/invoices failed:", e);
    return NextResponse.json(
      { error: "Could not persist status — check server logs / DATABASE_URL." },
      { status: 500 }
    );
  }
}
