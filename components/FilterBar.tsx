"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Calendar, ChevronDown } from "lucide-react";
import styles from "./FilterBar.module.css";

interface Props {
  filterText: string;
  onFilterTextChange: (value: string) => void;
  dateRangeLabel: string;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export default function FilterBar({
  filterText,
  onFilterTextChange,
  dateRangeLabel,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: Props) {
  const [dateOpen, setDateOpen] = useState(false);

  return (
    <div className={styles.row}>
      <button className={styles.dropdownBtn}>
        <span>Invoices</span>
        <ChevronDown size={16} strokeWidth={1.5} />
      </button>

      <div className={styles.searchWrap}>
        <Search size={16} strokeWidth={1.5} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Select a filter..."
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
      </div>

      <button className={styles.iconBtn} aria-label="Filter settings">
        <SlidersHorizontal size={16} strokeWidth={1.5} />
      </button>

      <div className={styles.dateWrap}>
        <button
          className={styles.dropdownBtn}
          onClick={() => setDateOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={dateOpen}
        >
          <Calendar size={16} strokeWidth={1.5} />
          <span>{dateRangeLabel}</span>
          <ChevronDown size={16} strokeWidth={1.5} />
        </button>

        {dateOpen && (
          <div className={styles.datePopover}>
            <label className={styles.dateField}>
              <span className={styles.dateLabel}>From</span>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </label>
            <label className={styles.dateField}>
              <span className={styles.dateLabel}>To</span>
              <input
                type="date"
                className={styles.dateInput}
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </label>
            <div className={styles.dateActions}>
              <button
                className={styles.dateClear}
                onClick={() => {
                  onDateFromChange("");
                  onDateToChange("");
                }}
              >
                Clear
              </button>
              <button
                className={styles.dateDone}
                onClick={() => setDateOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
