# Department Reports

Each department reports here with standardized format for dashboard aggregation.

## Standard Report Format

```markdown
# DEPARTMENT NAME - Status Report
**Updated:** [timestamp]
**Status:** 🟢 On Track | 🟡 Needs Attention | 🔴 Blocked

## Current State
[Where we are right now]

## Active Work
[What we're doing this moment]

## Blockers
[What's preventing progress]

## Questions
[What we don't know / need clarification on]

## Next Actions
[Immediate next steps to make progress]

## Metrics
[Relevant numbers/stats]
```

## Departments

1. **air-fresh.md** - Air Fresh Marketing
2. **humming-agent.md** - Humming Agent AI
3. **web-dev.md** - Website Development
4. **sales.md** - Sales & Pipeline
5. **operations.md** - Operations & Systems

## Auto-Aggregation

Main dashboard at `~/clawd/dashboard/STATUS.md` pulls from all department files automatically.

Updates triggered by:
- Heartbeat checks (every 30 min during work hours)
- Manual refresh command
- Department report submissions
