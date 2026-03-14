// Single source of truth for all brand colors
// Change here → changes everywhere

export const BRAND = {
  primary: "#2563EB", // blue-600
  primaryHover: "#1D4ED8", // blue-700
  primaryLight: "#EFF6FF", // blue-50
  primaryBorder: "#BFDBFE", // blue-200
} as const;

export const SCORE_BANDS = {
  strong: {
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    label: "Strong Match",
  },
  moderate: {
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    label: "Moderate Match",
  },
  poor: {
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    label: "Low Match",
  },
} as const;

export const CATEGORY_COLORS = {
  technical: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  tool: { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
  soft: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  general: { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB" },
} as const;

export const FILLER_COLORS = {
  bg: "#FEF3C7",
  text: "#92400E",
  border: "#FDE68A",
  underline: "#F59E0B",
} as const;

// Section background alternation
export const SECTION_BG = {
  primary: "#FFFFFF",
  secondary: "#F8FAFC",
} as const;
