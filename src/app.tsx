import { useEffect, useState } from "react";
import { Switch, Title, ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
import { CommandPalettePrototype } from "./command-palette-prototype";
import { applyThemePreference, readThemePreference, saveThemePreference } from "./theme-preference";
import type { ColorScheme } from "./theme-preference";

const colorSchemes: { value: ColorScheme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function App() {
  const [theme, setTheme] = useState(readThemePreference);

  useEffect(() => {
    applyThemePreference(theme);
    saveThemePreference(theme);

    if (theme.colorScheme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystemTheme = () => applyThemePreference(theme);
    media.addEventListener("change", followSystemTheme);
    return () => media.removeEventListener("change", followSystemTheme);
  }, [theme]);

  return (
    <div className="playground-shell">
      <header className="playground-header">
        <div className="playground-brand">
          <span className="brand-mark">pf</span>
          <span>PatternFly playground</span>
        </div>
        <div className="theme-controls" role="group" aria-label="Theme settings">
          <ToggleGroup aria-label="Color scheme" isCompact>
            {colorSchemes.map(({ value, label }) => (
              <ToggleGroupItem
                key={value}
                text={label}
                isSelected={theme.colorScheme === value}
                onChange={() => setTheme((current) => ({ ...current, colorScheme: value }))}
              />
            ))}
          </ToggleGroup>
          <Switch
            id="felt-theme"
            label="Project Felt"
            isChecked={theme.felt}
            onChange={(_, felt) => setTheme((current) => ({ ...current, felt }))}
          />
        </div>
      </header>
      <main className="playground-main">
        <div className="page-heading">
          <p className="page-overline">Syntara navigation study</p>
          <Title headingLevel="h1" size="3xl">
            Syntara command palette
          </Title>
          <p>Find a destination in Syntara’s main navigation without losing your place.</p>
        </div>
        <CommandPalettePrototype />
      </main>
    </div>
  );
}
