/**
 * Admin Chat - File Upload Endpoint
 * POST /api/admin/chat/file
 * 
 * Handles file uploads to admin chat
 * - Stores files in Supabase storage (`admin-files` bucket)
 * - Creates file record in database
 * - Supports: PDF, images, documents, any file type
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function handleFileUpload(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { 
      file_data,      // Base64 encoded file
      file_name,
      file_type,
      category,       // 'job_posting', 'training', 'contract', 'client_info', 'other'
      message_id,
      uploaded_by,
      uploaded_by_name
    } = req.body;

    // Validate required fields
    if (!file_data || !file_name || !uploaded_by) {
      return res.status(400).json({ 
        error: 'Missing required fields: file_data, file_name, uploaded_by' 
      });
    }

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedName = file_name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${timestamp}-${sanitizedName}`;

    // Decode base64 file data
    const buffer = Buffer.from(file_data.split(',')[1] || file_data, 'base64');

    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('admin-files')
      .upload(filePath, buffer, {
        contentType: file_type || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ 
        error: 'Failed to upload file',
        details: uploadError.message 
      });
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('admin-files')
      .getPublicUrl(filePath);

    // Create database record for the file
    const { data: fileRecord, error: dbError } = await supabase
      .from('admin_chat_files')
      .insert([{
        message_id: message_id || null,
        file_name,
        file_url: publicUrl,
        file_type,
        file_size: buffer.length,
        category: category || 'other',
        uploaded_by,
        uploaded_by_name: uploaded_by_name || 'Admin',
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalPath: filePath
        }
      }])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return success since file is uploaded
      return res.status(201).json({
        success: true,
        file_url: publicUrl,
        file_name,
        warning: 'File uploaded but database record may be incomplete'
      });
    }

    return res.status(201).json({
      success: true,
      file: fileRecord[0],
      file_url: publicUrl,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

module.exports = handleFileUpload;
