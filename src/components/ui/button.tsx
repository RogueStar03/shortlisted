import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--sl-gradient-accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--sl-radius-lg)",
  },
  secondary: {
    background: "transparent",
    color: "var(--sl-text-muted)",
    border: "1px solid var(--sl-border)",
    borderRadius: "var(--sl-radius-lg)",
  },
  ghost: {
    background: "transparent",
    color: "var(--sl-accent)",
    border: "none",
    borderRadius: "var(--sl-radius-md)",
    fontSize: 11,
  },
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseClass = `inline-flex items-center justify-center font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed ${SIZE_CLASSES[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={baseClass} style={VARIANT_STYLES[variant]} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      style={VARIANT_STYLES[variant]}
    >
      {children}
    </button>
  );
}
