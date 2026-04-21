import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Shortlisted",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: April 2026</p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10">
          <p className="text-sm text-blue-800 leading-relaxed">
            <span className="font-semibold">Plain English summary:</span> Use
            this service honestly and don&apos;t abuse it. I built this to help
            people &mdash; please use it for that. If something goes seriously
            wrong on my end, I will do everything in my power to fix it. If
            something goes wrong beyond my control &mdash; a third-party outage,
            data loss at the infrastructure level &mdash; I will be honest with
            you about it and genuinely sorry, but I cannot guarantee recovery in
            every scenario. I am one person. Please be understanding.
          </p>
        </div>

        <div className="space-y-10 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              1. Acceptance of terms
            </h2>
            <p>
              By accessing or using Shortlisted (&quot;Service&quot;), you agree to be
              bound by these Terms of Service. If you do not agree, please do
              not use the Service. These terms constitute a legally binding
              agreement between you and the individual developer operating
              Shortlisted, based in India.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              2. Description of service
            </h2>
            <p>
              Shortlisted is a resume keyword analysis tool and job application
              tracker. Resume analysis runs entirely in your browser &mdash; no
              resume text is sent to any server. The Application Tracker
              provides a Kanban board to manage your job applications, follow-up
              reminders, and analytics.
            </p>
            <p className="mt-2">
              The Service is intended for personal job search use. Future
              features aimed at recruiters or hiring managers may be offered
              separately under different terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              3. Acceptable use
            </h2>
            <p>
              You agree to use the Service honestly and in good faith. You must
              not:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                "Use automated tools, bots, or scripts to access the Service at scale.",
                "Attempt to reverse-engineer, copy, or resell the Service or its core logic.",
                "Upload or paste content that is illegal, harmful, or violates third-party rights.",
                "Impersonate another person or create fake accounts.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              4. Account responsibility
            </h2>
            <p>
              You are responsible for keeping your account credentials secure.
              Please notify us if you suspect unauthorised access. We are not
              liable for losses resulting from credentials you shared or failed
              to protect.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              5. Intellectual property
            </h2>
            <p>
              The Service, its code, design, and content belong to the
              developer. You may not copy, reproduce, or redistribute any part
              of the Service without permission.
            </p>
            <p className="mt-2">
              Text you submit &mdash; resumes, job descriptions, notes &mdash; remains
              yours. We store only what is necessary to operate the features you
              use, and only for as long as your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              6. Service availability and limitations
            </h2>
            <p>
              Shortlisted is operated by one person alongside other commitments.
              While I will make every effort to keep the service running
              reliably, I cannot guarantee 100% uptime or instant responses to
              every issue.
            </p>
            <p className="mt-2">
              If something goes wrong that is within my control &mdash; a bug, the
              site going offline &mdash; I will fix it as quickly as I can and
              communicate openly about what happened.
            </p>
            <p className="mt-2">
              If something goes wrong that is outside my control &mdash; an outage at
              Supabase or Vercel; data loss at the infrastructure level; a
              service discontinuation by a third party &mdash; I will be transparent
              about it, help where I can, and be genuinely sorry. But I cannot
              recover what a third-party provider has lost, and I ask for your
              understanding in those situations.
            </p>
            <p className="mt-2">
              The analysis results are a tool to assist your judgment, not a
              guarantee of any outcome. Getting a higher match score does not
              guarantee an interview.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by Indian law, we are not liable
              for indirect or consequential damages arising from your use of the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              8. Termination
            </h2>
            <p>
              We may suspend accounts that clearly abuse the Service or violate
              these terms. You may delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              9. Governing law
            </h2>
            <p>
              These terms are governed by the laws of India. Disputes are
              subject to the jurisdiction of Indian courts. That said &mdash; please
              just reach out first. Almost everything can be resolved with a
              direct conversation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              10. Changes to terms
            </h2>
            <p>
              If we make material changes, registered users will be notified by
              email with reasonable notice. Continued use after changes take
              effect means you accept the updated terms.
            </p>
          </section>

          <section className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <p className="text-gray-600 italic">
              This is a solo project built in good faith. If something is
              unclear, unfair, or broken &mdash; reach out. I would rather fix the
              problem than argue about terms.
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
            <Link
              href="/contact"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
