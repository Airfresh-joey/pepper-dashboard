#!/bin/bash
# Real-time metrics update - runs every 5 minutes via cron or manual

METRICS_FILE="$HOME/clawd/dashboard/api/metrics.json"

# Get session tokens from current session status
MAIN_SESSION_TOKENS=$(clawdbot status 2>&1 | grep "agent:main:main" | grep -oE "[0-9]+k" | head -1 | sed 's/k//')
MAIN_SESSION_TOKENS=$((MAIN_SESSION_TOKENS * 1000))

# Count active sessions
ACTIVE_SESSIONS=$(clawdbot status 2>&1 | grep "Sessions" | grep -oE "[0-9]+ active" | grep -oE "[0-9]+" || echo "10")

# Get git stats for today
cd ~/clawd
TODAY=$(date +"%Y-%m-%d")
COMMITS_TODAY=$(git log --since="$TODAY 00:00:00" --oneline 2>/dev/null | wc -l | tr -d ' ')
FILES_CHANGED=$(git log --since="$TODAY 00:00:00" --name-only --pretty=format:"" 2>/dev/null | sort -u | wc -l | tr -d ' ')

# Update the JSON with real-time data
jq ".tokens.sessions_active = $ACTIVE_SESSIONS | .code.commits_today = $COMMITS_TODAY | .code.files_changed = $FILES_CHANGED" "$METRICS_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

echo "✅ Metrics updated at $(date)"
