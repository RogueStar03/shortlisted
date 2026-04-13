import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export const metadata = { title: "Account — Shortlisted" };

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "1px solid var(--sl-border)",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--sl-border)",
  borderRadius: "var(--sl-radius-2xl)",
  overflow: "hidden",
  marginBottom: 16,
};

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, plan_expires_at, created_at")
    .eq("id", user.id)
    .single();

  const now = new Date();
  const isPack =
    profile?.plan === "pack" &&
    profile?.plan_expires_at &&
    new Date(profile.plan_expires_at) > now;

  const expiryDate = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const displayName =
    user.email
      ?.split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "User";

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)" }}>
      <Navbar userEmail={user.email} />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--sl-text)", margin: 0 }}>Account</h1>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--sl-text-muted)" }}>Your profile and plan details.</p>
        </div>

        {/* Profile card */}
        <div style={cardStyle}>
          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderBottom: "1px solid var(--sl-border)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--sl-accent-glow)", border: "1px solid rgba(124,106,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "var(--sl-accent)", fontWeight: 600, fontSize: 15 }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", margin: 0 }}>{displayName}</p>
              <p style={{ fontSize: 12, color: "var(--sl-text-dim)", marginTop: 2 }}>{user.email}</p>
            </div>
          </div>

          {/* Member since */}
          <div style={{ ...rowStyle }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)" }}>Member since</span>
            <span style={{ fontSize: 12, color: "var(--sl-text)" }}>{joinedDate ?? "—"}</span>
          </div>

          {/* Auth provider */}
          <div style={{ ...rowStyle, borderBottom: "none" }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)" }}>Signed in with</span>
            <span style={{ fontSize: 12, color: "var(--sl-text)" }}>
              {user.app_metadata?.provider === "google" ? "Google" : "Email & Password"}
            </span>
          </div>
        </div>

        {/* Plan card */}
        <div style={cardStyle}>
          <div style={{ ...rowStyle }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)" }}>Current plan</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 999,
                ...(isPack
                  ? { background: "var(--sl-success-bg)", color: "var(--sl-success)" }
                  : { background: "var(--sl-card)", color: "var(--sl-text-muted)" }),
              }}
            >
              {isPack ? "Placement Pack" : "Free"}
            </span>
          </div>

          {isPack && expiryDate && (
            <div style={{ ...rowStyle }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sl-text-muted)" }}>Access until</span>
              <span style={{ fontSize: 12, color: "var(--sl-text)" }}>{expiryDate}</span>
            </div>
          )}

          {!isPack && (
            <div style={{ padding: "20px 24px", borderTop: "1px solid var(--sl-border)" }}>
              <p style={{ fontSize: 12, color: "var(--sl-text-muted)", marginBottom: 12, lineHeight: 1.6 }}>
                Upgrade to get the application tracker, follow-up reminders, and analytics.
              </p>
              <Link
                href="/#pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  background: "var(--sl-gradient-accent)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: "var(--sl-radius-lg)",
                  textDecoration: "none",
                }}
              >
                Get Placement Pack →
              </Link>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={cardStyle}>
          {[
            { href: "/analyze", label: "Resume Analyzer", show: true },
            { href: "/tracker", label: "Application Tracker", show: isPack },
            { href: "/privacy", label: "Privacy Policy", show: true, dim: true },
            { href: "/terms", label: "Terms of Service", show: true, dim: true },
          ]
            .filter((item) => item.show)
            .map((item, idx, arr) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 24px",
                  borderBottom: idx < arr.length - 1 ? "1px solid var(--sl-border)" : "none",
                  textDecoration: "none",
                  color: item.dim ? "var(--sl-text-muted)" : "var(--sl-text)",
                  fontSize: 12,
                  fontWeight: 500,
                  transition: "var(--sl-transition-fast)",
                }}
              >
                {item.label}
                <span style={{ color: "var(--sl-text-dim)" }}>→</span>
              </Link>
            ))}
        </div>

        <p style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: "var(--sl-text-dim)" }}>
          Shortlisted — Built to get you shortlisted
        </p>
      </main>
    </div>
  );
}
