---
task_id: 06
title: Source Editing and Reparse
status: pending
priority: P0
estimated_hours: 4
prd_features: ["Autosave source editing"]
archi_sections: ["Canvas Edit Flow"]
depends_on: ["04", "05"]
---

# Task 06: Source Editing and Reparse

## Context

Editing a source branch must immediately update the real source file, then reparse and refresh the canvas.

## Requirements

- [ ] Edit text of a source branch.
- [ ] Rewrite corresponding source range.
- [ ] Save file immediately.
- [ ] Reparse file after write.
- [ ] Refresh branch display from source.

## Acceptance Criteria

- [ ] Editing a branch changes the Markdown file on disk.
- [ ] Editing the file externally updates the branch after reparse.
- [ ] No unsaved draft source exists in the app.

