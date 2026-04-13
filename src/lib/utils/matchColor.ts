export function getMatchColor(score: number): string {
  if (score >= 75) return "var(--sl-success)";
  if (score >= 50) return "var(--sl-warning)";
  return "var(--sl-danger)";
}
