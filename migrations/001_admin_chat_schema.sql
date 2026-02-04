-- Admin Chat Hub - Database Schema
-- Created: February 2, 2026
-- Purpose: Support admin chat, file uploads, job posting automation, and staff list generation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Admin Chat Messages Table
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id TEXT NOT NULL,
  admin_name TEXT,
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'system', 'action'
  thread_id UUID REFERENCES admin_chat_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_admin_chat_messages_admin_id ON admin_chat_messages(admin_id);
CREATE INDEX idx_admin_chat_messages_created_at ON admin_chat_messages(created_at DESC);
CREATE INDEX idx_admin_chat_messages_thread_id ON admin_chat_messages(thread_id);

-- ==========================================
-- 2. Admin Chat Files Table
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_chat_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES admin_chat_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(255),
  file_size BIGINT,
  category VARCHAR(50), -- 'job_posting', 'training', 'contract', 'client_info', 'other'
  uploaded_by TEXT NOT NULL,
  uploaded_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,
  version INT DEFAULT 1
);

CREATE INDEX idx_admin_chat_files_message_id ON admin_chat_files(message_id);
CREATE INDEX idx_admin_chat_files_category ON admin_chat_files(category);
CREATE INDEX idx_admin_chat_files_created_at ON admin_chat_files(created_at DESC);

-- ==========================================
-- 3. Admin Actions Table
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type VARCHAR(50), -- 'job_posting', 'staff_list', 'report', 'email'
  triggered_by TEXT NOT NULL,
  triggered_by_name TEXT,
  triggered_from_message UUID REFERENCES admin_chat_messages(id),
  target_data JSONB,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_triggered_by ON admin_actions(triggered_by);
CREATE INDEX idx_admin_actions_status ON admin_actions(status);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- ==========================================
-- 4. Message Reactions Table
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_chat_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES admin_chat_messages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT,
  emoji VARCHAR(10) NOT NULL, -- '✅', '❌', '👍', etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_chat_reactions_message_id ON admin_chat_reactions(message_id);
CREATE INDEX idx_admin_chat_reactions_user_id ON admin_chat_reactions(user_id);

-- ==========================================
-- 5. Job Posting Parser Results Table
-- ==========================================
CREATE TABLE IF NOT EXISTS job_posting_parsed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES admin_chat_messages(id),
  raw_text TEXT NOT NULL,
  parsed_data JSONB, -- {title, date, time, location, positions, pay_rate, requirements}
  calendar_event_id UUID,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'created'
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT
);

CREATE INDEX idx_job_posting_parsed_message_id ON job_posting_parsed(message_id);
CREATE INDEX idx_job_posting_parsed_status ON job_posting_parsed(status);

-- ==========================================
-- 6. Staff List Generations Table
-- ==========================================
CREATE TABLE IF NOT EXISTS staff_list_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID,
  event_name TEXT NOT NULL,
  generated_by TEXT NOT NULL,
  generated_by_name TEXT,
  pdf_url TEXT,
  talent_data JSONB, -- Snapshot of talent data used for PDF
  editable_fields JSONB, -- Fields edited before PDF generation
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'generated', 'emailed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  generated_at TIMESTAMP WITH TIME ZONE,
  emailed_to TEXT,
  emailed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_staff_list_generations_event_id ON staff_list_generations(event_id);
CREATE INDEX idx_staff_list_generations_generated_by ON staff_list_generations(generated_by);
CREATE INDEX idx_staff_list_generations_created_at ON staff_list_generations(created_at DESC);

-- ==========================================
-- RLS Policies (Row Level Security)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE admin_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_chat_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posting_parsed ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_list_generations ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all messages
CREATE POLICY "Admins can view all chat messages"
  ON admin_chat_messages FOR SELECT
  USING (true); -- Will be restricted by app-level auth

-- Allow admins to insert messages
CREATE POLICY "Admins can insert chat messages"
  ON admin_chat_messages FOR INSERT
  WITH CHECK (true);

-- Allow admins to see all files
CREATE POLICY "Admins can view all chat files"
  ON admin_chat_files FOR SELECT
  USING (true);

-- Allow admins to insert files
CREATE POLICY "Admins can upload files"
  ON admin_chat_files FOR INSERT
  WITH CHECK (true);

-- ==========================================
-- Views for Common Queries
-- ==========================================

-- Recent chat activity with file attachments
CREATE OR REPLACE VIEW admin_chat_activity AS
SELECT
  m.id,
  m.admin_id,
  m.admin_name,
  m.message,
  m.message_type,
  m.created_at,
  COALESCE(f.file_count, 0) as file_count,
  COALESCE(r.reaction_count, 0) as reaction_count
FROM admin_chat_messages m
LEFT JOIN (
  SELECT message_id, COUNT(*) as file_count
  FROM admin_chat_files
  GROUP BY message_id
) f ON m.id = f.message_id
LEFT JOIN (
  SELECT message_id, COUNT(*) as reaction_count
  FROM admin_chat_reactions
  GROUP BY message_id
) r ON m.id = r.message_id
WHERE m.deleted_at IS NULL
ORDER BY m.created_at DESC;

-- Job postings awaiting action
CREATE OR REPLACE VIEW pending_job_postings AS
SELECT
  jp.id,
  jp.parsed_data->>'title' as job_title,
  jp.parsed_data->>'date' as job_date,
  jp.created_by,
  jp.created_at,
  jp.status
FROM job_posting_parsed jp
WHERE jp.status IN ('draft', 'approved')
ORDER BY jp.created_at DESC;

-- Recent staff list generations
CREATE OR REPLACE VIEW recent_staff_lists AS
SELECT
  sl.id,
  sl.event_name,
  sl.generated_by_name,
  sl.status,
  sl.created_at,
  sl.generated_at,
  sl.emailed_at
FROM staff_list_generations sl
ORDER BY sl.created_at DESC
LIMIT 50;

-- Summary statistics
CREATE OR REPLACE VIEW admin_chat_stats AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT admin_id) as unique_admins,
  COUNT(*) as total_messages,
  (SELECT COUNT(*) FROM admin_chat_files WHERE DATE(created_at) = DATE(admin_chat_messages.created_at)) as total_files,
  (SELECT COUNT(*) FROM admin_actions WHERE DATE(created_at) = DATE(admin_chat_messages.created_at)) as total_actions
FROM admin_chat_messages
WHERE deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;
