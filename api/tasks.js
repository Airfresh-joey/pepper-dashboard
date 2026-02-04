// Pepper Command Center - Tasks API
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://prdhntwypgaakppvklbq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_BHzTCuZc4a499d8uIMBGyQ_CUXtajbH';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                return await getTasks(req, res);
            case 'POST':
                return await createTask(req, res);
            case 'PATCH':
                return await updateTask(req, res);
            case 'DELETE':
                return await deleteTask(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
};

async function getTasks(req, res) {
    const { project_id, status, source } = req.query;

    let query = supabase.from('tasks').select('*');

    if (project_id) query = query.eq('project_id', project_id);
    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source', source);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return res.status(200).json(data);
}

async function createTask(req, res) {
    const {
        project_id,
        title,
        description = '',
        status = 'not-started',
        type = 'task',
        priority = 'medium',
        source = 'api',
        slack_message_id = null,
        assignee = null
    } = req.body;

    if (!project_id || !title) {
        return res.status(400).json({ error: 'project_id and title are required' });
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            project_id,
            title,
            description,
            status,
            type,
            priority,
            source,
            slack_message_id,
            assignee
        }])
        .select()
        .single();

    if (error) throw error;
    return res.status(201).json({ success: true, task: data });
}

async function updateTask(req, res) {
    const { id, ...updates } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Task id is required' });
    }

    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return res.status(200).json({ success: true, task: data });
}

async function deleteTask(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Task id is required' });
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return res.status(200).json({ success: true });
}
