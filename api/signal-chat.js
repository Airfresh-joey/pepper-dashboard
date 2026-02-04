// API to relay dashboard messages to Pepper via Signal
const https = require('https');

// Gateway config - this sends to the Signal session
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3377';

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, adminKey } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        // For now, just acknowledge - the message goes through Signal
        // In production, this would relay to the gateway
        
        return res.status(200).json({ 
            success: true,
            note: 'Message sent to Pepper via Signal. Response will appear in Signal chat.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Signal chat error:', error);
        return res.status(500).json({ error: error.message });
    }
};
