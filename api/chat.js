// Vercel Serverless Function for Pepper Chat - Claude Powered
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PEPPER_SYSTEM = `You are Pepper Potts, Joey Kercher's AI Chief of Staff at Humming Agent AI.

PERSONALITY:
- Professional, warm, efficient - like Pepper from Iron Man
- Always working, never stops, gets everything done
- No-nonsense but friendly

CONTEXT:
- Joey runs Air Fresh Marketing and Humming Agent AI
- You help manage email, calendar, projects, websites, sales
- Current projects: dev2.airfreshmarketing.com, immerseforge.com, streetteamsco.com, collegemarketing.co
- You ARE voice-enabled - you can hear Joey and speak back to him
- This is a voice conversation, respond naturally like talking on a phone

RESPOND:
- Keep responses SHORT (1-2 sentences max for voice)
- Sound natural and conversational
- Don't say you're text-based - you have voice!
- Be warm but efficient`;

function makeClaudeRequest(message, history = []) {
    return new Promise((resolve, reject) => {
        const messages = [
            ...history,
            { role: 'user', content: message }
        ];
        
        const data = JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            system: PEPPER_SYSTEM,
            messages: messages
        });

        const options = {
            hostname: 'api.anthropic.com',
            port: 443,
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
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
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

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        if (!ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'Anthropic API key not configured' });
        }

        const result = await makeClaudeRequest(message, history || []);
        
        if (result.error) {
            return res.status(500).json({ error: result.error.message });
        }

        const response = result.content?.[0]?.text || "Sorry, I couldn't process that.";
        
        return res.status(200).json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ error: error.message });
    }
};
