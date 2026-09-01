export const HIGHLIGHT_LANGS = ["typescript", "tsx", "javascript", "json", "yaml", "bash"] as const;

export type HighlightLang = (typeof HIGHLIGHT_LANGS)[number];

export function isHighlightLang(value: string): value is HighlightLang {
  return (HIGHLIGHT_LANGS as readonly string[]).includes(value);
}
