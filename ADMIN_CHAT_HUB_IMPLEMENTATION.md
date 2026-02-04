# Admin Chat Hub - Phase 1 Implementation Guide

**Project:** immerseforge-tms (ImmerseForge Talent Management System)  
**Status:** Phase 1 - Complete ✅  
**Date:** February 2, 2026

---

## 📋 What's Been Built

### Database Layer
- ✅ 6 new Supabase tables for admin chat functionality
- ✅ RLS (Row Level Security) policies configured
- ✅ 4 SQL views for common queries
- ✅ Storage buckets for file uploads and PDFs

**Tables Created:**
1. `admin_chat_messages` - Chat messages
2. `admin_chat_files` - Uploaded files
3. `admin_actions` - Action tracking
4. `admin_chat_reactions` - Message reactions
5. `job_posting_parsed` - Job posting parser results
6. `staff_list_generations` - Staff list PDFs

### Backend API Routes
- ✅ `POST /api/admin/chat/message` - Save messages
- ✅ `POST /api/admin/chat/file` - Upload files
- ✅ `GET /api/admin/chat/history` - Retrieve chat history
- ✅ `POST /api/admin/chat/parse-job` - Parse job postings
- ✅ `POST /api/admin/staff-list/generate` - Generate staff lists
- ✅ `POST /api/admin/staff-list/email` - Email staff lists

### Frontend Components (React)
- ✅ `AdminChat` - Main chat component
- ✅ `AdminChatBox` - Message input
- ✅ `AdminChatHistory` - Message display
- ✅ `FileUploadUI` - Drag-drop file upload
- ✅ `JobPostingForm` - Job posting parser UI
- ✅ `StaffListPreview` - Editable staff list preview
- ✅ Professional CSS styling with ImmerseForge branding

---

## 🚀 Integration Steps

### Step 1: Set Up Supabase Database

1. **Create tables in Supabase:**
   ```bash
   # Run the SQL migration
   psql -U postgres -d your_database -f /Users/joeymacmini/clawd/dashboard/migrations/001_admin_chat_schema.sql
   ```

2. **Create storage buckets:**
   - Go to Supabase Dashboard → Storage
   - Create bucket: `admin-files` (public, files are public URLs)
   - Create bucket: `admin-reports` (for generated PDFs)

3. **Verify tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

### Step 2: Install Dependencies

The React components require these packages:

```bash
cd /Users/joeymacmini/clawd/dashboard
npm install jspdf html2canvas
npm install @supabase/supabase-js
```

### Step 3: Configure Environment Variables

Add to `.env`:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Service (choose one)
SENDGRID_API_KEY=your-sendgrid-key
# OR
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-password

# Optional: Admin Credentials
ADMIN_EMAIL=joey@immerseforge.com
ADMIN_PHONE=+1-303-xxx-xxxx
```

### Step 4: Create Vercel API Route Wrapper

Create `/api/admin/index.js` to route all admin requests:

```javascript
// /Users/joeymacmini/clawd/dashboard/api/admin/index.js

export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Route to appropriate handler
  if (pathname.includes('chat/message')) {
    return require('../admin-chat-message')(req, res);
  } else if (pathname.includes('chat/file')) {
    return require('../admin-chat-file-upload')(req, res);
  } else if (pathname.includes('chat/history')) {
    return require('../admin-chat-history')(req, res);
  } else if (pathname.includes('chat/parse-job')) {
    return require('../admin-parse-job-posting')(req, res);
  } else if (pathname.includes('staff-list/generate')) {
    return require('../admin-generate-staff-list')(req, res);
  } else if (pathname.includes('staff-list/email')) {
    return require('../admin-email-staff-list')(req, res);
  }
  
  res.status(404).json({ error: 'Not found' });
}
```

### Step 5: Integrate Components into App

Add to your main dashboard or admin page:

```jsx
import AdminChat from '@/components/AdminChat';

