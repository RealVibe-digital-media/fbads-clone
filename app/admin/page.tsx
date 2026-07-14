"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, RefreshCw, Download } from "lucide-react";
import {
  formatAmount,
  formatDisplayDate,
  type Invoice,
  type InvoiceStatus,
} from "@/data/invoices";
import styles from "./page.module.css";

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "due", label: "Due" },
  { value: "partially_paid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

interface UploadResult {
  file: string;
  ok: boolean;
  replaced?: boolean;
  duplicate?: boolean;
  invoice?: Invoice;
  error?: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Remember the key on this browser
  useEffect(() => {
    const saved = localStorage.getItem("fbclone_admin_key");
    if (saved) setAdminKey(saved);
  }, []);
  useEffect(() => {
    if (adminKey) localStorage.setItem("fbclone_admin_key", adminKey);
  }, [adminKey]);

  const refresh = useCallback(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices))
      .catch(() => setNotice("Failed to load invoices"));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function postFiles(
    files: File[],
    replace: boolean
  ): Promise<{ results: UploadResult[]; status: number }> {
    const form = new FormData();
    for (const f of files) form.append("files", f);
    if (replace) form.append("replace", "1");
    const res = await fetch("/api/invoices/upload", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    return { results: data.results ?? [], status: res.status };
  }

  async function onUpload() {
    const fileList = fileRef.current?.files;
    if (!fileList || fileList.length === 0) {
      setNotice("Choose one or more PDF files first.");
      return;
    }
    const files = Array.from(fileList);
    setUploading(true);
    setNotice(null);
    setResults([]);
    try {
      // Pass 1: plain upload — duplicates come back flagged, nothing overwritten
      const first = await postFiles(files, false);
      if (first.status === 401) {
        setNotice("Invalid admin key.");
        return;
      }
      let combined = first.results;

      // Duplicates? Ask before replacing the previous invoice.
      const dupNames = first.results
        .filter((r) => r.duplicate)
        .map((r) => r.file);
      if (dupNames.length > 0) {
        const confirmed = window.confirm(
          `${dupNames.length === 1 ? "This invoice already exists" : "These invoices already exist"}:\n\n` +
            dupNames.join("\n") +
            `\n\nReplace the previous invoice${dupNames.length === 1 ? "" : "s"} with the new upload? The status will be kept.`
        );
        if (confirmed) {
          const dupFiles = files.filter((f) => dupNames.includes(f.name));
          const second = await postFiles(dupFiles, true);
          // Merge: replaced outcomes override the duplicate errors
          combined = combined.map(
            (r) => second.results.find((s) => s.file === r.file) ?? r
          );
        }
      }

      setResults(combined);
      const ok = combined.filter((r) => r.ok).length;
      const replaced = combined.filter((r) => r.replaced).length;
      const failed = combined.length - ok;
      setNotice(
        `Uploaded ${ok - replaced} new, replaced ${replaced}, failed ${failed}.`
      );
      if (fileRef.current) fileRef.current.value = "";
      refresh();
    } catch {
      setNotice("Upload failed — check the server.");
    } finally {
      setUploading(false);
    }
  }

  async function onStatusChange(invoiceNumber: string, status: string) {
    setNotice(null);
    const res = await fetch(`/api/invoices/${invoiceNumber}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      setNotice("Invalid admin key.");
      return;
    }
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setNotice(d.error ?? "Failed to update status.");
      return;
    }
    refresh();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Invoice admin</h1>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Access</h2>
        <input
          type="password"
          className={styles.keyInput}
          placeholder="Admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Upload invoices</h2>
        <p className={styles.hint}>
          Select one or more Meta invoice PDFs. Invoice #, account ID, date and
          amount are extracted automatically. If an invoice number already
          exists you&apos;ll be asked whether to replace the previous invoice.
        </p>
        <div className={styles.uploadRow}>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            multiple
            className={styles.fileInput}
          />
          <button
            className={styles.uploadBtn}
            onClick={onUpload}
            disabled={uploading}
          >
            <Upload size={16} strokeWidth={1.5} />
            <span>{uploading ? "Uploading..." : "Upload"}</span>
          </button>
        </div>

        {results.length > 0 && (
          <ul className={styles.results}>
            {results.map((r) => (
              <li
                key={r.file}
                className={r.ok ? styles.resultOk : styles.resultErr}
              >
                {r.ok
                  ? `✓ ${r.file} → #${r.invoice?.invoiceNumber} (${r.invoice?.issueDate})${r.replaced ? " — replaced previous" : ""}`
                  : `✕ ${r.file}: ${r.error}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.listHeader}>
          <h2 className={styles.cardTitle}>
            All invoices ({invoices.length})
          </h2>
          <button className={styles.refreshBtn} onClick={refresh}>
            <RefreshCw size={14} strokeWidth={1.5} />
            <span>Refresh</span>
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Invoice #</th>
              <th className={styles.th}>Billable ID</th>
              <th className={styles.th}>Issue date</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoiceNumber} className={styles.row}>
                <td className={styles.td}>{inv.invoiceNumber}</td>
                <td className={styles.td}>{inv.billableId}</td>
                <td className={styles.td}>
                  {formatDisplayDate(inv.issueDate)}
                </td>
                <td className={styles.td}>
                  {formatAmount(inv.amountBilled, inv.currency)}
                </td>
                <td className={styles.td}>
                  <select
                    className={styles.statusSelect}
                    value={inv.status === "overdue" ? "due" : inv.status}
                    onChange={(e) =>
                      onStatusChange(inv.invoiceNumber, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.filter((o) => o.value !== "overdue").map(
                      (o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className={styles.td}>
                  <a
                    className={styles.dlLink}
                    href={`/api/invoices/${inv.invoiceNumber}/download`}
                  >
                    <Download size={14} strokeWidth={1.5} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {notice && <div className={styles.notice}>{notice}</div>}
    </div>
  );
}
