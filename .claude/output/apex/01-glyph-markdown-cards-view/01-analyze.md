# Step 01: Analyze

**Task:** Fork Glyph and deliver the first source-aware Markdown Cards view
**Started:** 2026-08-08T23:00:10Z

## Codebase Context

### Repository state

- `source-mindmap-app` currently contains documentation only and is tracked as ordinary files inside the parent `D:\SYSTEM\PROJECTS` repository; it is not an independent Git repository.
- The project directory has `README.md`, `PLAN.md`, `docs/`, `INBOX/` and the saved APEX output, but no application source, package manifest or local `AGENTS.md`.
- GitHub authentication is active for `loikbey-netizen`; no `loikbey-netizen/glyph` fork currently exists.
- A clean Glyph upstream snapshot exists at `C:\Users\sayfo\AppData\Local\Temp\glyph-source-inspect`, on commit `106adb6adc524674ed82a006788b2c4a3cb627be` (`v0.20.0`, 2026-08-07).
- Glyph is MIT licensed (`LICENSE:1-6`).

### Runtime and toolchain

- Glyph declares Node 24 in `.nvmrc`; the machine has Node `v24.16.0` and pnpm `11.16.0`.
- The inspected clone has no `node_modules` directory.
- `rustc` and `cargo` are not currently available on `PATH`.
- Glyph uses Tauri v2, React 19 and TypeScript (`README.md:10-16`, `package.json:41,67`).
- Markdown dependencies already include `remark-parse` and `unified` (`package.json:84,87`).

### Existing document modes

- `src/lib/settings.ts:53-82` defines only `view`, `edit` and `split`, with a cyclic mode toggle.
- `src/components/TabContent.tsx:22-24,126-175` dispatches Markdown files to `MarkdownEditor`, `SplitView` or `MarkdownViewer` according to that mode.
- `src/components/TabContent.tsx:114-123` dispatches `.canvas` files separately to `CanvasPane`; Markdown documents do not currently expose a Canvas/Cards representation.

### Existing Markdown structure utilities

- `src/lib/markdownHeadings.ts:5-15` parses ATX headings H1-H6, records line numbers and ignores fenced code blocks.
- `src/lib/headingSection.ts:20-29` extracts a heading section through the next heading of the same or higher level.
- The current heading model exposes level, text and start line, but no end range, hierarchy path, stable node identity or replacement operation.

### Existing Canvas engine

- `src/lib/canvas/types.ts:23-80` models positioned nodes and directed edges; file nodes already accept an optional heading `subpath` (`lines 38-44`).
- `src/hooks/useCanvasEditing.ts:17-20,75-151` creates and edits only text, group and link nodes. File nodes can round-trip through JSON but cannot be created or edited through the Canvas UI.
- `src/hooks/useCanvasDocument.ts:15-45` couples the Canvas state to serialized JSON content and reparses only when serialized content changes externally.
- `src/components/CanvasPane.tsx:16-20` explicitly treats the `.canvas` JSON as the edited document content.
- The Canvas implementation already has viewport, zoom, pan, selection, drag, resize, edges, inline text editing, serialization and focused tests.
- Graph rendering has a separate d3-force layout, while Canvas positions are explicit and persisted in JSON.

### Existing edit, undo and watcher behavior

- `src/hooks/useDocumentEdits.ts:34-72` writes programmatic edits through the Tauri `write_file` command and marks self-saves.
- `src/hooks/useDocumentEdits.ts:99-142` provides commit, undo and redo for whole-document programmatic edits.
- `src/hooks/useTabEvents.ts:53-84` listens for `file-changed`, ignores recent self-saves, avoids overwriting dirty edit buffers, reloads the file and drops stale undo history.
- `src-tauri/src/watcher.rs:49-108` already watches files/directories and emits `file-changed`/`directory-changed` events.
- Persistent source snapshots and a dedicated `D:\SYSTEM\.mindmap` visual metadata store do not exist in Glyph.

### Plugin boundary

- `src/lib/plugins/types.ts:227-241` exposes only mediated, read-only workspace access (`readFile`, `listFiles`) and no Canvas extension or source-write API.
- The requested behavior cannot be delivered by the current plugin contract alone.

### Quality conventions

- Glyph contains approximately 3,068 frontend test cases/matches and extensive Canvas, tab, watcher and Rust tests.
- `CLAUDE.md:7-20` makes a spec/plan/implement/ship loop mandatory for non-trivial upstream work.
- Required gates are `pnpm typecheck`, `pnpm check`, `pnpm test`, Rust tests and strict Clippy (`CLAUDE.md:24-31,41`).

## Canonical Intent

- `PLAN.md:3-5` limits the active lot to the Glyph fork and a first Cards view: one chapter card per heading, visible hierarchy, synchronized Markdown editing, external refresh, visual metadata outside the source, non-corruption tests and desktop verification.
- `PLAN.md:7-9` keeps sub-chapter/paragraph/list/rule/sentence fragmentation in `Next`; it is outside the active lot.
- `docs/prd.md:39-54` declares a derived Cards view, no canonical `.canvas`, heading parsing, immediate source editing, external watching and metadata under `D:\SYSTEM\.mindmap`.
- `docs/prd.md:164-176` excludes SaaS, Git operations in the app, central AI, cloud sync, Heptabase and export work from V1.
- `docs/prd.md:191-208` requires source edits to affect the real file and external changes to reparse without silently overwriting conflicts.
- `docs/prd.md:238-247` classifies source corruption and identity loss after external edits as high-impact risks.
- The broader P0 list still contains later mindmap features (multi-file maps, hide, labels, comments, structural moves). The narrower validated `PLAN.md > Now` item controls this APEX lot.

## Acceptance Criteria

| Criterion | Source | Public verification seam |
|---|---|---|
| A Markdown tab can display a Cards view without creating a `.canvas` source file. | Architecture + PLAN | `TabContent` rendering test and desktop interaction |
| ATX headings become hierarchical chapter cards. | PRD + PLAN | Pure Markdown-to-card projection tests |
| Card content is derived from the current Markdown file. | Architecture | Projection tests including fenced headings and nested levels |
| Editing a card rewrites only its corresponding section and preserves unrelated content. | PRD + risk table | Pure replacement tests comparing full before/after documents |
| Self-saves do not loop and external edits refresh the Cards projection. | PRD + existing watcher contract | Tab/event integration test and desktop verification |
| Visual state persists outside the `.md` and stores no copied source text. | Architecture + PLAN | Metadata serialization/storage contract test |
| Existing Glyph behavior remains green. | Glyph conventions | Typecheck, Biome check, full frontend tests and applicable Rust gates |

## Constraints and Current Blockers

- Rust must be installed before Tauri/Rust validation can run.
- The documented project is not yet an independent repository, while a maintainable upstream fork requires a clear Git boundary.
- The current APEX progress helper resolves the parent `PROJECTS` Git root; saved output exists correctly under the project but progress updates need the project Git boundary or direct file reconciliation.
- Temporary test fixtures must remain outside concurrently scanned SYSTEM trees, per promoted incident `system/validator-temp-scan-race`.
