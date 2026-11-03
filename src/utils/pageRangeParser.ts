/**
 * Parses user input page ranges like "1-5", "1, 3, 5-8", "2"
 * and returns sorted, deduplicated 0-based page indices.
 */
export function parsePageRange(input: string, maxPages: number): number[] {
  if (!input || !input.trim()) {
    // default to all pages
    return Array.from({ length: maxPages }, (_, i) => i);
  }

  const result = new Set<number>();
  const parts = input.split(/[,;\s]+/);

  for (const part of parts) {
    if (!part) continue;

    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const minVal = Math.min(start, end);
        const maxVal = Math.max(start, end);
        for (let p = minVal; p <= maxVal; p++) {
          if (p >= 1 && p <= maxPages) {
            result.add(p - 1); // convert to 0-based index
          }
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) {
        result.add(p - 1); // convert to 0-based index
      }
    }
  }

  const sorted = Array.from(result).sort((a, b) => a - b);
  return sorted.length > 0 ? sorted : Array.from({ length: maxPages }, (_, i) => i);
}

/**
 * Format page indices back to a readable string (e.g. [0, 1, 2, 4] -> "1-3, 5")
 */
export function formatPageRange(indices: number[]): string {
  if (indices.length === 0) return '';
  const sorted = [...indices].sort((a, b) => a - b);
  const ranges: string[] = [];

  let start = sorted[0];
  let end = start;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
      start = sorted[i];
      end = start;
    }
  }
  ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);

  return ranges.join(', ');
}
