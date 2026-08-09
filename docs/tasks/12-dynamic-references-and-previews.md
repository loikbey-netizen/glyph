---
task_id: 12
title: Dynamic References and Previews
status: pending
priority: P1
estimated_hours: 4
prd_features: ["Dynamic references", "Reference previews"]
archi_sections: ["Mindmap Model", "Ordering Rule"]
depends_on: ["04", "05"]
---

# Task 12: Dynamic References and Previews

## Context

Contracts and long documents need internal references that survive article reordering.

## Requirements

- [ ] Add stable IDs to source when a dynamic reference requires it.
- [ ] Insert dynamic refs in Markdown using the chosen syntax.
- [ ] Recompute displayed numbering from source order.
- [ ] Show collapsed reference-preview branches under referencing branches.
- [ ] Editing a reference preview updates the target source.
- [ ] Moving a reference preview never reorders the target source.

## Acceptance Criteria

- [ ] Moving an article changes its displayed number.
- [ ] References update to the new number.
- [ ] Reference previews are collapsed by default with visible count.

