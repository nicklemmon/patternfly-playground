import type { ColorMode } from "../hooks/useColorMode";

export const SHIKI_THEME_LIGHT = "github-light";
export const SHIKI_THEME_DARK = "github-dark";

export function shikiThemeForMode(mode: ColorMode) {
  return mode === "dark" ? SHIKI_THEME_DARK : SHIKI_THEME_LIGHT;
}
