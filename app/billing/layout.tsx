import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import LeftRail from "@/components/LeftRail";
import { businessMeta } from "@/data/invoices";
import styles from "./layout.module.css";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root}>
      <LeftRail businessName={businessMeta.name} />
      <div className={styles.main}>
        <TopBar businessName={businessMeta.name} />
        <div className={styles.body}>
          <Sidebar />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
