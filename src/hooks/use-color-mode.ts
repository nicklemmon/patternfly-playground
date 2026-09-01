import { useCallback, useEffect, useState } from "react";

export type ColorMode = "light" | "dark";

const STORAGE_KEY = "pf-playground-color-mode";
const DARK_CLASS = "pf-v6-theme-dark";

function getPreferredMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyMode(mode: ColorMode) {
  document.documentElement.classList.toggle(DARK_CLASS, mode === "dark");
}

export function useColorMode() {
  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const mode = getPreferredMode();
    applyMode(mode);
    return mode;
  });

  useEffect(() => {
    applyMode(colorMode);
    localStorage.setItem(STORAGE_KEY, colorMode);
  }, [colorMode]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { colorMode, setColorMode, toggleColorMode };
}
