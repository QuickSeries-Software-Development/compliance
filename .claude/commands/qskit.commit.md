---
allowed-tools: Bash(git checkout --branch:*), Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git push:*), Bash(git commit:*), Bash(git log:*), Bash(git rev-parse:*), Bash(gh pr create:*), Bash(gh pr list:*), Bash(gh pr view:*), Bash(gh repo view:*), Bash(gh api:*), AskUserQuestion
description: Commit changes, optionally push and create PR
argument-hint: --push-pr
---

# Git Commit Assistant

Creates well-formatted commits following ISMS documentation conventions.

**Options:**

- `--push-pr` - Push and create PR after commit

## Input

```text
$ARGUMENTS
```

Parse flags from input. Default: commit only (no push).

## Process

### 1. Branch Validation

Check current branch:

```bash
git rev-parse --abbrev-ref HEAD
```

| Branch Pattern | Action |
| -------------- | ------ |
| `main`, `master` | **Protected** - prompt for branch name, create new branch |
| Other | **Valid** - proceed with commit |

### 2. Pre-Commit Validation

For ISMS documentation, validate:

1. Changed markdown files have valid frontmatter (if policy documents)
2. `CHANGELOG.md` is updated for policy/risk changes
3. No placeholder text like `[specify]` or `[TBD]` in active documents

### 3. Analyze and Plan

1. Run `git status` and `git diff --stat`
2. Review conversation history to understand what was accomplished
3. Categorize changes by type:
   - Policy documents (`ISO-27001/*.md`)
   - Risk Registry (`ISO-27001/RR*.csv`)
   - Skills/rules (`.claude/`)
   - Other documentation

### 4. Create Commits

**Commit message format:**

```text
[ISMS] {type}: {description}
```

**Commit types for this project:**

| Type | Use for |
| --- | --- |
| `policy` | New or updated policy documents |
| `risk` | Risk Registry changes |
| `docs` | Non-policy documentation (README, CLAUDE.md) |
| `skill` | Claude skills or rules |
| `template` | Document templates |
| `chore` | Repo maintenance, config changes |

**Staging:**

- Use explicit file paths (never `git add -A` or `git add .`)
- Group related files in same commit

**Examples:**

```text
[ISMS] policy: Update Access Control Policy - add MFA requirements
[ISMS] risk: Add R-152 for new cloud storage asset
[ISMS] docs: Update CLAUDE.md with risk registry workflow
[ISMS] skill: Add /risk-update skill for registry management
```

### 5. Push & PR (if --push-pr)

Push to remote and create PR:

```bash
git push -u origin <branch>
gh pr create --title "[ISMS] <summary>" --body "$(cat <<'EOF'
## Summary
- [bullet points of changes]

## Documents Changed
- [list of files]

## Review Checklist
- [ ] Frontmatter updated (version, last-updated)
- [ ] CHANGELOG.md updated
- [ ] Cross-references validated
- [ ] No unresolved placeholders
EOF
)"
```

## Error Handling

| Error | Action |
| ----- | ------ |
| On protected branch | Prompt for new branch creation |
| Missing CHANGELOG entry | Warn user, suggest adding entry |
| Push fails | Check upstream, suggest `git pull --rebase` |
| PR creation fails | Report error, provide manual steps |

## Guidelines

- **Never auto-commit** - always confirm with user first
- **Imperative mood** - "add" not "added", "update" not "updated"
- **Under 72 chars** - first line of commit message
- **Atomic commits** - one logical change per commit
- **Always update CHANGELOG** - for policy and risk registry changes
