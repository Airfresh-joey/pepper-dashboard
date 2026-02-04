#!/usr/bin/env node

/**
 * Simple Claude Usage Dashboard
 * Uses clawdbot session data to track usage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getUsageFromClawdbot() {
  try {
    // Use clawdbot's built-in session status
    const result = execSync('clawdbot sessions list --limit 50 2>&1', { encoding: 'utf8' });
    
    // Parse session data to calculate usage
    let totalTokens = 0;
    let totalCost = 0;
    
    // This is a simplified version - we'll calculate from session files
    const sessionDir = path.join(process.env.HOME, '.clawdbot/agents/main/sessions');
    
    if (fs.existsSync(sessionDir)) {
      const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.jsonl'));
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      files.forEach(file => {
        const filePath = path.join(sessionDir, file);
        const stats = fs.statSync(filePath);
        
        // Only process files from the last week
        if (stats.mtimeMs > weekAgo) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.trim().split('\n');
          
          lines.forEach(line => {
            try {
              const msg = JSON.parse(line);
              if (msg.usage) {
                totalTokens += (msg.usage.totalTokens || 0);
                if (msg.usage.cost) {
                  totalCost += (msg.usage.cost.total || 0);
                }
              }
            } catch (e) {}
          });
        }
      });
    }
    
    return {
      weeklyTokens: totalTokens,
      weeklyPercent: Math.min(100, (totalTokens / 2000000) * 100), // Estimate
      monthlySpend: totalCost,
      spendPercent: Math.min(100, (totalCost / 50) * 100),
      balance: 50 - totalCost,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting usage:', error.message);
    return {
      weeklyTokens: 0,
      weeklyPercent: 0,
      monthlySpend: 0,
      spendPercent: 0,
      balance: 50,
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
  }
}

function createDashboard(usage) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Usage - Live</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      padding: 24px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { 
      font-size: 28px; 
      margin-bottom: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
    .card {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border: 1px solid #333;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .value {
      font-size: 36px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
    }
    .bar {
      width: 100%;
      height: 6px;
      background: #222;
      border-radius: 3px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
    .fill.warn { background: linear-gradient(90deg, #f59e0b, #ef4444); }
    .fill.danger { background: #ef4444; }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      margin-left: 8px;
    }
    .badge.ok { background: #10b98120; color: #10b981; }
    .badge.warn { background: #f59e0b20; color: #f59e0b; }
    .badge.danger { background: #ef444420; color: #ef4444; }
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 11px;
      color: #666;
    }
  </style>
  <script>setTimeout(() => location.reload(), 60000);</script>
</head>
<body>
  <div class="container">
    <h1>⚡ Claude API Usage</h1>
    
    <div class="grid">
      <div class="card">
        <div class="label">Weekly Usage</div>
        <div class="value">
          ${usage.weeklyPercent.toFixed(0)}%
          <span class="badge ${usage.weeklyPercent > 80 ? 'warn' : 'ok'}">
            ${usage.weeklyPercent > 80 ? 'HIGH' : 'OK'}
          </span>
        </div>
        <div class="bar">
          <div class="fill ${usage.weeklyPercent > 80 ? 'warn' : ''}" style="width: ${usage.weeklyPercent}%"></div>
        </div>
      </div>
      
      <div class="card">
        <div class="label">Monthly Spend</div>
        <div class="value">
          $${usage.monthlySpend.toFixed(2)}
          <span class="badge ${usage.spendPercent > 80 ? 'danger' : usage.spendPercent > 60 ? 'warn' : 'ok'}">
            ${usage.spendPercent.toFixed(0)}%
          </span>
        </div>
        <div class="bar">
          <div class="fill ${usage.spendPercent > 80 ? 'danger' : usage.spendPercent > 60 ? 'warn' : ''}" 
               style="width: ${usage.spendPercent}%"></div>
        </div>
      </div>
      
      <div class="card">
        <div class="label">Balance</div>
        <div class="value">$${usage.balance.toFixed(2)}</div>
        <div class="label" style="margin-top: 8px; color: #10b981;">of $50.00 limit</div>
      </div>
    </div>
    
    <div class="footer">
      Last updated: ${new Date().toLocaleTimeString()}<br>
      Auto-refreshes every 60 seconds
    </div>
  </div>
</body>
</html>`;

  const htmlPath = path.join(process.env.HOME, 'clawd/dashboard/claude-usage.html');
  fs.writeFileSync(htmlPath, html);
  
  const jsonPath = path.join(process.env.HOME, 'clawd/dashboard/claude-usage.json');
  fs.writeFileSync(jsonPath, JSON.stringify(usage, null, 2));
  
  console.log(`✅ Dashboard created: file://${htmlPath}`);
  return htmlPath;
}

const usage = getUsageFromClawdbot();
const dashboardPath = createDashboard(usage);

console.log('\n📊 Current Usage:');
console.log(`   Weekly: ${usage.weeklyPercent.toFixed(1)}%`);
console.log(`   Spend: $${usage.monthlySpend.toFixed(2)} (${usage.spendPercent.toFixed(0)}%)`);
console.log(`   Balance: $${usage.balance.toFixed(2)}`);
console.log(`\n🌐 Open dashboard: file://${dashboardPath}`);
