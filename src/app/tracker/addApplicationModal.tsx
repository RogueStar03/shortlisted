"use client";

import { useState } from "react";
import type {
  Application,
  ApplicationStatus,
} from "@/lib/supabase/applications";

interface Props {
  onClose: () => void;
  onAdd: (data: {
    company: string;
    role: string;
    status: ApplicationStatus;
    applied_at: string;
    jd_url: string | null;
    notes: string | null;
  }) => Promise<void>;
  onEdit?: (
    id: string,
    data: {
      company: string;
      role: string;
      status: ApplicationStatus;
      applied_at: string;
      jd_url: string | null;
      notes: string | null;
    },
  ) => Promise<void>;
  editingApp?: Application | null;
}

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--sl-card)",
  border: "1px solid var(--sl-border)",
  borderRadius: "var(--sl-radius-lg)",
  color: "var(--sl-text)",
  padding: "8px 12px",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 500,
  color: "var(--sl-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: 6,
};

export default function AddApplicationModal({ onClose, onAdd }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("applied");
  const [appliedAt, setAppliedAt] = useState(
    editingApp?.applied_at ?? new Date().toISOString().split("T")[0],
  );
  const [jdUrl, setJdUrl] = useState(editingApp?.jd_url ?? "");
  const [notes, setNotes] = useState(editingApp?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      company: company.trim(),
      role: role.trim(),
      status,
      applied_at: appliedAt,
      jd_url: jdUrl.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (isEditing && onEdit) {
        await onEdit(editingApp.id, payload);
      } else {
        await onAdd(payload);
      }
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        padding: "0 16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--sl-surface)",
          border: "1px solid var(--sl-border-light)",
          borderRadius: "var(--sl-radius-2xl)",
          boxShadow: "var(--sl-shadow-modal)",
          width: "100%",
          maxWidth: 440,
          padding: 24,
          animation: "sl-scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--sl-text)", margin: 0 }}>Add application</h2>
          <button
            onClick={onClose}
            style={{ color: "var(--sl-text-dim)", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>
                Company <span style={{ color: "var(--sl-danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Role <span style={{ color: "var(--sl-danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Software Engineer"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                style={{ ...inputStyle, background: "var(--sl-card)" }}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Applied on</label>
              <input
                type="date"
                value={appliedAt}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setAppliedAt(e.target.value)}
                style={{ ...inputStyle, background: "var(--sl-card)" }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Job posting URL</label>
            <input
              type="text"
              value={jdUrl}
              onChange={(e) => {
                const val = e.target.value;
                if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
                  setJdUrl("https://" + val);
                } else {
                  setJdUrl(val);
                }
              }}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruiter name, interview date, anything relevant..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 11, color: "var(--sl-danger)", background: "var(--sl-danger-bg)", padding: "8px 12px", borderRadius: "var(--sl-radius-lg)" }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "1px solid var(--sl-border)",
                borderRadius: "var(--sl-radius-lg)",
                fontSize: 13,
                color: "var(--sl-text-muted)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "var(--sl-gradient-accent)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                borderRadius: "var(--sl-radius-lg)",
                border: "none",
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
