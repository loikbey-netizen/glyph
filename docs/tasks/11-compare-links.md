---
task_id: 11
title: Compare Links
status: pending
priority: P1
estimated_hours: 2
prd_features: ["Multi-source comparison"]
archi_sections: ["Mindmap Model"]
depends_on: ["05"]
---

# Task 11: Compare Links

## Context

Users need to compare branches across pages, documents and sources without changing source hierarchy.

## Requirements

- [ ] Add `compare` links between branches.
- [ ] Store compare links in mindmap metadata.
- [ ] Ensure compare links never modify source files.
- [ ] Mark compare links for validation when either target changes significantly.

## Acceptance Criteria

- [ ] Two branches from different files can be linked for comparison.
- [ ] Moving or deleting the compare link does not affect source files.

