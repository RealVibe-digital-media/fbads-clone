import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Login is not configured. Set SITE_PASSWORD in .env.local." },
      { status: 500 },
    );
  }

  if (password !== expected) {
    return NextResponse.json(
      { error: "The password you've entered is incorrect." },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("fb_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// Logout: clear the session cookie.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fb_auth", "", { path: "/", maxAge: 0 });
  return res;
}
