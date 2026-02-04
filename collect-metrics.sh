#!/bin/bash
# Collect all metrics for Joey's dashboard

OUTPUT_FILE="$HOME/clawd/dashboard/api/metrics.json"
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TODAY=$(date +"%Y-%m-%d")

# === TOKEN USAGE ===
# Get session stats from clawdbot
SESSION_STATS=$(clawdbot status 2>&1 | grep -A 20 "Sessions")

# Extract total tokens from active sessions (rough estimate from status output)
TOTAL_TOKENS=0
while read -r line; do
    if [[ $line =~ ([0-9]+)k/1000k ]]; then
        TOKENS=${BASH_REMATCH[1]}
        TOTAL_TOKENS=$((TOTAL_TOKENS + TOKENS))
    fi
done <<< "$SESSION_STATS"

# Convert to actual tokens (k = 1000)
TOTAL_TOKENS=$((TOTAL_TOKENS * 1000))

# Estimate cost (Claude Sonnet 4.5: ~$3/1M input, ~$15/1M output tokens)
# Rough estimate: 60% input, 40% output
INPUT_TOKENS=$((TOTAL_TOKENS * 60 / 100))
OUTPUT_TOKENS=$((TOTAL_TOKENS * 40 / 100))
INPUT_COST=$(echo "scale=2; $INPUT_TOKENS * 3 / 1000000" | bc)
OUTPUT_COST=$(echo "scale=2; $OUTPUT_TOKENS * 15 / 1000000" | bc)
TOTAL_COST=$(echo "scale=2; $INPUT_COST + $OUTPUT_COST" | bc)

# === LINES OF CODE ===
# Count lines changed today in git
cd ~/clawd 2>/dev/null || cd ~/
LINES_ADDED=$(git log --since="$TODAY 00:00:00" --numstat --pretty=format:"" 2>/dev/null | awk '{added+=$1} END {print added+0}')
LINES_DELETED=$(git log --since="$TODAY 00:00:00" --numstat --pretty=format:"" 2>/dev/null | awk '{deleted+=$2} END {print deleted+0}')
LINES_TOTAL=$((LINES_ADDED + LINES_DELETED))

# Get commits today
COMMITS_TODAY=$(git log --since="$TODAY 00:00:00" --oneline 2>/dev/null | wc -l | xargs)

# === FILES CREATED ===
# Count files created today
FILES_CREATED=$(find ~/clawd -type f -newermt "$TODAY 00:00:00" 2>/dev/null | wc -l | xargs)

# === ACTIVE SESSIONS ===
ACTIVE_SESSIONS=$(clawdbot status 2>&1 | grep "Sessions" | grep -oE "[0-9]+ active" | grep -oE "[0-9]+" || echo "0")

# === OUTPUT STATS ===
# Count markdown files created (reports, docs, etc.)
REPORTS_TODAY=$(find ~/clawd -name "*.md" -newermt "$TODAY 00:00:00" 2>/dev/null | wc -l | xargs)

# Total file size created today (in KB)
TOTAL_SIZE=$(find ~/clawd -type f -newermt "$TODAY 00:00:00" -exec ls -l {} \; 2>/dev/null | awk '{sum+=$5} END {print int(sum/1024)}')

# === HOURLY BREAKDOWN ===
# Get commits per hour today
CURRENT_HOUR=$(date +"%H")
COMMITS_THIS_HOUR=$(git log --since="$TODAY $CURRENT_HOUR:00:00" --oneline 2>/dev/null | wc -l | xargs)

# Lines changed this hour
LINES_THIS_HOUR=$(git log --since="$TODAY $CURRENT_HOUR:00:00" --numstat --pretty=format:"" 2>/dev/null | awk '{lines+=$1+$2} END {print lines+0}')

# === BUILD JSON OUTPUT ===
cat > "$OUTPUT_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "today": "$TODAY",
  "tokens": {
    "total": $TOTAL_TOKENS,
    "input": $INPUT_TOKENS,
    "output": $OUTPUT_TOKENS,
    "sessions_active": $ACTIVE_SESSIONS
  },
  "cost": {
    "input": "$INPUT_COST",
    "output": "$OUTPUT_COST",
    "total": "$TOTAL_COST",
    "currency": "USD"
  },
  "code": {
    "lines_added_today": $LINES_ADDED,
    "lines_deleted_today": $LINES_DELETED,
    "lines_total_today": $LINES_TOTAL,
    "lines_this_hour": $LINES_THIS_HOUR,
    "commits_today": $COMMITS_TODAY,
    "commits_this_hour": $COMMITS_THIS_HOUR
  },
  "output": {
    "files_created_today": $FILES_CREATED,
    "reports_created_today": $REPORTS_TODAY,
    "total_size_kb": $TOTAL_SIZE
  },
  "performance": {
    "avg_lines_per_commit": $(echo "scale=1; $LINES_TOTAL / ($COMMITS_TODAY + 1)" | bc),
    "avg_files_per_hour": $(echo "scale=1; $FILES_CREATED / ($CURRENT_HOUR + 1)" | bc)
  }
}
EOF

echo "✅ Metrics collected: $OUTPUT_FILE"
cat "$OUTPUT_FILE"
