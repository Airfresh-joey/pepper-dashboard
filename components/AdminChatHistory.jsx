/**
 * Admin Chat Message History Display
 * 
 * Features:
 * - Display messages with timestamps
 * - Show attached files inline
 * - Message reactions
 * - File preview/download
 * - Threaded conversations
 */

import React, { useState } from 'react';

export default function AdminChatHistory({ messages, loading, messagesEndRef }) {
  const [selectedThread, setSelectedThread] = useState(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('csv')) return '📊';
    return '📎';
  };

  const getReactionEmoji = (emoji) => {
    const reactions = {
      'thumbs_up': '👍',
      'thumbs_down': '👎',
      'check': '✅',
      'x': '❌',
      'fire': '🔥',
      'thinking': '🤔'
    };
    return reactions[emoji] || emoji;
  };

  if (loading && messages.length === 0) {
    return (
      <div className="chat-history loading">
        <p>Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="admin-chat-history">
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={msg.id} className={`message ${msg.message_type}`}>
            {/* Date divider */}
            {idx === 0 || formatDate(msg.created_at) !== formatDate(messages[idx - 1].created_at) && (
              <div className="date-divider">
                {formatDate(msg.created_at)}
              </div>
            )}

            <div className="message-content">
              <div className="message-header">
                <strong className="admin-name">{msg.admin_name || 'Admin'}</strong>
                <span className="message-time">{formatTime(msg.created_at)}</span>
              </div>

              <div className="message-text">
                {msg.message}
              </div>

              {/* Attached Files */}
              {msg.admin_chat_files && msg.admin_chat_files.length > 0 && (
                <div className="message-files">
                  {msg.admin_chat_files.map(file => (
                    <div key={file.id} className="file-item">
                      <span className="file-icon">
                        {getFileIcon(file.file_type)}
                      </span>
                      <div className="file-info">
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                          {file.file_name}
                        </a>
                        {file.category && (
                          <span className="file-category">{file.category}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Reactions */}
              {msg.admin_chat_reactions && msg.admin_chat_reactions.length > 0 && (
                <div className="message-reactions">
                  {msg.admin_chat_reactions.map(reaction => (
                    <span key={reaction.id} className="reaction" title={reaction.user_name}>
                      {getReactionEmoji(reaction.emoji)}
                    </span>
                  ))}
                </div>
              )}

              {/* Threaded replies count */}
              {msg.thread_id === null && (
                <button 
                  className="btn-reply"
                  onClick={() => setSelectedThread(msg.id)}
                >
                  💬 Reply
                </button>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
