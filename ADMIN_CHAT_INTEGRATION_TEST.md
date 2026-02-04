# Admin Chat Hub - Integration Test Guide

**Purpose:** Verify all components work together correctly  
**Time Required:** ~30 minutes  
**Prerequisites:** Phase 1 fully deployed & running

---

## Pre-Test Checklist

- [ ] Supabase tables created
- [ ] Storage buckets created  
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Dev server running (`npm run dev`)
- [ ] Admin Chat component loaded in browser

---

## Test Suite 1: Chat System

### Test 1.1: Send Basic Message

```
Action:
1. Navigate to Admin Chat page
2. Type: "Testing admin chat system"
3. Press: Enter

Expected Result:
✅ Message appears in chat history immediately
✅ Timestamp shows current time
✅ Admin name displays (default: "Admin")
✅ No console errors
✅ Message saved to Supabase (check DB)

Verification:
SELECT * FROM admin_chat_messages ORDER BY created_at DESC LIMIT 1;
Should show your test message
```

### Test 1.2: Multiple Messages

```
Action:
1. Send 3 messages in sequence
2. Each with different content

Expected Result:
✅ All 3 appear in correct order (oldest first)
✅ Each has unique timestamp
✅ Scroll to bottom shows latest message
✅ No duplicate messages

Verification:
SELECT COUNT(*) FROM admin_chat_messages;
Should increase by 3
```

### Test 1.3: Chat History Load

```
Action:
1. Close browser tab
2. Open admin chat page again

Expected Result:
✅ Previous messages load automatically
✅ Shows "Loading chat history..." briefly
✅ Chat history appears (up to 50 most recent)
✅ Messages in correct order

Verification:
Check browser Network tab - should see:
GET /api/admin/chat/history?limit=50
Status: 200
Response includes messages
```

---

## Test Suite 2: File Upload

### Test 2.1: Drag-Drop Upload

```
Action:
1. Find a PDF file on your computer
2. Drag it into the "Drag files here" zone
3. Select category: "📋 Job Posting"
4. Click "Upload File"

Expected Result:
✅ File preview shows before upload
✅ Category changes to "Job Posting"
✅ Progress bar appears and completes
✅ "File uploaded successfully" message shows
✅ File appears in chat history with icon & link

Verification:
Check Supabase → Storage → admin-files bucket
Should contain your uploaded PDF with timestamp prefix
```

### Test 2.2: File Download

```
Action:
1. Click on uploaded file in chat
2. Or click the file link

Expected Result:
✅ File downloads to computer (or opens in new tab)
✅ File is complete and readable
✅ Original filename preserved

Verification:
Downloaded file should match uploaded file (same size, content)
```

### Test 2.3: Category Auto-Detection

```
Action:
1. Create test files:
   - job_posting.txt
   - training_material.pdf
   - client_info.doc
2. Upload each one

Expected Result:
✅ job_posting.txt → Auto-selects "Job Posting"
✅ training_material.pdf → Auto-selects "Training Material"
✅ client_info.doc → Auto-selects "Client Information"

Verification:
SELECT * FROM admin_chat_files;
Each file should have correct category
```

### Test 2.4: Large File Upload

```
Action:
1. Create a large file (~50MB)
2. Upload via drag-drop
3. Watch progress indicator

Expected Result:
✅ Progress bar shows accurate percentage
✅ File uploads without timeout
✅ Completes successfully
✅ File accessible in Supabase

Verification:
File appears in storage bucket with correct size
```

---

## Test Suite 3: Job Posting Parser

### Test 3.1: Parse Simple Job Posting

```
Action:
1. Click "📋 Job Posting" button in header
2. Paste text:
   "
   Position: Brand Ambassador
   Date: February 15, 2026
   Time: 2:00 PM
   Location: Denver Convention Center
   Positions: 5
   Pay: $25/hour
   Requirements: Professional appearance, event experience
   "
3. Click "Parse Job Posting"

Expected Result:
✅ Form appears with parsed fields
✅ Job Title: "Brand Ambassador"
✅ Date: "02/15/2026"
✅ Time: "2:00 PM"
✅ Location: "Denver Convention Center"
✅ Number of Positions: "5"
✅ Pay Rate: "$25"

Verification:
Check console - no JavaScript errors
Check Supabase → job_posting_parsed table
Should have one record with parsed_data JSON
```

### Test 3.2: Fill Missing Details

```
Action:
1. From previous test, form still open
2. Change Job Title to: "VIP Brand Ambassador"
3. Add Requirements: "Must have transportation"
4. Click "Create Calendar Event"

Expected Result:
✅ Form accepts changes
✅ No validation errors
✅ Event creation initiates
✅ Success message shows (or redirect to calendar)

Verification:
Check Supabase → admin_actions table
Should have new record with status 'completed'
```

### Test 3.3: Partial Job Data

