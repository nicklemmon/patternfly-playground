import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import type { CSSProperties, ReactNode } from "react";
import { createHighlighterCore } from "shiki/core";
import type { HighlighterCore, ThemeRegistration } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export const highlightLangs = ["typescript", "tsx", "javascript", "json", "yaml", "bash"] as const;
export type HighlightLang = (typeof highlightLangs)[number];

type ThemeModule = Promise<{ default: ThemeRegistration }>;

// Static import() calls so Vite emits a chunk per theme, fetched only when picked.
const themeLoaders = {
  "github-light": () => import("shiki/themes/github-light.mjs"),
  "github-dark": () => import("shiki/themes/github-dark.mjs"),
  "catppuccin-latte": () => import("shiki/themes/catppuccin-latte.mjs"),
  "catppuccin-mocha": () => import("shiki/themes/catppuccin-mocha.mjs"),
  "solarized-light": () => import("shiki/themes/solarized-light.mjs"),
  "solarized-dark": () => import("shiki/themes/solarized-dark.mjs"),
  "one-light": () => import("shiki/themes/one-light.mjs"),
  "one-dark-pro": () => import("shiki/themes/one-dark-pro.mjs"),
  "rose-pine-dawn": () => import("shiki/themes/rose-pine-dawn.mjs"),
  "rose-pine-moon": () => import("shiki/themes/rose-pine-moon.mjs"),
  "vitesse-light": () => import("shiki/themes/vitesse-light.mjs"),
  "vitesse-dark": () => import("shiki/themes/vitesse-dark.mjs"),
} satisfies Record<string, () => ThemeModule>;
type ThemeName = keyof typeof themeLoaders;

// Each pair follows the playground's light/dark color scheme.
export const themePairs = [
  { id: "github", label: "GitHub", light: "github-light", dark: "github-dark" },
  { id: "catppuccin", label: "Catppuccin", light: "catppuccin-latte", dark: "catppuccin-mocha" },
  { id: "solarized", label: "Solarized", light: "solarized-light", dark: "solarized-dark" },
  { id: "one", label: "One", light: "one-light", dark: "one-dark-pro" },
  { id: "rose-pine", label: "Rosé Pine", light: "rose-pine-dawn", dark: "rose-pine-moon" },
  { id: "vitesse", label: "Vitesse", light: "vitesse-light", dark: "vitesse-dark" },
] as const satisfies readonly { id: string; label: string; light: ThemeName; dark: ThemeName }[];
export type ThemePair = (typeof themePairs)[number];

export type Highlighted<T> = {
  body: T;
  /** Theme background/foreground as CSS variables for the surrounding CodeBlock. */
  style: CSSProperties;
};

let highlighterPromise: Promise<HighlighterCore> | undefined;

// Fine-grained imports keep the build from emitting a chunk for every Shiki grammar.
async function getHighlighter(pair: ThemePair) {
  highlighterPromise ??= createHighlighterCore({
    themes: [],
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
  const highlighter = await highlighterPromise;
  const missing = [pair.light, pair.dark].filter(
    (name) => !highlighter.getLoadedThemes().includes(name),
  );
  await highlighter.loadTheme(...missing.map((name) => themeLoaders[name]()));
  return highlighter;
}

// Both themes are emitted as CSS variables (--shiki-light / --shiki-dark) so the
// playground's `pf-v6-theme-dark` class picks the palette without re-highlighting.
function themeOptions(pair: ThemePair) {
  return { themes: { light: pair.light, dark: pair.dark }, defaultColor: false } as const;
}

function themeStyle(highlighter: HighlighterCore, pair: ThemePair): CSSProperties {
  const light = highlighter.getTheme(pair.light);
  const dark = highlighter.getTheme(pair.dark);
  return {
    "--shiki-light-bg": light.bg,
    "--shiki-light-fg": light.fg,
    "--shiki-dark-bg": dark.bg,
    "--shiki-dark-fg": dark.fg,
  } as CSSProperties;
}

/** Approach A: token spans only, suitable as CodeBlockCode children (no nested pre). */
export async function highlightToReactNodes(
  code: string,
  lang: HighlightLang,
  pair: ThemePair,
): Promise<Highlighted<ReactNode>> {
  const highlighter = await getHighlighter(pair);
  const root = highlighter.codeToHast(code, { lang, ...themeOptions(pair) });
  const pre = root.children.find((child) => child.type === "element" && child.tagName === "pre");
  const codeElement =
    pre?.type === "element"
      ? pre.children.find((child) => child.type === "element" && child.tagName === "code")
      : undefined;
  const children = codeElement?.type === "element" ? codeElement.children : [];

  return {
    body: toJsxRuntime(
      { type: "root", children },
      { Fragment, jsx, jsxs, elementAttributeNameCase: "react" },
    ),
    style: themeStyle(highlighter, pair),
  };
}

/** Approach B: full Shiki HTML, which includes its own pre/code. Don't nest it in CodeBlockCode. */
export async function highlightToHtml(
  code: string,
  lang: HighlightLang,
  pair: ThemePair,
): Promise<Highlighted<string>> {
  const highlighter = await getHighlighter(pair);
  return {
    body: highlighter.codeToHtml(code, { lang, ...themeOptions(pair) }),
    style: themeStyle(highlighter, pair),
  };
}
