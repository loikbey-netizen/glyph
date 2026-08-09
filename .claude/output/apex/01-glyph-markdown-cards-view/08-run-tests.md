# Step 08: Run Tests

**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.
**Started:** 2026-08-08T23:00:10Z

---

## Test Runner Log

### Final run

- Requirements: no external database, service or network dependency.
- Frontend command: `pnpm exec vitest run --maxWorkers=1`.
- Result: 357/357 files and 3,181/3,181 tests passed.
- Rust command: `cargo test --manifest-path src-tauri/Cargo.toml`.
- Result: 447/447 tests passed; doc tests passed.
- Failed assertions: 0.

### Close-flush invariant addendum

- Focused command: `pnpm exec vitest run src/hooks/useCardsMetadata.test.tsx src/hooks/useCloseFlush.test.tsx --maxWorkers=1`.
- Result: 2/2 files and 6/6 tests passed after connecting the process-level
  Cards write queue to native shutdown.
- `pnpm typecheck`: passed after the addendum.

The single-worker frontend setting is intentional on this Windows machine: the
unbounded worker pool previously exhausted process resources and created false
timeouts in unrelated heavy export suites.

---
## Step Complete
**Status:** ✓ Complete
**Tests passed:** 3,181 frontend + 447 Rust
**Attempts:** 1 final bounded run
**Next:** Step 10 desktop verification
**Timestamp:** 2026-08-09T03:20:51+02:00
