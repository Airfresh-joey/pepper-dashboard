#!/bin/bash
# Heartbeat Dashboard Check
# Run this from HEARTBEAT.md to auto-update the dashboard

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$(dirname "$SCRIPT_DIR")"
LAST_RUN_FILE="$DASHBOARD_DIR/.last-update"

# Check if we should run (every 30 minutes)
if [ -f "$LAST_RUN_FILE" ]; then
    LAST_RUN=$(cat "$LAST_RUN_FILE")
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - LAST_RUN))
    
    # Skip if less than 30 minutes (1800 seconds)
    if [ $TIME_DIFF -lt 1800 ]; then
        echo "⏭️  Skipping update (last run $((TIME_DIFF / 60)) minutes ago)"
        exit 0
    fi
fi

# Run the update
echo "🔄 Running scheduled dashboard update..."
bash "$SCRIPT_DIR/update-dashboard.sh"

# Save timestamp
date +%s > "$LAST_RUN_FILE"

# Check for critical issues and alert
CRITICAL_ISSUES=0

# Check for security issues
if grep -q "🔴 CRITICAL" "$DASHBOARD_DIR/STATUS.md"; then
    echo "🚨 CRITICAL SECURITY ISSUES DETECTED!"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

# Check for website downtime
DOWN_SITES=$(grep -c "⚠️.*check needed" "$DASHBOARD_DIR/STATUS.md" || echo "0")
if [ $DOWN_SITES -gt 0 ]; then
    echo "⚠️  $DOWN_SITES website(s) may be down"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
fi

# Check for too many blockers
TOTAL_BLOCKERS=$(find "$DASHBOARD_DIR/departments" -name "STATUS.md" -exec grep -c "^- \[" {} + | awk '{s+=$1} END {print s}' || echo "0")
if [ $TOTAL_BLOCKERS -gt 10 ]; then
    echo "⚠️  High blocker count: $TOTAL_BLOCKERS across all departments"
fi

if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo "✅ All systems nominal"
fi

exit 0
