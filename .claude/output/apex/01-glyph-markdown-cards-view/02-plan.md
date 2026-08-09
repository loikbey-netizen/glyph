# Step 02: Plan

**Task:** Fork Glyph and deliver the first source-aware Markdown Cards view
**Started:** 2026-08-08T23:00:10Z

## Overview

Promote the documentation-only project into a maintainable standalone fork of Glyph, then add a fourth Markdown tab representation named `Cards`. The Cards surface will project headings into a restricted instance of Glyph's existing Canvas editor, route text edits through the existing document commit/undo/watcher pipeline, and persist only visual coordinates outside the Markdown source.

## Prerequisites

- Create `loikbey-netizen/glyph` as the remote fork and keep `hamidfzm/glyph` as `upstream`.
- Convert `D:\SYSTEM\PROJECTS\LOIK-BEY\source-mindmap-app` from parent-tracked documentation into the standalone fork while preserving `docs/`, `PLAN.md`, `INBOX/` and APEX outputs exactly.
- Preserve the parent `PROJECTS` worktree's unrelated changes; represent the promoted project using the same nested Git-link convention as existing individual projects.
- Install the official Rust toolchain because Node 24 and pnpm are present but Cargo/Rust are absent.
- Keep temporary test fixtures outside SYSTEM validation trees.

## Vertical Slice 1 — Open a Markdown document as chapter cards

**User story:** From an ordinary `.md` tab, the user selects Cards and sees one spatial card per heading, connected according to heading hierarchy, without any `.canvas` file being created.

**Depends on:** repository/toolchain prerequisites.

**Agreed seam and proof:** pure projection tests plus `TabContent`/`TabBar` component tests; desktop proof opens a Markdown fixture and switches to Cards.

### File changes

#### `src/lib/markdownCards.ts` — new

- Define a source-aware `MarkdownCard` model with opaque deterministic id, level, title, parent id, source offsets, original direct segment and displayed Markdown.
- Project ATX headings using the existing fenced-code-aware heading parser (`src/lib/markdownHeadings.ts:5-35`).
- Build parent relationships with a heading-level stack.
- Limit each card's editable source to its heading plus direct preamble up to the next heading, preventing parent/child content duplication.
- Preserve source line endings and expose a deterministic left-to-right tree layout.
- Return an empty projection for documents without headings; never synthesize source content.

#### `src/lib/markdownCards.test.ts` — new

- Cover H1-H6 hierarchy, skipped levels, duplicate titles, fenced pseudo-headings, CRLF, Unicode, empty chapters, preamble-before-first-heading and documents without headings.
- Assert opaque ids do not contain heading text.
- Assert projected edges reference existing nodes and deterministic coordinates do not overlap for the fixture set.

#### `src/components/cards/MarkdownCardsPane.tsx` — new

- Convert the current Markdown string into in-memory Canvas JSON/Data and pass it to the reusable Canvas surface.
- Render hierarchy edges and a clear empty state when no headings exist.
- Keep the source path only as a lookup key; do not serialize source text to a `.canvas` file.
- Use a Cards-specific viewport key so switching modes preserves the user's camera independently.

#### `src/components/cards/MarkdownCardsPane.test.tsx` — new

- Verify heading cards, hierarchy edges, empty state, refresh after a changed `content` prop and absence of `.canvas` persistence calls.

#### `src/lib/settings.ts` and `src/lib/settings.test.ts`

- Add `EDITOR_MODE.cards` while retaining the existing `view`, `edit` and `split` modes.
- Include Cards in desktop mode cycling and keep the narrow-screen split fallback behavior.
- Add explicit helpers distinguishing text-buffer modes (`edit`/`split`) from derived modes (`view`/`cards`) so existing save logic does not treat Cards as an unsaved source buffer.

#### `src/components/icons/CardsModeIcon.tsx` — new

- Add a small accessible icon consistent with the existing View/Edit/Split mode icon API.

#### `src/components/layout/TabBar.tsx` and its tests

- Add an explicit Cards action only for Markdown-like text documents, not images, notebooks or `.canvas` boards.
- Keep Split available and preserve all existing mode actions.

#### `src/components/TabContent.tsx` and `src/components/TabContent.test.tsx`

- Dispatch `EDITOR_MODE.cards` to `MarkdownCardsPane` before the existing editor/split/view branches.
- Pass current source content, absolute source path, tab id and the existing document commit callback.
- Add rendering and external-content-refresh assertions.

#### `src/locales/{en,de,es,fa,zh}/common.json`

- Add parity-safe labels/titles for Cards mode and its empty/error states.

