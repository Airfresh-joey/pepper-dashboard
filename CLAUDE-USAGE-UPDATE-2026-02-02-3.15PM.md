# Claude API Usage Dashboard Update
**Generated:** February 2, 2026 at 3:15 PM (MST)
**Session:** cron:84826ca3-c4a7-4525-a4f1-e4e64e0e2baf

## 📊 Update Status
✅ **Dashboard Successfully Updated**
- Script: ~/clawd/dashboard/update-claude-usage.sh
- Tracker: claude-usage-tracker.js
- Data Source: Session transcripts (254 files analyzed)

---

## 🔢 Current Usage Metrics

### Weekly Usage (Last 7 Days)
| Metric | Value | Status |
|--------|-------|--------|
| **Weekly Tokens** | 831,862,120 | ⚠️ At Capacity |
| **Weekly Percentage** | 100% | Critical |

### Monthly Usage (Current Month: February 2026)
| Metric | Value | Status |
|--------|-------|--------|
| **Monthly Tokens** | 85,976,168 | - |
| **Monthly Spend** | $77.61 | 🔴 EXCEEDED |
| **Budget Allocated** | $50.00 | - |
| **Budget Overage** | $27.61 | 🔴 EXCEEDED |
| **Remaining Balance** | $0.00 | 🔴 CRITICAL |

---

## 📈 Session Usage Scan

**Sessions Analyzed:** 254 session files
**Source Location:** ~/.clawdbot/agents/main/sessions
**Parsing Method:** JSONL transcript extraction + token counting

### Analysis Notes
- High token consumption detected from multiple parallel sessions
- Weekly usage at 100% capacity threshold
- Monthly spending has exceeded budget by $27.61 (55% over budget)
- Balance: $0.00 (no remaining allocation)

---

## 📁 Dashboard Files Updated

### 1. JSON Data File
📊 **Location:** `~/clawd/dashboard/claude-usage.json`
```json
{
  "claudeUsage": {
    "weeklyTokens": 831862120,
    "monthlyTokens": 85976168,
    "weeklyPercentage": 100,
    "monthlySpend": "77.61",
    "spendPercentage": 100,
    "balance": "0.00",
    "lastUpdated": "2026-02-02T22:15:09.037Z"
  },
  "timestamp": "2026-02-02T22:15:09.037Z"
}
```
**Status:** ✅ Updated  
**Auto-refresh:** Every 60 seconds

### 2. HTML Dashboard
📊 **Location:** `~/clawd/dashboard/claude-usage.html`
**View:** `file:///Users/joeymacmini/clawd/dashboard/claude-usage.html`

**Features:**
- Real-time metric display
- Visual progress bars with color coding
  - Green: Good (< 50%)
  - Orange/Yellow: Warning (50-80%)
  - Red: Danger (>80%)
- Status indicators (OK / Warning / Danger)
- Dark mode interface (optimized for visibility)
- Auto-refresh every 60 seconds
- Last updated timestamp

**Current Status:**
- ⚠️ Weekly Usage: **Warning** (100% of limit)
- 🔴 Monthly Spend: **Critical** (100% of $50 budget)
- 🔴 Balance: **Critical** ($0.00 remaining)

---

## 🎯 Key Alerts

### 🔴 CRITICAL: Budget Exceeded
- **Current Spend:** $77.61
- **Budget:** $50.00
- **Overage:** $27.61 (55% over)
- **Status:** No remaining balance for February

### ⚠️ WARNING: Weekly Capacity
- **Usage:** 831,862,120 tokens
- **Percentage:** 100% of limit
- **Recommendation:** Monitor usage patterns closely

---

## 💡 Recommended Actions

1. **Immediate:** Review high-token sessions for optimization opportunities
2. **This Week:** Analyze token consumption patterns by session type
3. **Budget Planning:** Adjust monthly allocation or implement usage limits
4. **Monitoring:** Keep dashboard displayed for real-time tracking
5. **Optimization:** Consider:
   - Reducing session context window sizes
   - Batching multiple requests
   - Using Claude Haiku for routine tasks

---

## 📊 Dashboard Automation Status

**Auto-Update:** Enabled (via cron)
**Update Frequency:** Hourly on the hour
**Data Retention:** JSON file maintains historical timestamp
**HTML Refresh:** 60-second client-side refresh cycle
**Visualization:** Real-time progress bars and status indicators

---

## 🔗 Quick Access

- **JSON Data:** ~/clawd/dashboard/claude-usage.json
- **HTML Dashboard:** file:///Users/joeymacmini/clawd/dashboard/claude-usage.html
- **Update Script:** ~/clawd/dashboard/update-claude-usage.sh
- **Tracker Script:** ~/clawd/dashboard/claude-usage-tracker.js
- **Session Data:** ~/.clawdbot/agents/main/sessions/

---

**Report Status:** ✅ Complete
**Dashboard Status:** ✅ Running & Auto-Updating
**Last Update:** 2026-02-02 22:15 UTC
**Next Auto-Update:** 2026-02-02 23:00 UTC (1 hour)
