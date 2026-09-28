import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import type { ReactNode } from "react";
import { createHighlighterCore } from "shiki/core";
import type { HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export const highlightLangs = ["typescript", "tsx", "javascript", "json", "yaml", "bash"] as const;
export type HighlightLang = (typeof highlightLangs)[number];

// Both themes are emitted as CSS variables (--shiki-light / --shiki-dark) so the
// playground's `pf-v6-theme-dark` class picks the palette without re-highlighting.
const themeOptions = {
  themes: { light: "github-light", dark: "github-dark" },
  defaultColor: false,
} as const;

let highlighterPromise: Promise<HighlighterCore> | undefined;

// Fine-grained imports keep the build from emitting a chunk for every Shiki grammar.
function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [import("shiki/themes/github-light.mjs"), import("shiki/themes/github-dark.mjs")],
    langs: [
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/yaml.mjs"),
      import("shiki/langs/bash.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}

/** Approach A: token spans only, suitable as CodeBlockCode children (no nested pre). */
export async function highlightToReactNodes(code: string, lang: HighlightLang): Promise<ReactNode> {
  const highlighter = await getHighlighter();
  const root = highlighter.codeToHast(code, { lang, ...themeOptions });
  const pre = root.children.find((child) => child.type === "element" && child.tagName === "pre");
  const codeElement =
    pre?.type === "element"
      ? pre.children.find((child) => child.type === "element" && child.tagName === "code")
      : undefined;
  const children = codeElement?.type === "element" ? codeElement.children : [];

  return toJsxRuntime(
    { type: "root", children },
    { Fragment, jsx, jsxs, elementAttributeNameCase: "react" },
  );
}

/** Approach B: full Shiki HTML, which includes its own pre/code. Don't nest it in CodeBlockCode. */
export async function highlightToHtml(code: string, lang: HighlightLang): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, { lang, ...themeOptions });
}
