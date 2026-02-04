# Dashboard Web Server

## Status
✅ **RUNNING** on port 8080

## Access URLs

### On this Mac (Joey's Mac mini)
```
http://localhost:8080
http://localhost:8080/kanban.html
http://localhost:8080/dashboard.html
```

### From Other Devices (iPhone, iPad, etc.)

**Step 1:** Find your Mac's IP address
- Go to **System Settings → Network**
- Look for "IP Address" (usually 192.168.x.x or 10.0.x.x)

**Step 2:** Access from any device on same WiFi
```
http://YOUR-MAC-IP:8080
http://YOUR-MAC-IP:8080/kanban.html
http://YOUR-MAC-IP:8080/dashboard.html
```

**Example:**
If your Mac's IP is `192.168.1.100`:
- `http://192.168.1.100:8080` - Home page
- `http://192.168.1.100:8080/kanban.html` - Kanban board
- `http://192.168.1.100:8080/dashboard.html` - Main dashboard

## Server Management

### Check if running
```bash
lsof -i :8080
```

### Stop server
```bash
pkill -f "http.server 8080"
```

### Start server
```bash
~/clawd/dashboard/serve.sh
```

Or manually:
```bash
cd ~/clawd/dashboard
python3 -m http.server 8080 > server.log 2>&1 &
```

### View logs
```bash
cat ~/clawd/dashboard/server.log
```

## Files Served

- `index.html` - Landing page with links to all dashboards
- `kanban.html` - Interactive Kanban board
- `dashboard.html` - Main command center
- `QUICK.md` - Quick status view
- `MAIN.md` - Full markdown dashboard
- `STATUS.md` - Technical status

## Auto-Start on Boot (Optional)

To make the dashboard start automatically when the Mac boots:

1. Create a launch agent plist
2. Copy to `~/Library/LaunchAgents/`
3. Load with `launchctl`

(Instructions can be added if needed)

## Security Note

This server is accessible to **anyone on your WiFi network**. It's perfect for your personal devices but don't use on public WiFi without additional security.

## Making it Public (Future)

To access from anywhere (not just home WiFi):
- Option 1: Set up Tailscale (already have it installed)
- Option 2: Use ngrok or similar tunnel
- Option 3: Deploy to Vercel/Netlify/GitHub Pages

Let me know if you want any of these!
