---
task_id: 02
title: Global Mindmap Storage
status: pending
priority: P0
estimated_hours: 2
prd_features: ["D:\\SYSTEM\\.mindmap storage"]
archi_sections: ["Global Storage"]
depends_on: ["01"]
---

# Task 02: Global Mindmap Storage

## Context

Mindmap metadata must be centralized under `D:\SYSTEM\.mindmap`, not inside each source project.

## Requirements

- [ ] Create/read global settings.
- [ ] Store maps under `D:\SYSTEM\.mindmap\maps`.
- [ ] Store source index under `D:\SYSTEM\.mindmap\indexes`.
- [ ] Use JSON files for MVP.

## Acceptance Criteria

- [ ] A map can be saved and loaded.
- [ ] Source projects are not modified when creating metadata.

