# Step 04: Validate

**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.
**Started:** 2026-08-08T23:00:10Z

---

## Validation Progress

### Gates

- TypeScript: `pnpm typecheck` passed.
- Lint: `pnpm lint` passed across 855 source files.
- Frontend tests: 357 files, 3,171 tests passed with `--maxWorkers=1`.
- Frontend production build: passed (3,850 modules transformed).
- Rust format: `cargo fmt --check` passed.
- Rust tests: 445 tests passed; doc tests passed.
- Rust lint: `cargo clippy --all-targets -- -D warnings` passed.

The earlier unconstrained Vitest run produced worker/resource timeouts. A complete
bounded rerun passed every suite, including the previously timed-out export and
graph suites.

### Acceptance criteria

- [x] AC1 — Markdown opens as Cards without creating a `.canvas` file.
- [x] AC2 — ATX headings become deterministic hierarchical cards and edges.
- [x] AC3 — Cards are rebuilt from the current Markdown content.
- [x] AC4 — Card edits replace only their guarded source slice and preserve LF/CRLF.
- [x] AC5 — Cards remains a derived mode; external watcher reloads are accepted.
- [x] AC6 — only opaque ids and numeric geometry are stored outside source text.
- [x] AC7 — all frontend and Rust regression gates pass.

### Self-audit

- No skipped tests or unexplained blocked tasks.
- New behavior has pure, hook, component, integration and Rust filesystem tests.
- Existing Canvas behavior remains unrestricted by default; restrictions are
  enforced at action boundaries for Cards.
- Corrupt/missing metadata falls back without blocking source access.

---
## Step Complete
**Status:** ✓ Complete
**Typecheck:** ✓
**Lint:** ✓
**Tests:** ✓ 3,171 frontend + 445 Rust
**Format:** ✓ Targeted frontend formatting + Rust format check
**Next:** Step 05 adversarial examination
**Timestamp:** 2026-08-09T02:43:21+02:00
