export type ColorScheme = "system" | "light" | "dark";

export type ThemePreference = {
  colorScheme: ColorScheme;
  felt: boolean;
};

const storageKey = "patternfly-playground-theme";
const defaultPreference: ThemePreference = { colorScheme: "system", felt: false };

export function readThemePreference(): ThemePreference {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (typeof saved !== "object" || saved === null) return defaultPreference;

    const preference = saved as Record<string, unknown>;
    const colorScheme = preference.colorScheme;
    return {
      colorScheme:
        colorScheme === "light" || colorScheme === "dark" || colorScheme === "system"
          ? colorScheme
          : "system",
      felt: preference.felt === true,
    };
  } catch {
    return defaultPreference;
  }
}

export function applyThemePreference(preference: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark =
    preference.colorScheme === "dark" || (preference.colorScheme === "system" && prefersDark);

  document.documentElement.classList.toggle("pf-v6-theme-dark", isDark);
  document.documentElement.classList.toggle("pf-v6-theme-felt", preference.felt);
}

export function saveThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(preference));
  } catch {
    // Theme switching still works when storage is unavailable.
  }
}
