import { useEffect, useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Gallery,
  Label,
  Switch,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
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
        <Link to="/" className="playground-brand">
          <span className="brand-mark">pf</span>
          <span>PatternFly playground</span>
        </Link>
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
        <Outlet />
      </main>
    </div>
  );
}

export function PrototypeIndex() {
  return (
    <>
      <div className="page-heading">
        <Title headingLevel="h1" size="3xl">
          Prototypes
        </Title>
      </div>
      <Gallery hasGutter className="prototype-gallery">
        <Card isFullHeight>
          <CardHeader>
            <Label color="purple" isCompact>
              Navigation
            </Label>
          </CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              Syntara command palette
            </Title>
          </CardTitle>
          <CardBody>Find Syntara pages from a keyboard-accessible command palette.</CardBody>
          <CardFooter>
            <Link to="/command-palette" aria-label="Open Syntara command palette prototype">
              Open prototype
            </Link>
          </CardFooter>
        </Card>
      </Gallery>
    </>
  );
}
