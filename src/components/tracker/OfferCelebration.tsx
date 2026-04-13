"use client";

interface OfferCelebrationProps {
  company: string;
  role: string;
  onClose: () => void;
}

export default function OfferCelebration({ company, role, onClose }: OfferCelebrationProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--sl-surface)",
          border: "1px solid rgba(52,211,153,0.27)",
          borderRadius: "var(--sl-radius-3xl)",
          padding: "44px 52px",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          boxShadow: "var(--sl-shadow-celebration)",
          animation: "sl-scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 30,
            color: "var(--sl-text)",
            marginBottom: 12,
          }}
        >
          You got an offer!
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--sl-success)",
            marginBottom: 6,
          }}
        >
          {company}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--sl-text-muted)",
            marginBottom: 8,
          }}
        >
          {role}
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--sl-text-muted)",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          All that effort paid off. Take a moment to celebrate — you earned this.
        </p>
        <button
          onClick={onClose}
          style={{
            background: "var(--sl-gradient-success)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--sl-radius-lg)",
            padding: "12px 32px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Thanks!
        </button>
      </div>
    </div>
  );
}