export default function AdminDashboard() {
  return (
    <div>
      <AdminChat />
    </div>
  );
}
```

---

## 📚 Feature Documentation

### Feature 1: Chat UI with File Upload

**How it works:**
1. Users type messages in the chat box
2. Messages are saved to Supabase with timestamps
3. Drag-drop files into the upload zone
4. Files are categorized (job posting, training, etc.)
5. Files are stored in Supabase storage
6. File URLs are displayed in chat with icons

**User Flow:**
```
User types message → Press Enter → Message saved → Appears in history
User drags file → Select category → Click Upload → File appears in chat
```

### Feature 2: Job Posting Auto-Parser

**How it works:**
1. User pastes job posting text in chat
2. System detects it's a job posting
3. Parser extracts: title, date, location, positions, pay, requirements
4. User sees form with parsed data
5. User fills in blanks or corrections
6. User clicks "Create Calendar Event"
7. Event created in calendar automatically

**Parsed Fields:**
- Job Title (required)
- Date (required)
- Time (optional)
- Location (optional)
- Number of Positions (optional)
- Pay Rate (optional)
- Requirements (optional)

**Example Input:**
```
Brand Ambassador needed for Denver Fashion Week
Date: Feb 15, 2026
Time: 2-6 PM
Location: Downtown Denver Convention Center
Positions: 5 openings
Pay: $25/hour
Requirements: Professional appearance, good communication, experience with events
```

**Parser Output:**
```json
{
  "title": "Brand Ambassador",
  "date": "02/15/2026",
  "time": "2:00 PM",
  "location": "Downtown Denver",
  "positions": 5,
  "pay_rate": "$25",
  "requirements": "Professional appearance..."
}
```

### Feature 3: Staff List PDF Generator (Crown Jewel!)

**This is the most important feature. Make it beautiful!**

**How it works:**
1. User enters event name
2. System queries database for talent assigned to event
3. Shows preview table with all fields editable
4. User can:
   - Edit names, phone numbers, locations
   - Remove team members
   - Add notes
5. User can:
   - Download PDF (professional, branded)
   - Email PDF to recipient
   - Both at once

**Staff List Includes:**
- Name (full)
- Last Initial (for privacy on client copies)
- Phone number
- Shift dates & hours
- Location/venue
- Team member photo (headshot)
- ImmerseForge branding

**PDF Branding:**
- ImmerseForge blue color (#0066cc)
- Professional layout
- Logo in header
- Generated date & by whom
- Professional fonts

**Example Workflow:**
```
Joey: /staff-list Denver Fashion Week
System: Shows preview with 12 talent
Joey: Removes 2 people, updates one phone number
Joey: Enters: branding@immerseforge.com in email field
Joey: Clicks "Email & Download"
Result: PDF generated, emailed, and downloads to computer
```

### Feature 4: Email Integration

**Simple but powerful!**

Each generated report (staff list, etc.) has email capability:

1. Generate staff list
2. Preview shows email field
3. Enter recipient email
4. Click "Email & Download"
5. System generates PDF + sends email to recipient
6. PDF also downloads to user's computer

**Email Template:**
```
Subject: Staff List - [Event Name]

Dear Team,

Please find attached the professional staff list for [Event Name].

Includes:
- Staff names (with last initials for privacy)
- Contact phone numbers
- Shift dates and hours
- Assignment locations

Generated: [Date & Time]
Generated by: [Admin Name]

