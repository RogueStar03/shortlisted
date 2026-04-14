import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Privacy Policy — Shortlisted",
};

export default async function PrivacyPage() {
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
        <h1 style={{ fontSize: 30, fontWeight: 700, color: "var(--sl-text)", marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "var(--sl-text-dim)", marginBottom: 40 }}>Last updated: March 2026</p>

        {/* Human note first */}
        <div style={{ background: "var(--sl-accent-glow)", border: "1px solid rgba(124,106,255,0.25)", borderRadius: "var(--sl-radius-xl)", padding: 20, marginBottom: 40 }}>
          <p style={{ fontSize: 13, color: "var(--sl-accent-light)", lineHeight: 1.7 }}>
            <span style={{ fontWeight: 600 }}>A note from the developer:</span>{" "}
            Shortlisted is an indie project built by one person to help job
            seekers. I have no interest in your data, no advertising partners,
            and no investors asking me to monetise your information. This policy
            exists to be transparent about what I collect and why — not to hide
            anything behind legal language.
          </p>
        </div>

        <div className="space-y-10" style={{ fontSize: 13, color: "var(--sl-text-muted)", lineHeight: 1.7 }}>
          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              1. Who we are
            </h2>
            <p>
              Shortlisted (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an independent software product
              operated by an individual developer based in India. This service
              is offered at shortlisted.app and related subdomains. For queries,
              contact us at the email address listed on the platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              2. What data we collect and why
            </h2>

            <div className="space-y-4">
              <div>
                <p style={{ fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>
                  Account information
                </p>
                <p>
                  When you sign up, we collect your email address and a hashed
                  password (or link your Google account). This is used
                  exclusively to identify your account, allow you to sign in,
                  and associate your data with you. We do not use your email for
                  marketing without your explicit opt-in.
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>
                  Resume and job description text
                </p>
                <p>
                  Resume analysis runs entirely in your browser. The text you
                  paste into the resume and job description fields{" "}
                  <span style={{ fontWeight: 500, color: "var(--sl-text)" }}>
                    never leaves your device
                  </span>{" "}
                  during analysis — no server receives it, no database stores
                  it. This is a deliberate architectural choice, not a claim we
                  make lightly.
                </p>
                <p className="mt-2">
                  If you use the Application Tracker (Placement Pack feature),
                  job description text you attach to an application is stored in
                  our database linked to your account so you can retrieve it
                  later. You can delete any application and its associated data
                  at any time.
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>Usage data</p>
                <p>
                  We collect basic anonymised usage information (pages visited,
                  feature usage frequency) to understand how the product is
                  being used and where to improve it. This data is not linked to
                  your identity.
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 500, color: "var(--sl-text)", marginBottom: 4 }}>Payment data</p>
                <p>
                  Placement Pack access is sold as a one-time purchase — there
                  is no automatic renewal. Payments are processed by Razorpay.
                  We do not store your card, UPI, or banking details. Razorpay&apos;s
                  privacy policy governs payment data handling.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              3. What we do not do
            </h2>
            <ul className="space-y-2 list-none">
              {[
                "We do not sell your data to any third party, ever.",
                "We do not share your data with advertisers.",
                "We do not use your resume content to train AI models without your explicit, informed, opt-in consent.",
                "We do not build profiles of you for any purpose beyond operating the service.",
                "We do not send marketing emails unless you have specifically opted in.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              4. Future use of data for algorithm improvement or AI features
            </h2>
            <p>
              We may in the future wish to improve the keyword matching
              algorithm or introduce AI-powered features such as resume bullet
              rewriting. If we ever want to use user-contributed resume content
              to improve these systems, we will:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Ask for volunteers explicitly — no data will be used without a clear, separate opt-in.",
                "Explain exactly what data would be used, how, and for how long.",
                "Allow you to withdraw consent at any time.",
                "Never use data from users who have not opted in.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "var(--sl-accent-light)" }} className="shrink-0 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              This is a commitment, not just a policy clause.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              5. Data storage and security
            </h2>
            <p>
              Account data and application tracker entries are stored on
              Supabase, a managed database platform with industry-standard
              encryption at rest and in transit. Access to your data is
              restricted by row-level security policies — meaning the database
              itself enforces that you can only read and write your own records.
            </p>
            <p className="mt-2">
              While we take reasonable precautions, no internet service can
              guarantee absolute security. We encourage you to use a strong,
              unique password.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              6. Data retention
            </h2>
            <p>
              We retain your account data for as long as your account is active.
              If you delete your account, all associated data — profile,
              application tracker entries, scan history — is permanently deleted
              within 30 days. You may request deletion at any time by contacting
              us.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              7. Your rights under Indian law
            </h2>
            <p>
              Under the Digital Personal Data Protection Act, 2023 (DPDPA) and
              applicable Indian law, you have the right to:
            </p>
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                "Access the personal data we hold about you.",
                "Correct inaccurate or incomplete data.",
                "Request erasure of your data.",
                "Withdraw consent for data processing where consent is the legal basis.",
                "Nominate a person to exercise these rights on your behalf.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: "var(--sl-text-dim)" }} className="shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us through the platform.
              We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              8. Cookies
            </h2>
            <p>
              We use session cookies strictly for authentication — to keep you
              signed in. We do not use tracking cookies, advertising cookies, or
              third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", marginBottom: 12 }}>
              9. Changes to this policy
            </h2>
            <p>
              If we make material changes to this policy, we will notify
              signed-in users by email and update the &ldquo;last updated&rdquo; date above.
              Continued use of the service after notification constitutes
              acceptance of the revised policy.
            </p>
          </section>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
