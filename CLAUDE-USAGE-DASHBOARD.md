# 🤖 Claude API Usage Dashboard — Feb 2, 2026 10:45 AM

## 📊 Current Usage Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Weekly Tokens** | 823,170,771 | ⚠️ MAXED OUT |
| **Monthly Tokens** | 72,413,021 | 📈 |
| **Monthly Spend** | $71.45 | 🔴 OVER BUDGET |
| **Balance** | $0.00 | 💥 DEPLETED |
| **Sessions Tracked** | 311 files (81MB) | ✅ Loaded |

---

## 🚨 CRITICAL ALERTS

### ⚠️ Budget Exceeded
- Monthly spend: **$71.45** (50/50 limit)
- **100% of monthly budget consumed**
- Previous month overage needs review

### ⚠️ Weekly Token Limit Reached
- Weekly usage: **823.2M tokens** (estimated cap: 10M)
- **8,231% of weekly estimate**
- Indicates either:
  - Real usage is far higher than estimate
  - Duplicate token counting in logs
  - Long-running background processes

---

## 📈 Token Breakdown

### By Category
- **Input Tokens**: Estimated in session logs
- **Output Tokens**: Estimated in session logs
- **Processing Cost**: Calculated from token ratios

### Historical Comparison
```
This Week:   823.2M tokens
This Month:  72.4M tokens
Last Update: 2026-02-02 10:45:07 UTC
```

---

## 💰 Billing Status

**Current Month (Feb 2026):**
- Budget: $50.00
- Spent: $71.45
- Remaining: $0.00
- **Status: OVER BUDGET**

---

## 📝 Session Data Source

- **Location**: `~/.clawdbot/agents/main/sessions/`
- **Files Analyzed**: 311 JSONL files
- **Total Size**: 81MB
- **Last Updated**: 2026-02-02 17:45:07 UTC
- **Update Frequency**: Auto-refresh every 60 seconds

---

## 🔧 Dashboard Files

1. **JSON Dashboard**: `/dashboard/claude-usage.json` — Machine-readable usage data
2. **HTML Dashboard**: `/dashboard/claude-usage.html` — Live web interface
3. **This Report**: `/dashboard/CLAUDE-USAGE-DASHBOARD.md` — Human-readable summary

---

## ⚡ Next Steps

1. **Review token counting logic** — Verify calculations aren't inflated
2. **Check for duplicate entries** — Session logs may count usage multiple times
3. **Plan budget increase** — Current $50/month limit is insufficient
4. **Implement rate limiting** — Consider token quotas for background processes

---

Generated: **February 2, 2026 10:45 AM (MST)**  
Next update: Automated every 60 seconds
