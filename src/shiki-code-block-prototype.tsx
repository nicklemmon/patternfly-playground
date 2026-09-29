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
  Flex,
  FlexItem,
  Label,
  Spinner,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { codeSamples } from "./shiki-code-samples";
import {
  highlightLangs,
  highlightToHtml,
  highlightToReactNodes,
  themePairs,
} from "./shiki-highlighter";
import type { Highlighted, HighlightLang, ThemePair } from "./shiki-highlighter";

type HighlightState<T> =
  | { status: "loading" }
  | { status: "done"; value: Highlighted<T> }
  | { status: "error" };

const langLabels: Record<HighlightLang, string> = {
  typescript: "TypeScript",
  tsx: "TSX",
  javascript: "JavaScript",
  json: "JSON",
  yaml: "YAML",
  bash: "Bash",
};

type CodeBlockProps = { code: string; lang: HighlightLang; pair: ThemePair };

// Keeps showing the last result while the next one loads, so swapping themes or
// languages replaces the code and background in one render instead of flashing a spinner.
function useHighlighted<T>(
  { code, lang, pair }: CodeBlockProps,
  highlight: (code: string, lang: HighlightLang, pair: ThemePair) => Promise<Highlighted<T>>,
): [HighlightState<T>, isBusy: boolean] {
  const [result, setResult] = useState<{ key: string; highlighted: HighlightState<T> }>();
  const key = `${pair.id}\n${lang}\n${code}`;

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang, pair).then(
      (value) => !cancelled && setResult({ key, highlighted: { status: "done", value } }),
      (error: unknown) => {
        console.error("Shiki highlighting failed", error);
        if (!cancelled) setResult({ key, highlighted: { status: "error" } });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [code, lang, pair, key, highlight]);

  // Busy on first load (spinner) and while a previous result is shown for a stale key.
  return [result?.highlighted ?? { status: "loading" }, result?.key !== key];
}

const copyMessages = {
  idle: "Copy to clipboard",
  copied: "Successfully copied to clipboard!",
  failed: "Copy failed",
};

function CopyCodeAction({ code, id }: { code: string; id: string }) {
  const [copyState, setCopyState] = useState<keyof typeof copyMessages>("idle");

  return (
    <CodeBlockAction>
      <ClipboardCopyButton
        id={id}
        aria-label="Copy code to clipboard"
        onClick={async () => {
          // The Clipboard API is missing on insecure origins (e.g. the dev server over a LAN IP).
          try {
            await navigator.clipboard.writeText(code);
            setCopyState("copied");
          } catch {
            setCopyState("failed");
          }
        }}
        exitDelay={copyState === "idle" ? 600 : 1500}
        maxWidth="110px"
        variant="plain"
        onTooltipHidden={() => setCopyState("idle")}
      >
        {copyMessages[copyState]}
      </ClipboardCopyButton>
    </CodeBlockAction>
  );
}

const loadingSpinner = <Spinner size="md" aria-label="Highlighting code" />;

/** Approach A: keep CodeBlockCode's <pre><code> and inject Shiki token spans. */
function TokenSpansCodeBlock(props: CodeBlockProps) {
  const { code } = props;
  const [highlighted, isBusy] = useHighlighted<ReactNode>(props, highlightToReactNodes);

  return (
    <CodeBlock
      className="shiki-code-block"
      aria-busy={isBusy}
      style={highlighted.status === "done" ? highlighted.value.style : undefined}
      actions={<CopyCodeAction code={code} id="approach-a-copy" />}
    >
      <CodeBlockCode className="shiki-tokens">
        {highlighted.status === "done"
          ? highlighted.value.body
          : highlighted.status === "error"
            ? code
            : loadingSpinner}
      </CodeBlockCode>
    </CodeBlock>
  );
}

/** Approach B: CodeBlock chrome only; Shiki owns the <pre><code> via HTML. */
function ShikiHtmlCodeBlock(props: CodeBlockProps) {
  const { code } = props;
  const [highlighted, isBusy] = useHighlighted(props, highlightToHtml);

  return (
    <CodeBlock
      className="shiki-code-block"
      aria-busy={isBusy}
      style={highlighted.status === "done" ? highlighted.value.style : undefined}
      actions={<CopyCodeAction code={code} id="approach-b-copy" />}
    >
      {highlighted.status === "done" ? (
        <div
          className="shiki-html-body"
          // Shiki HTML is generated from our own sample strings, not user HTML input.
          dangerouslySetInnerHTML={{ __html: highlighted.value.body }}
        />
      ) : highlighted.status === "error" ? (
        <pre className="shiki-html-fallback">{code}</pre>
      ) : (
        loadingSpinner
      )}
    </CodeBlock>
  );
}

export function ShikiCodeBlockPrototype() {
  const [lang, setLang] = useState<HighlightLang>("typescript");
  const [pair, setPair] = useState<ThemePair>(themePairs[0]);
  const code = codeSamples[lang];
  const blockProps = { code, lang, pair };

  return (
    <div className="shiki-prototype">
      <Flex spaceItems={{ default: "spaceItemsXl" }} rowGap={{ default: "rowGapMd" }}>
        <FlexItem>
          <span className="shiki-control-label" id="shiki-lang-label">
            Language
          </span>
          <ToggleGroup aria-labelledby="shiki-lang-label" isCompact>
            {highlightLangs.map((item) => (
              <ToggleGroupItem
                key={item}
                text={langLabels[item]}
                buttonId={`lang-${item}`}
                isSelected={lang === item}
                onChange={() => setLang(item)}
              />
            ))}
          </ToggleGroup>
        </FlexItem>
        <FlexItem>
          <span className="shiki-control-label" id="shiki-theme-label">
            Theme
          </span>
          <ToggleGroup aria-labelledby="shiki-theme-label" isCompact>
            {themePairs.map((item) => (
              <ToggleGroupItem
                key={item.id}
                text={item.label}
                buttonId={`theme-${item.id}`}
                isSelected={pair.id === item.id}
                onChange={() => setPair(item)}
              />
            ))}
          </ToggleGroup>
        </FlexItem>
      </Flex>

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
        <TokenSpansCodeBlock {...blockProps} />
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
        <ShikiHtmlCodeBlock {...blockProps} />
      </section>
    </div>
  );
}
