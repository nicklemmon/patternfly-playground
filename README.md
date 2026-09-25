# PatternFly playground

Throwaway Vite + React + TypeScript sandbox with PatternFly 6 prewired.

Currently uses **Vite 8**. The CodeSandbox setup was originally written for Vite 6; it has not been re-verified after the Vite upgrade.

## Local

```bash
npm install
npm run dev
```

Edit `src/app.tsx` to try components.

The header lets you choose System, Light, or Dark mode and independently opt in to Project Felt. Your selection is saved in this browser; System follows OS appearance changes.

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

## CodeSandbox

Open / fork:

```text
https://codesandbox.io/p/github/nicklemmon/patternfly-playground
```

Or use **Use this template** on GitHub. `.codesandbox/tasks.json` installs deps and starts `npm run dev` automatically. This is an interactive development preview, not a deployed static site. Local, uncommitted changes will not appear in the GitHub import.
