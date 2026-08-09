---
task_id: 05
title: Canvas Branch Model
status: pending
priority: P0
estimated_hours: 4
prd_features: ["Canvas source-aware"]
archi_sections: ["Mindmap Model", "Ordering Rule"]
depends_on: ["04"]
---

# Task 05: Canvas Branch Model

## Context

Canvas is the main view. Branches can represent source text, labels, comments, mirrors or groups.

## Requirements

- [ ] Implement branch types: source, label, comment, mirror, group.
- [ ] Render parent/child hierarchy.
- [ ] Track position for each branch.
- [ ] Preserve link from source branch to source node.
- [ ] Sort source siblings by vertical position.

## Acceptance Criteria

- [ ] Source branches display parsed Markdown.
- [ ] Labels/comments can be shown without source writes.
- [ ] Branch hierarchy can be saved and reloaded.

