/**
 * IslandLoaf scoring formula:
 * score = (views * 0.7) + (likes * 0.2) + (comments * 0.1)
 */
export function calculateScore(views: number, likes: number, comments: number): number {
  return views * 0.7 + likes * 0.2 + comments * 0.1;
}

/**
 * Format large numbers for display (e.g., 1.2K, 3.4M)
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100); // amounts stored in cents
}
