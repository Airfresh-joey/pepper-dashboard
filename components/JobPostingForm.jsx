/**
 * Job Posting Auto-Parser Form
 * 
 * Features:
 * - Parse job posting text
 * - Fill missing details
 * - Create calendar event
 * - Approval workflow
 */

import React, { useState } from 'react';

export default function JobPostingForm({ onParse, onClose }) {
  const [jobText, setJobText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    positions: '',
    pay_rate: '',
    requirements: ''
  });

  const handleParse = async () => {
    setLoading(true);
    try {
      onParse(jobText);
      // The parsed data will come back through props
      // For now, we'll simulate parsing
      setParsedData(true);
      setEditing(true);
    } catch (error) {
      console.error('Failed to parse:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async () => {
    try {
      // Call API to create calendar event
      const response = await fetch('/api/admin/chat/create-job-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Calendar event created successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="job-posting-form">
      <div className="form-header">
        <h3>📋 Job Posting Parser</h3>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      {!parsedData ? (
        <div className="parse-section">
          <label>Paste job posting text:</label>
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste job posting, text from email, or any job description..."
            rows="8"
          />
          <button
            className="btn-primary"
            onClick={handleParse}
            disabled={loading || !jobText.trim()}
          >
            {loading ? 'Parsing...' : 'Parse Job Posting'}
          </button>
        </div>
      ) : (
        <div className="form-section">
          <p className="form-help">Fill in or correct the parsed job details:</p>

          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFieldChange}
              placeholder="e.g., Brand Ambassador"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFieldChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFieldChange}
                placeholder="e.g., Denver, CO"
              />
            </div>
            <div className="form-group">
              <label>Number of Positions</label>
              <input
                type="number"
                name="positions"
                value={formData.positions}
                onChange={handleFieldChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pay Rate</label>
            <input
              type="text"
              name="pay_rate"
              value={formData.pay_rate}
              onChange={handleFieldChange}
              placeholder="e.g., $25/hour"
            />
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleFieldChange}
              placeholder="Skills, experience, requirements"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleCreateEvent}
              disabled={!formData.title || !formData.date}
            >
              Create Calendar Event
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setParsedData(null);
                setJobText('');
                setFormData({
                  title: '',
                  date: '',
                  time: '',
                  location: '',
                  positions: '',
                  pay_rate: '',
                  requirements: ''
                });
              }}
            >
              Clear & Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
