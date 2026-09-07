/**
 * Real-platform "rich text" — LinkedIn and Facebook posts are plain text,
 * there is no bold/italic HTML on the other end of the publish API. Bold
 * and italic are applied as Unicode Mathematical Alphanumeric Symbol
 * substitutions directly on the caption string instead — the same
 * technique every real social scheduler uses, since it's the only styling
 * that actually survives a plain-text post. Only A-Z/a-z map; everything
 * else (digits, punctuation, spaces) passes through unchanged.
 */

const BOLD_UPPER_BASE = 0x1d400;
const BOLD_LOWER_BASE = 0x1d41a;
const ITALIC_UPPER_BASE = 0x1d434;
const ITALIC_LOWER_BASE = 0x1d44e;

function mapLetters(text: string, upperBase: number, lowerBase: number): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(upperBase + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(lowerBase + (code - 97));
    } else {
      out += ch;
    }
  }
  return out;
}

export function toUnicodeBold(text: string): string {
  return mapLetters(text, BOLD_UPPER_BASE, BOLD_LOWER_BASE);
}

export function toUnicodeItalic(text: string): string {
  return mapLetters(text, ITALIC_UPPER_BASE, ITALIC_LOWER_BASE);
}

/** Prefixes each non-empty line of the given text with a bullet, for the
 *  toolbar's List button. */
export function toBulletList(text: string): string {
  return text
    .split("\n")
    .map((line) => (line.trim().length === 0 ? line : line.startsWith("• ") ? line : `• ${line}`))
    .join("\n");
}
