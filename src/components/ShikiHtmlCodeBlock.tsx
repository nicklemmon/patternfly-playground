import { useEffect, useState } from "react";
import { CodeBlock, Spinner } from "@patternfly/react-core";
import type { ColorMode } from "../hooks/useColorMode";
import { highlightToHtml } from "../highlight/highlighter";
import type { HighlightLang } from "../highlight/languages";
import { CopyCodeAction } from "./CopyCodeAction";

type ShikiHtmlCodeBlockProps = {
  code: string;
  lang: HighlightLang;
  colorMode: ColorMode;
};

/**
 * Approach B: CodeBlock chrome only — Shiki owns the <pre><code> via HTML.
 * Intentionally skips CodeBlockCode to avoid nested pre/code.
 */
export function ShikiHtmlCodeBlock({ code, lang, colorMode }: ShikiHtmlCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setError(null);

    void highlightToHtml(code, lang, colorMode)
      .then((result) => {
        if (!cancelled) {
          setHtml(result);
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
    <CodeBlock actions={<CopyCodeAction code={code} id="approach-b-copy" />}>
      {error ? (
        <pre className="shiki-html-fallback">{code}</pre>
      ) : html ? (
        <div
          className="shiki-html-body"
          // Shiki HTML is generated from our own sample strings, not user HTML input.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="shiki-html-loading">
          <Spinner size="md" aria-label="Highlighting code" />
        </div>
      )}
    </CodeBlock>
  );
}
