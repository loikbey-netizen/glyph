---
task_id: 09
title: Safety Snapshots Undo and Diff
status: pending
priority: P0
estimated_hours: 4
prd_features: ["Undo/safety", "Source editing"]
archi_sections: ["Global Storage", "Safety"]
depends_on: ["06"]
---

# Task 09: Safety Snapshots Undo and Diff

## Context

Source deletion and editing should feel like a Markdown editor, without blocking confirmations. Safety comes from undo, snapshots and diff-on-demand.

## Requirements

- [ ] Implement memory undo for source edits and metadata edits.
- [ ] Store persistent snapshots in `D:\SYSTEM\.mindmap\snapshots\`.
- [ ] Snapshot modified source files and affected mindmap metadata.
- [ ] Add retention cap.
- [ ] Expose diff on demand from history/undo/snapshot.

## Acceptance Criteria

- [ ] Source edit can be undone immediately.
- [ ] Source delete can be restored.
- [ ] Snapshot survives app restart.
- [ ] Diff is available without appearing after every edit.

