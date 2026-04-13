type BadgeVariant = "danger" | "success" | "warning" | "accent" | "muted";

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  danger: {
    background: "var(--sl-danger-bg)",
    color: "var(--sl-danger)",
  },
  success: {
    background: "var(--sl-success-bg)",
    color: "var(--sl-success)",
  },
  warning: {
    background: "var(--sl-warning-bg)",
    color: "var(--sl-warning)",
  },
  accent: {
    background: "var(--sl-accent-glow)",
    color: "var(--sl-accent)",
  },
  muted: {
    background: "var(--sl-card)",
    color: "var(--sl-text-muted)",
  },
};

export default function Badge({
  children,
  variant = "muted",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      style={{
        ...BADGE_STYLES[variant],
        display: "inline-flex",
        alignItems: "center",
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}
