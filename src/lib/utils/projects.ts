/** Two-digit display index: 1 → "01". */
export function displayIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
