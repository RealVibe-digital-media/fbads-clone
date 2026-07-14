import type { NextRequest } from "next/server";

/**
 * Write operations (upload, status change) require the admin key.
 * The key lives in ADMIN_KEY (env) and is sent as the `x-admin-key` header.
 * If ADMIN_KEY is not configured (bare local dev), writes are allowed.
 */
export function isAdmin(req: NextRequest): boolean {
  const configured = process.env.ADMIN_KEY;
  if (!configured) return true;
  return req.headers.get("x-admin-key") === configured;
}
