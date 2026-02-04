/**
 * Admin Chat - History Endpoint
 * GET /api/admin/chat/history
 * 
 * Retrieves chat history with files and reactions
 * Query params:
 * - limit: number of messages (default 50)
 * - offset: pagination offset (default 0)
 * - thread_id: get messages from specific thread (optional)
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function getChatHistory(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { limit = 50, offset = 0, thread_id } = req.query;

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Build query
    let query = supabase
      .from('admin_chat_messages')
      .select(`
        id,
        admin_id,
        admin_name,
        message,
        message_type,
        thread_id,
        created_at,
        updated_at,
        admin_chat_files(
          id,
          file_name,
          file_url,
          file_type,
          file_size,
          category,
          uploaded_by_name,
          created_at
        ),
        admin_chat_reactions(
          id,
          user_id,
          user_name,
          emoji,
          created_at
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by thread if specified
    if (thread_id) {
      query = query.or(`id.eq.${thread_id},thread_id.eq.${thread_id}`);
    }

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Failed to retrieve chat history',
        details: error.message 
      });
    }

    // Reverse to show oldest first
    messages.reverse();

    return res.status(200).json({
      success: true,
      messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: count,
        hasMore: parseInt(offset) + parseInt(limit) < count
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

module.exports = getChatHistory;
