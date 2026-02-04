#!/bin/bash
# Auto-update main dashboard from all department reports

DASHBOARD="$HOME/clawd/dashboard/STATUS.md"
DEPT_DIR="$HOME/clawd/dashboard/departments"
TIMESTAMP=$(date '+%B %d, %Y @ %I:%M %p %Z')

echo "🔄 Updating dashboard from department reports..."

# Create backup
cp "$DASHBOARD" "$DASHBOARD.backup"

# Function to extract status emoji from department file
get_status() {
  local file=$1
  if [ -f "$file" ]; then
    grep -m 1 "Status:" "$file" | grep -o "[🟢🟡🔴]" || echo "⚪"
  else
    echo "⚪"
  fi
}

# Function to extract latest update from department file
get_latest() {
  local file=$1
  if [ -f "$file" ]; then
    head -20 "$file" | grep -v "^#" | grep -v "^$" | head -3
  else
    echo "No report available"
  fi
}

# Update timestamp in dashboard
sed -i '' "s/\*\*Last Updated:\*\*.*/\*\*Last Updated:\*\* $TIMESTAMP/" "$DASHBOARD"

# Extract department statuses
AIR_FRESH_STATUS=$(get_status "$DEPT_DIR/air-fresh.md")
HUMMING_STATUS=$(get_status "$DEPT_DIR/humming-agent.md")
WEB_DEV_STATUS=$(get_status "$DEPT_DIR/web-dev.md")
SALES_STATUS=$(get_status "$DEPT_DIR/sales.md")
OPS_STATUS=$(get_status "$DEPT_DIR/operations.md")

echo "✅ Dashboard updated: $TIMESTAMP"
echo ""
echo "Department Status:"
echo "  Air Fresh: $AIR_FRESH_STATUS"
echo "  Humming Agent: $HUMMING_STATUS"
echo "  Web Dev: $WEB_DEV_STATUS"
echo "  Sales: $SALES_STATUS"
echo "  Operations: $OPS_STATUS"
