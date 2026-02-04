#!/bin/bash

# Generate API data from department STATUS.md files
# This script reads the STATUS.md files and creates a JSON API response

DASHBOARD_DIR="$HOME/clawd/dashboard"
API_FILE="$DASHBOARD_DIR/api/departments.json"
DEPT_DIR="$DASHBOARD_DIR/departments"

echo "🔄 Generating API data from department STATUS files..."

# Start JSON structure
cat > "$API_FILE" << 'EOF'
{
  "lastUpdated": "TIMESTAMP_PLACEHOLDER",
  "departments": {
EOF

# Function to parse a department STATUS.md file
parse_department() {
    local dept_id="$1"
    local status_file="$DEPT_DIR/$dept_id/STATUS.md"
    
    if [ ! -f "$status_file" ]; then
        echo "⚠️  Warning: $status_file not found, skipping..."
        return
    fi
    
    echo "  Processing $dept_id..."
    
    # Extract data using grep and sed
    local status=$(grep "^\*\*Status:\*\*" "$status_file" | sed 's/.*: \(.*\)/\1/' | sed 's/ 🟢.*//' | sed 's/ 🟡.*//')
    local health=$(grep "Overall Health:" "$status_file" | sed 's/.*: //')
    local projects=$(grep "Active Projects:" "$status_file" | sed 's/.*: //')
    local blockers=$(grep "Blockers:" "$status_file" | sed 's/.*: //')
    
    # Determine status level based on emoji
    local status_level="green"
    if grep -q "🟡" "$status_file"; then
        status_level="yellow"
    elif grep -q "🔴" "$status_file"; then
        status_level="red"
    fi
    
    # Build JSON (simplified - real version would parse all projects and metrics)
    echo "    \"$dept_id\": {"
    echo "      \"status\": \"$status\","
    echo "      \"statusLevel\": \"$status_level\","
    echo "      \"health\": \"$health\","
    echo "      \"activeProjects\": ${projects:-0},"
    echo "      \"blockers\": ${blockers:-0}"
    echo "    },"
}

# Parse each department
for dept in air-fresh humming-agent web-dev sales operations; do
    parse_department "$dept"
done

# Close JSON (remove last comma and close)
echo "  }"
echo "}"

# Replace timestamp
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
sed -i.bak "s/TIMESTAMP_PLACEHOLDER/$timestamp/" "$API_FILE"
rm -f "$API_FILE.bak"

echo "✅ API data generated at $API_FILE"
echo "📊 Last updated: $timestamp"
