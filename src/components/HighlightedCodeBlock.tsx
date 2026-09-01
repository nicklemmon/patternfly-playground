import { useEffect, useState, type JSX } from "react";
import { CodeBlock, CodeBlockCode, Spinner } from "@patternfly/react-core";
import type { ColorMode } from "../hooks/useColorMode";
import { highlightToReactNodes } from "../highlight/highlighter";
import type { HighlightLang } from "../highlight/languages";
import { CopyCodeAction } from "./CopyCodeAction";

type HighlightedCodeBlockProps = {
  code: string;
  lang: HighlightLang;
  colorMode: ColorMode;
};

/**
 * Approach A: keep PatternFly CodeBlockCode's <pre><code>, inject Shiki token spans.
 */
export function HighlightedCodeBlock({ code, lang, colorMode }: HighlightedCodeBlockProps) {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setNodes(null);
    setError(null);

    void highlightToReactNodes(code, lang, colorMode)
      .then((result) => {
        if (!cancelled) {
          setNodes(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Highlight failed");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang, colorMode]);

  return (
    <CodeBlock actions={<CopyCodeAction code={code} id="approach-a-copy" />}>
      <CodeBlockCode id="approach-a-code" className="pf-shiki-tokens">
        {error ? code : (nodes ?? <Spinner size="md" aria-label="Highlighting code" />)}
      </CodeBlockCode>
    </CodeBlock>
  );
}
