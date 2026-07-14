import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { formatAmount, formatDisplayDate } from "@/data/invoices";
import { getInvoice, withComputed } from "@/lib/invoiceStore";
import StatusPill from "@/components/StatusPill";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { invoiceNumber: string };
}) {
  const raw = await getInvoice(params.invoiceNumber);
  const invoice = raw ? withComputed(raw) : undefined;

  return (
    <div className={styles.page}>
      <Link href="/billing/invoices" className={styles.back}>
        <ChevronLeft size={16} strokeWidth={1.5} />
        <span>Back to invoices</span>
      </Link>

      <h2 className={styles.title}>Invoice {params.invoiceNumber}</h2>

      {invoice ? (
        <>
          <dl className={styles.list}>
            <div className={styles.row}>
              <dt className={styles.dt}>Billable ID</dt>
              <dd className={styles.dd}>{invoice.billableId}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.dt}>Issue date</dt>
              <dd className={styles.dd}>
                {formatDisplayDate(invoice.issueDate)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.dt}>Due date</dt>
              <dd className={styles.dd}>
                {formatDisplayDate(invoice.dueDate)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.dt}>Amount billed</dt>
              <dd className={styles.dd}>
                {formatAmount(invoice.amountBilled, invoice.currency)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.dt}>Status</dt>
              <dd className={styles.dd}>
                <StatusPill invoice={invoice} />
              </dd>
            </div>
          </dl>

          <a
            href={`/api/invoices/${invoice.invoiceNumber}/download`}
            className={styles.downloadBtn}
          >
            <Download size={16} strokeWidth={1.5} />
            <span>Download invoice</span>
          </a>
        </>
      ) : (
        <p className={styles.note}>Invoice not found.</p>
      )}
    </div>
  );
}
