# Step 03: Execute

**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.
**Started:** 2026-08-08T23:00:10Z

---

## Implementation Log

- Promoted the documentation-only folder into a standalone fork of Glyph v0.20.0 at upstream commit `106adb6`, with `origin` pointing to `loikbey-netizen/glyph` and `upstream` pointing to `hamidfzm/glyph`.
- Preserved the former folder at `source-mindmap-app-pre-fork-backup-20260809`; verified all 35 copied product/APEX files by SHA-256.
- Installed the pinned frontend dependency graph with pnpm 10.34.3, the official Rust toolchain, and Visual Studio 2022 Build Tools with the C++ workload required for Tauri linking.
- Added the `cards` editor mode, tab-bar control, locale strings, and derived-mode guards so Cards never enters Glyph's full-document text-buffer lifecycle.
- Added fenced-code-aware chapter projection with exact UTF-16 ranges, CRLF preservation, deterministic opaque ids, parent hierarchy, and stale-write protection.
- Added a Cards pane backed by Glyph's existing Canvas renderer. Cards allow move, resize, and inline text editing while creation, deletion, recoloring, and connection mutations are disabled.
- Added geometry-only metadata projection and dedicated Tauri commands that persist validated numeric layout JSON outside Markdown under `.mindmap/views`, using sibling temporary files and atomic persistence. Frontend writes are serialized so rapid updates cannot complete out of order.
- Added regression tests for hierarchy, source preservation, CRLF, stale writes, Canvas projection, metadata privacy, Cards rendering, mode routing, and locale parity inputs.
- Targeted validation: 134/134 feature-adjacent frontend tests passed across the main regression run and the queued-write hook run. TypeScript and the production frontend build pass.
- The unconstrained full suite completed with 3,110/3,126 tests passing. Its 16 failures were caused by worker startup/resource timeouts in pre-existing export/graph tests plus the now-updated legacy mode-cycle assertion; the corrected App test passes in isolation. A bounded deterministic suite is used in the dedicated test step.
- Repository-wide `biome check src/` is not a valid clean baseline on this Windows checkout because 852 pre-existing CRLF formatting diagnostics appear across untouched upstream files. `biome lint` passes on all touched TypeScript/TSX files; new files were formatted directly.
