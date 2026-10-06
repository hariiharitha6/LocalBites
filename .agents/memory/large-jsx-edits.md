---
name: Large JSX edits
description: A practical editing constraint for compact TSX components with long JSX lines.
---

When a TSX component is compressed into long single-line JSX, keep edits narrowly scoped; broad replacements and function selectors may fail to match even when the target appears unchanged.

**Why:** several patch attempts against a long JSX line failed, while small isolated edits applied reliably.

**How to apply:** Before changing a compact component, locate the exact target and use the smallest possible patch. If several related changes are needed, consider formatting or extracting the component first.
