import { Title } from "@patternfly/react-core";
import { Link } from "@tanstack/react-router";
import { CommandPalettePrototype } from "./command-palette-prototype";

export function CommandPalettePage() {
  return (
    <>
      <Link to="/" className="back-link">
        ← All prototypes
      </Link>
      <div className="page-heading">
        <p className="page-overline">Syntara navigation study</p>
        <Title headingLevel="h1" size="3xl">
          Syntara command palette
        </Title>
        <p>Find a destination in Syntara’s main navigation without losing your place.</p>
      </div>
      <CommandPalettePrototype />
    </>
  );
}
