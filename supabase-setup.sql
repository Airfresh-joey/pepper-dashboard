-- Pepper Command Center - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#8b5cf6',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'backlog', 'on-hold', 'completed', 'archived')),
    slack_channel TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'testing', 'blocked', 'completed')),
    type TEXT DEFAULT 'task' CHECK (type IN ('task', 'bug', 'feature')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assignee TEXT,
    due_date DATE,
    source TEXT DEFAULT 'manual',
    slack_message_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (for dashboard - you can restrict later)
CREATE POLICY "Allow public access to projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default projects
INSERT INTO projects (name, description, color, status, slack_channel) VALUES
    ('Air Fresh Marketing', 'Marketing campaigns and brand assets', '#3b82f6', 'active', '#airfresh'),
    ('Humming Agent AI', 'AI agent development', '#8b5cf6', 'active', '#humming-agent'),
    ('Immerse Forge', 'VR/AR experiences', '#22c55e', 'active', '#immerse-forge'),
    ('Slack - General', 'General team tasks', '#f59e0b', 'active', '#general'),
    ('Slack - Dev', 'Development tasks from Slack', '#06b6d4', 'active', '#dev');

-- Create index for faster queries
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
