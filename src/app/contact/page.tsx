import Link from "next/link";

export const metadata = {
  title: "Contact — Shortlisted",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="w-full px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Short<span className="text-blue-600">listed</span>
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
        {/* Intro */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Hey, I&apos;m Abhishek 👋
          </h1>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              I built Shortlisted for myself. A while back I was going through
              the exhausting cycle of applying to jobs — tweaking my resume for
              every JD, maintaining a chaotic Excel sheet to track applications,
              getting ghosted after &quot;we&apos;ll be in touch&quot;, and wondering if the
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
            <p className="text-gray-500 italic">
              (And yes, if you have a good referral — feel free to send it my
              way. I won&apos;t say no.)
            </p>
          </div>
        </div>

        {/* What I built with */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-10">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Built with
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js",
              "Tailwind CSS",
              "Supabase",
              "Vercel",
              "Razorpay",
              "Claude",
            ].map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            The analysis engine is pure TypeScript running in your browser — no
            server sees your resume.
          </p>
        </div>

        {/* Contact */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Get in touch
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              For anything — bug reports, feature requests, refund requests,
              feedback, or just to say hi:
            </p>

            <a
              href="mailto:abhishekkayasth87@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
            >
              abhishekkayasth87@gmail.com
            </a>
            <p className="text-xs text-gray-400">
              I check this regularly. Response time is usually within a day or
              two, sometimes longer if life is busy — but I will reply.
            </p>
          </div>
        </div>

        {/* What I respond to */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
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
              className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white"
            >
              <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">
                  {label}
                </p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
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
