import { Info } from "lucide-react";
import styles from "./BusinessSummary.module.css";

interface Props {
  businessName: string;
  businessId: string;
  amountDue: string;
  nextBillingPeriod: string;
}

export default function BusinessSummary({
  businessName,
  businessId,
  amountDue,
  nextBillingPeriod,
}: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.label}>Business name</span>
        <span className={styles.value}>
          {businessName} ({businessId})
        </span>
      </div>

      <div className={styles.right}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>
            Amount due
            <span
              className={styles.infoIcon}
              title="Total amount currently owed across all invoices."
            >
              <Info size={12} strokeWidth={2} />
            </span>
          </span>
          <span className={styles.statValue}>{amountDue}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>
            Next billing period
            <span
              className={styles.infoIcon}
              title="Estimated amount for your next billing period."
            >
              <Info size={12} strokeWidth={2} />
            </span>
          </span>
          <span className={styles.statValue}>{nextBillingPeriod}</span>
        </div>
      </div>
    </div>
  );
}
