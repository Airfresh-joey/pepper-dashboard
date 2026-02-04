/**
 * Admin Chat - Save Message Endpoint
 * POST /api/admin/chat/message
 * 
 * Saves admin chat messages to database
 * Supports: text messages, system messages, action triggers
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function saveMessage(req, res) {
  try {
    // Validate request
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { admin_id, admin_name, message, message_type = 'text', thread_id } = req.body;

    // Validate required fields
    if (!admin_id || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: admin_id, message' 
      });
    }

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Save message to database
    const { data, error } = await supabase
      .from('admin_chat_messages')
      .insert([{
        admin_id,
        admin_name: admin_name || 'Admin',
        message,
        message_type,
        thread_id: thread_id || null
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to save message',
        details: error.message 
      });
    }

    // Return created message
    return res.status(201).json({
      success: true,
      message: data[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

module.exports = saveMessage;
