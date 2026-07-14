"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose } from "lucide-react";
import styles from "./Sidebar.module.css";

type NavItem = {
  label: string;
  href: string;
  icon: string; // webp path (rendered as a tintable CSS mask)
};

const NAV: NavItem[] = [
  { label: "Accounts", href: "/billing/accounts", icon: "/icons/accounts.webp" },
  { label: "Payment methods", href: "/billing/payment-methods", icon: "/icons/payment-methods.webp" },
  { label: "Payment activity", href: "/billing/payment-activity", icon: "/icons/payment-activity.webp" },
  { label: "Credit lines", href: "/billing/credit-lines", icon: "/icons/credit-lines.webp" },
  { label: "Invoices", href: "/billing/invoices", icon: "/icons/invoices.webp" },
  { label: "Legal entities", href: "/billing/legal-entities", icon: "/icons/legal-entities.webp" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar} aria-label="Billing navigation">
      <ul className={styles.list}>
        {NAV.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.item} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={styles.maskIcon}
                  style={{
                    WebkitMaskImage: `url(${icon})`,
                    maskImage: `url(${icon})`,
                  }}
                  aria-hidden="true"
                />
                <span className={styles.label}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.collapseRow}>
        <button className={styles.collapseBtn} aria-label="Collapse sidebar">
          <PanelLeftClose size={16} strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}
