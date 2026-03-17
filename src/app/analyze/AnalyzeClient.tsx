"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { analyseResume, type AnalysisResult } from "@/lib/engine";

// Lazy-load pdfjs only when needed — keeps initial bundle small
async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");

  // Worker must be set before any PDF operations
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => {
        const textItem = item as { str: string; hasEOL?: boolean };
        return textItem.hasEOL ? textItem.str + "\n" : textItem.str + " ";
      })
      .join("")
      .trim();
    pages.push(pageText);
  }

  return pages.join("\n\n").trim();
}

type InputMode = "text" | "pdf";

export default function AnalyzeClient() {
  const [resumeMode, setResumeMode] = useState<InputMode>("pdf");
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractWarning, setExtractWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("PDF must be under 5MB.");
      return;
    }

    setPdfFile(file);
    setExtractWarning(null);
    setError(null);
    setExtracting(true);

    try {
      const text = await extractTextFromPDF(file);

      if (text.length < 100) {
        setExtractWarning(
          "We couldn't extract much text from this PDF. It may be a scanned image or heavily designed template. Try copying and pasting the text manually instead.",
        );
        setResumeMode("text");
        setPdfFile(null);
      } else {
        setResume(text);
        if (text.length < 300) {
          setExtractWarning(
            "Extracted text looks short. If your resume has multiple columns or graphics, some content may have been missed. Check the text below.",
          );
        }
      }
    } catch {
      setError("Failed to read the PDF. Try copying the text manually.");
      setResumeMode("text");
      setPdfFile(null);
    } finally {
      setExtracting(false);
    }
  }

  function handleAnalyze() {
    setError(null);
    const resumeText = resume.trim();
    const jdText = jd.trim();

    if (resumeText.length < 50) {
      setError("Resume text is too short. Please paste your full resume.");
      return;
    }
    if (jdText.length < 50) {
      setError(
        "Job description is too short. Please paste the full job description.",
      );
      return;
    }

    setLoading(true);
    try {
      const result: AnalysisResult = analyseResume(resumeText, jdText);
      sessionStorage.setItem("shortlisted_result", JSON.stringify(result));
      sessionStorage.setItem("shortlisted_resume", resumeText);
      sessionStorage.setItem("shortlisted_jd", jdText);
      router.push("/results");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const resumeWords = resume.trim() ? resume.trim().split(/\s+/).length : 0;
  const jdWords = jd.trim() ? jd.trim().split(/\s+/).length : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Resume Analyzer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste your resume and the job description. We'll show you exactly
          what's missing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Your Resume
            </label>
            <div className="flex items-center gap-3">
              {resumeMode === "text" && (
                <span className="text-xs text-gray-400">
                  {resumeWords} words
                </span>
              )}
              {/* Mode toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    setResumeMode("pdf");
                    setExtractWarning(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    resumeMode === "pdf"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    setResumeMode("text");
                    setPdfFile(null);
                    setExtractWarning(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    resumeMode === "text"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Text
                </button>
              </div>
            </div>
          </div>
          {/* Extraction warning */}
          {extractWarning && (
            <p className="mb-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
              ⚠ {extractWarning}
            </p>
          )}
          {resumeMode === "text" ? (
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here — plain text works best. If you have a PDF, switch to PDF mode above."
              className="flex-1 min-h-[420px] px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono leading-relaxed"
            />
          ) : (
            <div className="flex-1 min-h-[420px] flex flex-col">
              {/* PDF drop zone */}
              <div
                onClick={() => !extracting && fileInputRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                  extracting
                    ? "border-blue-200 bg-blue-50 cursor-wait"
                    : pdfFile
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {extracting ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <p className="text-sm text-blue-600 font-medium">
                      Extracting text...
                    </p>
                  </>
                ) : pdfFile && resume ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-700">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {resumeWords} words extracted
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                        setResume("");
                        setExtractWarning(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Click to upload PDF
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Max 5MB · Text-based PDFs only
                      </p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePDFUpload}
                className="hidden"
              />

              {/* Show extracted text preview after PDF upload */}
              {pdfFile && resume && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-gray-500">
                      Extracted text preview
                    </p>
                    <button
                      onClick={() => setResumeMode("text")}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit manually
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 font-mono leading-relaxed">
                    {resume.slice(0, 400)}
                    {resume.length > 400 ? "..." : ""}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* JD panel — unchanged */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Job Description
            </label>
            <span className="text-xs text-gray-400">{jdWords} words</span>
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here — include the requirements, responsibilities, and preferred skills sections."
            className="flex-1 min-h-[420px] px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-xs text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100">
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
              <svg
                className="animate-spin h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Resume →"
          )}
        </button>
      </div>
    </main>
  );
}
