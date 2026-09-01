import { useMemo, useState } from "react";
import {
  Alert,
  Content,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Title,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { HighlightedCodeBlock } from "./components/highlighted-code-block";
import { ShikiHtmlCodeBlock } from "./components/shiki-html-code-block";
import { ThemeToggle } from "./components/theme-toggle";
import { HIGHLIGHT_LANGS, type HighlightLang } from "./highlight/languages";
import { useColorMode } from "./hooks/use-color-mode";
import { SNIPPETS } from "./samples/snippets";

export default function App() {
  const { colorMode, setColorMode } = useColorMode();
  const [lang, setLang] = useState<HighlightLang>("typescript");
  const code = useMemo(() => SNIPPETS[lang], [lang]);

  return (
    <Page>
      <PageSection>
        <Flex
          direction={{ default: "column" }}
          gap={{ default: "gapLg" }}
          style={{ maxWidth: 920 }}
        >
          <FlexItem>
            <Flex
              justifyContent={{ default: "justifyContentSpaceBetween" }}
              alignItems={{ default: "alignItemsCenter" }}
              flexWrap={{ default: "wrap" }}
              gap={{ default: "gapMd" }}
            >
              <FlexItem>
                <Title headingLevel="h1" size="2xl">
                  Shiki + PatternFly CodeBlock
                </Title>
              </FlexItem>
              <FlexItem>
                <ThemeToggle colorMode={colorMode} onChange={setColorMode} />
              </FlexItem>
            </Flex>
          </FlexItem>

          <FlexItem>
            <Content>
              <p>
                Playground spike comparing two ways to compose <code>shiki/bundle/web</code> with
                PatternFly&apos;s <code>CodeBlock</code>. Prefer Approach A for real apps — it keeps
                PF&apos;s <code>&lt;pre&gt;&lt;code&gt;</code> and avoids nested pre/code from
                Shiki&apos;s HTML output.
              </p>
            </Content>
          </FlexItem>

          <FlexItem>
            <ToggleGroup aria-label="Language">
              {HIGHLIGHT_LANGS.map((item) => (
                <ToggleGroupItem
                  key={item}
                  text={item}
                  isSelected={lang === item}
                  onChange={() => setLang(item)}
                  buttonId={`lang-${item}`}
                />
              ))}
            </ToggleGroup>
          </FlexItem>

          <FlexItem>
            <Title headingLevel="h2" size="lg">
              Approach A — token spans inside CodeBlockCode
            </Title>
            <Content>
              <p>
                Shared highlighter → <code>codeToHast</code> → React spans as{" "}
                <code>CodeBlockCode</code> children. Copy still uses the raw source string.
              </p>
            </Content>
            <HighlightedCodeBlock code={code} lang={lang} colorMode={colorMode} />
          </FlexItem>

          <FlexItem>
            <Title headingLevel="h2" size="lg">
              Approach B — Shiki HTML body (skip CodeBlockCode)
            </Title>
            <Alert
              variant="info"
              title="Structural tradeoff"
              isInline
              style={{ marginBlockEnd: "1rem" }}
            >
              Shiki&apos;s <code>codeToHtml</code> emits its own{" "}
              <code>&lt;pre&gt;&lt;code&gt;</code>. Nesting that inside <code>CodeBlockCode</code>{" "}
              is invalid, so this demo uses <code>CodeBlock</code> chrome only and lets Shiki own
              the pre.
            </Alert>
            <ShikiHtmlCodeBlock code={code} lang={lang} colorMode={colorMode} />
          </FlexItem>
        </Flex>
      </PageSection>
    </Page>
  );
}
