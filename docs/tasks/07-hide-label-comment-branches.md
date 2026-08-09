---
task_id: 07
title: Hide Label Comment Branches
status: pending
priority: P0
estimated_hours: 3
prd_features: ["Branch metadata", "Canvas editing"]
archi_sections: ["Mindmap Model", "Safety"]
depends_on: ["05"]
---

# Task 07: Hide Label Comment Branches

## Context

Canvas needs non-source branch behavior so users can simplify, annotate and think without polluting source files.

## Requirements

- [ ] Implement local-to-map hide.
- [ ] Implement global-to-source hide.
- [ ] Show hidden branches in the left sidebar.
- [ ] Implement display labels that do not modify source text.
- [ ] Implement comments attached to source branches.
- [ ] Implement free comment branches.

## Acceptance Criteria

- [ ] Hiding a branch never modifies the source file.
- [ ] Hidden branches can be restored.
- [ ] Labels do not affect Markdown reading/export.
- [ ] Comments remain outside source and export.

