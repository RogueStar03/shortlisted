import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Shortlisted",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="w-full px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="text-black">Short</span>
            <span className="text-blue-600">listed</span>
          </Link>
          <Link
            href="/auth"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: March 2026</p>

        {/* Human note first */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10">
          <p className="text-sm text-blue-800 leading-relaxed">
            <span className="font-semibold">A note from the developer:</span>{" "}
            Shortlisted is an indie project built by one person to help job
            seekers. I have no interest in your data, no advertising partners,
            and no investors asking me to monetise your information. This policy
            exists to be transparent about what I collect and why — not to hide
            anything behind legal language.
          </p>
        </div>

        <div className="space-y-10 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              1. Who we are
            </h2>
            <p>
              Shortlisted (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an independent software product
              operated by an individual developer based in India. This service
              is offered at shortlisted.app and related subdomains. For queries,
              contact us at the email address listed on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              2. What data we collect and why
            </h2>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800 mb-1">
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
                <p className="font-medium text-gray-800 mb-1">
                  Resume and job description text
                </p>
                <p>
                  Resume analysis runs entirely in your browser. The text you
                  paste into the resume and job description fields{" "}
                  <span className="font-medium text-gray-900">
                    never leaves your device
                  </span>{" "}
                  during analysis — no server receives it, no database stores
                  it. This is a deliberate architectural choice, not a claim we
                  make lightly.
                </p>
                <p className="mt-2">
                  If you use the Application Tracker, job description text you
                  attach to an application is stored in our database linked to
                  your account so you can retrieve it later. You can delete any
                  application and its associated data at any time.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Usage data</p>
                <p>
                  We collect basic anonymised usage information (pages visited,
                  feature usage frequency) to understand how the product is
                  being used and where to improve it. This data is not linked to
                  your identity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
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
            <h2 className="text-base font-semibold text-gray-900 mb-3">
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
                  <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              This is a commitment, not just a policy clause.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
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
            <h2 className="text-base font-semibold text-gray-900 mb-3">
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
            <h2 className="text-base font-semibold text-gray-900 mb-3">
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
                  <span className="text-gray-300 shrink-0 mt-0.5">—</span>
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
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              8. Cookies
            </h2>
            <p>
              We use session cookies strictly for authentication — to keep you
              signed in. We do not use tracking cookies, advertising cookies, or
              third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              9. Changes to this policy
            </h2>
            <p>
              If we make material changes to this policy, we will notify
              signed-in users by email and update the &quot;last updated&quot; date above.
              Continued use of the service after notification constitutes
              acceptance of the revised policy.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16">
        <div className="w-full px-6 lg:px-12 py-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight">
            <span className="text-black">Short</span>
            <span className="text-blue-600">listed</span>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
