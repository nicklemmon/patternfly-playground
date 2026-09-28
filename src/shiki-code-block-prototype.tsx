// PROTOTYPE: Two ways to compose Shiki syntax highlighting with PatternFly's CodeBlock.
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Content,
  Label,
  Spinner,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { codeSamples } from "./shiki-code-samples";
import { highlightLangs, highlightToHtml, highlightToReactNodes } from "./shiki-highlighter";
import type { HighlightLang } from "./shiki-highlighter";

type Highlighted<T> =
  | { status: "loading" }
  | { status: "done"; value: T }
  | { status: "error"; message: string };

function useHighlighted<T>(
  code: string,
  lang: HighlightLang,
  highlight: (code: string, lang: HighlightLang) => Promise<T>,
): Highlighted<T> {
  const [result, setResult] = useState<{ key: string; highlighted: Highlighted<T> }>();
  const key = `${lang}\n${code}`;

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang).then(
      (value) => !cancelled && setResult({ key, highlighted: { status: "done", value } }),
      (error: unknown) =>
        !cancelled &&
        setResult({
          key,
          highlighted: {
            status: "error",
            message: error instanceof Error ? error.message : "Highlight failed",
          },
        }),
    );
    return () => {
      cancelled = true;
    };
  }, [code, lang, key, highlight]);

  return result?.key === key ? result.highlighted : { status: "loading" };
}

function CopyCodeAction({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <CodeBlockAction>
      <ClipboardCopyButton
        id={id}
        aria-label="Copy code to clipboard"
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
        }}
        exitDelay={copied ? 1500 : 600}
        maxWidth="110px"
        variant="plain"
        onTooltipHidden={() => setCopied(false)}
      >
        {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
      </ClipboardCopyButton>
    </CodeBlockAction>
  );
}

const loadingSpinner = <Spinner size="md" aria-label="Highlighting code" />;

/** Approach A: keep CodeBlockCode's <pre><code> and inject Shiki token spans. */
function TokenSpansCodeBlock({ code, lang }: { code: string; lang: HighlightLang }) {
  const highlighted = useHighlighted<ReactNode>(code, lang, highlightToReactNodes);

  return (
    <CodeBlock actions={<CopyCodeAction code={code} id="approach-a-copy" />}>
      <CodeBlockCode id="approach-a-code" className="shiki-tokens">
        {highlighted.status === "done"
          ? highlighted.value
          : highlighted.status === "error"
            ? code
            : loadingSpinner}
      </CodeBlockCode>
    </CodeBlock>
  );
}

/** Approach B: CodeBlock chrome only; Shiki owns the <pre><code> via HTML. */
function ShikiHtmlCodeBlock({ code, lang }: { code: string; lang: HighlightLang }) {
  const highlighted = useHighlighted(code, lang, highlightToHtml);

  return (
    <CodeBlock actions={<CopyCodeAction code={code} id="approach-b-copy" />}>
      {highlighted.status === "done" ? (
        <div
          className="shiki-html-body"
          // Shiki HTML is generated from our own sample strings, not user HTML input.
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      ) : highlighted.status === "error" ? (
        <pre className="shiki-html-fallback">{code}</pre>
      ) : (
        <div className="shiki-html-loading">{loadingSpinner}</div>
      )}
    </CodeBlock>
  );
}

export function ShikiCodeBlockPrototype() {
  const [lang, setLang] = useState<HighlightLang>("typescript");
  const code = codeSamples[lang];

  return (
    <div className="shiki-prototype">
      <ToggleGroup aria-label="Sample language">
        {highlightLangs.map((item) => (
          <ToggleGroupItem
            key={item}
            text={item}
            buttonId={`lang-${item}`}
            isSelected={lang === item}
            onChange={() => setLang(item)}
          />
        ))}
      </ToggleGroup>

      <section className="proposal">
        <div className="proposal-intro">
          <div>
            <Label color="green" isCompact>
              Recommended
            </Label>
            <Title headingLevel="h2" size="xl">
              Approach A — token spans inside CodeBlockCode
            </Title>
            <p>
              Shared highlighter → <code>codeToHast</code> → React spans as{" "}
              <code>CodeBlockCode</code> children. Copy still uses the raw source string.
            </p>
          </div>
        </div>
        <TokenSpansCodeBlock code={code} lang={lang} />
      </section>

      <section className="proposal">
        <div className="proposal-intro">
          <div>
            <Label color="orange" isCompact>
              Tradeoff
            </Label>
            <Title headingLevel="h2" size="xl">
              Approach B — Shiki HTML body (skip CodeBlockCode)
            </Title>
            <p>
              <code>codeToHtml</code> output rendered inside <code>CodeBlock</code> chrome.
            </p>
          </div>
        </div>
        <Alert variant="info" title="Structural tradeoff" isInline className="shiki-alert">
          <Content>
            Shiki&apos;s <code>codeToHtml</code> emits its own <code>&lt;pre&gt;&lt;code&gt;</code>.
            Nesting that inside <code>CodeBlockCode</code> is invalid, so this demo uses{" "}
            <code>CodeBlock</code> chrome only and lets Shiki own the pre.
          </Content>
        </Alert>
        <ShikiHtmlCodeBlock code={code} lang={lang} />
      </section>
    </div>
  );
}
