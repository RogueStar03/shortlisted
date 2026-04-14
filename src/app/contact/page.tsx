import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Contact — Shortlisted",
};

export default async function ContactPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ minHeight: "100vh", background: "var(--sl-base)" }}>
      <nav style={{ borderBottom: "1px solid var(--sl-border)" }}>
        <div className="w-full px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span style={{ color: "var(--sl-text)" }}>Short</span>
            <span className="text-blue-600">listed</span>
          </Link>
          {user ? (
            <Link href="/analyze" style={{ fontSize: 14, color: "var(--sl-text-muted)" }}>
              Open app
            </Link>
          ) : (
            <Link href="/auth" style={{ fontSize: 14, color: "var(--sl-text-muted)" }}>
              Sign in
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--sl-text)" }}>
            Hey, I&apos;m Abhishek 👋
          </h1>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--sl-text-muted)" }}>
            <p>
              I built Shortlisted for myself. A while back I was going through
              the exhausting cycle of applying to jobs — tweaking my resume for
              every JD, maintaining a chaotic Excel sheet to track applications,
              getting ghosted after &ldquo;we&apos;ll be in touch&rdquo;, and wondering if the
              ATS even read past my name.
            </p>
            <p>
              So I sat down with Claude and built something to fix that. Then I
              thought — why keep it to myself? If you&apos;re going through the same
              grind, maybe this helps you too.
            </p>
            <p>
              This isn&apos;t a startup. There&apos;s no team, no investors, no growth
              targets. It&apos;s a tool I genuinely use, maintained by one person in
              their spare time. Every rupee collected goes toward keeping the
              servers on and building the next useful thing.
            </p>
            <p style={{ color: "var(--sl-text-dim)", fontStyle: "italic" }}>
              (And yes, if you have a good referral — feel free to send it my
              way. I won&apos;t say no.)
            </p>
          </div>
        </div>

        {/* What I built with */}
        <div style={{ background: "var(--sl-surface)", border: "1px solid var(--sl-border)", borderRadius: "var(--sl-radius-xl)", padding: 20, marginBottom: 40 }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--sl-text-dim)" }}>
            Built with
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "Tailwind CSS", "Supabase", "Vercel", "Razorpay", "Claude"].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: "var(--sl-card)", border: "1px solid var(--sl-border-light)", color: "var(--sl-text-muted)" }}
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--sl-text-dim)" }}>
            The analysis engine is pure TypeScript running in your browser — no
            server sees your resume.
          </p>
        </div>

        {/* Contact */}
        <div className="mb-10">
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--sl-text)" }}>
            Get in touch
          </h2>
          <div className="space-y-3 text-sm" style={{ color: "var(--sl-text-muted)" }}>
            <p>
              For anything — bug reports, feature requests, refund requests,
              feedback, or just to say hi:
            </p>
            <a
              href="mailto:abhishekkayasth87@gmail.com"
              className="inline-flex items-center gap-2 font-medium hover:underline"
              style={{ color: "var(--sl-accent-light)" }}
            >
              abhishekkayasth87@gmail.com
            </a>
            <p className="text-xs" style={{ color: "var(--sl-text-dim)" }}>
              I check this regularly. Response time is usually within a day or
              two, sometimes longer if life is busy — but I will reply.
            </p>
          </div>
        </div>

        {/* What I respond to */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--sl-text)" }}>
            What I&apos;m happy to help with
          </h2>
          {[
            {
              label: "Bug reports",
              desc: "Something broken? Tell me exactly what happened and I'll fix it.",
            },
            {
              label: "Refund requests",
              desc: "Paid and not happy? Email me within 7 days and I'll sort it out.",
            },
            {
              label: "Feature ideas",
              desc: "Have a suggestion that would make this more useful? I'm listening.",
            },
            {
              label: "Feedback",
              desc: "Something feels wrong or confusing? I'd genuinely like to know.",
            },
          ].map(({ label, desc }) => (
            <div
              key={label}
              className="flex gap-4 p-4 rounded-xl"
              style={{ border: "1px solid var(--sl-border)", background: "var(--sl-card)" }}
            >
              <div className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: "var(--sl-accent)" }} />
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "var(--sl-text)" }}>
                  {label}
                </p>
                <p className="text-sm" style={{ color: "var(--sl-text-muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--sl-border)", marginTop: 64 }}>
        <div className="w-full px-6 lg:px-12 py-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight">
            <span style={{ color: "var(--sl-text)" }}>Short</span>
            <span className="text-blue-600">listed</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" style={{ fontSize: 12, color: "var(--sl-text-dim)" }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ fontSize: 12, color: "var(--sl-text-dim)" }}>
              Terms
            </Link>
            <Link href="/contact" style={{ fontSize: 12, color: "var(--sl-text-dim)" }}>
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
