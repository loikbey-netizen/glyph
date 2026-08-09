---
task_id: 04
title: Markdown Parser
status: pending
priority: P0
estimated_hours: 4
prd_features: ["Markdown to branches"]
archi_sections: ["Markdown Adapter MVP"]
depends_on: ["02", "03"]
---

# Task 04: Markdown Parser

## Context

Markdown files must become source-aware branches: document, headings, paragraphs and sentences.

## Requirements

- [ ] Parse Markdown into AST.
- [ ] Extract heading nodes.
- [ ] Extract paragraph nodes.
- [ ] Split paragraphs into sentence nodes.
- [ ] Preserve source ranges or enough mapping data for rewrite.
- [ ] Generate stable node IDs.

## Acceptance Criteria

- [ ] A Markdown file renders as a branch hierarchy.
- [ ] Each source branch has a source path and source range.
- [ ] Reparse keeps stable nodes when text changes slightly.

