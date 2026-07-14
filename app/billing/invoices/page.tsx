"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import {
  businessMeta,
  formatDisplayDate,
  formatMoney,
  type Invoice,
} from "@/data/invoices";
import BusinessSummary from "@/components/BusinessSummary";
import FilterBar from "@/components/FilterBar";
import InvoiceTable from "@/components/InvoiceTable";
import styles from "./page.module.css";

interface ApiMeta {
  accounts: string[];
  minDate: string | null;
  maxDate: string | null;
  amountDue: number;
  currency: Invoice["currency"];
  total: number;
}

export default function InvoicesPage() {
  const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);

  // Server-side filtering: refetch whenever a filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterText.trim()) params.set("q", filterText.trim());
    if (accountFilter) params.set("account", accountFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    if (showOutstandingOnly) params.set("outstanding", "1");

    const controller = new AbortController();
    fetch(`/api/invoices?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setInvoices(data.invoices);
        setMeta(data.meta);
      })
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
    return () => controller.abort();
  }, [filterText, accountFilter, dateFrom, dateTo, showOutstandingOnly]);

  const dateRangeLabel = useMemo(() => {
    if (dateFrom || dateTo) {
      const from = dateFrom ? formatDisplayDate(dateFrom) : "Start";
      const to = dateTo ? formatDisplayDate(dateTo) : "Today";
      return `${from} - ${to}`;
    }
    if (meta?.minDate && meta?.maxDate) {
      return `Lifetime: ${formatDisplayDate(meta.minDate)} - ${formatDisplayDate(meta.maxDate)}`;
    }
    return "Lifetime";
  }, [dateFrom, dateTo, meta]);

  const amountDue = meta
    ? formatMoney(meta.amountDue, meta.currency)
    : "—";

  return (
    <div className={styles.page}>
      {/* a) Section title row */}
      <div className={styles.titleRow}>
        <h2 className={styles.sectionTitle}>Invoices</h2>

        <div className={styles.accountSelectorWrap}>
          <button
            className={styles.accountBtn}
            onClick={() => setAccountOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={accountOpen}
          >
            <span>
              {accountFilter ? `ID: ${accountFilter}` : "All ad accounts"}
            </span>
            <ChevronDown size={16} strokeWidth={1.5} />
          </button>

          {accountOpen && (
            <div className={styles.accountDropdown} role="menu">
              <button
                className={styles.accountOption}
                onClick={() => {
                  setAccountFilter(null);
                  setAccountOpen(false);
                }}
              >
                All ad accounts
              </button>
              {(meta?.accounts ?? []).map((id) => (
                <button
                  key={id}
                  className={styles.accountOption}
                  onClick={() => {
                    setAccountFilter(id);
                    setAccountOpen(false);
                  }}
                >
                  ID: {id}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* c) Business summary bar */}
      <BusinessSummary
        businessName={businessMeta.name}
        businessId={businessMeta.businessId}
        amountDue={amountDue}
        nextBillingPeriod={businessMeta.nextBillingPeriod}
      />

      {/* d) Filter row */}
      <FilterBar
        filterText={filterText}
        onFilterTextChange={setFilterText}
        dateRangeLabel={dateRangeLabel}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* e) Toolbar row */}
      <div className={styles.toolbar}>
        <label className={styles.toggleWrap}>
          <button
            type="button"
            role="switch"
            aria-checked={showOutstandingOnly}
            className={`${styles.toggle} ${
              showOutstandingOnly ? styles.toggleOn : ""
            }`}
            onClick={() => setShowOutstandingOnly((v) => !v)}
          >
            <span className={styles.knob} />
          </button>
          <span className={styles.toggleLabel}>Show outstanding only</span>
        </label>

        <div className={styles.toolbarRight}>
          <button className={styles.toolbarBtn}>Create Report</button>
          <button className={styles.toolbarBtn}>
            <Download size={16} strokeWidth={1.5} />
            <span>Download All</span>
          </button>
        </div>
      </div>

      {/* f) Invoices table */}
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
