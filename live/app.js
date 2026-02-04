// ==================== MISSION CONTROL V2 ====================
// Joey's Ultimate Command Center

// Configuration
const CONFIG = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api' 
        : '/api',
    REFRESH_INTERVAL: 60000, // 1 minute
    WEATHER_REFRESH: 300000, // 5 minutes
};

// State
let state = {
    dashboardData: null,
    weatherData: null,
    skiData: null,
    kanbanData: null,
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Mission Control V2 Initializing...');
    
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load all data
    loadAllData();
    
    // Set up refresh intervals
    setInterval(loadAllData, CONFIG.REFRESH_INTERVAL);
    
    // Initialize drag and drop for Kanban
    initializeKanban();
});

// ==================== CLOCK ====================
function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Denver'
    };
    const timeStr = now.toLocaleString('en-US', options) + ' MST';
    document.getElementById('currentTime').textContent = timeStr;
}

// ==================== DATA LOADING ====================
async function loadAllData() {
    try {
        // Load dashboard data
        const dashboardPromise = fetch(CONFIG.API_URL)
            .then(r => r.json())
            .catch(err => {
                console.error('Dashboard API error:', err);
                return null;
            });
        
        // Load weather data
        const weatherPromise = loadWeatherData();
        
        // Load ski data
        const skiPromise = loadSkiData();
        
        // Wait for all
        const [dashboard, weather, ski] = await Promise.all([
            dashboardPromise,
            weatherPromise,
            skiPromise
        ]);
        
        state.dashboardData = dashboard;
        state.weatherData = weather;
        state.skiData = ski;
        
        // Render everything
        renderDashboard();
        
    } catch (error) {
        console.error('Failed to load data:', error);
        showError('Unable to load dashboard data. Retrying...');
    }
}

