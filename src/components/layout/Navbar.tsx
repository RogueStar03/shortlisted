"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth");
  }

  function tabStyle(href: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return {
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: "var(--sl-radius-md)",
      textDecoration: "none",
      transition: "var(--sl-transition-normal)",
      ...(active
        ? {
            background: "var(--sl-accent-glow)",
            border: "1px solid rgba(124,106,255,0.2)",
            color: "var(--sl-accent)",
          }
        : {
            background: "transparent",
            border: "1px solid transparent",
            color: "var(--sl-text-muted)",
          }),
    } as React.CSSProperties;
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--sl-border)",
        background: "var(--sl-base)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          padding: "0 24px",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "var(--sl-text)" }}>Short</span>
          <span style={{ color: "var(--sl-accent)" }}>listed</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/analyze" style={tabStyle("/analyze")}>
            Analyzer
          </Link>
          <Link href="/tracker" prefetch={false} style={tabStyle("/tracker")}>
            Tracker
          </Link>
          {userEmail && (
            <>
              <Link
                href="/account"
                style={{
                  fontSize: 12,
                  color: "var(--sl-text-dim)",
                  textDecoration: "none",
                  marginLeft: 8,
                }}
              >
                {userEmail}
              </Link>
              <button
                onClick={signOut}
                style={{
                  fontSize: 12,
                  color: "var(--sl-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
