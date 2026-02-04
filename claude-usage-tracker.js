#!/usr/bin/env node

/**
 * Claude API Usage Tracker
 * Tracks usage from Clawdbot session data
 */

const fs = require('fs');
const path = require('path');

function trackFromSessions() {
  const sessionDir = path.join(process.env.HOME, '.clawdbot/agents/main/sessions');
  
  if (!fs.existsSync(sessionDir)) {
    console.error('❌ Session directory not found');
    return {
      error: 'Session directory not found',
      weeklyTokens: 0,
      monthlySpend: 0,
      balance: 50.00
    };
  }

  // Read all session transcripts
  const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.jsonl'));
  
  let weeklyTokens = 0;
  let monthlyTokens = 0;
  let weeklyCost = 0;
  let monthlyCost = 0;
  
  const now = new Date();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  console.log(`📊 Scanning ${files.length} session files...`);

  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(sessionDir, file), 'utf8');
      const lines = content.trim().split('\n');
      
      lines.forEach(line => {
        try {
          const msg = JSON.parse(line);
          const usage = msg.message?.usage || msg.usage;
          if (usage && msg.timestamp) {
            const msgDate = new Date(msg.timestamp);
            const inputTokens = usage.input || usage.input_tokens || 0;
            const outputTokens = usage.output || usage.output_tokens || 0;
            const totalTokens = usage.totalTokens || (inputTokens + outputTokens);
            
            // Use actual cost if available, otherwise estimate
            const cost = usage.cost?.total || ((inputTokens / 1000000 * 3) + (outputTokens / 1000000 * 15));
            
            // Count weekly
            if (msgDate >= weekStart) {
              weeklyTokens += totalTokens;
              weeklyCost += cost;
            }
            
            // Count monthly
            if (msgDate >= monthStart) {
              monthlyTokens += totalTokens;
              monthlyCost += cost;
            }
          }
        } catch (e) {
          // Skip invalid lines
        }
      });
    } catch (e) {
      // Skip unreadable files
    }
  });

  return {
    weeklyTokens,
    monthlyTokens,
    weeklyPercentage: Math.min(100, (weeklyTokens / 10000000) * 100), // 10M tokens/week estimate
    monthlySpend: monthlyCost.toFixed(2),
    spendPercentage: Math.min(100, (monthlyCost / 50) * 100),
    balance: Math.max(0, 50 - monthlyCost).toFixed(2),
    lastUpdated: new Date().toISOString()
  };
}

async function updateDashboard() {
  console.log('📊 Tracking usage from session data...');
  const usage = trackFromSessions();
  
  const dashboardData = {
    claudeUsage: usage,
    timestamp: new Date().toISOString()
  };

  // Save to dashboard data file
  const dataFile = path.join(process.env.HOME, 'clawd/dashboard/claude-usage.json');
  fs.writeFileSync(dataFile, JSON.stringify(dashboardData, null, 2));

  console.log('✅ Dashboard updated');
  console.log(`📊 Weekly tokens: ${usage.weeklyTokens.toLocaleString()}`);
  console.log(`📊 Monthly tokens: ${usage.monthlyTokens.toLocaleString()}`);
  console.log(`💰 Monthly spend: $${usage.monthlySpend}`);
  console.log(`💳 Balance: $${usage.balance}`);

  // Update HTML dashboard
  updateHTMLDashboard(usage);
}

function updateHTMLDashboard(usage) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude API Usage - Live Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f0f;
      color: #e0e0e0;
      padding: 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { 
      font-size: 24px; 
      margin-bottom: 20px;
      color: #fff;
    }
    .card {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .metric {
      margin-bottom: 20px;
    }
    .metric:last-child { margin-bottom: 0; }
    .metric-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 600;
      color: #fff;
    }
    .metric-subvalue {
      font-size: 14px;
      color: #999;
      margin-top: 4px;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #333;
      border-radius: 4px;
      margin-top: 8px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      transition: width 0.3s ease;
    }
    .progress-fill.warning { background: linear-gradient(90deg, #f59e0b, #ef4444); }
    .progress-fill.danger { background: #ef4444; }
    .timestamp {
      font-size: 11px;
      color: #666;
      margin-top: 20px;
      text-align: center;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }
    .status.ok { background: #10b98120; color: #10b981; }
    .status.warning { background: #f59e0b20; color: #f59e0b; }
    .status.danger { background: #ef444420; color: #ef4444; }
  </style>
  <script>
    // Auto-refresh every 60 seconds
    setTimeout(() => location.reload(), 60000);
  </script>
</head>
<body>
  <div class="container">
    <h1>🤖 Claude API Usage Dashboard</h1>
    
    <div class="card">
      <div class="metric">
        <div class="metric-label">Weekly Token Usage (Last 7 Days)</div>
        <div class="metric-value">
          ${usage.weeklyTokens.toLocaleString()}
          <span class="status ${usage.weeklyPercentage > 80 ? 'warning' : 'ok'}">
            ${usage.weeklyPercentage > 80 ? 'High' : 'Normal'}
          </span>
        </div>
        <div class="metric-subvalue">${usage.weeklyPercentage.toFixed(1)}% of estimated limit</div>
        <div class="progress-bar">
          <div class="progress-fill ${usage.weeklyPercentage > 80 ? 'warning' : ''}" 
               style="width: ${usage.weeklyPercentage}%"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="metric">
        <div class="metric-label">Monthly Token Usage</div>
        <div class="metric-value">
          ${usage.monthlyTokens.toLocaleString()}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="metric">
        <div class="metric-label">Monthly Spend</div>
        <div class="metric-value">
          $${usage.monthlySpend}
          <span class="status ${usage.spendPercentage > 80 ? 'danger' : usage.spendPercentage > 60 ? 'warning' : 'ok'}">
            ${usage.spendPercentage.toFixed(0)}% of $50
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${usage.spendPercentage > 80 ? 'danger' : usage.spendPercentage > 60 ? 'warning' : ''}" 
               style="width: ${usage.spendPercentage}%"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="metric">
        <div class="metric-label">Remaining Balance</div>
        <div class="metric-value">
          $${usage.balance}
          <span class="status ok">Available</span>
        </div>
      </div>
    </div>

    <div class="timestamp">
      Last updated: ${new Date(usage.lastUpdated).toLocaleString()}
      <br>Auto-refreshes every 60 seconds
    </div>
  </div>
</body>
</html>`;

  const htmlFile = path.join(process.env.HOME, 'clawd/dashboard/claude-usage.html');
  fs.writeFileSync(htmlFile, html);
  console.log(`✅ HTML dashboard: file://${htmlFile}`);
}

// Run if called directly
if (require.main === module) {
  updateDashboard().catch(console.error);
}

module.exports = { updateDashboard };
