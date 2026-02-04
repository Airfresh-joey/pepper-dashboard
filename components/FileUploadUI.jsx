/**
 * Admin Chat - File Upload UI
 * 
 * Features:
 * - Drag-and-drop file upload
 * - File categorization
 * - File preview
 * - Progress indicator
 */

import React, { useState, useRef } from 'react';

const FILE_CATEGORIES = [
  { value: 'job_posting', label: '📋 Job Posting', icon: '📋' },
  { value: 'training', label: '📚 Training Material', icon: '📚' },
  { value: 'contract', label: '📜 Contract', icon: '📜' },
  { value: 'client_info', label: '🏢 Client Info', icon: '🏢' },
  { value: 'other', label: '📎 Other', icon: '📎' }
];

export default function FileUploadUI({ onFileSelected, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    // Auto-detect category based on filename
    if (file.name.toLowerCase().includes('job')) {
      setSelectedCategory('job_posting');
    } else if (file.name.toLowerCase().includes('train')) {
      setSelectedCategory('training');
    } else if (file.name.toLowerCase().includes('contract')) {
      setSelectedCategory('contract');
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelected(selectedFile, selectedCategory);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  };

  const getCategoryInfo = () => {
    return FILE_CATEGORIES.find(cat => cat.value === selectedCategory);
  };

  return (
    <div className="file-upload-ui">
      <div className="file-upload-header">
        <h3>📤 Upload File</h3>
        <p>Drag files here or click to browse</p>
      </div>

      {/* Drag-Drop Zone */}
      <div
        className={`drag-drop-zone ${dragActive ? 'active' : ''} ${loading ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="file-preview">
            <div className="file-icon">📄</div>
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p>Drag files here</p>
            <p className="or-text">or</p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleChange}
              className="file-input"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-browse"
              disabled={loading}
            >
              Browse Files
            </button>
          </>
        )}
      </div>

      {/* Category Selection */}
      {selectedFile && (
        <div className="category-selection">
          <label>File Category:</label>
          <div className="category-buttons">
            {FILE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`category-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
                title={cat.label}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p>{uploadProgress}%</p>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div className="upload-actions">
          <button
            className="btn-upload"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              setSelectedFile(null);
              setUploadProgress(0);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
