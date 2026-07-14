import LeftRail from "@/components/LeftRail";
import { businessMeta } from "@/data/invoices";
import styles from "./layout.module.css";

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root}>
      <LeftRail businessName={businessMeta.name} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