```
Action:
1. Paste minimal text:
   "Job: Event Coordinator, Date: 2/20"
2. Click "Parse Job Posting"

Expected Result:
✅ Parses available data:
   - Job Title: "Event Coordinator"
   - Date: "02/20"
✅ Other fields empty (ready for user input)
✅ Shows confidence indicators

Verification:
Form shows extracted data with blanks for missing fields
User can fill in blanks before creating event
```

---

## Test Suite 4: Staff List Generation

### Test 4.1: Generate Staff List

```
Action:
1. Click "👥 Staff List" button in header
2. Enter Event Name: "Denver Fashion Week Feb 5"
3. Click "Generate Staff List"

Expected Result:
✅ Staff list preview appears
✅ Table shows talent assigned to event
✅ Columns: Name, Last Initial, Phone, Shift, Location, Photo
✅ At least 1 staff member shown
✅ All fields are editable

Verification:
Check Supabase → staff_list_generations table
Should have new record with status 'draft'
talent_data JSON contains staff details
```

### Test 4.2: Edit Staff List

```
Action:
1. From staff list preview
2. Click on a name field
3. Change: "John Smith" → "John S. Smith"
4. Click on phone field
5. Change phone number
6. Click on location field
7. Change location

Expected Result:
✅ All fields are editable inline
✅ Changes reflected in table immediately
✅ No database update yet (still 'draft')

Verification:
Changes visible in preview only
Supabase record still shows original data
```

### Test 4.3: Remove Staff Member

```
Action:
1. From editable staff list
2. Click "✕" button next to a staff member

Expected Result:
✅ Staff member row removed from preview
✅ Staff count decreases by 1
✅ Table updates immediately

Verification:
Row no longer visible in preview
Original data in Supabase unchanged
```

### Test 4.4: Generate PDF

```
Action:
1. From staff list preview with edits
2. Click "📥 Download PDF"
3. Wait for PDF generation
4. File downloads

Expected Result:
✅ PDF file downloads to computer
✅ Filename: "StaffList-Denver Fashion Week Feb 5-[timestamp].pdf"
✅ PDF is readable
✅ PDF contains:
   - ImmerseForge branding
   - Event name
   - Generated date/time
   - Staff table with edits applied
   - Professional formatting

Verification:
Open PDF file - should look professional
All edits should be reflected in PDF
Column headers clearly visible
```

### Test 4.5: Email Staff List

```
Action:
1. From staff list preview
2. Enter email: "test@example.com"
3. Click "📧 Email & Download"
4. Wait for processing

Expected Result:
✅ PDF generated and downloads
✅ Confirmation message: "Staff list emailed to test@example.com"
✅ No errors in console

Verification:
Check Supabase → staff_list_generations
status changed to 'emailed'
emailed_to = test@example.com
emailed_at has timestamp

Note: Actual email delivery depends on SendGrid configuration
```

---

## Test Suite 5: Database Integration

### Test 5.1: Verify Tables Exist

```
SQL Query:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

Expected Result:
✅ admin_chat_messages
✅ admin_chat_files
✅ admin_actions
✅ admin_chat_reactions
✅ job_posting_parsed
✅ staff_list_generations

All 6 tables should exist
```

### Test 5.2: Check Data Integrity

```
SQL Query:
SELECT 
  (SELECT COUNT(*) FROM admin_chat_messages) as messages,
  (SELECT COUNT(*) FROM admin_chat_files) as files,
  (SELECT COUNT(*) FROM job_posting_parsed) as jobs,
  (SELECT COUNT(*) FROM staff_list_generations) as staff_lists;

Expected Result:
✅ All counts match your test actions
✅ No negative numbers
✅ Data persists across page refreshes
```

### Test 5.3: Check Indexes

```
SQL Query:
SELECT indexname FROM pg_indexes 
WHERE tablename = 'admin_chat_messages';

Expected Result:
✅ idx_admin_chat_messages_admin_id
✅ idx_admin_chat_messages_created_at
✅ idx_admin_chat_messages_thread_id

All indexes should exist for performance
```

---

## Test Suite 6: API Endpoints

### Test 6.1: Message API

```
Using Postman or curl:

POST http://localhost:3000/api/admin/chat/message
Body: {
  "admin_id": "test-admin",
  "admin_name": "Test Admin",
  "message": "API test message",
  "message_type": "text"
}

Expected Response (201):
{
  "success": true,
  "message": {
    "id": "uuid",
    "admin_id": "test-admin",
    "message": "API test message",
    "created_at": "2026-02-02T..."
  },
  "timestamp": "2026-02-02T..."
}
```

### Test 6.2: History API

```
Using Postman or curl:

GET http://localhost:3000/api/admin/chat/history?limit=10

Expected Response (200):
{
  "success": true,
  "messages": [
    { message data... },
    { message data... }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": X,
    "hasMore": boolean
  }
}
```

### Test 6.3: Job Parser API

```
Using Postman or curl:

POST http://localhost:3000/api/admin/chat/parse-job
Body: {
  "text": "Position: Manager, Date: 2/15/2026",
  "created_by": "test-admin",
  "created_by_name": "Test Admin"
}

Expected Response (200):
{
  "success": true,
  "parsed_data": {
    "title": "Manager",
    "date": "02/15/2026",
    ...
  },
  "job_record_id": "uuid"
}
```

