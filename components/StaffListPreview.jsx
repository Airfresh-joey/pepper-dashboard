/**
 * Staff List Preview - Editable Before PDF Generation
 * 
 * Features:
 * - View talent assigned to event
 * - Edit fields directly (name, phone, location, shift)
 * - Remove team members
 * - Add notes
 * - Generate PDF with ImmerseForge branding
 * - Email PDF to recipient
 * - Download PDF
 * 
 * This is the crown jewel feature - make it beautiful!
 */

import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StaffListPreview({ onGenerate, onClose, selectedFile }) {
  const [eventName, setEventName] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const previewRef = useRef(null);

  // Populate staff list when selectedFile is provided
  React.useEffect(() => {
    if (selectedFile && selectedFile.type === 'staff_list' && selectedFile.data) {
      setEventName(selectedFile.data.event_name || '');
      setStaffList(selectedFile.data.staff || []);
      setShowPreview(true);
    }
  }, [selectedFile]);

  const handleGenerateList = async () => {
    setLoading(true);
    try {
      onGenerate(eventName);
    } catch (error) {
      console.error('Failed to generate list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditField = (index, field, value) => {
    const newStaffList = [...staffList];
    newStaffList[index] = {
      ...newStaffList[index],
      [field]: value
    };
    setStaffList(newStaffList);
  };

  const handleRemoveStaff = (index) => {
    setStaffList(staffList.filter((_, i) => i !== index));
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      // Use html2canvas + jsPDF to generate branded PDF
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add ImmerseForge branding
      pdf.setFontSize(24);
      pdf.setTextColor(0, 102, 204); // ImmerseForge blue
      pdf.text('IMMERSEFORGE', 20, 20);

      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Staff List - ${eventName}`, 20, 35);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);

      // Add the preview table as image
      const imgHeight = (canvas.height * 190) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 55, 190, imgHeight);

      // Save PDF
      pdf.save(`StaffList-${eventName}-${Date.now()}.pdf`);

      // If email provided, send it
      if (emailRecipient) {
        await handleEmailPDF(pdf);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPDF = async (pdf) => {
    try {
      // Convert PDF to base64 and send via email API
      const pdfData = pdf.output('dataurlstring');

      const response = await fetch('/api/admin/staff-list/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_list_id: selectedFile?.id,
          pdf_data: pdfData,
          recipient_email: emailRecipient,
          event_name: eventName,
          sent_by: localStorage.getItem('admin_id') || 'admin'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Staff list emailed to ${emailRecipient}`);
      }
    } catch (error) {
      console.error('Failed to email PDF:', error);
    }
  };

  if (!showPreview && eventName === '') {
    return (
      <div className="staff-list-form">
        <div className="form-header">
          <h3>👥 Staff List Generator</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Denver Fashion Show - Feb 5"
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerateList}
          disabled={loading || !eventName.trim()}
        >
          {loading ? 'Generating...' : 'Generate Staff List'}
        </button>
      </div>
    );
  }

  return (
    <div className="staff-list-preview">
      <div className="form-header">
        <h3>👥 {eventName} - Staff List</h3>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      {/* Editable Staff Table */}
      <div className="staff-table-container" ref={previewRef}>
        <div className="staff-table-header">
          <h4>{eventName}</h4>
          <p>Generated: {new Date().toLocaleDateString()}</p>
        </div>

        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Initial</th>
              <th>Phone</th>
              <th>Shift</th>
              <th>Location</th>
              <th>Photo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, idx) => (
              <tr key={idx} className={editingRow === idx ? 'editing' : ''}>
                <td>
                  <input
                    type="text"
                    value={staff.name}
                    onChange={(e) => handleEditField(idx, 'name', e.target.value)}
                    className="edit-field"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    maxLength="1"
                    value={staff.last_initial}
                    onChange={(e) => handleEditField(idx, 'last_initial', e.target.value)}
                    className="edit-field short"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={staff.phone}
                    onChange={(e) => handleEditField(idx, 'phone', e.target.value)}
                    className="edit-field"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={`${staff.shift_start} - ${staff.shift_end}`}
                    onChange={(e) => handleEditField(idx, 'shift', e.target.value)}
                    className="edit-field"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={staff.location}
                    onChange={(e) => handleEditField(idx, 'location', e.target.value)}
                    className="edit-field"
                  />
                </td>
                <td>
                  {staff.photo_url && (
                    <img src={staff.photo_url} alt={staff.name} className="staff-photo" />
                  )}
                </td>
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveStaff(idx)}
                    title="Remove from list"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email & Generate Actions */}
      <div className="staff-list-actions">
        <div className="email-section">
          <label>Email PDF to:</label>
          <input
            type="email"
            value={emailRecipient}
            onChange={(e) => setEmailRecipient(e.target.value)}
            placeholder="recipient@example.com"
          />
        </div>

        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={handleGeneratePDF}
            disabled={loading || staffList.length === 0}
          >
            {loading ? 'Generating PDF...' : '📥 Download PDF'}
          </button>
          {emailRecipient && (
            <button
              className="btn-secondary"
              onClick={handleGeneratePDF}
              disabled={loading}
            >
              {loading ? 'Sending...' : '📧 Email & Download'}
            </button>
          )}
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="staff-list-info">
        <p>📝 Total Staff: {staffList.length}</p>
        <p>💡 Tip: Edit any field directly. The PDF will be professional and branded with ImmerseForge logo.</p>
      </div>
    </div>
  );
}
