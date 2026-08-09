---
task_id: 03
title: Source Folder Scanner
status: pending
priority: P0
estimated_hours: 3
prd_features: ["Source browser", "Detect new/non-mindmapped files"]
archi_sections: ["Source Model", "File Watch Flow"]
depends_on: ["01"]
---

# Task 03: Source Folder Scanner

## Context

When opening a folder used by IDEs and agents, the app should mirror the real folder hierarchy and expose mindmappable files without requiring a special app folder.

## Requirements

- [ ] Scan selected root folder.
- [ ] Include `.md` for MVP.
- [ ] Exclude `.git`, `node_modules`, `.next`, `dist`, `build`.
- [ ] Preserve real folder hierarchy in the sidebar.
- [ ] Mark files as mapped, unmapped, missing, or modified.
- [ ] Support opening a `.md` in Document/reader view.
- [ ] Support dragging a `.md` into a Canvas to import the full file.

## Acceptance Criteria

- [ ] Left panel mirrors folder hierarchy and lists Markdown files.
- [ ] New/unmapped files are visible.
- [ ] User can open a Markdown file as Document.
- [ ] User can drag a Markdown file into a mindmap.
