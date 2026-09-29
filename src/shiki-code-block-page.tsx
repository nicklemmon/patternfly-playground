import { Title } from "@patternfly/react-core";
import { Link } from "@tanstack/react-router";
import { ShikiCodeBlockPrototype } from "./shiki-code-block-prototype";

export function ShikiCodeBlockPage() {
  return (
    <>
      <Link to="/" className="back-link">
        ← All prototypes
      </Link>
      <div className="page-heading">
        <p className="page-overline">Syntax highlighting spike</p>
        <Title headingLevel="h1" size="3xl">
          Shiki + PatternFly CodeBlock
        </Title>
        <p>
          Compare two ways to compose Shiki syntax highlighting with PatternFly’s CodeBlock. Prefer
          Approach A for real apps — it keeps PatternFly’s pre and code elements.
        </p>
      </div>
      <ShikiCodeBlockPrototype />
    </>
  );
}
