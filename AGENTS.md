# Agent notes

## File naming

Source modules under `src/` use **kebab-case** filenames (`highlighted-code-block.tsx`, `use-color-mode.ts`).

- React **export** names stay idiomatic: PascalCase components, camelCase hooks.
- Single-word names (`main.tsx`, `index.css`) and tool configs (`vite.config.ts`, `tsconfig.*.json`) are fine as-is.
- Enforced by oxlint `unicorn/filename-case` (`npm run lint`).
