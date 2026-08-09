---
task_id: 10
title: Sidebar Navigation and Unfiled Inbox
status: pending
priority: P0
estimated_hours: 3
prd_features: ["Source browser", "Unfiled Markdown files"]
archi_sections: ["Global Storage", "Source Model"]
depends_on: ["02", "03"]
---

# Task 10: Sidebar Navigation and Unfiled Inbox

## Context

The app should feel like an IDE/iA Writer source browser while preserving global mindmap metadata outside source projects.

## Requirements

- [ ] Mirror watched folder hierarchy in the sidebar.
- [ ] Show `.md` files as openable/importable.
- [ ] Show mindmaps, recents, unfiled files, validation items and hidden branches.
- [ ] Create `D:\SYSTEM\MINDMAP_INBOX\` on first launch if missing.
- [ ] Create new Canvas/mindmap.
- [ ] Create new `.md` source from a Canvas into the unfiled inbox.
- [ ] Support moving unfiled `.md` into a watched folder and updating map references.

## Acceptance Criteria

- [ ] New Canvas can be created.
- [ ] New Markdown source can be created from Canvas.
- [ ] Unfiled files are real `.md` files on disk.
- [ ] Moving a file preserves mindmap references.

