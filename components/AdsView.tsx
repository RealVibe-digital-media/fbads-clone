"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Trash2,
  Sparkles,
  FlaskConical,
  Eye,
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
} from "lucide-react";
import {
  adsForAdSet,
  adsForCampaign,
  adsMeta,
  type AdRow,
} from "@/data/ads";
import { fmtInt, fmtMoney } from "@/data/campaigns";
import styles from "./AdsView.module.css";

const FILTER_PILLS = [
  { key: "all", label: "All ads", Icon: LayoutGrid, active: true },
  { key: "actions", label: "Actions", Icon: CircleDot, caret: true },
  { key: "active", label: "Active ads", Icon: Play },
  { key: "delivery", label: "Had delivery", Icon: Flag },
];

const DELIVERY: Record<
  AdRow["delivery"],
  { label: string; dotClass: string; muted?: boolean }
> = {
  learning: { label: "Learning", dotClass: "dotActive" },
  preparing: { label: "Preparing", dotClass: "dotPreparing" },
  active: { label: "Active", dotClass: "dotActive" },
  off: { label: "Off", dotClass: "dotOff", muted: true },
};

const NUM_HEADERS: { label: string; sub?: string }[] = [
  { label: "Results" },
  { label: "Cost per result" },
  { label: "Budget", sub: "Ad set" },
  { label: "Amount spent" },
  { label: "Impressions" },
  { label: "Reach" },
  { label: "Frequency" },
  { label: "CPM (cost per 1,000…" },
  { label: "Link clicks" },
  { label: "Ends" },
  { label: "Attribution setting" },
  { label: "Bid strategy", sub: "Ad set" },
  { label: "Last significant edit" },
  { label: "Quality ranking" },
  { label: "Engage… rate…" },
  { label: "Conver… rate…" },
  { label: "Ad set name" },
];

function RankCell({ value, sub }: { value: string | null; sub?: string }) {
  return (
    <div className={styles.metric}>
      <span>{value ?? "—"}</span>
      {sub ? <span className={styles.subLabel}>{sub}</span> : null}
    </div>
  );
}

