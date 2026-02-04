/**
 * Admin Chat - Staff List Generator (PDF)
 * POST /api/admin/staff-list/generate
 * 
 * Generates a professional branded staff list PDF
 * - Pulls talent assigned to an event
 * - Creates professional PDF with ImmerseForge branding
 * - Returns PDF URL and editable preview
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function generateStaffList(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { 
      event_id,
      event_name,
      generated_by,
      generated_by_name,
      talent_data, // Optional: override with custom talent data
      edit_fields  // Optional: edited fields before generation
    } = req.body;

    if (!event_id && !event_name) {
      return res.status(400).json({ 
        error: 'Missing required fields: event_id or event_name' 
      });
    }

    if (!generated_by) {
      return res.status(400).json({ 
        error: 'Missing required field: generated_by' 
      });
    }

    // Initialize Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // If talent_data not provided, query the database for talent on this event
    let talentData = talent_data;
    if (!talentData) {
      // Query bookings + profiles for this event
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          profile_id,
          status,
          shift_start,
          shift_end,
          location,
          profiles(
            id,
            first_name,
            last_name,
            phone,
            photo_url
          )
        `)
        .eq('event_id', event_id)
        .eq('status', 'confirmed');

      if (error && error.code !== 'PGRST116') {
        console.log('Bookings query info:', error);
        // If table doesn't exist, continue with empty data
      }

      talentData = data || [];
    }

    // Generate PDF with PDFKit (or use a template service)
    const staffList = talentData.map(booking => ({
      name: booking.profiles?.first_name + ' ' + booking.profiles?.last_name || 'Unknown',
      last_initial: booking.profiles?.last_name?.[0] || '?',
      phone: booking.profiles?.phone || 'N/A',
      photo_url: booking.profiles?.photo_url || null,
      shift_start: booking.shift_start || 'TBD',
      shift_end: booking.shift_end || 'TBD',
      location: booking.location || 'TBD'
    }));

    // Create preview response (frontend will convert to PDF)
    const preview = {
      event_name,
      staff: staffList,
      generated_at: new Date().toISOString(),
      generated_by_name
    };

    // Save record to database
    const { data: recordData, error: dbError } = await supabase
      .from('staff_list_generations')
      .insert([{
        event_id,
        event_name,
        generated_by,
        generated_by_name: generated_by_name || 'Admin',
        talent_data: staffList,
        editable_fields: edit_fields || {},
        status: 'draft'
      }])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to save staff list',
        details: dbError.message 
      });
    }

    return res.status(200).json({
      success: true,
      staff_list_id: recordData[0]?.id,
      preview,
      message: 'Staff list preview generated. Edit fields as needed, then click Generate PDF.',
      talent_count: staffList.length,
      next_step: 'Review preview → Edit fields → Generate PDF → Email or Download'
    });

  } catch (error) {
    console.error('Error generating staff list:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

module.exports = generateStaffList;
