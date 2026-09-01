import { ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
import type { ColorMode } from "../hooks/useColorMode";

type ThemeToggleProps = {
  colorMode: ColorMode;
  onChange: (mode: ColorMode) => void;
};

export function ThemeToggle({ colorMode, onChange }: ThemeToggleProps) {
  return (
    <ToggleGroup aria-label="Color mode">
      <ToggleGroupItem
        text="Light"
        isSelected={colorMode === "light"}
        onChange={() => onChange("light")}
        buttonId="color-mode-light"
      />
      <ToggleGroupItem
        text="Dark"
        isSelected={colorMode === "dark"}
        onChange={() => onChange("dark")}
        buttonId="color-mode-dark"
      />
    </ToggleGroup>
  );
}
