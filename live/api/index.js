// Ultimate Mission Control API - Joey's Command Center
const fs = require('fs').promises;
const path = require('path');

// Helper to read files safely
async function readFileSafe(filepath) {
  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (error) {
    return null;
  }
}

// Helper to parse markdown task lists
function parseTasks(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const tasks = [];
  
  lines.forEach(line => {
    const match = line.match(/^- \[([ x])\] (.+)/i);
    if (match) {
      tasks.push({
        done: match[1].toLowerCase() === 'x',
        text: match[2],
        priority: line.includes('🔥') || line.includes('URGENT') ? 'high' : 'normal'
      });
    }
  });
  
  return tasks;
}

// Fetch Denver weather
async function getWeather() {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.7392&longitude=-104.9903&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=America/Denver&forecast_days=7');
    const data = await response.json();
    
    const weatherCodes = {
      0: { desc: 'Clear sky', icon: '☀️' },
      1: { desc: 'Mainly clear', icon: '🌤️' },
      2: { desc: 'Partly cloudy', icon: '⛅' },
      3: { desc: 'Overcast', icon: '☁️' },
      45: { desc: 'Foggy', icon: '🌫️' },
      48: { desc: 'Foggy', icon: '🌫️' },
      51: { desc: 'Light drizzle', icon: '🌦️' },
      53: { desc: 'Moderate drizzle', icon: '🌦️' },
      55: { desc: 'Dense drizzle', icon: '🌧️' },
      61: { desc: 'Slight rain', icon: '🌧️' },
      63: { desc: 'Moderate rain', icon: '🌧️' },
      65: { desc: 'Heavy rain', icon: '⛈️' },
      71: { desc: 'Slight snow', icon: '🌨️' },
      73: { desc: 'Moderate snow', icon: '❄️' },
      75: { desc: 'Heavy snow', icon: '❄️' },
      77: { desc: 'Snow grains', icon: '❄️' },
      80: { desc: 'Slight rain showers', icon: '🌦️' },
      81: { desc: 'Moderate rain showers', icon: '🌧️' },
      82: { desc: 'Violent rain showers', icon: '⛈️' },
      85: { desc: 'Slight snow showers', icon: '🌨️' },
      86: { desc: 'Heavy snow showers', icon: '❄️' },
      95: { desc: 'Thunderstorm', icon: '⛈️' },
      96: { desc: 'Thunderstorm with hail', icon: '⛈️' },
      99: { desc: 'Thunderstorm with hail', icon: '⛈️' }
    };
    
    const current = data.current;
    const currentWeather = weatherCodes[current.weather_code] || { desc: 'Unknown', icon: '🌡️' };
    
    const forecast = data.daily.time.slice(0, 5).map((date, i) => ({
      date,
      tempHigh: Math.round(data.daily.temperature_2m_max[i]),
      tempLow: Math.round(data.daily.temperature_2m_min[i]),
      precipitation: data.daily.precipitation_probability_max[i],
      ...weatherCodes[data.daily.weather_code[i]]
    }));
    
    return {
      location: 'Denver, CO',
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        precipitation: current.precipitation,
        ...currentWeather
      },
      forecast
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
}

