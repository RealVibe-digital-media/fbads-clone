-- Invoices table backing the billing page.
-- Metadata + manual status live here; the PDF files themselves are static
-- assets in public/invoices/ and ship with the deploy.
-- Applied automatically by scripts/setup-db.js (also safe to run in the
-- Supabase SQL Editor — it is idempotent).

create table if not exists public.invoices (
  invoice_number text primary key,
  billable_id    text not null,               -- "Account Id / Group" from the PDF
  ad_account_id  text not null,
  issue_date     date not null,               -- "Invoice Date" from the PDF
  due_date       date not null,               -- issue_date + payment terms (NET 30)
  amount_billed  numeric(14,2) not null,       -- "Invoice Total" from the PDF
  currency       text not null default 'INR',
  status         text not null default 'due'   -- manual field
                 check (status in ('due','partially_paid','paid','overdue')),
  pdf_path       text not null,               -- static path, e.g. /invoices/123.pdf
  pdf_data       bytea,                        -- the PDF itself (~90KB) so uploads/
                                               -- downloads work on serverless hosts
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.invoices add column if not exists pdf_data bytea;

create index if not exists invoices_billable_id_idx on public.invoices (billable_id);
create index if not exists invoices_issue_date_idx  on public.invoices (issue_date);

-- The app talks to Postgres directly over DATABASE_URL (table owner, bypasses
-- RLS). Keep RLS enabled with no policies so the anon API key has no access.
alter table public.invoices enable row level security;
