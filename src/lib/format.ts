/** Shared formatting utilities. */

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}
