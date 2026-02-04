// Custom LLM endpoint for ElevenLabs that includes Signal context
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Store recent Signal context (would be updated by webhook in production)
let signalContext = `Recent Signal conversation context:
- Working on pepper-dashboard.vercel.app
- Setting up voice Pepper with ElevenLabs
- Joey wants voice and Signal Pepper to be connected
- Dashboard has usage tracking, chat, voice features
- Team: Krista (operations), Kimberly (sales)
- Projects: ImmerseForge, Air Fresh Marketing, Humming Agent AI
`;

function callClaude(messages, systemPrompt) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 300,
            system: systemPrompt,
            messages: messages
        });

        const options = {
            hostname: 'api.anthropic.com',
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    
    // Update context endpoint
    if (req.method === 'POST' && req.url.includes('update-context')) {
        signalContext = req.body.context || signalContext;
        return res.status(200).json({ updated: true });
    }

    try {
        const { messages } = req.body;
        
        const systemPrompt = `You are Pepper, Joey's AI assistant. Be natural and helpful.

${signalContext}

Be conversational, warm, and direct. Keep responses short for voice.`;

        const result = await callClaude(messages || [], systemPrompt);
        const response = result.content?.[0]?.text || "Sorry, I didn't catch that.";
        
        return res.status(200).json({ response });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