---

## Test Suite 7: UI/UX

### Test 7.1: Responsive Design

```
Test on:
1. Desktop (1920x1080)
2. Laptop (1366x768)
3. Tablet (768x1024)
4. Mobile (375x667)

Expected Result:
✅ All elements visible without horizontal scroll
✅ Chat readable on all screen sizes
✅ File upload works on touch devices
✅ Forms responsive on mobile
✅ Buttons large enough to tap
```

### Test 7.2: Keyboard Navigation

```
Actions:
1. Tab through form fields
2. Enter to send messages
3. Escape to close forms
4. Shift+Tab to go backwards

Expected Result:
✅ All interactive elements keyboard accessible
✅ Focus visible with borders/highlighting
✅ Enter sends messages
✅ Logical tab order
```

### Test 7.3: Loading States

```
Actions:
1. Watch chat history load
2. Upload large file
3. Generate staff list
4. Send message during slow network

Expected Result:
✅ "Loading..." messages appear
✅ Buttons disabled during operations
✅ Progress indicators visible
✅ No stuck/frozen UI
```

### Test 7.4: Error Handling

```
Actions:
1. Try uploading without selecting file
2. Try sending empty message
3. Try without required fields in forms
4. Check browser console

Expected Result:
✅ Form validation prevents bad submissions
✅ Error messages appear
✅ User can correct and retry
✅ No console errors/warnings
```

---

## Test Suite 8: Performance

### Test 8.1: Chat History Load Time

```
Action:
1. Open Admin Chat with 100+ messages
2. Measure load time
3. Check Network tab

Expected Result:
✅ Messages load in < 2 seconds
✅ API response < 1 second
✅ Page renders within 3 seconds total
✅ No network warnings/errors
```

### Test 8.2: File Upload Speed

```
Action:
1. Upload 10MB file
2. Measure upload time
3. Check Network tab

Expected Result:
✅ Upload completes within 30 seconds
✅ Progress bar accurate
✅ File accessible immediately after upload
✅ No stalling or timeouts
```

### Test 8.3: PDF Generation Speed

```
Action:
1. Generate PDF with 20 staff members
2. Measure generation time

Expected Result:
✅ PDF generates within 5 seconds
✅ No browser hang/freeze
✅ PDF downloads without delay
✅ Professional quality output
```

### Test 8.4: Database Query Performance

```
SQL:
EXPLAIN ANALYZE SELECT * FROM admin_chat_messages 
WHERE admin_id = 'test' 
ORDER BY created_at DESC 
LIMIT 50;

Expected Result:
✅ Query completes < 100ms
✅ Uses index on admin_id
✅ Uses index on created_at
✅ No sequential scans warning
```

---

## Test Results Summary

Create a test results document:

```markdown
# Admin Chat Hub - Test Results

Date: [DATE]
Tester: [NAME]
Environment: [DEV/PROD]
Build: Phase 1 - Complete

## Summary
- Tests Passed: [ ] / 32
- Tests Failed: [ ]
- Blockers: [ ] None / [ ] List below

## Issues Found
1. [Issue] - [Priority] - [Status]
2. [Issue] - [Priority] - [Status]

## Performance Metrics
- Chat load time: [X]ms
- File upload speed: [X]MB/s
- PDF generation: [X]s
- Database queries: [X]ms avg

## Deployment Ready?
✅ YES / ❌ NO

## Sign-off
Tested by: [Name]
Date: [Date]
Approved: [Name]
```

---

## Troubleshooting During Tests

### Issue: Messages not appearing
**Solution:**
1. Check browser console for errors
2. Verify Supabase URL/keys in env
3. Check Supabase database is accessible
4. Try POST to API directly with curl

### Issue: File upload fails
**Solution:**
1. Check file size (should be <100MB)
2. Verify admin-files bucket exists
3. Check file permissions in Supabase
4. Try different file type

### Issue: PDF won't generate
**Solution:**
1. Check jsPDF library installed
2. Check html2canvas installed
3. Look for JavaScript errors in console
4. Try with smaller staff list

### Issue: Email not sending
**Solution:**
1. Verify SendGrid key configured
2. Check recipient email format
3. Look for email service errors in logs
4. Test with curl first

### Issue: Tests slow
**Solution:**
1. Close other browser tabs
2. Clear browser cache
3. Check internet speed
4. Use localhost instead of domain

---

## Next Steps After Testing

✅ If all tests pass:
1. Commit code to git
2. Deploy to staging
3. Run tests again on staging
4. Deploy to production
5. Monitor for errors

❌ If tests fail:
1. Document issues
2. Fix failing components
3. Re-run failing tests only
4. Repeat until all pass
5. Then deploy

---

**Test Status: [PENDING]**  
**Last Updated: February 2, 2026**

---

Good luck with testing! 🚀
