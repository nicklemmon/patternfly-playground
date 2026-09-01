import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs, type JSX } from "react/jsx-runtime";
import { createHighlighter, type Highlighter } from "shiki/bundle/web";
import type { ColorMode } from "../hooks/use-color-mode";
import { HIGHLIGHT_LANGS, type HighlightLang } from "./languages";
import { SHIKI_THEME_DARK, SHIKI_THEME_LIGHT, shikiThemeForMode } from "./themes";

type HastRoot = ReturnType<Highlighter["codeToHast"]>;

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME_LIGHT, SHIKI_THEME_DARK],
      langs: [...HIGHLIGHT_LANGS],
    });
  }
  return highlighterPromise;
}

function getCodeElementChildren(root: HastRoot) {
  const pre = root.children.find((child) => child.type === "element" && child.tagName === "pre");
  if (!pre || pre.type !== "element") {
    return [];
  }
  const code = pre.children.find((child) => child.type === "element" && child.tagName === "code");
  if (!code || code.type !== "element") {
    return [];
  }
  return code.children;
}

/** Approach A: token spans suitable as CodeBlockCode children (no nested pre). */
export async function highlightToReactNodes(
  code: string,
  lang: HighlightLang,
  colorMode: ColorMode,
): Promise<JSX.Element> {
  const highlighter = await getHighlighter();
  const theme = shikiThemeForMode(colorMode);
  const hast = highlighter.codeToHast(code, { lang, theme });
  const children = getCodeElementChildren(hast);

  return toJsxRuntime(
    { type: "root", children },
    { Fragment, jsx, jsxs, elementAttributeNameCase: "react" },
  ) as JSX.Element;
}

/**
 * Approach B: full Shiki HTML (includes its own pre/code).
 * Callers should NOT nest this inside CodeBlockCode.
 */
export async function highlightToHtml(
  code: string,
  lang: HighlightLang,
  colorMode: ColorMode,
): Promise<string> {
  const highlighter = await getHighlighter();
  const theme = shikiThemeForMode(colorMode);
  return highlighter.codeToHtml(code, { lang, theme });
}
