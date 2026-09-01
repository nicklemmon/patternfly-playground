# PatternFly playground

Throwaway Vite + React + TypeScript sandbox with PatternFly 6 prewired.

## Local

```bash
npm install
npm run dev
```

Edit `src/app.tsx` to try components.

### File naming

Source files under `src/` use **kebab-case** (e.g. `theme-toggle.tsx`, `use-color-mode.ts`). Component and hook **exports** stay PascalCase / camelCase. Enforced by oxlint `unicorn/filename-case` via `npm run lint`. See [AGENTS.md](AGENTS.md).

### Format on save (oxfmt)

1. Install the [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) extension (`oxc.oxc-vscode`) in VS Code / Cursor.
2. Open this folder — `.vscode/settings.json` already enables format-on-save with oxfmt.
3. Or format from the CLI:

```bash
npm run format
npm run format:check
```

## Experiment: Shiki + PatternFly CodeBlock

Branch: `experiment/shiki-code-block`

Compares two ways to add Shiki highlighting to PF `CodeBlock`:

| Approach | Composition                                                  | Recommendation                      |
| -------- | ------------------------------------------------------------ | ----------------------------------- |
| **A**    | `codeToHast` → React token spans as `CodeBlockCode` children | **Prefer** — keeps PF `<pre><code>` |
| **B**    | `codeToHtml` as body, skip `CodeBlockCode`                   | Demo only — Shiki owns `<pre>`      |

Also includes a light/dark toggle via `pf-v6-theme-dark` on `<html>`, with Shiki themes `github-light` / `github-dark`.

Langs: `typescript`, `tsx`, `javascript`, `json`, `yaml`, `bash`.
