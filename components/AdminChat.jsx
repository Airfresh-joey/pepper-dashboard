/**
 * Admin Chat Hub - Main Component
 * 
 * Features:
 * - Real-time chat messaging
 * - File upload with drag-drop support
 * - File categorization
 * - Message reactions
 * - Job posting auto-parser
 * - Staff list generator
 * - Email integration
 */

import React, { useState, useEffect, useRef } from 'react';
import AdminChatBox from './AdminChatBox';
import AdminChatHistory from './AdminChatHistory';
import FileUploadUI from './FileUploadUI';
import JobPostingForm from './JobPostingForm';
import StaffListPreview from './StaffListPreview';
import './AdminChat.css';

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJobParser, setShowJobParser] = useState(false);
  const [showStaffListGenerator, setShowStaffListGenerator] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [admin_id] = useState(() => {
    // Get from localStorage or generate
    return localStorage.getItem('admin_id') || `admin-${Date.now()}`;
  });
  const messagesEndRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadChatHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/admin/chat/history?limit=50');
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      const response = await fetch('/api/admin/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id,
          admin_name: localStorage.getItem('admin_name') || 'Admin',
          message,
          message_type: 'text'
        })
      });

      const data = await response.json();
      if (data.success) {
        // Check if message contains job posting indicators
        if (message.toLowerCase().includes('job') || 
            message.toLowerCase().includes('position') ||
            message.toLowerCase().includes('hiring')) {
          setShowJobParser(true);
        }
        loadChatHistory();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelected = async (file, category) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const response = await fetch('/api/admin/chat/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_data: e.target.result,
            file_name: file.name,
            file_type: file.type,
            category,
            uploaded_by: admin_id,
            uploaded_by_name: localStorage.getItem('admin_name') || 'Admin'
          })
        });

        const data = await response.json();
        if (data.success) {
          // Add system message about file upload
          await handleSendMessage(`📎 Uploaded: ${file.name}`);
          loadChatHistory();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParseJobPosting = async (text) => {
    try {
      const response = await fetch('/api/admin/chat/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          created_by: admin_id,
          created_by_name: localStorage.getItem('admin_name') || 'Admin'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedFile({ type: 'job', data: data.parsed_data, id: data.job_record_id });
      }
    } catch (error) {
      console.error('Failed to parse job posting:', error);
    }
  };

  const handleGenerateStaffList = async (event_name) => {
    try {
      const response = await fetch('/api/admin/staff-list/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name,
          generated_by: admin_id,
          generated_by_name: localStorage.getItem('admin_name') || 'Admin'
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedFile({ type: 'staff_list', data: data.preview, id: data.staff_list_id });
        setShowStaffListGenerator(true);
      }
    } catch (error) {
      console.error('Failed to generate staff list:', error);
    }
  };

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-header">
        <h2>Admin Command Center</h2>
        <div className="admin-chat-actions">
          <button 
            className="btn-action"
            onClick={() => setShowJobParser(!showJobParser)}
            title="Parse job posting"
          >
            📋 Job Posting
          </button>
          <button 
            className="btn-action"
            onClick={() => setShowStaffListGenerator(!showStaffListGenerator)}
            title="Generate staff list"
          >
            👥 Staff List
          </button>
        </div>
      </div>

      <div className="admin-chat-main">
        <div className="admin-chat-left">
          {/* File Upload Section */}
          <FileUploadUI 
            onFileSelected={handleFileSelected}
            loading={loading}
          />

          {/* Chat History */}
          <AdminChatHistory 
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />
        </div>

        <div className="admin-chat-right">
          {/* Job Posting Parser */}
          {showJobParser && (
            <JobPostingForm 
              onParse={handleParseJobPosting}
              onClose={() => setShowJobParser(false)}
            />
          )}

          {/* Staff List Generator */}
          {showStaffListGenerator && (
            <StaffListPreview 
              onGenerate={handleGenerateStaffList}
              onClose={() => setShowStaffListGenerator(false)}
              selectedFile={selectedFile}
            />
          )}
        </div>
      </div>

      {/* Message Input */}
      <AdminChatBox 
        onSendMessage={handleSendMessage}
        loading={loading}
      />
    </div>
  );
}
