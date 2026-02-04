#!/bin/bash
# Helper script for departments to update their status
# Usage: ./update-department.sh [department-name] [field] [value]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$(dirname "$SCRIPT_DIR")"
DEPT_NAME="$1"
FIELD="$2"
VALUE="$3"

if [ -z "$DEPT_NAME" ]; then
    echo "Usage: $0 <department> [field] [value]"
    echo ""
    echo "Departments:"
    echo "  - air-fresh"
    echo "  - humming-agent"
    echo "  - web-dev"
    echo "  - sales"
    echo "  - operations"
    echo ""
    echo "Examples:"
    echo "  $0 web-dev status '🟢 All Systems Go'"
    echo "  $0 sales metric 'Total Leads: 45'"
    echo "  $0 operations blocker 'Gmail API access needed'"
    exit 1
fi

DEPT_FILE="$DASHBOARD_DIR/departments/$DEPT_NAME/STATUS.md"

if [ ! -f "$DEPT_FILE" ]; then
    echo "❌ Department not found: $DEPT_NAME"
    exit 1
fi

# If no field specified, just open the file for editing
if [ -z "$FIELD" ]; then
    echo "📝 Opening $DEPT_NAME status for editing..."
    ${EDITOR:-nano} "$DEPT_FILE"
    echo "✅ Department status updated"
    echo "🔄 Run update-dashboard.sh to refresh main dashboard"
    exit 0
fi

# Update specific field
case "$FIELD" in
    status)
        sed -i '' "s/\*\*Status:\*\*.*/\*\*Status:\*\* $VALUE/" "$DEPT_FILE"
        echo "✅ Updated status to: $VALUE"
        ;;
    blocker)
        # Add blocker to the Blockers section
        sed -i '' "/^## 🚨 Blockers/a\\
- $VALUE
" "$DEPT_FILE"
        echo "✅ Added blocker: $VALUE"
        ;;
    action)
        # Add next action
        sed -i '' "/^## ⚡ Next Actions/a\\
- [ ] $VALUE
" "$DEPT_FILE"
        echo "✅ Added action: $VALUE"
        ;;
    *)
        echo "❌ Unknown field: $FIELD"
        echo "Valid fields: status, blocker, action"
        exit 1
        ;;
esac

# Update timestamp
TIMESTAMP=$(date "+%B %d, %Y @ %I:%M %p %Z")
sed -i '' "s/\*\*Last Updated:\*\*.*/\*\*Last Updated:\*\* $TIMESTAMP/" "$DEPT_FILE"

echo "🔄 Triggering dashboard update..."
bash "$SCRIPT_DIR/update-dashboard.sh"

exit 0
