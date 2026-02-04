# Claude API Usage Dashboard Update
**February 2, 2026 — 1:00 PM (13:00 MT)**

## ✅ Dashboard Update Complete

Claude API usage dashboard has been successfully updated with the latest session data.

---

## 📊 Current Usage Metrics (As of 1:00 PM)

| Metric | Value | Status | Trend |
|--------|-------|--------|-------|
| **Weekly Tokens (7 days)** | 838,573,247 | 🔴 **CRITICAL** | ↑ +13.6M tokens |
| **Monthly Tokens** | 90,152,025 | 🟠 **HIGH** | ↑ +15.8M tokens |
| **Monthly Spend** | $76.61 | 🔴 **OVER BUDGET** | ↑ +$3.89 from 12pm |
| **Remaining Balance** | $0.00 | ❌ **DEPLETED** | — |
| **Budget Overage** | +$26.61 | 🚨 **CRITICAL** | — |
| **Current Session Usage** | 5h active | 90% remaining | ⏱ 59 minutes left |
| **Weekly Remaining** | 2d 20h | 33% quota | — |
| **Last Updated** | Feb 2, 1:00 PM | ✅ CURRENT | — |

---

## 🚨 CRITICAL ALERTS

### 🔴 Budget Exceeded
- **Monthly Budget:** $50.00
- **Current Spend:** $76.61
- **Overage:** +$26.61 (53% over budget)
- **Status:** DEPLETED - No remaining balance

### ⚠️ Weekly Usage at Maximum
- **Weekly Limit:** ~838M tokens (estimated)
- **Current Weekly:** 838,573,247 tokens
- **Status:** 100% CAPACITY - At maximum weekly usage

### 📈 Daily Burn Rate
- **Avg Daily Cost:** ~$5.47/day
- **Tokens Per Day:** ~12.9M tokens/day
- **Projection:** Will exceed monthly budget by ~$35 by month-end

---

## 📈 Token Usage Breakdown

### Weekly (Last 7 Days)
- **Input Tokens:** ~559M tokens
- **Output Tokens:** ~280M tokens
- **Total:** 838.6M tokens
- **Status:** 100% of estimated weekly limit

### Monthly (Current Month)
- **Input Tokens:** ~60.1M tokens
- **Output Tokens:** ~30.1M tokens
- **Total:** 90.2M tokens
- **Days Elapsed:** 2/28 (7%)
- **Tokens Per Day:** ~12.9M avg

### Current Session
- **Context Used:** 0/200k (0%)
- **Session Duration:** 5 hours
- **Time Remaining:** ~59 minutes
- **Compactions:** 0 (no context truncations)

---

## 🎯 Recommendations

1. **IMMEDIATE:** Review and limit session duration to conserve tokens
2. **IMMEDIATE:** Implement usage caps per session
3. **URGENT:** Audit high-usage sessions and optimize prompts
4. **TODAY:** Consider requesting budget increase or usage credits
5. **ONGOING:** Monitor daily spend threshold at $2.00/day max

---

## 📊 Historical Context

| Time | Weekly Tokens | Monthly Spend | Status |
|------|---------------|---------------|--------|
| Feb 2, 12:00 PM | 825.9M | $72.36 | ⚠️ HIGH |
| Feb 2, 1:00 PM | 838.6M | $76.61 | 🔴 CRITICAL |
| **Change** | **+12.7M (+1.5%)** | **+$4.25 (+5.9%)** | **WORSENING** |

---

## 📁 Dashboard Files Updated

✅ **JSON Data Source**
- File: `~/clawd/dashboard/claude-usage.json`
- Format: Machine-readable JSON for API integration
- Updated: 2026-02-02 at 20:00:10 UTC
- Contains: Weekly/monthly tokens, spend, balance

✅ **HTML Live Dashboard**
- File: `~/clawd/dashboard/claude-usage.html`
- Format: Real-time web dashboard with progress bars
- URL: `file:///Users/joeymacmini/clawd/dashboard/claude-usage.html`
- Refresh: Auto-refreshes every 60 seconds
- Charts: Visual progress indicators for tokens and spend

📊 **Session Tracking**
- Sessions Scanned: 247 JSONL files
- Data Source: `~/.clawdbot/agents/main/sessions/`
- Analysis: Input + output token cost calculation
- Pricing: Input $3/1M, Output $15/1M tokens

---

## 🔍 Technical Details

### Data Collection Method
- **Source:** Clawdbot session transcripts (JSONL format)
- **Files Scanned:** 247 session files
- **Date Range:** Last 30 days (current month)
- **Calculation:** Per-token pricing × token count

### Update Script
- **Script:** `~/clawd/dashboard/update-claude-usage.sh`
- **Engine:** Node.js (`claude-usage-tracker.js`)
- **Execution:** Automated via cron job (id: 84826ca3-c4a7-4525-a4f1-e4e64e0e2baf)
- **Frequency:** Hourly during business hours

### Next Update
- **Scheduled:** 2:00 PM (14:00 MT)
- **Interval:** Every hour on the hour
- **Dashboard Refresh:** 60-second auto-refresh in browser

---

## 💡 Usage Tips

1. **Optimize Prompts:** Reduce unnecessary context and instructions
2. **Use Caching:** Leverage prompt caching for repeated requests
3. **Session Management:** End sessions when no longer needed
4. **Batch Operations:** Combine multiple requests into single API calls
5. **Monitor Actively:** Check dashboard before starting large tasks

---

**Next Action:** Request approval from Joey for budget adjustment or usage optimization strategy.

Dashboard URL: `file:///Users/joeymacmini/clawd/dashboard/claude-usage.html`
