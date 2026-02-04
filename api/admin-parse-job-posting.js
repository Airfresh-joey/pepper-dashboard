/**
 * Admin Chat - Job Posting Parser
 * POST /api/admin/chat/parse-job
 * 
 * Parses job posting text and extracts key information
 * Returns structured data for user to review/edit
 * Can trigger calendar event creation
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Simple job posting parser
function parseJobPosting(text) {
  const parsed = {
    title: null,
    date: null,
    time: null,
    location: null,
    positions: null,
    pay_rate: null,
    requirements: null,
    description: text
  };

  // Extract job title (usually first line or after "Position:" etc)
  const titleMatch = text.match(/(?:position|title|job|role)[\s:]*([^\n]+)/i);
  if (titleMatch) {
    parsed.title = titleMatch[1].trim();
  }

  // Extract date (MM/DD/YYYY, MM-DD-YYYY, etc)
  const dateMatch = text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/);
  if (dateMatch) {
    parsed.date = dateMatch[1];
  }

  // Extract time
  const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);
  if (timeMatch) {
    parsed.time = timeMatch[1];
  }

  // Extract location/city
  const locationMatch = text.match(/(?:location|city|venue)[\s:]*([^\n,]+)/i);
  if (locationMatch) {
    parsed.location = locationMatch[1].trim();
  }

  // Extract number of positions
  const positionsMatch = text.match(/(\d+)\s*(?:position|spot|opening)/i);
  if (positionsMatch) {
    parsed.positions = parseInt(positionsMatch[1]);
  }

  // Extract pay rate
  const payMatch = text.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|\/|hour|hr|day)/i);
  if (payMatch) {
    parsed.pay_rate = payMatch[1];
  }

  // Extract requirements
  const reqMatch = text.match(/(?:requirement|skill|experience)[\s:]*([^\n]+(?:\n(?![^\s]).+)*)/i);
  if (reqMatch) {
    parsed.requirements = reqMatch[1].trim();
  }

  return parsed;
}

async function parseJobPosting(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { 
      text,
      message_id,
      created_by,
      created_by_name
    } = req.body;

    if (!text || !created_by) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, created_by' 
      });
    }

    // Parse the job posting
    const parsed = parseJobPosting(text);

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Save parsed result to database
    const { data: jobRecord, error: dbError } = await supabase
      .from('job_posting_parsed')
      .insert([{
        message_id: message_id || null,
        raw_text: text,
        parsed_data: parsed,
        created_by,
        status: 'draft'
      }])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to save parsed job posting',
        details: dbError.message 
      });
    }

    return res.status(200).json({
      success: true,
      parsed_data: parsed,
      job_record_id: jobRecord[0]?.id,
      message: 'Job posting parsed successfully. Please review and fill in missing details.',
      confidence: {
        title: parsed.title ? 'high' : 'low',
        date: parsed.date ? 'high' : 'low',
        location: parsed.location ? 'high' : 'low',
        positions: parsed.positions ? 'high' : 'low'
      }
    });

  } catch (error) {
    console.error('Error parsing job posting:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

module.exports = parseJobPosting;