// Get ski conditions (mock data - can be enhanced with real API)
function getSkiReport() {
  return {
    resorts: [
      {
        name: 'Vail',
        distance: '100 mi',
        snowBase: '48"',
        newSnow24h: '3"',
        liftsOpen: '31/33',
        status: 'excellent',
        url: 'https://www.vail.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx'
      },
      {
        name: 'Breckenridge',
        distance: '88 mi',
        snowBase: '52"',
        newSnow24h: '5"',
        liftsOpen: '33/34',
        status: 'excellent',
        url: 'https://www.breckenridge.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx'
      },
      {
        name: 'Keystone',
        distance: '77 mi',
        snowBase: '45"',
        newSnow24h: '4"',
        liftsOpen: '20/21',
        status: 'good',
        url: 'https://www.keystoneresort.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx'
      },
      {
        name: 'Copper Mountain',
        distance: '75 mi',
        snowBase: '50"',
        newSnow24h: '6"',
        liftsOpen: '23/23',
        status: 'excellent',
        url: 'https://www.coppercolorado.com/the-mountain/mountain-report'
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

// Get calendar events
function getCalendar() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    today: [
      { time: '09:00', title: 'Morning Planning', type: 'personal' },
      { time: '10:30', title: 'Air Fresh - Client Check-in', type: 'meeting' },
      { time: '14:00', title: 'Humming Agent - Sales Call', type: 'sales' },
      { time: '16:00', title: 'Code Review - Dashboard', type: 'development' },
      { time: '18:00', title: 'Evening Workout', type: 'personal' }
    ],
    upcoming: [
      { date: tomorrow.toISOString().split('T')[0], time: '09:00', title: 'Team Standup', type: 'meeting' },
      { date: tomorrow.toISOString().split('T')[0], time: '11:00', title: 'Investor Call - Prepare', type: 'important' },
      { date: tomorrow.toISOString().split('T')[0], time: '15:00', title: 'Development Sprint', type: 'development' }
    ]
  };
}

// Get kanban board
function getKanban() {
  return {
    columns: {
      todo: {
        title: 'To Do',
        cards: [
          { id: 1, title: 'Connect Notion API', priority: 'high', tags: ['integration'] },
          { id: 2, title: 'Setup calendar sync', priority: 'high', tags: ['automation'] },
          { id: 3, title: 'Email automation workflow', priority: 'medium', tags: ['email'] },
          { id: 4, title: 'Ski trip planning', priority: 'low', tags: ['personal'] }
        ]
      },
      inProgress: {
        title: 'In Progress',
        cards: [
          { id: 5, title: 'Dashboard voice integration', priority: 'high', tags: ['development', 'urgent'] },
          { id: 6, title: 'Air Fresh website updates', priority: 'high', tags: ['client-work'] },
          { id: 7, title: 'Sales outreach - LinkedIn', priority: 'medium', tags: ['sales'] }
        ]
      },
      done: {
        title: 'Done',
        cards: [
          { id: 8, title: 'ImmerseForge TMS deployment', priority: 'high', tags: ['development'] },
          { id: 9, title: 'Boulder pitch presentation', priority: 'high', tags: ['sales'] },
          { id: 10, title: 'Morning workout routine', priority: 'low', tags: ['personal'] }
        ]
      }
    }
  };
}

// Main API handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const basePath = '/Users/joeymacmini/clawd';
    
    // Read all data sources
    const [
      userMd,
      urgentTasks,
      todo,
      priorities,
      tomorrowGoals,
      todayMemory,
      yesterdayMemory,
      weather
    ] = await Promise.all([
      readFileSafe(path.join(basePath, 'USER.md')),
      readFileSafe(path.join(basePath, 'urgent-tasks.md')),
      readFileSafe(path.join(basePath, 'TODO.md')),
      readFileSafe(path.join(basePath, 'operations/PRIORITIES.md')),
      readFileSafe(path.join(basePath, 'operations/TOMORROW-HUGE-GOALS.md')),
      readFileSafe(path.join(basePath, 'memory/2026-01-28.md')),
      readFileSafe(path.join(basePath, 'memory/2026-01-27.md')),
      getWeather()
    ]);
    
    // Parse tasks from various sources
    const urgentTasksList = parseTasks(urgentTasks);
    const todoList = parseTasks(todo);
    const prioritiesList = parseTasks(priorities);
    
    // Extract active projects
    const projects = [
      {
        name: 'ImmerseForge TMS',
        status: 'deployed',
        url: 'https://immerseforge-tms.vercel.app',
        priority: 'high'
      },
      {
        name: 'Mission Control Dashboard',
        status: 'active',
        url: 'https://joey-mission-control.vercel.app',
        priority: 'high'
      },
      {
        name: 'Pepper Voice Interface',
        status: 'deployed',
        url: 'https://pepper-voice-web.vercel.app',
        priority: 'high'
      },
      {
        name: 'Air Fresh Marketing Sites',
        status: 'in-progress',
        priority: 'high'
      }
    ];
    
    // Business metrics
    const businessMetrics = {
      airFresh: {
        name: 'Air Fresh Marketing',
        revenue: { current: 0, goal: 10000, period: 'month' },
        deals: { active: 3, closed: 1 },
        websites: [
          { name: 'dev2.airfreshmarketing.com', status: 'launching' },
          { name: 'immerseforge.com', status: 'active' },
          { name: 'streetteamsco.com', status: 'in-progress' }
        ]
      },
      hummingAgent: {
        name: 'Humming Agent AI',
        revenue: { current: 0, goal: 15000, period: 'month' },
        deals: { active: 2, closed: 0 }
      }
    };
    
    // System status
    const systemStatus = {
      channels: [
        { name: 'Signal', status: 'online' },
        { name: 'Voice', status: 'online' },
        { name: 'Dashboard', status: 'online' }
      ]
    };
    
    // Recent activity
    const recentActivity = [
      { title: 'Voice interface deployed', timestamp: '11:33 PM', category: 'development' },
      { title: 'Dashboard updates shipped', timestamp: '11:25 PM', category: 'development' },
      { title: 'ImmerseForge launched', timestamp: '7:30 PM', category: 'deployment' }
    ];
    
    // Compile response
    const dashboardData = {
      timestamp: new Date().toISOString(),
      user: {
        name: 'Joey',
        timezone: 'America/Denver',
        location: 'Denver, CO'
      },
      weather,
      skiReport: getSkiReport(),
      calendar: getCalendar(),
      kanban: getKanban(),
      tasks: {
        urgent: urgentTasksList,
        todo: todoList,
        priorities: prioritiesList
      },
      projects,
      businessMetrics,
      systemStatus,
      recentActivity,
      gamification: {
        level: 1,
        xp: 150,
        xpToNextLevel: 500,
        dailyQuests: [
          { task: 'Morning workout', xp: 25, done: false },
          { task: 'Check all emails', xp: 40, done: false },
          { task: 'Ship daily apps', xp: 100, done: true }
        ],
        achievements: [
          { name: '🚀 Early Bird', desc: 'Shipped apps 6 hours early', unlocked: true },
          { name: '🎤 Pitch Master', desc: 'Completed Boulder presentation', unlocked: true },
          { name: '📧 Inbox Zero', desc: 'Clear all inboxes', unlocked: false }
        ]
      }
    };
    
    res.status(200).json(dashboardData);
    
  } catch (error) {
    console.error('Dashboard API Error:', error);
    res.status(500).json({ 
      error: 'Failed to load dashboard data',
      message: error.message 
    });
  }
};
