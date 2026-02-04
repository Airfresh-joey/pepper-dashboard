// Pepper Command Center - Projects API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://prdhntwypgaakppvklbq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_BHzTCuZc4a499d8uIMBGyQ_CUXtajbH';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                return await getProjects(req, res);
            case 'POST':
                return await createProject(req, res);
            case 'PATCH':
                return await updateProject(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};

async function getProjects(req, res) {
    const { slack_channel, status, name } = req.query;

    let query = supabase.from('projects').select('*');

    if (slack_channel) query = query.eq('slack_channel', slack_channel);
    if (status) query = query.eq('status', status);
    if (name) query = query.ilike('name', `%${name}%`);

    query = query.order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return res.status(200).json(data);
}

async function createProject(req, res) {
    const {
        name,
        description = '',
        color = '#8b5cf6',
        status = 'active',
        slack_channel = null
    } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }

    const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description, color, status, slack_channel }])
        .select()
        .single();

    if (error) throw error;
    return res.status(201).json({ success: true, project: data });
}

async function updateProject(req, res) {
    const { id, ...updates } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Project id is required' });
    }

    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return res.status(200).json({ success: true, project: data });
}