// ==================== WEATHER DATA ====================
async function loadWeatherData() {
    try {
        // Using wttr.in API for Denver weather
        const response = await fetch('https://wttr.in/Denver?format=j1');
        const data = await response.json();
        
        const current = data.current_condition[0];
        const forecast = data.weather.slice(0, 3);
        
        return {
            current: {
                temp: Math.round(current.temp_F),
                feelsLike: Math.round(current.FeelsLikeF),
                condition: current.weatherDesc[0].value,
                humidity: current.humidity,
                windSpeed: current.windspeedMiles,
                icon: getWeatherIcon(current.weatherCode)
            },
            forecast: forecast.map(day => ({
                day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                high: Math.round(day.maxtempF),
                low: Math.round(day.mintempF),
                condition: day.hourly[4]?.weatherDesc[0]?.value || 'Clear',
                icon: getWeatherIcon(day.hourly[4]?.weatherCode || '113')
            }))
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return getMockWeather();
    }
}

function getWeatherIcon(code) {
    const icons = {
        '113': '☀️', // Sunny
        '116': '⛅', // Partly cloudy
        '119': '☁️', // Cloudy
        '122': '☁️', // Overcast
        '143': '🌫️', // Mist
        '176': '🌦️', // Patchy rain
        '179': '🌨️', // Patchy snow
        '182': '🌨️', // Sleet
        '185': '🌨️', // Freezing drizzle
        '200': '⛈️', // Thundery outbreaks
        '227': '❄️', // Blizzard
        '230': '❄️', // Blizzard
        '248': '🌫️', // Fog
        '260': '🌫️', // Freezing fog
        '263': '🌦️', // Light drizzle
        '266': '🌦️', // Light drizzle
        '281': '🌧️', // Freezing drizzle
        '284': '🌧️', // Heavy freezing drizzle
        '293': '🌧️', // Light rain
        '296': '🌧️', // Light rain
        '299': '🌧️', // Moderate rain
        '302': '🌧️', // Moderate rain
        '305': '🌧️', // Heavy rain
        '308': '🌧️', // Heavy rain
        '311': '🌨️', // Light freezing rain
        '314': '🌨️', // Moderate freezing rain
        '317': '🌨️', // Light sleet
        '320': '🌨️', // Moderate sleet
        '323': '🌨️', // Light snow
        '326': '🌨️', // Light snow
        '329': '❄️', // Moderate snow
        '332': '❄️', // Moderate snow
        '335': '❄️', // Heavy snow
        '338': '❄️', // Heavy snow
        '350': '🌨️', // Ice pellets
        '353': '🌦️', // Light rain shower
        '356': '🌧️', // Moderate rain shower
        '359': '🌧️', // Torrential rain shower
        '362': '🌨️', // Light sleet shower
        '365': '🌨️', // Moderate sleet shower
        '368': '🌨️', // Light snow shower
        '371': '❄️', // Moderate snow shower
        '374': '🌨️', // Light ice pellet shower
        '377': '🌨️', // Moderate ice pellet shower
        '386': '⛈️', // Thunderstorm
        '389': '⛈️', // Moderate thunderstorm
        '392': '⛈️', // Thunderstorm with snow
        '395': '⛈️', // Moderate thunderstorm with snow
    };
    return icons[code] || '🌤️';
}

function getMockWeather() {
    return {
        current: {
            temp: 42,
            feelsLike: 38,
            condition: 'Partly Cloudy',
            humidity: 45,
            windSpeed: 8,
            icon: '⛅'
        },
        forecast: [
            { day: 'Thu', high: 45, low: 32, condition: 'Sunny', icon: '☀️' },
            { day: 'Fri', high: 48, low: 35, condition: 'Partly Cloudy', icon: '⛅' },
            { day: 'Sat', high: 52, low: 38, condition: 'Clear', icon: '☀️' }
        ]
    };
}

// ==================== SKI DATA ====================
async function loadSkiData() {
    // Mock ski data - in production, this would call a ski conditions API
    return [
        {
            name: 'Eldora',
            distance: '21 miles',
            snowbase: '45"',
            new24h: '3"',
            new7d: '8"',
            openLifts: '12/12',
            conditions: 'Excellent',
            temp: '28°F'
        },
        {
            name: 'Winter Park',
            distance: '67 miles',
            snowbase: '62"',
            new24h: '5"',
            new7d: '12"',
            openLifts: '22/25',
            conditions: 'Excellent',
            temp: '25°F'
        },
        {
            name: 'Copper',
            distance: '75 miles',
            snowbase: '58"',
            new24h: '4"',
            new7d: '10"',
            openLifts: '20/23',
            conditions: 'Good',
            temp: '26°F'
        },
        {
            name: 'Loveland',
            distance: '56 miles',
            snowbase: '54"',
            new24h: '6"',
            new7d: '14"',
            openLifts: '10/10',
            conditions: 'Excellent',
            temp: '24°F'
        }
    ];
}

// ==================== CALENDAR DATA ====================
function getCalendarEvents() {
    // Mock calendar data - will be replaced with Google Calendar API
    const now = new Date();
    const events = [
        {
            time: '9:00 AM',
            title: 'Respond to Architect - Kitchen Remodel',
            desc: 'Review plans and send feedback',
            priority: 'high'
        },
        {
            time: '11:00 AM',
            title: 'Sales Call - Alpha Roofing',
            desc: 'Follow-up on HummingAgent AI pitch',
            priority: 'medium'
        },
        {
            time: '2:00 PM',
            title: 'Email Processing Block',
            desc: 'Process all 5 inboxes',
            priority: 'medium'
        },
        {
            time: '4:00 PM',
            title: 'Project Review',
            desc: 'Review daily apps and deployments',
            priority: 'low'
        }
    ];
    
    return events;
}

// ==================== KANBAN DATA ====================
function initializeKanban() {
    if (!state.kanbanData) {
        state.kanbanData = {
            todo: [
                { id: 1, title: 'Finish Google backup codes setup', tags: ['urgent', 'personal'] },
                { id: 2, title: 'Choose presentation template', tags: ['business'] },
                { id: 3, title: 'Check Skylead campaign status', tags: ['business'] },
                { id: 4, title: 'Review email inbox', tags: ['urgent'] },
            ],
            inProgress: [
                { id: 5, title: 'Kitchen remodel - architect response', tags: ['urgent', 'personal'] },
                { id: 6, title: 'Email access setup (5 accounts)', tags: ['urgent', 'business'] },
            ],
            done: [
                { id: 7, title: 'Upload Humming Agent presentation', tags: ['business'] },
                { id: 8, title: 'Ship daily apps', tags: ['business'] },
            ]
        };
    }
}

// ==================== RENDER DASHBOARD ====================
function renderDashboard() {
    if (!state.dashboardData) {
        showError('No dashboard data available');
        return;
    }
    
    const data = state.dashboardData;
    
    // Update header
    updateHeader(data);
    
    // Render main content
    const html = `
        <div class="dashboard-grid">
            <!-- Weather Widget -->
            <div class="widget-half">
                ${renderWeatherWidget()}
            </div>
            
            <!-- Ski Report -->
            <div class="widget-half">
                ${renderSkiWidget()}
            </div>
            
            <!-- Calendar Today -->
            <div class="widget-third">
                ${renderCalendarWidget()}
            </div>
            
            <!-- Schedule Timeline -->
            <div class="widget-third">
                ${renderScheduleWidget()}
            </div>
            
            <!-- Urgent Tasks -->
            <div class="widget-third">
                ${renderUrgentTasksWidget(data)}
            </div>
            
            <!-- Kanban Board -->
            <div class="widget-full">
                ${renderKanbanWidget()}
            </div>
            
            <!-- All Tasks -->
            <div class="widget-half">
                ${renderAllTasksWidget(data)}
            </div>
            
            <!-- Notion Integration -->
            <div class="widget-half">
                ${renderNotionWidget()}
            </div>
            
            <!-- RentAHuman Live Demo -->
            <div class="widget-half">
                ${renderRentAHumanWidget()}
            </div>
        </div>
    `;
    
    document.getElementById('dashboardContent').innerHTML = html;
    
    // Attach event listeners
    attachEventListeners();
}

// ==================== UPDATE HEADER ====================
function updateHeader(data) {
    if (!data.gamification) return;
    
    document.getElementById('userLevel').textContent = `Level ${data.gamification.level}`;
    document.getElementById('currentXP').textContent = data.gamification.xp;
    document.getElementById('maxXP').textContent = data.gamification.xpToNextLevel;
    
    const xpPercent = (data.gamification.xp / data.gamification.xpToNextLevel) * 100;
    document.getElementById('xpBarFill').style.width = `${xpPercent}%`;
}

// ==================== WEATHER WIDGET ====================
function renderWeatherWidget() {
    if (!state.weatherData) {
        return `<div class="card"><div class="loading-spinner"></div></div>`;
    }
    
    const weather = state.weatherData;
    
    return `
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">🌤️ Denver Weather</h2>
                    <div class="card-subtitle">Current conditions + 3-day forecast</div>
                </div>
            </div>
            
            <div class="weather-current">
                <div class="weather-icon">${weather.current.icon}</div>
                <div>
                    <div class="weather-temp">${weather.current.temp}°F</div>
                    <div class="weather-desc">${weather.current.condition}</div>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Feels Like</div>
                    <div class="weather-detail-value">${weather.current.feelsLike}°F</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Humidity</div>
                    <div class="weather-detail-value">${weather.current.humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Wind</div>
                    <div class="weather-detail-value">${weather.current.windSpeed} mph</div>
                </div>
            </div>
            
            <div class="weather-forecast">
                ${weather.forecast.map(day => `
                    <div class="forecast-day">
                        <div class="forecast-day-name">${day.day}</div>
                        <div class="forecast-icon">${day.icon}</div>
                        <div class="forecast-temp">${day.high}° / ${day.low}°</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== SKI WIDGET ====================
function renderSkiWidget() {
    if (!state.skiData) {
        return `<div class="card"><div class="loading-spinner"></div></div>`;
    }
    
    return `
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">⛷️ Ski Report</h2>
                    <div class="card-subtitle">Nearby resorts - Live conditions</div>
                </div>
            </div>
            
            <div class="ski-resorts">
                ${state.skiData.map(resort => `
                    <div class="ski-resort">
                        <div class="resort-name">${resort.name}</div>
                        <div class="snow-stat">
                            <span class="snow-stat-label">Base:</span>
                            <span class="snow-stat-value">${resort.snowbase}</span>
                        </div>
                        <div class="snow-stat">
                            <span class="snow-stat-label">24h:</span>
                            <span class="snow-stat-value">${resort.new24h}</span>
                        </div>
                        <div class="snow-stat">
                            <span class="snow-stat-label">Lifts:</span>
                            <span class="snow-stat-value">${resort.openLifts}</span>
                        </div>
                        <div class="snow-stat">
                            <span class="snow-stat-label">Temp:</span>
                            <span class="snow-stat-value">${resort.temp}</span>
                        </div>
                        <div class="conditions-badge ${resort.conditions === 'Excellent' ? 'conditions-excellent' : 'conditions-good'}">
                            ${resort.conditions}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== CALENDAR WIDGET ====================
function renderCalendarWidget() {
    const events = getCalendarEvents();
    
    return `
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">📅 Today's Calendar</h2>
                    <div class="card-subtitle">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                </div>
            </div>
            
            ${events.map(event => `
                <div class="calendar-event">
                    <div class="event-time">${event.time}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-desc">${event.desc}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ==================== SCHEDULE WIDGET ====================
function renderScheduleWidget() {
    const schedule = [
        { time: '8:30 AM', task: 'Morning workout - 50 push-ups', completed: false },
        { time: '9:00 AM', task: 'Architect response', completed: false },
        { time: '10:00 AM', task: 'Email processing', completed: false },
        { time: '11:00 AM', task: 'Sales call', completed: false },
        { time: '12:00 PM', task: 'Lunch break', completed: false },
        { time: '2:00 PM', task: 'Project work', completed: false },
    ];
    
    return `
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">📋 Today's Schedule</h2>
                    <div class="card-subtitle">Timeline view</div>
                </div>
            </div>
            
            <div class="timeline">
                ${schedule.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-dot ${item.completed ? 'completed' : ''}"></div>
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-content">
                            ${item.task}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== URGENT TASKS WIDGET ====================
function renderUrgentTasksWidget(data) {
    const tasks = data.urgentTasks || [];
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">🔥 Urgent Tasks</h2>
            </div>
            
            <ul class="task-list">
                ${tasks.length > 0 
                    ? tasks.map((task, i) => `
                        <li class="task-item priority-high ${task.done ? 'done' : ''}">
                            <div class="task-checkbox ${task.done ? 'checked' : ''}" onclick="toggleTask('urgent', ${i})"></div>
                            <span>${task.text}</span>
                        </li>
                    `).join('')
                    : '<li class="task-item"><span style="color: var(--text-secondary);">No urgent tasks! 🎉</span></li>'
                }
            </ul>
        </div>
    `;
}

// ==================== ALL TASKS WIDGET ====================
function renderAllTasksWidget(data) {
    const tasks = data.todo || [];
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">✅ All Tasks</h2>
            </div>
            
            <ul class="task-list">
                ${tasks.map((task, i) => `
                    <li class="task-item ${task.done ? 'done' : ''}">
                        <div class="task-checkbox ${task.done ? 'checked' : ''}" onclick="toggleTask('todo', ${i})"></div>
                        <span>${task.text}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

// ==================== KANBAN WIDGET ====================
function renderKanbanWidget() {
    const kanban = state.kanbanData;
    
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">📊 Kanban Board</h2>
            </div>
            
            <div class="kanban-board">
                <div class="kanban-column" data-column="todo">
                    <div class="kanban-header">
                        📝 To Do
                        <span class="kanban-count">${kanban.todo.length}</span>
                    </div>
                    ${kanban.todo.map(card => renderKanbanCard(card)).join('')}
                </div>
                
                <div class="kanban-column" data-column="inProgress">
                    <div class="kanban-header">
                        ⚡ In Progress
                        <span class="kanban-count">${kanban.inProgress.length}</span>
                    </div>
                    ${kanban.inProgress.map(card => renderKanbanCard(card)).join('')}
                </div>
                
                <div class="kanban-column" data-column="done">
                    <div class="kanban-header">
                        ✅ Done
                        <span class="kanban-count">${kanban.done.length}</span>
                    </div>
                    ${kanban.done.map(card => renderKanbanCard(card)).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderKanbanCard(card) {
    return `
        <div class="kanban-card" draggable="true" data-card-id="${card.id}">
            <div class="kanban-card-title">${card.title}</div>
            <div class="kanban-card-meta">
                ${card.tags.map(tag => `
                    <span class="kanban-tag tag-${tag}">${tag}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// ==================== NOTION WIDGET ====================
function renderNotionWidget() {
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">📝 Notion Integration</h2>
            </div>
            
            <div class="notion-preview">
                <div class="notion-icon">📓</div>
                <div class="notion-status">
                    Notion integration coming soon!<br>
                    <small style="opacity: 0.7;">Will sync your workspace, tasks, and notes</small>
                </div>
            </div>
        </div>
    `;
}

// ==================== RENTAHUMAN WIDGET ====================
function renderRentAHumanWidget() {
    return `
        <div class="card" style="background: linear-gradient(135deg, #00d4ff 0%, #a29bfe 100%); border: 2px solid #00ff88;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <div>
                    <h2 class="card-title" style="color: white;">🔥 RentAHuman</h2>
                    <div class="card-subtitle" style="color: rgba(255,255,255,0.9);">Gig Platform - LIVE NOW</div>
                </div>
                <div style="background: #00ff88; color: #0f0f23; padding: 8px 16px; border-radius: 12px; font-weight: bold; font-size: 0.9rem;">
                    ✅ DEPLOYED
                </div>
            </div>
            
            <div style="padding: 20px 0;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
                    <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; backdrop-filter: blur(10px);">
                        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 4px;">Build Time</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: white;">12s</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.15); padding: 16px; border-radius: 12px; backdrop-filter: blur(10px);">
                        <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 4px;">Pages</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: white;">7</div>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="https://rentahuman.vercel.app" target="_blank" 
                       style="display: block; padding: 14px 20px; background: rgba(255,255,255,0.25); border-radius: 12px; text-decoration: none; color: white; font-weight: 600; transition: all 0.3s; backdrop-filter: blur(10px);"
                       onmouseover="this.style.background='rgba(255,255,255,0.35)'; this.style.transform='translateY(-2px)'"
                       onmouseout="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(0)'">
                        🏠 View Live Site
                    </a>
                    
                    <a href="./rentahuman-demo.html" target="_blank" 
                       style="display: block; padding: 14px 20px; background: rgba(0,255,136,0.3); border: 2px solid rgba(0,255,136,0.5); border-radius: 12px; text-decoration: none; color: white; font-weight: 600; transition: all 0.3s; backdrop-filter: blur(10px);"
                       onmouseover="this.style.background='rgba(0,255,136,0.4)'; this.style.transform='translateY(-2px)'"
                       onmouseout="this.style.background='rgba(0,255,136,0.3)'; this.style.transform='translateY(0)'">
                        📊 Full Demo Dashboard
                    </a>
                </div>
                
                <div style="margin-top: 16px; padding: 14px; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                    <div style="font-size: 0.85rem; color: rgba(255,255,255,0.9); margin-bottom: 8px;">
                        <strong>✅ Working:</strong> UI, Database, Vercel
                    </div>
                    <div style="font-size: 0.85rem; color: rgba(255,255,255,0.9);">
                        <strong>⏸️ Pending:</strong> Stripe, Domain
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Drag and drop for Kanban
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });
}

// ==================== KANBAN DRAG & DROP ====================
let draggedCard = null;

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedCard = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedCard) {
        const targetColumn = this.dataset.column;
        const cardId = parseInt(draggedCard.dataset.cardId);
        
        // Find and move the card in state
        let card = null;
        for (const [column, cards] of Object.entries(state.kanbanData)) {
            const index = cards.findIndex(c => c.id === cardId);
            if (index !== -1) {
                card = cards.splice(index, 1)[0];
                break;
            }
        }
        
        if (card && targetColumn) {
            state.kanbanData[targetColumn].push(card);
            renderDashboard();
        }
    }
    
    return false;
}

// ==================== TASK TOGGLE ====================
function toggleTask(type, index) {
    if (state.dashboardData) {
        const tasks = type === 'urgent' ? state.dashboardData.urgentTasks : state.dashboardData.todo;
        if (tasks[index]) {
            tasks[index].done = !tasks[index].done;
            renderDashboard();
        }
    }
}

// ==================== PEPPER MODAL ====================
function openPepper() {
    document.getElementById('pepperModal').classList.add('active');
}

function closePepper() {
    document.getElementById('pepperModal').classList.remove('active');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePepper();
    }
});

// ==================== ERROR HANDLING ====================
function showError(message) {
    document.getElementById('dashboardContent').innerHTML = `
        <div class="card" style="text-align: center; padding: 60px;">
            <h2 style="color: var(--accent-red); margin-bottom: 16px; font-size: 2rem;">⚠️ Error</h2>
            <p style="color: var(--text-secondary); font-size: 1.1rem;">${message}</p>
        </div>
    `;
}

// Make functions globally available
window.toggleTask = toggleTask;
window.openPepper = openPepper;
window.closePepper = closePepper;

console.log('🎮 Mission Control V2 Ready!');
