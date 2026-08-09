# APEX Task: 01-glyph-markdown-cards-view

**Created:** 2026-08-08T23:00:10Z
**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.

---

## Configuration

| Flag | Value |
|------|-------|
| Auto mode (`-a`) | true |
| Examine mode (`-x`) | true |
| Save mode (`-s`) | true |
| Test mode (`-t`) | true |
| Economy mode (`-e`) | false |
| Branch mode (`-b`) | false |
| PR mode (`-pr`) | false |
| Interactive mode (`-i`) | false |
| Tasks mode (`-k`) | false |
| Verify mode (`-v`) | true |
| Branch name |  |

---

## User Request

```
apex -a -x -s -t -v fork Glyph and implement the first Markdown Cards view
```

---

## Canonical Inputs

- `D:\SYSTEM\PROJECTS\LOIK-BEY\source-mindmap-app\PLAN.md` (`## Now`)
- `D:\SYSTEM\PROJECTS\LOIK-BEY\source-mindmap-app\docs\prd.md` (P0/P1, core rules, risks and success metrics)
- `D:\SYSTEM\PROJECTS\LOIK-BEY\source-mindmap-app\docs\archi.md` (validated Glyph/Tauri architecture and Markdown views)
- `D:\SYSTEM\PROJECTS\LOIK-BEY\source-mindmap-app\docs\idea.md` (validated product decisions)
- Glyph upstream snapshot `106adb6adc524674ed82a006788b2c4a3cb627be` (`v0.20.0`)
- No matching pre-APEX intake exists; the validated canonical documents above contain the current intent.

---

## Acceptance Criteria

- Opening a Markdown document exposes a Cards representation without creating a `.canvas` source file.
- ATX headings become hierarchical chapter cards whose displayed content comes from the current `.md`.
- Editing a chapter card updates only the corresponding Markdown section and preserves unrelated bytes/content.
- A self-save reparses the document without an event loop; an external edit refreshes the Cards representation.
- Visual positions/state contain no duplicated source text and persist outside the Markdown source.
- Typecheck, formatting/lint, focused tests, full frontend tests and the runnable desktop surface are verified.

---

## Progress

| Step | Status | Timestamp |
|------|--------|-----------|
| 00-init | ✓ Complete | 2026-08-08T23:00:10Z |
| 01-analyze | ✓ Complete | 2026-08-08T23:03:39Z |
| 02-plan | ✓ Complete | 2026-08-08T23:09:33Z |
| 02b-tasks | ⏭ Skip | |
| 03-execute | ✓ Complete | 2026-08-09T02:45:00+02:00 |
| 04-validate | ✓ Complete | 2026-08-09T02:50:00+02:00 |
| 05-examine | ✓ Complete | 2026-08-09T02:55:00+02:00 |
| 06-resolve | ✓ Complete | 2026-08-09T03:04:29+02:00 |
| 07-tests | ✓ Complete | 2026-08-09T03:10:00+02:00 |
| 08-run-tests | ✓ Complete | 2026-08-09T03:20:51+02:00 |
| 10-verify | ✓ Complete | 2026-08-09T04:02:00+02:00 |
| 09-finish | ⏭ Skip | |

**Run status:** ✓ Complete — implementation, review, tests and native verification passed.