export default function AdsView({
  variant,
}: {
  variant: "adset" | "campaign";
}) {
  const isAdset = variant === "adset";
  const [rows, setRows] = useState<AdRow[]>(
    isAdset ? adsForAdSet : adsForCampaign
  );
  // In the reference the 2nd row is selected on the ad-set variant
  const [checked, setChecked] = useState<Set<string>>(
    new Set(isAdset ? ["d2"] : [])
  );

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

  const truncatedAccount = `${adsMeta.accountName} (${adsMeta.accountId.slice(0, 14)}…`;
  const total = isAdset ? adsMeta.adSetTotalAds : adsMeta.campaignTotalAds;

  return (
    <div className={styles.page}>
      {/* ── Top header ─────────────────────────────────────── */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <h1 className={styles.title}>Ads</h1>
          <button className={styles.bizChip} aria-label="Business">
            <span className={styles.bizAvatar}>R</span>
          </button>
          <button className={styles.accountSelector}>
            <Building2 size={16} strokeWidth={1.5} />
            <span className={styles.accountName}>{truncatedAccount}</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
          <button className={styles.oppChip}>
            <span className={styles.oppScore}>{adsMeta.opportunityScore}</span>
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
              src="/realvibe-logo.png"
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

      {/* ── Filter pills ───────────────────────────────────── */}
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

      {/* ── Search ─────────────────────────────────────────── */}
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search to filter by: name, ID or metrics"
        />
      </div>

      {/* ── Level tabs + pagination + date ─────────────────── */}
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
          <Link href="/campaigns/adsets" className={styles.tab}>
            <LayoutGrid size={16} strokeWidth={1.5} />
            <span>{isAdset ? "Ad sets" : "Ad sets for 1 Campaign"}</span>
            {isAdset && (
              <span className={styles.selectedChip}>
                1 selected
                <X size={12} strokeWidth={2} />
              </span>
            )}
          </Link>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            <ImageIcon
              size={16}
              strokeWidth={1.5}
              className={styles.tabIconActive}
            />
            <span>{isAdset ? "Ads" : "Ads for 1 Campaign"}</span>
            {isAdset && (
              <span className={styles.selectedChip}>
                1 selected
                <X size={12} strokeWidth={2} />
              </span>
            )}
          </button>
        </div>
        <div className={styles.tabsRight}>
          {!isAdset && (
            <span className={styles.pagination}>
              <span className={styles.pageRange}>
                {adsMeta.campaignPageRange}
              </span>
              <button className={styles.pageBtn} aria-label="Previous page">
                <ChevronLeft size={14} strokeWidth={1.5} />
              </button>
              <button className={styles.pageBtn} aria-label="Next page">
                <ChevronRight size={14} strokeWidth={1.5} />
              </button>
            </span>
          )}
          <button className={styles.dateBtn}>
            <Calendar size={16} strokeWidth={1.5} />
            <span>{adsMeta.dateRange}</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </button>
        </div>
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
            {isAdset ? (
              <>
                <span className={styles.splitBtn}>
                  <button className={styles.splitMain}>
                    <Copy size={15} strokeWidth={1.5} />
                    <span>Duplicate</span>
                  </button>
                  <button className={styles.splitCaret} aria-label="Duplicate options">
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                </span>
                <span className={styles.splitBtn}>
                  <button className={styles.splitMain}>
                    <Pencil size={15} strokeWidth={1.5} />
                    <span>Edit</span>
                  </button>
                  <button className={styles.splitCaret} aria-label="Edit options">
                    <ChevronDown size={14} strokeWidth={1.5} />
                  </button>
                </span>
                <button className={styles.iconBorderBtn} aria-label="Delete">
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <>
                <button className={styles.toolBtn} disabled>
                  <Copy size={15} strokeWidth={1.5} />
                  <span>Duplicate</span>
                </button>
                <button className={styles.toolBtn} disabled>
                  <Pencil size={15} strokeWidth={1.5} />
                  <span>Edit</span>
                </button>
              </>
            )}
            <button className={styles.toolBtn}>
              <Sparkles size={15} strokeWidth={1.5} />
              <span>Analyse</span>
            </button>
            <button className={styles.toolBtn}>
              <FlaskConical size={15} strokeWidth={1.5} />
              <span>A/B test</span>
            </button>
            {isAdset && (
              <button className={styles.toolBtn}>
                <Eye size={15} strokeWidth={1.5} />
                <span>Preview</span>
              </button>
            )}
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
                    Ad
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
                {NUM_HEADERS.map(({ label, sub }) => (
                  <th key={label} className={`${styles.th} ${styles.thNum}`}>
                    <span className={styles.thStack}>
                      <span className={styles.thInner}>
                        {label}
                        <ArrowUpDown size={12} strokeWidth={1.5} className={styles.sortIcon} />
                        <ChevronDown size={12} strokeWidth={1.5} className={styles.thCaret} />
                      </span>
                      {sub ? <span className={styles.thSub}>{sub}</span> : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const d = DELIVERY[a.delivery];
                const isChecked = checked.has(a.id);
                return (
                  <tr
                    key={a.id}
                    className={`${styles.row} ${isChecked ? styles.rowChecked : ""}`}
                  >
                    <td className={`${styles.td} ${styles.colCheck}`}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isChecked}
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
                      <span className={styles.adCell}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={`${styles.thumb} ${
                            a.thumb === "photo" ? styles.thumbPhoto : styles.thumbLogo
                          }`}
                          src={a.thumb === "photo" ? "/ad-static.jpg" : "/ad-logo.jpg"}
                          alt=""
                          aria-hidden="true"
                        />
                        <a href="#" className={styles.nameLink}>
                          {a.name}
                        </a>
                      </span>
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
                          {a.costPerResult !== null ? fmtMoney(a.costPerResult) : "—"}
                        </span>
                        <span className={styles.subLabel}>{a.costLabel}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <span className={styles.adsetBudget}>Using campaign…</span>
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
                      <div className={styles.metric}>
                        <span>{a.bidStrategy}</span>
                        <span className={styles.subLabel}>{a.bidStrategySub}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <span>{a.lastEdit}</span>
                        <span className={styles.subLabel}>{a.lastEditSub}</span>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <RankCell value={a.qualityRanking} sub={a.qualityRankingSub} />
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <RankCell
                        value={a.engagementRanking}
                        sub={a.engagementRankingSub}
                      />
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <RankCell
                        value={a.conversionRanking}
                        sub={a.conversionRankingSub}
                      />
                    </td>
                    <td className={`${styles.td} ${styles.tdNum}`}>
                      <div className={styles.metric}>
                        <Link
                          href="/campaigns/adsets/ads"
                          className={styles.nameLink}
                        >
                          {a.adSetName}
                        </Link>
                        <span className={styles.subLabel}>{a.adSetSub}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={styles.tableFooter}>
          <span>Results from {total} ads</span>
          <Info size={13} strokeWidth={1.5} className={styles.footerInfo} />
        </div>
      </div>
    </div>
  );
}
