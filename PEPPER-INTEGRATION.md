# Pepper Integration Guide

## API Endpoints

Base URL: `https://pepper-dashboard.vercel.app/api`

### Projects API

#### List All Projects
```bash
GET /api/projects
```

#### Find Project by Slack Channel
```bash
GET /api/projects?slack_channel=#airfresh
```

#### Create Project
```bash
POST /api/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "color": "#3b82f6",
  "status": "active",
  "slack_channel": "#channel-name"
}
```

---

### Tasks API

#### List Tasks
```bash
GET /api/tasks
GET /api/tasks?project_id=UUID
GET /api/tasks?status=in-progress
GET /api/tasks?source=slack
```

#### Create Task (from Slack)
```bash
POST /api/tasks
Content-Type: application/json

{
  "project_id": "PROJECT_UUID",
  "title": "Task title",
  "description": "Task details",
  "status": "not-started",
  "type": "task",
  "priority": "medium",
  "source": "slack",
  "slack_message_id": "MSG_ID"
}
```

#### Update Task Status
```bash
PATCH /api/tasks
Content-Type: application/json

{
  "id": "TASK_UUID",
  "status": "in-progress"
}
```

#### Delete Task
```bash
DELETE /api/tasks?id=TASK_UUID
```

---

## Pepper Commands

When Pepper receives a message in Slack, use these patterns:

### Add Task from Slack Message

```javascript
// 1. Find the project by Slack channel
const projectRes = await fetch('https://pepper-dashboard.vercel.app/api/projects?slack_channel=' + channelName);
const projects = await projectRes.json();
const project = projects[0];

// 2. Create the task
await fetch('https://pepper-dashboard.vercel.app/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: project.id,
    title: 'Task from Slack',
    description: messageText,
    status: 'not-started',
    type: 'task',
    priority: 'medium',
    source: 'slack',
    slack_message_id: messageId
  })
});
```

### Update Task Status

```javascript
await fetch('https://pepper-dashboard.vercel.app/api/tasks', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: taskId,
    status: 'completed'
  })
});
```

---

## Project Mappings

| Slack Channel | Project Name | Color |
|---------------|-------------|-------|
| #airfresh | Air Fresh Marketing | #3b82f6 |
| #humming-agent | Humming Agent AI | #8b5cf6 |
| #immerse-forge | Immerse Forge | #22c55e |
| #general | Slack - General | #f59e0b |
| #dev | Slack - Dev | #06b6d4 |

---

## Task Statuses

- `not-started` - Backlog/To Do
- `in-progress` - Currently working
- `testing` - In review/testing
- `blocked` - Blocked by something
- `completed` - Done

## Task Types

- `task` - General task
- `bug` - Bug fix
- `feature` - New feature

## Task Priorities

- `low`
- `medium`
- `high`
- `critical`

---

## Example: Full Slack-to-Dashboard Flow

When someone posts "@pepper add task: Fix the login button" in #humming-agent:

```javascript
// Pepper parses the message and calls:
const response = await fetch('https://pepper-dashboard.vercel.app/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: 'HUMMING_AGENT_PROJECT_UUID',
    title: 'Fix the login button',
    status: 'not-started',
    type: 'bug',
    priority: 'high',
    source: 'slack',
    slack_message_id: 'SLACK_MSG_TS'
  })
});

// Dashboard updates in real-time!
```

---

## Dashboard URL

**Live Dashboard:** https://pepper-dashboard.vercel.app/command-center-v2.html

The dashboard auto-updates via Supabase real-time subscriptions when tasks are added/updated.
