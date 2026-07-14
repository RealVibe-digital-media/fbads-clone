import { NextRequest, NextResponse } from "next/server";
import { getInvoices, withComputed } from "@/lib/invoiceStore";

export const dynamic = "force-dynamic";

/**
 * GET /api/invoices
 *
 * Query params (all optional, combinable):
 *   q           text search across invoice number + billable ID
 *   account     exact billable/ad-account ID
 *   from, to    ISO dates, inclusive range on issueDate
 *   outstanding "1" -> only invoices whose status is not "paid"
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const account = searchParams.get("account");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const outstanding = searchParams.get("outstanding") === "1";

  const all = (await getInvoices()).map(withComputed);

  const invoices = all.filter((inv) => {
    if (outstanding && inv.status === "paid") return false;
    if (account && inv.adAccountId !== account && inv.billableId !== account)
      return false;
    if (from && inv.issueDate < from) return false;
    if (to && inv.issueDate > to) return false;
    if (q) {
      const haystack = `${inv.invoiceNumber} ${inv.billableId}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  // Meta computed over ALL invoices (filters don't change the business totals)
  const unpaid = all.filter((i) => i.status !== "paid");
  const amountDue = unpaid.reduce((sum, i) => sum + i.amountBilled, 0);
  const dates = all.map((i) => i.issueDate).sort();

  return NextResponse.json({
    invoices,
    meta: {
      accounts: Array.from(new Set(all.map((i) => i.billableId))),
      minDate: dates[0] ?? null,
      maxDate: dates[dates.length - 1] ?? null,
      amountDue,
      currency: all[0]?.currency ?? "INR",
      total: all.length,
    },
  });
}
