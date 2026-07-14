export type InvoiceStatus = "due" | "partially_paid" | "paid" | "overdue";

export interface Invoice {
  invoiceNumber: string;
  billableId: string;
  adAccountId: string;
  issueDate: string; // ISO yyyy-mm-dd (parsed from the PDF)
  dueDate: string; // ISO, issueDate + payment terms (NET 30)
  amountBilled: number;
  currency: "INR" | "USD";
  status: InvoiceStatus; // manual field, set per invoice
  dueInDays?: number; // computed by the API relative to today
  pdfPath: string; // static path of the uploaded PDF
}

export interface BusinessMeta {
  name: string;
  businessId: string;
  nextBillingPeriod: string;
}

export const businessMeta: BusinessMeta = {
  name: "RealVibe Digital Media",
  businessId: "282894218196972",
  nextBillingPeriod: "$7,110.37",
};

const currencySymbol: Record<Invoice["currency"], string> = {
  INR: "₹",
  USD: "$",
};

// NOTE: The reference screenshot and every target value in the spec use
// Western thousands grouping (e.g. ₹1,123,392.13), so we format with "en-US"
// to stay pixel-exact. "en-IN" would render lakh grouping (₹11,23,392.13),
// which would not match the reference.
function group(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Table cell format: "₹221,649.92 INR" */
export function formatAmount(amount: number, currency: Invoice["currency"]): string {
  return `${currencySymbol[currency]}${group(amount)} ${currency}`;
}

/** Summary format: "₹363,856.94" */
export function formatMoney(amount: number, currency: Invoice["currency"]): string {
  return `${currencySymbol[currency]}${group(amount)}`;
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** ISO "2024-11-02" -> display "2 Nov 2024" (matches Ads Manager) */
export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}
