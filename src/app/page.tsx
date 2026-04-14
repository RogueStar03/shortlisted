import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import HowItWorks from "@/components/landing/howItWorks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    icon: "◎",
    title: "Keyword gap analysis",
    desc: "See exactly which skills the JD demands that your resume doesn't mention. Ranked by how much they matter.",
  },
  {
    icon: "◈",
    title: "Filler word detector",
    desc: "60 overused phrases flagged inline — 'responsible for', 'team player', 'hardworking' — with specific rewrites.",
  },
  {
    icon: "◇",
    title: "Match score",
    desc: "A weighted score that reflects what ATS systems actually care about. Technical skills count more than soft skills.",
  },
  {
    icon: "▦",
    title: "Application tracker",
    desc: "Kanban pipeline from applied to offer. Notes, reminders, and analytics on your job search.",
  },
];


export default async function LandingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)", color: "var(--sl-text)" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--sl-border)", background: "var(--sl-base)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="w-full px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight no-underline hover:opacity-80 transition-opacity" style={{ color: "var(--sl-text)" }}>
            Short<span className="text-blue-500">listed</span>
          </Link>
          <div className="flex items-center gap-5">
            {user ? (
              <Button href="/analyze" size="sm">
                Open app
              </Button>
            ) : (
              <Button href="/auth" size="sm">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section>
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-6"
            style={{ background: "var(--sl-accent-glow)", border: "1px solid rgba(124,106,255,0.25)", color: "var(--sl-accent-light)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--sl-accent)" }} />
            Free to use — no credit card required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
            Built to get you <span className="text-blue-500">shortlisted</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: "var(--sl-text-muted)" }}>
            See what the ATS sees. Fix what gets you ghosted. Paste your resume
            and a job description — get a match score, keyword gaps, and filler
            word fixes in under a second.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/auth" size="md">
              Analyze my resume →
            </Button>
            <Button href="#how-it-works" variant="secondary" size="md">
              See how it works
            </Button>
          </div>
          <p className="mt-6 text-xs" style={{ color: "var(--sl-text-dim)" }}>
            Analysis runs locally — your resume never leaves your device
          </p>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Features */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Everything you need to get past the ATS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon, title, desc }) => (
              <Card key={title}>
                <div className="text-xl text-blue-500 mb-3">{icon}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: "var(--sl-text)" }}>
                  {title}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: "var(--sl-text-muted)" }}>
                  {desc}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--sl-surface)", borderTop: "1px solid var(--sl-border)" }}>
        <div className="w-full px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-base font-bold tracking-tight">
            Short<span className="text-blue-500">listed</span>
          </span>
          <p className="text-xs" style={{ color: "var(--sl-text-dim)" }}>
            Built for job seekers. Analysis runs locally — your data stays
            yours.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs" style={{ color: "var(--sl-text-dim)" }}>
              Privacy
            </Link>
            <Link href="/terms" className="text-xs" style={{ color: "var(--sl-text-dim)" }}>
              Terms
            </Link>
            <Link href="/contact" className="text-xs" style={{ color: "var(--sl-text-dim)" }}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
