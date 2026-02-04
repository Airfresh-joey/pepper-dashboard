// API to fetch usage data from various services
const https = require('https');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

function fetchElevenLabs() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.elevenlabs.io',
            path: '/v1/user/subscription',
            method: 'GET',
            headers: { 'xi-api-key': ELEVENLABS_API_KEY }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve({
                        service: 'ElevenLabs',
                        plan: data.tier,
                        used: data.character_count,
                        limit: data.character_limit,
                        percent: Math.round((data.character_count / data.character_limit) * 100),
                        unit: 'characters',
                        resets: new Date(data.next_character_count_reset_unix * 1000).toLocaleDateString()
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const elevenLabs = await fetchElevenLabs();
        
        return res.status(200).json({
            timestamp: new Date().toISOString(),
            services: [
                elevenLabs,
                {
                    service: 'Anthropic',
                    plan: 'API',
                    note: 'Pay per use - check console.anthropic.com',
                    percent: null
                },
                {
                    service: 'Vercel',
                    plan: 'Pro',
                    note: 'Check vercel.com/usage',
                    percent: null
                }
            ]
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
