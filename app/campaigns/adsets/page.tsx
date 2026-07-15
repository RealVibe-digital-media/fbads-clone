"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Megaphone,
  Building2,
  Info,
  BarChart3,
  X,
  GitCompareArrows,
} from "lucide-react";
import { adSets as seed, adSetsMeta, type AdSet } from "@/data/adsets";
import { fmtInt, fmtMoney } from "@/data/campaigns";
import styles from "./page.module.css";

const FILTER_PILLS = [
  { key: "all", label: "All ads", Icon: LayoutGrid, active: true },
  { key: "actions", label: "Actions", Icon: CircleDot, caret: true },
  { key: "active", label: "Active ads", Icon: Play },
  { key: "delivery", label: "Had delivery", Icon: Flag },
];

const DELIVERY: Record<
  AdSet["delivery"],
  { label: string; dotClass: string; muted?: boolean }
> = {
  learning: { label: "Learning", dotClass: "dotActive" },
  learning_limited: { label: "Learning limited", dotClass: "dotLimited" },
  active: { label: "Active", dotClass: "dotActive" },
  off: { label: "Off", dotClass: "dotOff", muted: true },
};

export default function AdSetsPage() {
  const [rows, setRows] = useState<AdSet[]>(seed);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) =>
    setRows((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, on: !r.on, delivery: !r.on ? "active" : "off" }
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

  const truncatedAccount = `${adSetsMeta.accountName} (${adSetsMeta.accountId.slice(0, 14)}…`;

  return (
    <div className={styles.page}>
      {/* ── Top header ─────────────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <h1 className={styles.title}>Ad sets</h1>

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
              {adSetsMeta.opportunityScore}
            </span>
            <span>Opportunity score</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.topRight}>
          <span className={styles.updatedText}>Updated just now</span>
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
          <Link href="/campaigns" className={styles.tab}>
            <Folder size={16} strokeWidth={1.5} />
            <span>Campaigns</span>
            <span className={styles.selectedChip}>
              1 selected
              <X size={12} strokeWidth={2} />
            </span>
          </Link>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            <LayoutGrid
              size={16}
              strokeWidth={1.5}
              className={styles.tabIconActive}
            />
            <span>Ad sets for 1 Campaign</span>
          </button>
          <button className={styles.tab}>
            <ImageIcon size={16} strokeWidth={1.5} />
            <span>Ads for 1 Campaign</span>
          </button>
        </div>
        <button className={styles.dateBtn}>
          <Calendar size={16} strokeWidth={1.5} />
          <span>{adSetsMeta.dateRange}</span>
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
            <button className={styles.toolBtn} disabled>
              <Copy size={15} strokeWidth={1.5} />
              <span>Duplicate</span>
            </button>
            <button className={styles.toolBtn} disabled>
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
                    Ad set
                    <ArrowUpDown size={12} strokeWidth={1.5} className={styles.sortIcon} />
                    <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                  </span>
                </th>
                <th className={styles.th}>
                  <span className={styles.thInner}>
                    Delivery
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
                  "Attribution setting",
                  "Bid strategy",
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
              {rows.map((a) => {
                const d = DELIVERY[a.delivery];
                return (
                  <tr key={a.id} className={styles.row}>
                    <td className={`${styles.td} ${styles.colCheck}`}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={checked.has(a.id)}
                        onChange={() => toggleCheck(a.id)}
                      />
                    </td>
                    <td className={`${styles.td} ${styles.colToggle}`}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={a.on}
                        className={`${styles.switch} ${a.on ? styles.switchOn : ""}`}
                        onClick={() => toggleRow(a.id)}
                      >
                        <span className={styles.knob} />
                      </button>
                    </td>
                    <td className={`${styles.td} ${styles.colName}`}>
                      <div className={styles.nameCell}>
                        <span className={styles.nameLine}>
                          <a href="#" className={styles.nameLink}>
                            {a.name}
                          </a>
                          <Pencil
                            size={12}
                            strokeWidth={1.5}
                            className={styles.namePencil}
                          />
                        </span>
                        {/* quick actions appear on row hover, like Ads Manager */}
                        <span className={styles.quickActions}>
                          <span className={styles.qaChip}>
                            <BarChart3 size={11} strokeWidth={1.5} />
                            Charts
                          </span>
                          <span className={styles.qaChip}>
                            <Pencil size={11} strokeWidth={1.5} />
                            Edit
                          </span>
                          <span className={styles.qaChip}>
                            <Copy size={11} strokeWidth={1.5} />
                            Duplicate
                          </span>
                          <span className={styles.qaChip}>
                            <GitCompareArrows size={11} strokeWidth={1.5} />
                            Compare
                          </span>
                          <span className={styles.qaChip}>
                            <MoreHorizontal size={11} strokeWidth={1.5} />
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.deliveryCell}>
                        <span className={`${styles.dot} ${styles[d.dotClass]}`} />
                        <span className={d.muted ? styles.mutedText : undefined}>
                          {d.label}
                        </span>
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.actionsCell}>
                        {a.recommendations ? (
                          <span className={styles.recChip}>
                            <Megaphone size={12} strokeWidth={1.5} />
                            {a.recommendations} recommendation
                            {a.recommendations > 1 ? "s" : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                        {a.hasExport ? (
                          <Download
                            size={14}
                            strokeWidth={1.5}
                            className={styles.exportIcon}
                          />
                        ) : null}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <span>{a.results !== null ? fmtInt(a.results) : "—"}</span>
                        <span className={styles.subLabel}>{a.resultLabel}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <span>
                          {a.costPerResult !== null
                            ? fmtMoney(a.costPerResult)
                            : "—"}
                        </span>
                        <span className={styles.subLabel}>{a.costLabel}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <span className={styles.adsetBudget}>
                          {a.budget !== null ? fmtMoney(a.budget) : "Using campaign…"}
                        </span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {fmtMoney(a.amountSpent)}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.impressions !== null ? fmtInt(a.impressions) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.reach !== null ? fmtInt(a.reach) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.frequency !== null ? a.frequency.toFixed(2) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.cpm !== null ? fmtMoney(a.cpm) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.linkClicks !== null ? fmtInt(a.linkClicks) : "—"}
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>{a.ends}</td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <span>{a.attribution}</span>
                        <span className={styles.subLabel}>{a.attributionSub}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      {a.bidStrategy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={styles.tableFooter}>
          <span>Results from {adSetsMeta.totalAdSets} ad sets</span>
          <Info size={13} strokeWidth={1.5} className={styles.footerInfo} />
        </div>
      </div>
    </div>
  );
}