Best regards,
ImmerseForge Administration
```

### Feature 5: File Categorization & Storage

**Files are organized by type:**

Categories:
- 📋 Job Posting
- 📚 Training Material
- 📜 Contract
- 🏢 Client Information
- 📎 Other

**Storage:**
- Files stored in `admin-files` Supabase bucket
- Public URLs available for download
- Metadata saved with each file (uploader, date, category)
- Version history supported

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Message saving works
- [ ] File upload works with various file types
- [ ] Chat history retrieves messages in correct order
- [ ] Job posting parser extracts data correctly
- [ ] Staff list generates with correct talent
- [ ] PDF generation works
- [ ] Email sending works

### Integration Tests
- [ ] Full chat flow: message → appears in history
- [ ] Full file flow: upload → appears in chat → can download
- [ ] Full job flow: paste text → parse → create event
- [ ] Full staff flow: generate → edit → email → download

### UI Tests
- [ ] Drag-drop upload works
- [ ] File category buttons work
- [ ] Chat scrolls to new messages
- [ ] Form validation prevents invalid data
- [ ] Mobile responsive design works
- [ ] Dark mode styling (if applicable)

### Performance Tests
- [ ] Chat loads first 50 messages quickly
- [ ] File upload handles large files (>100MB)
- [ ] PDF generation completes in <5 seconds
- [ ] Email sending completes in <3 seconds

---

## 🔧 Configuration & Customization

### Customize Job Posting Parser

Edit `/api/admin-parse-job-posting.js` - modify `parseJobPosting()` function:

```javascript
function parseJobPosting(text) {
  const parsed = {
    title: null,
    date: null,
    // ... add more fields as needed
  };
  
  // Add your custom regex patterns for parsing
  const titleMatch = text.match(/(?:position|title|job|role)[\s:]*([^\n]+)/i);
  if (titleMatch) {
    parsed.title = titleMatch[1].trim();
  }
  
  return parsed;
}
```

### Customize Staff List PDF

Edit `/components/StaffListPreview.jsx` - modify `handleGeneratePDF()` function:

```javascript
const handleGeneratePDF = async () => {
  const pdf = new jsPDF();
  
  // Customize: Add your logo
  // pdf.addImage(logoURL, 'PNG', 10, 10, 190, 30);
  
  // Customize: Change colors
  // pdf.setTextColor(0, 102, 204); // ImmerseForge blue
  
  // Customize: Add footer
  // pdf.text('ImmerseForge.com', 10, 280);
  
  pdf.save(`StaffList.pdf`);
};
```

### Customize Email Template

Edit `/api/admin-email-staff-list.js` - modify `emailBody`:

```javascript
const emailBody = `
Dear [RECIPIENT],

Staff List for ${event_name}

[CUSTOM MESSAGE HERE]

Best regards,
[YOUR NAME/COMPANY]
`;
```

---

## 📈 Future Enhancements

### Phase 2: Reporting & Communications
- [ ] Generate talent summary reports
- [ ] Generate active events calendar
- [ ] Generate team roster PDFs
- [ ] Email approval workflows

### Phase 3: Workflow Automation
- [ ] Smart commands (/create, /approve, /assign)
- [ ] Message reaction-based approvals
- [ ] Scheduled email sends
- [ ] Audit trail logging

### Phase 4: Client Portal Integration
- [ ] Private client channels
- [ ] Client dashboard access
- [ ] Client document sharing
- [ ] Client status updates

---

## 🚨 Troubleshooting

### Problem: Files not uploading
**Solution:**
- Check Supabase `admin-files` bucket exists
- Verify SUPABASE_ANON_KEY has bucket access permissions
- Check browser console for specific error message

### Problem: Chat history not loading
**Solution:**
- Verify database tables were created
- Check SUPABASE_URL and keys in environment
- Try: `SELECT COUNT(*) FROM admin_chat_messages;` in Supabase SQL editor

### Problem: Job posting parser not recognizing text
**Solution:**
- Add more regex patterns to `parseJobPosting()` function
- Test parser with specific job posting format
- Log parser output to debug

### Problem: PDF generation slow or failing
**Solution:**
- Check browser console for jsPDF errors
- Verify html2canvas library installed
- Reduce number of fields in staff list
- Try in different browser

### Problem: Email not sending
**Solution:**
- Verify SendGrid API key in environment
- Check email recipient is valid format
- Look for email service error logs
- Manually test email service

---

## 📝 Database Schema Reference

### admin_chat_messages
```sql
- id (UUID) - Primary key
- admin_id (TEXT) - User ID
- admin_name (TEXT) - User's display name
- message (TEXT) - Message content
- message_type (VARCHAR) - 'text', 'system', 'action'
- thread_id (UUID) - Parent message for threads
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- deleted_at (TIMESTAMP) - Soft delete
```

### admin_chat_files
```sql
- id (UUID) - Primary key
- message_id (UUID) - Associated message
- file_name (TEXT) - Original filename
- file_url (TEXT) - Supabase storage URL
- file_type (VARCHAR) - MIME type
- file_size (BIGINT) - Bytes
- category (VARCHAR) - 'job_posting', 'training', etc.
- uploaded_by (TEXT) - User ID
- uploaded_by_name (TEXT) - User's name
- created_at (TIMESTAMP)
- metadata (JSONB) - Additional data
- version (INT) - Version number
```

### staff_list_generations
```sql
- id (UUID) - Primary key
- event_id (UUID) - Associated event
- event_name (TEXT) - Event display name
- generated_by (TEXT) - User ID
- generated_by_name (TEXT) - User's name
- pdf_url (TEXT) - Generated PDF URL
- talent_data (JSONB) - Talent snapshot
- editable_fields (JSONB) - User edits
- status (VARCHAR) - 'draft', 'generated', 'emailed'
- created_at (TIMESTAMP)
- generated_at (TIMESTAMP)
- emailed_to (TEXT) - Recipient email
- emailed_at (TIMESTAMP)
```

---

## 📞 Support & Questions

For issues or questions about implementation:

1. Check the troubleshooting section above
2. Review component code comments
3. Check Supabase SQL editor for table status
4. Enable browser console debugging

---

## ✅ Implementation Checklist

- [ ] Supabase tables created via SQL migration
- [ ] Supabase storage buckets created
- [ ] Environment variables configured
- [ ] Dependencies installed (jspdf, html2canvas, @supabase/supabase-js)
- [ ] API routes connected via Vercel
- [ ] React components integrated into app
- [ ] CSS styling imported
- [ ] Initial test completed
- [ ] Database query verified working
- [ ] File upload tested
- [ ] Chat messages working
- [ ] Job posting parser tested
- [ ] Staff list generation tested
- [ ] PDF generation tested
- [ ] Email integration tested
- [ ] Mobile responsive tested
- [ ] Ready for production deployment

---

## 🎉 What's Next?

**Immediate (Today):**
1. Set up Supabase database
2. Configure environment variables
3. Install dependencies
4. Test basic chat functionality

**This Week (Phase 2):**
1. Add report generation (/report command)
2. Add email approval workflows
3. Add message reactions for approvals

**Next Week (Phase 3):**
1. Add smart commands
2. Add scheduled actions
3. Build audit trail

**Future (Phase 4):**
1. Client portal access
2. Client document sharing
3. Client dashboard

---

**Built with ❤️ for Joey - Ready to make ImmerseForge command center awesome!**
