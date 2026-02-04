# 🤖 Automated Dashboard System - Complete Guide

**Version:** 1.0  
**Created:** January 30, 2026  
**Status:** 🟢 Operational

---

## 📋 OVERVIEW

This system automatically aggregates reports from all 5 departments into a unified command center dashboard. Updates happen every 30 minutes during active hours (8am-11pm) via the heartbeat system.

### Key Features
✅ **Automated Updates** - Runs every 30 minutes without manual intervention  
✅ **Multi-Department** - Aggregates 5 department status files  
✅ **Real-Time Metrics** - Security, websites, git, and more  
✅ **Alert System** - Flags critical issues automatically  
✅ **Easy Department Updates** - Simple CLI for teams to update their status  

---

## 🏢 DEPARTMENT STRUCTURE

```
~/clawd/dashboard/
├── STATUS.md                    # Main aggregated dashboard
├── departments/
│   ├── air-fresh/
│   │   └── STATUS.md           # Air Fresh Marketing status
│   ├── humming-agent/
│   │   └── STATUS.md           # Humming Agent AI status
│   ├── web-dev/
│   │   └── STATUS.md           # Web Development status
│   ├── sales/
│   │   └── STATUS.md           # Sales pipeline status
│   └── operations/
│       └── STATUS.md           # Operations status
└── scripts/
    ├── update-dashboard.sh      # Main aggregation script
    ├── heartbeat-check.sh       # Heartbeat integration
    └── update-department.sh     # Helper for updating departments
```

---

## 🔄 HOW IT WORKS

### Automatic Updates (Every 30 Minutes)

1. **Heartbeat Trigger** - Pepper's heartbeat runs `heartbeat-check.sh`
2. **Time Check** - Only runs if >30 minutes since last update
3. **Data Collection** - Pulls from all 5 department STATUS.md files
4. **Metric Gathering** - Checks security, websites, git repos
5. **Dashboard Generation** - Rebuilds main STATUS.md with fresh data
6. **Alert Check** - Flags critical issues (security, downtime, etc.)

### Manual Updates

```bash
# Update main dashboard (aggregates all departments)
~/clawd/dashboard/scripts/update-dashboard.sh

# Force update even if <30 min
rm ~/clawd/dashboard/.last-update && ~/clawd/dashboard/scripts/update-dashboard.sh

# Update specific department
~/clawd/dashboard/scripts/update-department.sh web-dev
```

---

## 📝 UPDATING DEPARTMENT STATUS

### Method 1: Quick Field Updates

```bash
# Update department status emoji
~/clawd/dashboard/scripts/update-department.sh web-dev status "🟢 All Systems Go"

# Add a blocker
~/clawd/dashboard/scripts/update-department.sh sales blocker "HubSpot API credentials needed"

# Add a next action
~/clawd/dashboard/scripts/update-department.sh operations action "Set up Gmail API access"
```

### Method 2: Edit Department File Directly

```bash
# Open department file for full editing
~/clawd/dashboard/scripts/update-department.sh air-fresh

# Or edit manually
nano ~/clawd/dashboard/departments/air-fresh/STATUS.md

# Then trigger dashboard update
~/clawd/dashboard/scripts/update-dashboard.sh
```

---

## 📊 DEPARTMENT STATUS TEMPLATE

Each department follows this standard format:

```markdown
# [DEPARTMENT NAME] - Department Status
**Last Updated:** Auto-generated
**Department Lead:** Joey
**Status:** 🟢 Operational

## 📊 Current Status
- Overall Health: HEALTHY
- Active Projects: X
- Blockers: X

## 🎯 Active Projects
### Project Name
- Status: 🟢 Active
- Progress: 60%
- Next Action: Complete feature X
- Timeline: Q1 2026

## 🚨 Blockers
- Blocker 1
- Blocker 2
*or* *None currently*

## 📈 Key Metrics
- Metric 1: Value
- Metric 2: Value

## ⚡ Next Actions
- [ ] Action 1
- [ ] Action 2

## 📝 Notes
Additional context and information
```

---

## 🎯 REAL-TIME METRICS

### Security Status
- **Source:** `~/clawd/security/verify-security.sh`
- **Frequency:** Every dashboard update
- **Alerts:** Critical issues flagged in main dashboard

### Website Monitoring
Checks all 4 sites:
- dev2.airfreshmarketing.com
- immerseforge.com
- streetteamsco.com
- collegemarketing.co

