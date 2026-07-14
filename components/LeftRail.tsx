"use client";

import { useState } from "react";
import {
  Bell,
  Gauge,
  Table,
  Newspaper,
  Users,
  Megaphone,
  CreditCard,
  Share2,
  Menu,
  Sparkles,
  HelpCircle,
  Contact,
  Settings,
  Search,
  MessageCircleQuestion,
  Bug,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import styles from "./LeftRail.module.css";

const NAV = [
  { key: "overview", label: "Account overview", Icon: Gauge, badge: 5 },
  { key: "campaigns", label: "Campaigns", Icon: Table },
  { key: "reporting", label: "Ads Reporting", Icon: Newspaper },
  { key: "audiences", label: "Audiences", Icon: Users },
  { key: "adsettings", label: "Advertising settings", Icon: Megaphone },
  { key: "billing", label: "Billing & payments", Icon: CreditCard, active: true },
  { key: "events", label: "Events Manager", Icon: Share2 },
  { key: "alltools", label: "All tools", Icon: Menu },
];

const UTILITY = [
  { key: "help", label: "Help", Icon: HelpCircle },
  { key: "contact", label: "Contacts", Icon: Contact },
  { key: "settings", label: "Settings", Icon: Settings },
  { key: "search", label: "Search", Icon: Search },
  { key: "support", label: "Support", Icon: MessageCircleQuestion },
  { key: "bug", label: "Report a problem", Icon: Bug },
];

const MetaMark = ({ size = 24 }: { size?: number }) => (
  // Plain <img> (not next/image): the logo is a static SVG that mounts/unmounts
  // on every hover of the panel. next/image with `priority` injects a <head>
  // preload link and throws "removeChild of null" on unmount, so we avoid it.
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/meta-logo.svg"
    alt="Meta"
    width={Math.round(size * 1.5)}
    height={size}
  />
);

export default function LeftRail({
  businessName,
}: {
  businessName: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Collapsed icon rail */}
      <div className={styles.rail} aria-label="Navigation" role="navigation">
        <div className={styles.railTop}>
          <span className={styles.railLogo}>
            <MetaMark size={24} />
          </span>
          <span className={styles.bizAvatar} aria-hidden="true">
            {businessName.charAt(0)}
          </span>
          <span className={styles.railIcon}>
            <Bell size={22} strokeWidth={1.5} />
          </span>

          <div className={styles.railDivider} />

          {NAV.map(({ key, Icon, badge, active }) => (
            <span
              key={key}
              className={`${styles.railIcon} ${active ? styles.railActive : ""}`}
            >
              <Icon size={22} strokeWidth={1.5} />
              {badge ? <span className={styles.badge}>{badge}</span> : null}
            </span>
          ))}
        </div>

        <div className={styles.railBottom}>
          <span className={`${styles.railIcon} ${styles.metaAi}`}>
            <Sparkles size={22} strokeWidth={1.5} />
          </span>
          {UTILITY.map(({ key, Icon }) => (
            <span key={key} className={styles.railIcon}>
              <Icon size={22} strokeWidth={1.5} />
            </span>
          ))}
        </div>
      </div>

      {/* Expanded panel — shown on hover */}
      {expanded && (
        <nav className={styles.panel} aria-label="Ads Manager navigation">
          <div className={styles.panelHeader}>
            <MetaMark size={24} />
          </div>
          <h2 className={styles.panelTitle}>Ads Manager</h2>

          <button className={styles.bizSelector}>
            <span className={styles.bizAvatarSm} aria-hidden="true">
              {businessName.charAt(0)}
            </span>
            <span className={styles.bizName}>{businessName}</span>
            <ChevronDown size={16} strokeWidth={1.5} />
          </button>

          <button className={styles.panelItem}>
            <Bell size={20} strokeWidth={1.5} className={styles.panelIcon} />
            <span className={styles.panelLabel}>Notifications</span>
          </button>

          <ul className={styles.panelList}>
            {NAV.map(({ key, label, Icon, badge, active }) => (
              <li key={key}>
                <button
                  className={`${styles.panelItem} ${
                    active ? styles.panelActive : ""
                  }`}
                >
                  <Icon size={20} strokeWidth={1.5} className={styles.panelIcon} />
                  <span className={styles.panelLabel}>{label}</span>
                  {badge ? (
                    <span className={styles.panelBadge}>{badge}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.panelSectionLabel}>Frequently used</div>
          <button className={styles.panelItem}>
            <ShieldCheck size={20} strokeWidth={1.5} className={styles.panelIcon} />
            <span className={styles.panelLabel}>Business Support Home</span>
          </button>

          <div className={styles.panelDivider} />
          <button className={styles.panelItem}>
            <Sparkles
              size={20}
              strokeWidth={1.5}
              className={`${styles.panelIcon} ${styles.metaAi}`}
            />
            <span className={styles.panelLabel}>Meta AI business assistant</span>
          </button>
        </nav>
      )}
    </div>
  );
}
