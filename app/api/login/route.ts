import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const expectedEmail = process.env.SITE_EMAIL;
  const expectedPassword = process.env.SITE_PASSWORD;
  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      {
        error:
          "Login is not configured. Set SITE_EMAIL and SITE_PASSWORD in .env.local.",
      },
      { status: 500 },
    );
  }

  const emailOk =
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase();
  if (!emailOk || password !== expectedPassword) {
    return NextResponse.json(
      {
        error:
          "The email or password that you've entered doesn't match any account.",
      },
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
