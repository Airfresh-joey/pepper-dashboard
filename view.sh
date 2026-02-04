#!/bin/bash
# Quick dashboard viewer

DASHBOARD_DIR="$HOME/clawd/dashboard"

case "${1:-main}" in
  quick|q)
    cat "$DASHBOARD_DIR/QUICK.md"
    ;;
  main|m)
    cat "$DASHBOARD_DIR/MAIN.md"
    ;;
  status|s)
    cat "$DASHBOARD_DIR/STATUS.md"
    ;;
  all|a)
    echo "=== QUICK VIEW ==="
    cat "$DASHBOARD_DIR/QUICK.md"
    echo ""
    echo "=== DETAILED STATUS ==="
    cat "$DASHBOARD_DIR/STATUS.md"
    ;;
  *)
    echo "Usage: $0 [quick|main|status|all]"
    echo "  quick  - Quick summary"
    echo "  main   - Full dashboard (default)"
    echo "  status - Technical status"
    echo "  all    - Everything"
    ;;
esac
