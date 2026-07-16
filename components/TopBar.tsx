"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./TopBar.module.css";

export default function TopBar({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <h1 className={styles.title}>Billing &amp; payments</h1>

        <div className={styles.selectorWrap}>
          <button
            className={styles.selector}
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <span className={styles.bizAvatar} aria-hidden="true">
              {businessName.charAt(0)}
            </span>
            <span className={styles.bizName}>{businessName}</span>
            <ChevronDown size={16} strokeWidth={2} />
          </button>

          {open && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownItem}>{businessName}</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.avatarWrap}>
          <Image
            src="/realvibe-logo.png"
            alt="Profile"
            width={36}
            height={36}
            className={styles.avatar}
          />
          <span className={styles.fbBadge} aria-hidden="true">
            f
          </span>
        </div>
      </div>
    </header>
  );
}