## Vertical Slice 2 — Edit a card without corrupting unrelated Markdown

**User story:** Editing the contents of a chapter card updates only that chapter's direct Markdown segment, supports heading rename, and leaves every unrelated byte/section unchanged.

**Depends on:** Slice 1.

**Agreed seam and proof:** pure full-document replacement tests, Canvas capability tests and document commit/undo integration tests.

### File changes

#### `src/lib/markdownCards.ts`

- Add `replaceMarkdownCard(document, cardRef, nextSegment)` returning a result instead of hiding errors.
- Require the edited segment to begin with a valid ATX heading; allow renaming/level changes, then rely on reparse for the new hierarchy.
- Verify the current source slice still equals the card's captured original segment before applying; return a stale-source conflict without writing otherwise.
- Preserve all content outside the exact source offsets and preserve the document's newline convention.

#### `src/lib/markdownCards.test.ts`

- Prove byte-for-byte preservation outside the edited range for LF/CRLF, frontmatter, fenced blocks, duplicate headings and nested children.
- Cover heading rename, level change, invalid heading rejection and stale-source conflict.

#### `src/components/canvas/CanvasEditor.tsx`

- Add a backwards-compatible capabilities prop controlling create, delete, connect, recolor and resize operations.
- Preserve current unrestricted behavior for real `.canvas` files.
- Let the Cards surface enable inline text edit and movement while disabling source-creating/deleting and custom-edge operations.

#### `src/components/canvas/CanvasEditableNode.tsx`, `CanvasSelectionToolbar.tsx`, `CanvasToolbar.tsx`, `canvasMenuItems.ts`

- Respect the capabilities supplied by `CanvasEditor`: hide disabled controls/connectors and prevent disabled keyboard/context-menu mutations at the behavior boundary.
- Keep node movement and text editing available for chapter cards.

#### Canvas component tests

- Extend `CanvasEditor.editing.test.tsx`, `CanvasEditor.menu.test.tsx`, `CanvasEditor.gestures.test.tsx` and focused toolbar/menu tests to prove restricted mode cannot create/delete/connect while ordinary Canvas remains unchanged.

#### `src/components/cards/MarkdownCardsPane.tsx`

- Compare committed in-memory Canvas data against the current projection.
- Route one changed text node through `replaceMarkdownCard` and the existing `commitEdit` callback.
- Surface validation/conflict errors non-destructively; never fall back to last-write-wins.
- Reject simultaneous multi-node text mutations as invalid for this first slice.

#### `src/hooks/useDocumentEdits.ts`, `src/hooks/useTabStrip.ts`, `src/hooks/useTabEvents.ts` and tests

- Treat Cards as a derived mode: programmatic card edits write through the existing immediate `write_file` path, participate in programmatic undo/redo and mark self-saves.
- Initialize edit buffers only for `edit`/`split`, not Cards.
- Keep dirty-buffer protection limited to true text-buffer modes; external changes in Cards reload and rebuild the projection.
- Add regression tests for card commit, undo/redo, watcher self-save suppression and external refresh.

## Vertical Slice 3 — Persist visual layout outside the Markdown source

**User story:** Moving/resizing cards survives restart while the `.md` remains text-only and no source content is duplicated in metadata.

**Depends on:** Slices 1 and 2.

**Agreed seam and proof:** pure metadata-schema tests, Rust filesystem tests using system temp directories, component persistence tests and desktop restart verification.

### File changes

#### `src/lib/cardsMetadata.ts` and `src/lib/cardsMetadata.test.ts` — new

- Define the versioned frontend metadata contract containing only opaque node ids and numeric x/y/width/height values.
- Validate untrusted loaded JSON, drop invalid entries and assert serialization cannot contain heading/body text.

#### `src/hooks/useCardsMetadata.ts` and test — new

- Load metadata for the current absolute source path through dedicated Tauri commands.
- Merge valid saved coordinates onto deterministic projected coordinates.
- Debounce layout-only saves; ignore source-text changes in the metadata payload.
- Handle missing/corrupt metadata with deterministic layout and a non-blocking warning.

#### `src-tauri/src/cards_metadata.rs` — new

- Resolve the production Windows store to `D:\SYSTEM\.mindmap\views`, with a test-only/environment override and a safe per-platform fallback for non-Windows builds.
- Derive opaque filenames from normalized absolute source paths without writing source text into metadata.
- Read validated JSON and save atomically through a temporary sibling plus rename.
- Create the metadata directory on first save.
- Unit-test missing files, round-trip, invalid JSON, path normalization, atomic replacement and isolated temp roots.

