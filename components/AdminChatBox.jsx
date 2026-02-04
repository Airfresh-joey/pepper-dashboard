/**
 * Admin Chat Message Input Box
 * 
 * Handles:
 * - Message input
 * - Send button
 * - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
 * - Loading states
 */

import React, { useState, useRef } from 'react';

export default function AdminChatBox({ onSendMessage, loading }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="admin-chat-box">
      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="Type a message... (Shift+Enter for new line)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        rows="3"
      />
      <button
        className="btn-send"
        onClick={handleSend}
        disabled={loading || !message.trim()}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
