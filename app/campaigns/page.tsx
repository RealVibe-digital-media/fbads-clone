"use client";

import { useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  CircleDot,
  Play,
  Flag,
  Plus,
  SlidersHorizontal,
  Folder,
  LayoutGrid,
  Image as ImageIcon,
  Calendar,
  Copy,
  Pencil,
  Sparkles,
  FlaskConical,
  Columns3,
  Layers,
  Download,
  ArrowUpDown,
  ArrowUp,
  AlertTriangle,
  Megaphone,
  Building2,
  Info,
  BarChart3,
} from "lucide-react";
import {
  campaigns as seed,
  campaignsMeta,
  fmtInt,
  fmtMoney,
  type Campaign,
} from "@/data/campaigns";
import styles from "./page.module.css";

const FILTER_PILLS = [
  { key: "all", label: "All ads", Icon: LayoutGrid, active: true },
  { key: "actions", label: "Actions", Icon: CircleDot, caret: true },
  { key: "active", label: "Active ads", Icon: Play },
  { key: "delivery", label: "Had delivery", Icon: Flag },
];

export default function CampaignsPage() {
  const [rows, setRows] = useState<Campaign[]>(seed);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) =>
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? {
              ...r,
              on: !r.on,
              delivery: !r.on ? "active" : "off",
            }
          : r
      )
    );

  const toggleCheck = (id: string) =>
    setChecked((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const truncatedAccount = `${campaignsMeta.accountName} (${campaignsMeta.accountId.slice(0, 14)}…`;

  return (
    <div className={styles.page}>
      {/* ── Top header ─────────────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <h1 className={styles.title}>Campaigns</h1>

          <button className={styles.bizChip} aria-label="Business">
            <span className={styles.bizAvatar}>R</span>
          </button>

          <button className={styles.accountSelector}>
            <Building2 size={16} strokeWidth={1.5} />
            <span className={styles.accountName}>{truncatedAccount}</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>

          <button className={styles.oppChip}>
            <span className={styles.oppScore}>
              {campaignsMeta.opportunityScore}
            </span>
            <span>Opportunity score</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.topRight}>
          <button className={styles.iconGhostBtn} aria-label="Refresh">
            <RefreshCw size={16} strokeWidth={1.5} />
          </button>
          <button className={styles.reviewBtn}>Review and publish</button>
          <button className={styles.iconBorderBtn} aria-label="More options">
            <MoreHorizontal size={16} strokeWidth={1.5} />
          </button>
          <div className={styles.avatarWrap}>
            <Image
              src="/profile.png"
              alt="Profile"
              width={32}
              height={32}
              className={styles.avatar}
            />
            <span className={styles.fbBadge} aria-hidden="true">
              f
            </span>
          </div>
        </div>
      </header>

      {/* ── Filter pills row ───────────────────────────────── */}
      <div className={styles.pillsRow}>
        <div className={styles.pillsLeft}>
          {FILTER_PILLS.map(({ key, label, Icon, active, caret }) => (
            <button
              key={key}
              className={`${styles.pill} ${active ? styles.pillActive : ""}`}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span>{label}</span>
              {caret && <ChevronDown size={12} strokeWidth={1.5} />}
            </button>
          ))}
          <button className={styles.seeMore}>
            <Plus size={14} strokeWidth={1.5} />
            <span>See more</span>
          </button>
        </div>
        <div className={styles.pillsRight}>
          <button className={styles.createViewBtn}>Create a view</button>
          <button className={styles.iconBorderBtn} aria-label="View settings">
            <SlidersHorizontal size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Search row ─────────────────────────────────────── */}
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search to filter by: name, ID or metrics"
        />
      </div>

      {/* ── Level tabs + date range ────────────────────────── */}
      <div className={styles.tabsRow}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            <Folder size={16} strokeWidth={1.5} />
            <span>Campaigns</span>
          </button>
          <button className={styles.tab}>
            <LayoutGrid size={16} strokeWidth={1.5} />
            <span>Ad sets</span>
          </button>
          <button className={styles.tab}>
            <ImageIcon size={16} strokeWidth={1.5} />
            <span>Ads</span>
          </button>
        </div>
        <button className={styles.dateBtn}>
          <Calendar size={16} strokeWidth={1.5} />
          <span>{campaignsMeta.dateRange}</span>
          <ChevronDown size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Table card ─────────────────────────────────────── */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button className={styles.createBtn}>
              <Plus size={16} strokeWidth={2} />
              <span>Create</span>
            </button>
            <button className={styles.toolBtn}>
              <Copy size={15} strokeWidth={1.5} />
              <span>Duplicate</span>
            </button>
            <button className={styles.toolBtn}>
              <Pencil size={15} strokeWidth={1.5} />
              <span>Edit</span>
            </button>
            <button className={styles.toolBtn}>
              <Sparkles size={15} strokeWidth={1.5} />
              <span>Analyse</span>
            </button>
            <button className={styles.toolBtn}>
              <FlaskConical size={15} strokeWidth={1.5} />
              <span>A/B test</span>
            </button>
            <button className={styles.toolBtn}>
              <span>More</span>
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
          </div>
          <div className={styles.toolbarRight}>
            <button className={styles.toolBtn}>
              <Columns3 size={15} strokeWidth={1.5} />
              <span>Columns: Performance</span>
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            <button className={styles.toolBtn}>
              <Layers size={15} strokeWidth={1.5} />
              <span>Breakdown</span>
              <ChevronDown size={14} strokeWidth={1.5} />
            </button>
            <button className={styles.iconBorderBtn} aria-label="Reports">
              <BarChart3 size={16} strokeWidth={1.5} />
            </button>
            <button className={styles.iconBorderBtn} aria-label="Export">
              <Download size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.colCheck}`}>
                  <input type="checkbox" className={styles.checkbox} />
                </th>
                <th className={`${styles.th} ${styles.colToggle}`}>
                  <span className={styles.thInner}>
                    Off…
                    <ArrowUpDown size={12} strokeWidth={1.5} className={styles.sortIcon} />
                  </span>
                </th>
                <th className={`${styles.th} ${styles.colName}`}>
                  <span className={styles.thInner}>
                    Campaign
                    <ArrowUpDown size={12} strokeWidth={1.5} className={styles.sortIcon} />
                    <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                  </span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thInner}>
                    <span className={styles.thSorted}>Delivery</span>
                    <ArrowUp size={12} strokeWidth={1.5} className={styles.sortIconActive} />
                    <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                  </span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thInner}>
                    Actions
                    <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                  </span>
                </th>
                {[
                  "Results",
                  "Cost per result",
                  "Budget",
                  "Amount spent",
                  "Impressions",
                  "Reach",
                  "Frequency",
                  "CPM (cost per 1,000…",
                  "Link clicks",
                  "Ends",
                ].map((label) => (
                  <th key={label} className={`${styles.th} ${styles.thNum}`}>
                    <span className={styles.thInner}>
                      {label}
                      <ArrowUpDown size={12} strokeWidth={1.5} className={styles.sortIcon} />
                      <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={styles.row}>
                  <td className={`${styles.td} ${styles.colCheck}`}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={checked.has(c.id)}
                      onChange={() => toggleCheck(c.id)}
                    />
                  </td>
                  <td className={`${styles.td} ${styles.colToggle}`}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={c.on}
                      className={`${styles.switch} ${c.on ? styles.switchOn : ""}`}
                      onClick={() => toggleRow(c.id)}
                    >
                      <span className={styles.knob} />
                    </button>
                  </td>
                  <td className={`${styles.td} ${styles.colName}`}>
                    <a href="#" className={styles.nameLink}>
                      {c.name}
                    </a>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.deliveryCell}>
                      <span
                        className={`${styles.dot} ${
                          c.delivery === "active" ? styles.dotActive : styles.dotOff
                        }`}
                      />
                      <span
                        className={
                          c.delivery === "active" ? undefined : styles.mutedText
                        }
                      >
                        {c.delivery === "active" ? "Active" : "Off"}
                      </span>
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.actionsCell}>
                      {c.warnings ? (
                        <span className={styles.warnChip}>
                          <AlertTriangle size={12} strokeWidth={1.5} />
                          {c.warnings}
                        </span>
                      ) : null}
                      {c.recommendations ? (
                        <span className={styles.recChip}>
                          <Megaphone size={12} strokeWidth={1.5} />
                          {c.warnings
                            ? c.recommendations
                            : `${c.recommendations} recommendations`}
                        </span>
                      ) : null}
                      {c.hasExport ? (
                        <Download
                          size={14}
                          strokeWidth={1.5}
                          className={styles.exportIcon}
                        />
                      ) : null}
                      {!c.warnings && !c.recommendations && !c.hasExport
                        ? "—"
                        : null}
                    </span>
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    <div className={styles.metric}>
                      <span>{c.results !== null ? fmtInt(c.results) : "—"}</span>
                      <span className={styles.subLabel}>{c.resultLabel}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    <div className={styles.metric}>
                      <span>
                        {c.costPerResult !== null ? fmtMoney(c.costPerResult) : "—"}
                      </span>
                      <span className={styles.subLabel}>{c.costLabel}</span>
                    </div>
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.budget !== null ? (
                      <div className={styles.metric}>
                        <span>{fmtMoney(c.budget)}</span>
                        <span className={styles.subLabel}>Daily</span>
                      </div>
                    ) : (
                      <div className={styles.metric}>
                        <span className={styles.adsetBudget}>
                          Using ad set bu…
                        </span>
                      </div>
                    )}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {fmtMoney(c.amountSpent)}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.impressions !== null ? fmtInt(c.impressions) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.reach !== null ? fmtInt(c.reach) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.frequency !== null ? c.frequency.toFixed(2) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.cpm !== null ? fmtMoney(c.cpm) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>
                    {c.linkClicks !== null ? fmtInt(c.linkClicks) : "—"}
                  </td>
                  <td className={`${styles.td} ${styles.tdNum}`}>{c.ends}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={styles.tableFooter}>
          <span>Results from {campaignsMeta.totalCampaigns} campaigns</span>
          <Info size={13} strokeWidth={1.5} className={styles.footerInfo} />
        </div>
      </div>
    </div>
  );
}
