# Markdown Patterns

> Linting rules for `.md` files.

## Critical Rules

| Rule                | ✅ Correct                            | ❌ Wrong                   |
| ------------------- | ------------------------------------- | -------------------------- |
| Block spacing       | Blank lines before/after lists, code, tables | No blank lines       |
| Table separators    | `\| --- \|` (with spaces)             | `\|---\|` (no spaces)      |
| Table alignment     | Pad cells with spaces                 | Unaligned columns          |
| URLs                | \`http://...\` or `<http://...>`      | Bare URLs                  |
| Headings            | Use `##` headings                     | Bold text as heading       |
| First line          | Start with `# Heading`                | Start with text            |

## Quick Checklist

- [ ] Blank line before/after every list
- [ ] Blank line before/after every code block
- [ ] Table separators have spaces: `| --- |`
- [ ] Table columns aligned with padding
- [ ] URLs wrapped in backticks or angle brackets

## Examples

```markdown
Some text.

- Item 1
- Item 2

More text.

| Col 1 | Col 2 |
| ----- | ----- |
| a     | b     |
```
