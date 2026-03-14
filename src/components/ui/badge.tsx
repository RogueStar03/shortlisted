type BadgeVariant = "red" | "green" | "amber" | "blue" | "gray";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  red: "bg-red-100 text-red-600",
  green: "bg-green-100 text-green-600",
  amber: "bg-amber-100 text-amber-600",
  blue: "bg-blue-100 text-blue-600",
  gray: "bg-gray-100 text-gray-500",
};

export default function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${BADGE_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
