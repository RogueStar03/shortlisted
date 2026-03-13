"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyseResume, type AnalysisResult } from "@/lib/engine";

export default function AnalyzeClient() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleAnalyze() {
    setError(null);
    if (resume.trim().length < 50) {
      setError("Resume text is too short. Please paste your full resume.");
      return;
    }
    if (jd.trim().length < 50) {
      setError("Job description is too short. Please paste the full job description.");
      return;
    }

    setLoading(true);

    // Run analysis client-side — no API call needed
    try {
      const result: AnalysisResult = analyseResume(resume, jd);
      // Store result in sessionStorage to pass to results page
      sessionStorage.setItem("shortlisted_result", JSON.stringify(result));
      sessionStorage.setItem("shortlisted_resume", resume);
      sessionStorage.setItem("shortlisted_jd", jd);
      router.push("/results");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
      setLoading(false);
    }
  }

  const resumeWords = resume.trim() ? resume.trim().split(/\s+/).length : 0;
  const jdWords = jd.trim() ? jd.trim().split(/\s+/).length : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Resume Analyzer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste your resume and the job description. We&apos;ll show you exactly what&apos;s missing.
        </p>
      </div>

      {/* Two panel input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Resume */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Your Resume
            </label>
            <span className="text-xs text-gray-400">{resumeWords} words</span>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your resume text here — plain text works best. If you have a PDF, copy the text out of it."
            className="flex-1 min-h-105 px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono leading-relaxed"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Job Description
            </label>
            <span className="text-xs text-gray-400">{jdWords} words</span>
          </div>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here — include the requirements, responsibilities, and preferred skills sections."
            className="flex-1 min-h-105 px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-xs text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
          {error}
        </p>
      )}

      {/* CTA */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Analysis runs locally — your resume never leaves your device.
        </p>
        <button
          onClick={handleAnalyze}
          disabled={loading || !resume.trim() || !jd.trim()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Analyzing...
            </span>
          ) : "Analyze Resume →"}
        </button>
      </div>

    </main>
  );
}