#### `src-tauri/src/lib.rs`

- Register the load/save Cards metadata commands in the existing Tauri invoke handler.

#### `src/components/cards/MarkdownCardsPane.tsx`

- Separate text commits from layout-only commits.
- Save only coordinates/sizes after move/resize and immediately rebuild from current source plus metadata.

#### `src/components/cards/MarkdownCardsPane.test.tsx`

- Verify metadata load, merge, save debounce, corrupt-store fallback and proof that serialized metadata contains no chapter source text.

## Testing strategy

### Pre-agreed public seams

- Markdown projection/replacement — pure TypeScript tests via `pnpm vitest run src/lib/markdownCards.test.ts`.
- Restricted Canvas behavior — Testing Library against `CanvasEditor` public interactions.
- Tab integration — `TabContent`, `TabBar`, `useDocumentEdits` and `useTabEvents` tests.
- Metadata storage — pure frontend schema tests plus Rust unit tests using OS temp directories, never SYSTEM roots.
- User surface — launch `pnpm tauri dev`, open a copied Markdown fixture, switch Document/Source/Cards, edit a card, move it, externally modify the fixture and restart.

### Full gates

- `pnpm typecheck`
- `pnpm check`
- `pnpm test`
- `pnpm build`
- `cargo test --manifest-path src-tauri/Cargo.toml`
- `cargo clippy --manifest-path src-tauri/Cargo.toml --all-targets -- -D warnings`

## Acceptance criteria mapping

- AC1 (Cards without `.canvas`) — Slice 1: mode, projection, pane and tab integration.
- AC2 (hierarchical chapter cards) — Slice 1: `markdownCards` projection and Canvas edges.
- AC3 (content derived from current Markdown) — Slices 1/2: pure projection plus content-prop refresh.
- AC4 (targeted non-corrupting edit) — Slice 2: guarded replacement and document commit pipeline.
- AC5 (self-save/external refresh) — Slice 2: existing watcher integration with derived-mode classification.
- AC6 (visual state outside source, no copied text) — Slice 3: metadata contract and Rust store.
- AC7 (Glyph regression safety) — all slices: focused tests plus complete TypeScript/Rust gates.

## Key decisions

- Cards is a fourth representation; the existing Split view remains available.
- First slice creates one card per ATX heading only. Paragraph/list/rule/sentence fragmentation remains in `PLAN.md > Next`.
- A parent card contains only its heading and direct preamble; nested heading content lives exclusively in child cards.
- Card ids and metadata filenames are opaque and deterministic; no heading/body text is copied into metadata.
- Structural card creation, deletion, custom connections and source reordering remain out of scope; Cards mode exposes text editing plus visual movement/resizing.
- Stale source conflicts abort the card write and surface an error; no last-write-wins behavior.
- Glyph branding and unrelated upstream features remain unchanged in this lot.

## Risks and mitigations

- **Repository conversion can lose current docs:** stage in a separate verified directory, compare preserved files before switching, and keep a recoverable backup until validation finishes.
- **Markdown corruption:** pure offset-based replacement with original-slice guard, CRLF fixtures, full before/after assertions and adversarial review.
- **Mode regression:** explicit derived/text-buffer mode helpers and existing mode-cycle/save tests.
- **Canvas restriction bypass:** enforce capabilities in handlers as well as hiding controls.
- **Metadata leakage:** typed numeric-only schema, opaque ids and tests scanning serialized output for source strings.
- **Watcher race:** use existing self-save marker and reject stale card slices.
- **Upstream drift:** retain `upstream` remote and minimize changes to existing Canvas public behavior.

## Uncertainty analysis

| Aspect | Confidence | Resolution in auto mode |
|---|---|---|
| Glyph integration seams | High | Reuse verified TabContent, mode, Canvas and document-edit boundaries. |
| Chapter segment semantics | High | Heading plus direct preamble; child heading owns its own content. |
| Repository promotion | Medium | Use a staged clone, verified backup and existing nested-repo convention. |
| Global metadata portability | Medium | Honor `D:\SYSTEM\.mindmap` on Windows; provide isolated override/fallback for tests and other platforms. |
| Rust availability | High | Install official Rust toolchain before Tauri verification. |

---

## Step Complete

**Status:** ✓ Complete
**Files planned:** 18 primary/new files plus focused existing tests/locales
**Tests planned:** 8 focused TypeScript suites, Rust unit tests and full project gates
**Uncertainties resolved:** 5 through validated defaults
**Next:** `step-03-execute.md`
**Timestamp:** 2026-08-09T01:00:00+02:00
