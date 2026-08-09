# Step 05: Examine

**Task:** Fork Glyph and deliver the first source-aware Cards view for Markdown files: one chapter card per heading, visible hierarchy, synchronized editing back to the .md source, visual metadata outside the source, external file watching, non-corruption tests, and desktop verification.
**Started:** 2026-08-08T23:00:10Z

---

## Adversarial Review

### Pinned surface

The review covered only the Cards lot: the new Markdown projection, Canvas
capability boundary, editor-mode integration, geometry hook/store, Tauri
commands, locale additions and their tests. Product documents copied during
the fork promotion were used as canonical sources but not treated as newly
authored implementation behavior.

## Standards

| Class | Severity | Location | Evidence | Impact | Fix |
|---|---|---|---|---|---|
| REAL | Medium | `useCardsMetadata` load/save state | A pending initial read could resolve after a local move and replace the newer in-memory geometry. | Visible position rollback and possible later persistence of stale layout. | Invalidate pending reads when a local save occurs; add a deferred-read race test. |
| REAL | Medium | `markdownCardsToCanvas` vertical placement | Row Y used the minimum height even when the preceding card grew beyond it. | Long chapter cards could overlap subsequent cards. | Advance the Y cursor by each computed card height plus row gap. |
| REAL | Medium | `cards_metadata.rs` command inputs | The Tauri boundary accepted unbounded path and JSON payload sizes/node counts. | A compromised or buggy webview could consume excessive CPU, memory or disk in the app-owned store. | Bound path bytes, payload bytes and node count before persistence. |
| REAL | Low | `CanvasEditor` capability composition | `editText: false` still allowed task-checkbox text mutation; mixed recolor/delete capabilities rendered no-op controls. | The restriction contract was internally inconsistent and unsafe for future derived views. | Guard task toggles and omit toolbar actions whose handlers are unavailable. |
| REAL | Low | `parseCardsMetadata` | Arrays and unknown top-level fields were not rejected in the frontend validator. | Frontend and Rust contracts could diverge for untrusted metadata. | Reject arrays and all fields except `version` and `nodes`. |

## Spec

| Class | Severity | Requirement | Location | Evidence | Fix |
|---|---|---|---|---|---|
| REAL | Medium | Cards is available only for Markdown-like documents. | `useMenuHandlers` mode cycling | The TabBar hid Cards for non-Markdown files, but the global menu shortcut still cycled every file through Cards. | Filter Cards out of `nextEditorMode` for non-Markdown active paths and test the menu route. |

## Axis summary

- Standards: 5 real findings; worst severity Medium.
- Spec: 1 real finding; worst severity Medium.

---
## Step Complete
**Status:** ✓ Complete
**Next:** Step 06 resolve all real findings
**Timestamp:** 2026-08-09T02:55:00+02:00

### Post-resolution re-examination

The six fixes and their public tests were reviewed again after Step 08. One
additional Standards finding was identified against engineering invariant
INV-4: Cards writes survived a React unmount through their promise closures,
but the native close coordinator did not await them. The write queue is now
process-owned and `useCloseFlush` awaits it before document shutdown. Focused
unmount and close-order regressions pass.

Native verification then exposed one final visual Standards finding: the Cards
wrapper was not a flex container, so the absolutely positioned Canvas had no
usable height and rendered blank. The wrapper now establishes a column flex
context and a DOM regression test pins that contract.
