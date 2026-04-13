"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--sl-card)",
  border: "1px solid var(--sl-border)",
  borderRadius: "var(--sl-radius-lg)",
  color: "var(--sl-text)",
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/analyze";
  const supabase = createSupabaseBrowserClient();

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(next);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ color: "var(--sl-text)" }}>Short</span>
            <span style={{ color: "var(--sl-accent)" }}>listed</span>
          </h1>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--sl-text-muted)" }}>
            {mode === "signin" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--sl-surface)", border: "1px solid var(--sl-border-light)", borderRadius: "var(--sl-radius-2xl)", padding: "28px 24px" }}>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "10px 16px",
              border: "1px solid var(--sl-border)",
              borderRadius: "var(--sl-radius-lg)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--sl-text)",
              background: "var(--sl-card)",
              cursor: "pointer",
              opacity: loading ? 0.5 : 1,
              transition: "var(--sl-transition-fast)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.29H1.88v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.51 10.52A4.8 4.8 0 0 1 4.26 9c0-.53.09-1.04.25-1.52V5.41H1.88A8 8 0 0 0 .98 9c0 1.3.31 2.52.9 3.59l2.63-2.07z"/>
              <path fill="#EA4335" d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.1 4.41l2.63 2.07c.63-1.89 2.39-3.3 4.47-3.3z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ margin: "20px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--sl-border)" }} />
            <span style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--sl-border)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--sl-border-light)")}
                onBlur={e => (e.target.style.borderColor = "var(--sl-border)")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "var(--sl-border-light)")}
                onBlur={e => (e.target.style.borderColor = "var(--sl-border)")}
              />
            </div>

            {error && (
              <p style={{ fontSize: 11, color: "var(--sl-danger)", background: "var(--sl-danger-bg)", padding: "8px 12px", borderRadius: "var(--sl-radius-lg)" }}>
                {error}
              </p>
            )}
            {message && (
              <p style={{ fontSize: 11, color: "var(--sl-success)", background: "var(--sl-success-bg)", padding: "8px 12px", borderRadius: "var(--sl-radius-lg)" }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "var(--sl-gradient-accent)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: "var(--sl-radius-lg)",
                border: "none",
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
                marginTop: 4,
              }}
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        {/* Toggle mode */}
        <p style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--sl-text-muted)" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
            style={{ color: "var(--sl-accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 12 }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
}
