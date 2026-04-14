export default function Card({
  children,
  className = "",
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: "var(--sl-radius-xl)",
        border: highlight
          ? "1px solid rgba(124,106,255,0.35)"
          : "1px solid var(--sl-border)",
        background: highlight ? "var(--sl-accent-glow)" : "var(--sl-card)",
        padding: 20,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
