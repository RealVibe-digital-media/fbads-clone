"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import type { Invoice } from "@/data/invoices";
import { formatAmount, formatDisplayDate } from "@/data/invoices";
import StatusPill from "./StatusPill";
import styles from "./InvoiceTable.module.css";

interface Props {
  invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: Props) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            <th className={`${styles.th} ${styles.colInvoice}`}>Invoice number</th>
            <th className={`${styles.th} ${styles.colDate}`}>Issue date</th>
            <th className={`${styles.th} ${styles.colAmount}`}>Amount billed</th>
            <th className={`${styles.th} ${styles.colStatus}`}>Status</th>
            <th className={`${styles.th} ${styles.colAction}`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceNumber} className={styles.row}>
              <td className={`${styles.td} ${styles.colInvoice}`}>
                <Link
                  href={`/billing/invoices/${inv.invoiceNumber}`}
                  className={styles.invoiceLink}
                >
                  {inv.invoiceNumber}
                </Link>
                <div className={styles.billableId}>
                  Billable ID: {inv.billableId}
                </div>
              </td>
              <td className={`${styles.td} ${styles.colDate}`}>
                {formatDisplayDate(inv.issueDate)}
              </td>
              <td className={`${styles.td} ${styles.colAmount}`}>
                {formatAmount(inv.amountBilled, inv.currency)}
              </td>
              <td className={`${styles.td} ${styles.colStatus}`}>
                <StatusPill invoice={inv} />
              </td>
              <td className={`${styles.td} ${styles.colAction}`}>
                {/* Downloads the actual invoice PDF (served from the DB) */}
                <a
                  className={styles.actionBtn}
                  href={`/api/invoices/${inv.invoiceNumber}/download`}
                  aria-label={`Download invoice ${inv.invoiceNumber}`}
                >
                  <Download size={16} strokeWidth={1.5} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoices.length === 0 && (
        <div className={styles.empty}>No invoices match the current filters.</div>
      )}
    </div>
  );
}
