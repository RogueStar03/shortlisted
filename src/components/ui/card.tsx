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
      className={`rounded-xl border bg-white p-5 ${
        highlight ? "border-blue-200 bg-blue-50" : "border-gray-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
