# Step 07: Tests

**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.
**Started:** 2026-08-08T23:00:10Z

---

## Test Analysis and Creation

### Infrastructure and conventions

- Framework: Vitest 4 + Testing Library for React, Rust unit tests for Tauri.
- Commands: `pnpm test`, `pnpm typecheck`, and `cargo test`.
- Existing convention: `describe`/`it`, behavior-oriented assertions, global
  Tauri invoke mock from `src/test/setup.ts`, fixtures built as real Canvas data,
  and filesystem isolation through `tempfile`.
- Reference patterns read: Canvas editor public-interaction tests, Tabs watcher
  integration tests, hook tests using deferred promises, and Rust command tests.

### Acceptance-criterion coverage

- AC1/AC2: projection and component tests prove Markdown-only Cards, hierarchy,
  edges, deterministic layout, empty state and no `.canvas` write path.
- AC3: component rerender and external watcher integration prove re-projection
  from current source.
- AC4: pure slice-replacement tests cover LF/CRLF, stale source, heading rename
  and level changes; TabContent/useTabs cover the public commit route.
- AC5: watcher test proves Cards reloads external source instead of protecting a
  nonexistent dirty text buffer.
- AC6: frontend schema/hook and Rust filesystem tests prove numeric-only opaque
  metadata, ordered writes, late-read protection and atomic replacement.
- AC7: mode, Canvas capability, menu, toolbar, app-cycle and full-suite
  regression tests preserve upstream behavior.

### Coverage gaps filled in this step

- Added public component tests for layout-only persistence, source prop refresh
  and corrupt-layout warning.
- Added proof that Tauri metadata payloads never contain chapter source text.
- Added race, tall-card, non-Markdown shortcut, granular capability and command
  input-boundary regression tests while resolving adversarial findings.

**Test files created or extended:** 15 frontend files plus Rust command tests.

---
## Step Complete
**Status:** ✓ Complete
**Tests created:** focused coverage across 15 frontend test files + 9 Rust metadata cases
**Next:** Step 08 run tests
**Timestamp:** 2026-08-09T03:06:28+02:00
