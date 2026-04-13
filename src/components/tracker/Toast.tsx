"use client";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        opacity: visible ? 1 : 0,
        transition: "var(--sl-transition-slow)",
        background: "var(--sl-card)",
        border: "1px solid var(--sl-success)",
        borderRadius: "var(--sl-radius-xl)",
        padding: "10px 20px",
        color: "var(--sl-success)",
        fontSize: 13,
        zIndex: 9990,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
