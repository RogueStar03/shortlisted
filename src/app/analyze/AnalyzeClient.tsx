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

const inputStyle: React.CSSProperties = {
  background: "var(--sl-surface)",
  border: "1px solid var(--sl-border)",
  borderRadius: "var(--sl-radius-xl)",
  color: "var(--sl-text)",
  padding: "14px",
  fontSize: 12,
  lineHeight: 1.6,
  outline: "none",
  resize: "vertical" as const,
  width: "100%",
  boxSizing: "border-box" as const,
  fontFamily: "var(--font-mono, monospace)",
};

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
    <main style={{ padding: "40px 24px", background: "var(--sl-base)" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--sl-text)", margin: 0 }}>
          Resume Analyzer
        </h1>
        <p style={{ marginTop: 4, fontSize: 13, color: "var(--sl-text-muted)" }}>
          Paste your resume and the job description. We&apos;ll show you exactly what&apos;s missing.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Resume panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Your Resume
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {resumeMode === "text" && (
                <span style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>
                  {resumeWords} words
                </span>
              )}
              {/* Mode toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 2, background: "var(--sl-surface)", borderRadius: "var(--sl-radius-lg)", padding: 2 }}>
                {(["pdf", "text"] as InputMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setResumeMode(mode);
                      setExtractWarning(null);
                      if (mode === "text") setPdfFile(null);
                    }}
                    style={{
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: "var(--sl-radius-md)",
                      border: "none",
                      cursor: "pointer",
                      transition: "var(--sl-transition-fast)",
                      ...(resumeMode === mode
                        ? { background: "var(--sl-card)", color: "var(--sl-text)" }
                        : { background: "transparent", color: "var(--sl-text-dim)" }),
                    }}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extraction warning */}
          {extractWarning && (
            <p style={{ marginBottom: 8, fontSize: 11, color: "var(--sl-warning)", background: "var(--sl-warning-bg)", padding: "8px 12px", borderRadius: "var(--sl-radius-lg)", border: "1px solid var(--sl-warning)" }}>
              ⚠ {extractWarning}
            </p>
          )}

          {resumeMode === "text" ? (
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here — plain text works best. If you have a PDF, switch to PDF mode above."
              style={{ ...inputStyle, minHeight: 420 }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 420 }}>
              {/* PDF drop zone */}
              <div
                onClick={() => !extracting && fileInputRef.current?.click()}
                style={{
                  flex: 1,
                  border: `2px dashed ${extracting ? "var(--sl-accent)" : pdfFile ? "var(--sl-success)" : "var(--sl-border)"}`,
                  borderRadius: "var(--sl-radius-xl)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  cursor: extracting ? "wait" : "pointer",
                  background: extracting ? "var(--sl-accent-glow)" : pdfFile ? "var(--sl-success-bg)" : "var(--sl-surface)",
                  transition: "var(--sl-transition-normal)",
                }}
              >
                {extracting ? (
                  <>
                    <svg className="animate-spin h-6 w-6" style={{ color: "var(--sl-accent)" }} viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p style={{ fontSize: 13, color: "var(--sl-accent)", fontWeight: 500 }}>Extracting text...</p>
                  </>
                ) : pdfFile && resume ? (
                  <>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--sl-success-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "var(--sl-success)", fontSize: 18 }}>✓</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--sl-success)" }}>{pdfFile.name}</p>
                      <p style={{ fontSize: 11, color: "var(--sl-text-muted)", marginTop: 2 }}>{resumeWords} words extracted</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                        setResume("");
                        setExtractWarning(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      style={{ fontSize: 11, color: "var(--sl-text-dim)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--sl-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg style={{ width: 20, height: 20, color: "var(--sl-text-dim)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--sl-text-muted)" }}>Click to upload PDF</p>
                      <p style={{ fontSize: 11, color: "var(--sl-text-dim)", marginTop: 2 }}>Max 5MB · Text-based PDFs only</p>
                    </div>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePDFUpload}
                style={{ display: "none" }}
              />

              {/* Extracted text preview */}
              {pdfFile && resume && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <p style={{ fontSize: 11, color: "var(--sl-text-muted)" }}>Extracted text preview</p>
                    <button
                      onClick={() => setResumeMode("text")}
                      style={{ fontSize: 11, color: "var(--sl-accent)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Edit manually
                    </button>
                  </div>
                  <div style={{ maxHeight: 128, overflowY: "auto", background: "var(--sl-surface)", border: "1px solid var(--sl-border)", borderRadius: "var(--sl-radius-lg)", padding: "8px 12px", fontSize: 11, color: "var(--sl-text-muted)", fontFamily: "var(--font-mono, monospace)", lineHeight: 1.6 }}>
                    {resume.slice(0, 400)}{resume.length > 400 ? "..." : ""}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* JD panel */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--sl-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Job Description
            </label>
            <span style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>{jdWords} words</span>
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here — include the requirements, responsibilities, and preferred skills sections."
            style={{ ...inputStyle, minHeight: 420 }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p style={{ marginTop: 16, fontSize: 11, color: "var(--sl-danger)", background: "var(--sl-danger-bg)", padding: "10px 16px", borderRadius: "var(--sl-radius-lg)", border: "1px solid var(--sl-danger)" }}>
          {error}
        </p>
      )}

      {/* CTA */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 11, color: "var(--sl-text-dim)" }}>
          Analysis runs locally — your resume never leaves your device.
        </p>
        <button
          onClick={handleAnalyze}
          disabled={loading || !resume.trim() || !jd.trim()}
          style={{
            background: "var(--sl-gradient-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--sl-radius-lg)",
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            opacity: loading || !resume.trim() || !jd.trim() ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze Resume →"
          )}
        </button>
      </div>
    </main>
  );
}
