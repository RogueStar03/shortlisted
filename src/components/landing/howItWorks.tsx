"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    step: "01",
    title: "Paste your resume",
    desc: "Plain text. No PDF parsing, no data stored on our servers.",
  },
  {
    step: "02",
    title: "Paste the job description",
    desc: "The full posting — requirements, responsibilities, preferred skills.",
  },
  {
    step: "03",
    title: "See what's missing",
    desc: "Keyword gaps, filler phrases, and a match score in under a second.",
  },
];

const RESUME_TEXT = `John Doe | Mumbai, India
Software Developer — Acme Corp

- Built REST endpoints using Node.js
- Deployed apps using Docker
- Worked with PostgreSQL databases

Skills: JavaScript, TypeScript, React`;

const JD_TEXT = `Backend Engineer — Series B Startup

Required:
- Node.js and TypeScript (3+ years)
- REST API design
- PostgreSQL and Redis
- Docker and Kubernetes
- CI/CD pipelines
- Microservices architecture`;

// Step 0 (index 0) = resume filled
// Step 1 (index 1) = resume + JD filled
// Step 2 (index 2) = results shown
const MOCK_STATES = [
  { resumeText: RESUME_TEXT, jdText: "", showResults: false },
  { resumeText: RESUME_TEXT, jdText: JD_TEXT, showResults: false },
  { resumeText: "", jdText: "", showResults: true },
];

function MockBrowser({ state }: { state: (typeof MOCK_STATES)[0] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white w-full">
      {/* Chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2 bg-white border border-gray-200 rounded text-[10px] text-gray-400 px-2 py-0.5 text-center">
          shortlisted.app/{state.showResults ? "results" : "analyze"}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 min-h-[320px]">
        {state.showResults ? (
          <div>
            {/* Score bar */}
            <div className="relative w-full h-12 rounded-lg overflow-hidden mb-3 bg-gray-50 flex items-center justify-center">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: "35%",
                  background:
                    "linear-gradient(to right, rgba(220,38,38,0.10), rgba(220,38,38,0.04))",
                }}
              />
              <div className="relative text-center">
                <div className="text-lg font-bold text-red-600">35%</div>
                <div className="text-[10px] text-red-500 font-medium">
                  Low Match
                </div>
              </div>
            </div>
            {/* Missing chips */}
            <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5">
              Missing Keywords
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                "+ Kubernetes",
                "+ Terraform",
                "+ Redis",
                "+ CI/CD",
                "+ Microservices",
              ].map((k) => (
                <span
                  key={k}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
            {/* Filler preview */}
            <div className="text-[10px] text-gray-500 bg-gray-50 rounded p-2 font-mono leading-relaxed border border-gray-100">
              I am a{" "}
              <span className="bg-amber-100 text-amber-800 border-b border-amber-400 px-0.5">
                hardworking
              </span>{" "}
              <span className="bg-amber-100 text-amber-800 border-b border-amber-400 px-0.5">
                team player
              </span>{" "}
              with{" "}
              <span className="bg-amber-100 text-amber-800 border-b border-amber-400 px-0.5">
                excellent communication skills
              </span>
              ...
            </div>
          </div>
        ) : (
          // Analyze view
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <div className="text-[9px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                Resume
              </div>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 min-h-[280px]">
                {state.resumeText ? (
                  <pre className="text-[9px] text-gray-600 leading-relaxed whitespace-pre-wrap font-mono">
                    {state.resumeText}
                  </pre>
                ) : (
                  <span className="text-[9px] text-gray-300 italic">
                    Paste your resume here...
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-[9px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
                Job Description
              </div>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 min-h-[280px]">
                {state.jdText ? (
                  <pre className="text-[9px] text-gray-600 leading-relaxed whitespace-pre-wrap font-mono">
                    {state.jdText}
                  </pre>
                ) : (
                  <span className="text-[9px] text-gray-300 italic">
                    Paste job description here...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % STEPS.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  function goTo(index: number) {
    if (index === active) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => {
      setActive(index);
      setVisible(true);
    }, 300);
  }

  return (
    <section id="how-it-works" className="py-20" style={{ background: "var(--sl-surface)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-12" style={{ color: "var(--sl-text)" }}>How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-24 items-center">
          {/* Left — mock browser fades between states */}
          <div
            className="transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <MockBrowser state={MOCK_STATES[active]} />
          </div>

          {/* Right — steps */}
          <div className="flex flex-col gap-4">
            {STEPS.map(({ step, title, desc }, i) => (
              <button
                key={step}
                onClick={() => goTo(i)}
                className="text-left flex gap-4 items-start p-4 rounded-xl transition-all duration-200"
                style={{
                  background: active === i ? "var(--sl-accent-glow)" : "transparent",
                  border: active === i ? "1px solid rgba(124,106,255,0.25)" : "1px solid transparent",
                }}
              >
                <div
                  className="text-xs font-mono font-bold shrink-0 mt-0.5"
                  style={{ color: active === i ? "var(--sl-accent)" : "var(--sl-text-dim)" }}
                >
                  {step}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: active === i ? "var(--sl-text)" : "var(--sl-text-muted)" }}
                  >
                    {title}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--sl-text-dim)" }}>
                    {desc}
                  </div>
                </div>
              </button>
            ))}

            {/* Progress dots */}
            <div className="flex gap-2 pl-4 mt-1">
              {STEPS.map((stepItem, i) => (
                <button
                  key={stepItem.step}
                  onClick={() => goTo(i)}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: active === i ? 24 : 8,
                    background: active === i ? "var(--sl-accent)" : "var(--sl-border-light)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
