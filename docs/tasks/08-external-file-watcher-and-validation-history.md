---
task_id: 08
title: External File Watcher and Validation History
status: pending
priority: P0
estimated_hours: 4
prd_features: ["External source changes", "Validation history"]
archi_sections: ["File Watch Flow"]
depends_on: ["04", "06"]
---

# Task 08: External File Watcher and Validation History

## Context

Codex, Cursor, Claude Desktop and normal editors can modify source files. The mindmap must reparse and show current source while preserving metadata validation.

## Requirements

- [ ] Watch imported source files.
- [ ] Reparse changed files automatically.
- [ ] Update Canvas from current source without blocking.
- [ ] Create validation history items for impacted labels, comments, links, alternatives, hides and mirrors.
- [ ] Visually mark branches needing validation.
- [ ] Apply minor typo-level changes silently when metadata remains safe.

## Acceptance Criteria

- [ ] External file edits appear in the Canvas.
- [ ] Deleted/unmatched source nodes become high-priority validation items.
- [ ] Validation markers are non-blocking.

