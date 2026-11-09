import type { TextPart } from "@/types/ui";

/**
 * Splits "Shaping *tomorrow.*" into plain and emphasised parts.
 * Asterisks mark emphasis; an unmatched asterisk is kept as literal text.
 */
export function splitEmphasis(line: string): TextPart[] {
  const parts: TextPart[] = [];
  const pattern = /\*([^*]+)\*/g;
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: line.slice(last, start), emphasis: false });
    parts.push({ text: match[1], emphasis: true });
    last = start + match[0].length;
  }
  if (last < line.length) parts.push({ text: line.slice(last), emphasis: false });
  return parts;
}
