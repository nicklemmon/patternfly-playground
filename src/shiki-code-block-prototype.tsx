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
  | { status: "error"; message: string };

type CodeBlockProps = { code: string; lang: HighlightLang; pair: ThemePair };

function useHighlighted<T>(
  { code, lang, pair }: CodeBlockProps,
  highlight: (code: string, lang: HighlightLang, pair: ThemePair) => Promise<Highlighted<T>>,
): HighlightState<T> {
  const [result, setResult] = useState<{ key: string; highlighted: HighlightState<T> }>();
  const key = `${pair.id}\n${lang}\n${code}`;

  useEffect(() => {
    let cancelled = false;
    highlight(code, lang, pair).then(
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
  }, [code, lang, pair, key, highlight]);

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
function TokenSpansCodeBlock(props: CodeBlockProps) {
  const { code } = props;
  const highlighted = useHighlighted<ReactNode>(props, highlightToReactNodes);

  return (
    <CodeBlock
      className="shiki-code-block"
      style={highlighted.status === "done" ? highlighted.value.style : undefined}
      actions={<CopyCodeAction code={code} id="approach-a-copy" />}
    >
      <CodeBlockCode id="approach-a-code" className="shiki-tokens">
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
  const highlighted = useHighlighted(props, highlightToHtml);

  return (
    <CodeBlock
      className="shiki-code-block"
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
        <div className="shiki-html-loading">{loadingSpinner}</div>
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
      <Flex
        className="shiki-controls"
        spaceItems={{ default: "spaceItemsXl" }}
        rowGap={{ default: "rowGapMd" }}
      >
        <FlexItem>
          <span className="shiki-control-label" id="shiki-lang-label">
            Language
          </span>
          <ToggleGroup aria-labelledby="shiki-lang-label" isCompact>
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
