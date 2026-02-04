// Webhook to receive ElevenLabs conversation transcripts
// Saves transcripts and can forward to Signal

const crypto = require('crypto');
require('dotenv').config({ path: require('path').join(process.env.HOME, 'clawd/.env') });
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET;

// In-memory storage (for demo - would use DB in production)
let recentTranscripts = [];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ElevenLabs-Signature');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - return recent transcripts
    if (req.method === 'GET') {
        return res.status(200).json({
            transcripts: recentTranscripts.slice(-10),
            count: recentTranscripts.length
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        const timestamp = new Date().toISOString();
        
        console.log('Voice webhook received:', timestamp);
        console.log('Data:', JSON.stringify(data, null, 2));
        
        // Extract conversation details
        const transcript = {
            timestamp,
            conversation_id: data.conversation_id || data.id,
            agent_id: data.agent_id,
            status: data.status,
            transcript: data.transcript || [],
            duration: data.call_duration_secs,
            raw: data
        };
        
        // Store transcript
        recentTranscripts.push(transcript);
        
        // Keep only last 50
        if (recentTranscripts.length > 50) {
            recentTranscripts = recentTranscripts.slice(-50);
        }
        
        // Log conversation summary
        if (data.transcript && Array.isArray(data.transcript)) {
            console.log('=== VOICE CONVERSATION ===');
            data.transcript.forEach(turn => {
                const role = turn.role === 'agent' ? 'Pepper' : 'Joey';
                console.log(`${role}: ${turn.message}`);
            });
            console.log('========================');
        }
        
        return res.status(200).json({ 
            received: true,
            conversation_id: transcript.conversation_id,
            timestamp
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
};