**Status Indicators:**
- ✅ = HTTP 200-299 (healthy)
- ⚠️ = Timeout or error (needs attention)

### Git Activity
- **Tracked Repos:** ~/clawd, ~/immerseforge
- **Metric:** Number of repos with uncommitted changes
- **Helps:** Track work in progress

### HubSpot Integration
- **Status:** 🔴 Pending API setup
- **When Ready:** Will auto-pull sales metrics
- **Frequency:** Every dashboard update

---

## 🚨 ALERT SYSTEM

### Critical Alerts (Immediate Attention)
- 🔴 Security scan finds CRITICAL issues
- 🔴 Website completely down
- 🔴 >3 sites unreachable

### Warnings (Review Soon)
- 🟡 Security warnings found
- 🟡 1-2 sites timing out
- 🟡 >10 blockers across departments

### Info (Normal Operation)
- ✅ All systems nominal
- ✅ Routine updates completed

---

## 🔧 TROUBLESHOOTING

### Dashboard Not Updating

```bash
# Check last update time
ls -lh ~/clawd/dashboard/.last-update

# Check for errors
bash -x ~/clawd/dashboard/scripts/update-dashboard.sh

# Force fresh update
rm ~/clawd/dashboard/.last-update
~/clawd/dashboard/scripts/update-dashboard.sh
```

### Department Status Not Showing

```bash
# Verify file exists
ls -lh ~/clawd/dashboard/departments/*/STATUS.md

# Check file format
head -20 ~/clawd/dashboard/departments/web-dev/STATUS.md
```

### Security Scan Not Running

```bash
# Test security script
bash ~/clawd/security/verify-security.sh

# Check script permissions
ls -l ~/clawd/security/verify-security.sh
```

---

## 📚 FOR DEPARTMENT LEADS

### Your Responsibilities

1. **Keep Status Current** - Update your department's STATUS.md when things change
2. **Use Standard Format** - Follow the template for consistency
3. **Flag Blockers** - Add blockers as soon as they occur
4. **Update Metrics** - Keep key metrics reasonably current
5. **Review Weekly** - Audit your department status every Friday

### Quick Update Commands

```bash
# I need to report a blocker
~/clawd/dashboard/scripts/update-department.sh [your-dept] blocker "Description"

# I completed something
~/clawd/dashboard/scripts/update-department.sh [your-dept] status "🟢 Healthy"

# I have a new priority
~/clawd/dashboard/scripts/update-department.sh [your-dept] action "New task to complete"

# I want to edit everything
~/clawd/dashboard/scripts/update-department.sh [your-dept]
```

---

## 🎮 INTEGRATION WITH GAME MODE

The dashboard integrates with Joey's gamified productivity system:

- **Quest Progress** - Tracked via department next actions
- **Blocker Removal** - Awards XP when blockers cleared
- **System Health** - Contributes to overall score

See [GAME-STATUS.md](./GAME-STATUS.md) for details.

---

## 🚀 FUTURE ENHANCEMENTS

### Planned Features
- [ ] HubSpot API integration (sales metrics)
- [ ] Gmail API integration (email stats)
- [ ] Notion integration (task tracking)
- [ ] Slack notifications on critical alerts
- [ ] Historical trending (charts over time)
- [ ] Mobile app dashboard view
- [ ] Voice status updates via Pepper

### Enhancement Requests
Submit ideas to Joey or add to `departments/operations/STATUS.md` under Next Actions.

---

## 💡 BEST PRACTICES

### Do's ✅
- Update your department status when major changes occur
- Use status emojis consistently (🟢🟡🔴⚪)
- Flag blockers immediately
- Keep metrics reasonably current
- Document your learnings in Notes section

### Don'ts ❌
- Don't manually edit main STATUS.md (auto-generated)
- Don't skip updating blockers
- Don't use inconsistent formats
- Don't leave stale data >1 week
- Don't remove the template structure

---

## 📞 SUPPORT

**Questions?** Ask Joey or Pepper  
**Bugs?** Report in Operations department status  
**Ideas?** Add to department Next Actions  

**Quick Help:**
```bash
# Show this guide
cat ~/clawd/dashboard/DASHBOARD-AUTOMATION.md

# List all commands
ls -lh ~/clawd/dashboard/scripts/
```

---

**System Status:** 🟢 Operational  
**Auto-Update:** Every 30 minutes (8am-11pm)  
**Last Updated:** Auto-generated on each run

🌶️ Built with love by Pepper for Joey
