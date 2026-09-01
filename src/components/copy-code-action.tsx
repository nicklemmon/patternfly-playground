import { useState } from "react";
import { ClipboardCopyButton, CodeBlockAction } from "@patternfly/react-core";

type CopyCodeActionProps = {
  code: string;
  id: string;
};

export function CopyCodeAction({ code, id }: CopyCodeActionProps) {
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
