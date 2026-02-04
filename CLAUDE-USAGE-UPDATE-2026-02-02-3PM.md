# Claude API Usage Dashboard Update
**Generated:** February 2, 2026 at 3:00 PM

## Dashboard Update Summary
✅ **Status:** Successfully updated

### Session Data Scan
- **Sessions scanned:** 254 session files
- **Source:** ~/.clawdbot/agents/main/sessions
- **Tracking method:** JSONL transcript parsing + token extraction

### Current Usage Metrics

#### Weekly Usage (Last 7 Days)
- **Token Count:** 841,962,560 tokens
- **Percentage of Limit:** 100%
- **Status:** ⚠️ At capacity

#### Monthly Usage (Current Month)
- **Token Count:** 94,133,368 tokens
- **Monthly Spend:** $78.69
- **Spend Percentage:** 100% of $50 budget
- **Remaining Balance:** $0.00
- **Status:** ⚠️ EXCEEDED BUDGET

### Dashboard Files Updated

#### 1. JSON Data File
📁 **File:** ~/clawd/dashboard/claude-usage.json
- Weekly tokens tracked
- Monthly spend calculated
- Balance information stored
- Timestamp: 2026-02-02T22:00:09.544Z

#### 2. HTML Dashboard
📁 **File:** ~/clawd/dashboard/claude-usage.html
- Live dashboard with auto-refresh (every 60 seconds)
- Visual progress bars for usage tracking
- Status indicators (OK / Warning / Danger)
- Dark mode interface
- View: file:///Users/joeymacmini/clawd/dashboard/claude-usage.html

### Key Observations
⚠️ **ALERT:** Monthly spending has exceeded the $50 budget by $28.69
- Current balance: $0.00
- Budget overage: $28.69

This suggests either:
1. Heavy session activity this month
2. Multiple parallel agent runs consuming tokens
3. Longer conversations with higher context
4. Session data calculations may include historical overlap

### Next Steps
- Monitor daily usage patterns
- Review high-token sessions
- Consider usage optimization strategies
- Track against actual Claude API billing

---
**Dashboard Status:** ✅ Running
**Last Update:** 2026-02-02 22:00 UTC
**Auto-Refresh:** Every 60 seconds (HTML)
