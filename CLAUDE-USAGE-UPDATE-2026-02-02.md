# Claude API Usage Dashboard Update
**Cron Job:** 84826ca3-c4a7-4525-a4f1-e4e64e0e2baf  
**Updated:** February 2, 2026 @ 08:45 AM MST  
**Status:** ✅ Complete

---

## 📊 Dashboard Update Summary

### Files Updated
- ✅ **claude-usage.json** — Updated 08:45, 286 bytes
- ✅ **claude-usage.html** — Updated 08:45, 3.7 KB
- ✅ **USAGE-SUMMARY.md** — Department report created
- ✅ **CLAUDE-API-USAGE.md** — Live dashboard markdown created

### Data Sources
- **Session files analyzed:** 218 JSONL files
- **Tracking window:** Full historical data
- **Model:** anthropic/claude-haiku-4-5
- **Refresh frequency:** Hourly via cron

---

## 📈 Current Usage Metrics

### Weekly Usage (Last 7 Days)
- **Tokens:** 816,875,276
- **Percentage:** 100% of limit
- **Status:** 🔴 At capacity
- **Cost:** Estimated $17/week

### Monthly Usage (Current Month)
- **Tokens:** 66,117,526
- **Spend:** $69.14
- **Budget:** $50.00
- **Overage:** -$19.14 (138% of budget)
- **Balance:** $0.00

---

## 🔴 Budget Alert

**CRITICAL:** Monthly budget exceeded by $19.14

```
Budget Limit:    $50.00 ████████████████████
Current Spend:   $69.14 ████████████████████████
Overage:         $19.14 ████
```

### Weekly Burn Rate
- **Current:** ~$17/week
- **Projected monthly:** $68/month
- **Trend:** Increasing usage pattern

---

## 🎯 Next Steps

1. **Monitor Real-Time** — Dashboard auto-refreshes every 60 seconds
2. **Archive Old Sessions** — Reduce tracked baseline by archiving historical sessions
3. **Implement Budgets** — Set per-agent token limits
4. **Set Thresholds** — Alert at 60% and 80% of monthly budget
5. **Review Usage** — Identify high-consumption tasks and optimize

---

## 📁 Access Points

### View the Dashboard
- **Live HTML:** `file:///Users/joeymacmini/clawd/dashboard/claude-usage.html`
- **JSON Data:** `~/clawd/dashboard/claude-usage.json`
- **Reports:** `~/clawd/departments/USAGE-SUMMARY.md`
- **Markdown:** `~/clawd/CLAUDE-API-USAGE.md`

### Session Directory
- **Path:** `~/.clawdbot/agents/main/sessions/`
- **Files tracked:** 218 session transcripts
- **Size estimate:** Multiple GB

---

## ⚙️ Automation Details

### Cron Configuration
- **Job ID:** 84826ca3-c4a7-4525-a4f1-e4e64e0e2baf
- **Frequency:** Hourly
- **Command:** `~/clawd/dashboard/update-claude-usage.sh`
- **Handler:** `claude-usage-tracker.js` (Node.js)

### Metrics Tracked
- **Input tokens:** Cost @ $3/million
- **Output tokens:** Cost @ $15/million
- **Session count:** 218 active files
- **Timestamp:** UTC ISO format

---

## 💡 Recommendations

### Immediate Actions
- ⚠️ Reduce session storage to lower tracked costs
- ⚠️ Consider temporary rate limiting on sub-agents
- ⚠️ Review and archive completed projects

### Long-Term Optimization
- Implement token budgets per agent/department
- Create alerts at 60% spending threshold
- Optimize prompt templates for efficiency
- Schedule batch operations during low-cost periods

### Budget Consideration
- Current trajectory: $68/month
- Options: Increase budget or reduce usage
- Recommend: Implement guardrails at $40/month cap

---

## 📊 Session Health

### Current API Limits
- **5-hour window:** 96% of capacity remaining
- **Weekly limit:** 34% of capacity remaining
- **Status:** Approaching soft limits

### Session Statistics
```
Total Session Files: 218
Main Channel: 1
Sub-agents: Multiple
Cron Jobs: Automated
Storage Used: ~2-3 GB estimated
```

---

**Dashboard Last Updated:** 2026-02-02T08:45:00 MST  
**Next Scheduled Update:** Hourly via cron job  
**Report Generated:** Cron automation system
