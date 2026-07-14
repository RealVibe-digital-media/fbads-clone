import type { Invoice } from "@/data/invoices";
import styles from "./StatusPill.module.css";

export default function StatusPill({ invoice }: { invoice: Invoice }) {
  let text: string;
  let variant: string;

  switch (invoice.status) {
    case "due":
      text = `Due in ${invoice.dueInDays} days`;
      variant = styles.yellow;
      break;
    case "partially_paid":
      text = "Partially paid";
      variant = styles.yellow;
      break;
    case "paid":
      text = "Paid";
      variant = styles.green;
      break;
    case "overdue":
      text = "Overdue";
      variant = styles.red;
      break;
    default:
      text = "";
      variant = styles.yellow;
  }

  return <span className={`${styles.pill} ${variant}`}>{text}</span>;
}
