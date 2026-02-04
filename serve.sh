#!/bin/bash
# Dashboard Web Server

PORT=8080
DIR="$HOME/clawd/dashboard"

echo "🌶️ Starting Pepper's Dashboard Server..."
echo ""
echo "📡 Access from this Mac:"
echo "   http://localhost:$PORT/kanban.html"
echo "   http://localhost:$PORT/dashboard.html"
echo ""
echo "📱 Access from other devices on your network:"
echo "   Find your Mac's IP address in System Settings > Network"
echo "   Then go to: http://YOUR-MAC-IP:$PORT/kanban.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$DIR"
python3 -m http.server $PORT
