import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import HowItWorks from "@/components/landing/howItWorks";

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

const PRICING = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "For occasional use",
    features: [
      "Unlimited resume analysis",
      "Keyword gap report",
      "Filler word detection",
      "Match score",
    ],
    cta: "Start for free",
    href: "/auth",
    highlight: false,
    mostPopular: false,
  },
  {
    name: "Monthly Pack",
    price: "₹40",
    period: "per month",
    desc: "For active job seekers",
    features: [
      "Everything in Free",
      "Application tracker (Kanban)",
      "Follow-up reminders",
      "Analytics dashboard",
      "Scan history (last 50)",
      "Ad-free experience",
    ],
    cta: "Get Placement Pack",
    href: "/auth",
    highlight: true,
    mostPopular: false,
  },
  {
    name: "Placement Pack",
    price: "₹99",
    period: " for 3 months",
    desc: "Best value for active job seekers",
    features: [
      "Everything in Free",
      "Application tracker (Kanban)",
      "Follow-up reminders",
      "Analytics dashboard",
      "Scan history (last 50)",
      "Ad-free experience",
    ],
    cta: "Get Placement Pack",
    href: "/auth",
    highlight: true,
    mostPopular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav — full width with inner constraint */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="w-full px-6 lg:px-12 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight no-underline text-gray-900 hover:opacity-80 transition-opacity">
            Short<span className="text-blue-600">listed</span>
          </Link>
          <div className="flex items-center gap-5">
            <a
              href="#pricing"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <Button href="/auth" size="sm">
              Sign in
            </Button>
          </div>
        </div>
      </nav>
      {/* Hero — white */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Free to use — no credit card required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
            Built to get you <span className="text-blue-600">shortlisted</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
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
          <p className="mt-6 text-xs text-gray-400">
            Analysis runs locally — your resume never leaves your device
          </p>
        </div>
      </section>
      {/* Mock preview — gray-50 */}
      <HowItWorks />
      {/* Features — gray-50 */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Everything you need to get past the ATS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ icon, title, desc }) => (
              <Card key={title}>
                <div className="text-xl text-blue-500 mb-3">{icon}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {title}
                </div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {desc}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing — white */}
      <section id="pricing" className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">Pricing</h2>
          <p className="text-sm text-gray-500 text-center mb-12">
            Resume analysis is free, forever. Pay only when you need the
            tracker.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING.map(
              ({
                name,
                price,
                period,
                desc,
                features,
                cta,
                href,
                highlight,
                mostPopular,
              }) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-6 flex flex-col ${
                    highlight
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {mostPopular && (
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3">
                      Most popular
                    </div>
                  )}
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {price}
                    </span>
                    <span className="text-xs text-gray-400">{period}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-5">{desc}</div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <span className="text-green-500 mt-0.5 shrink-0">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href={href}
                    variant={highlight ? "primary" : "secondary"}
                  >
                    {cta}
                  </Button>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      {/* Footer — full width */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="w-full px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-base font-bold tracking-tight">
            Short<span className="text-blue-600">listed</span>
          </span>
          <p className="text-xs text-gray-400">
            Built for job seekers. Analysis runs locally — your data stays
            yours.
          </p>
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
