import { NextRequest, NextResponse } from "next/server";
import { getInvoicePdf } from "@/lib/invoiceStore";

export const dynamic = "force-dynamic";

/** GET /api/invoices/[invoiceNumber]/download — streams the invoice PDF. */
export async function GET(
  _req: NextRequest,
  { params }: { params: { invoiceNumber: string } }
) {
  // Invoice numbers are numeric — reject anything else (path safety)
  if (!/^\d+$/.test(params.invoiceNumber)) {
    return NextResponse.json({ error: "Invalid invoice number" }, { status: 400 });
  }

  const pdf = await getInvoicePdf(params.invoiceNumber);
  if (!pdf) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${params.invoiceNumber}.pdf"`,
      "Content-Length": String(pdf.length),
    },
  });
}
