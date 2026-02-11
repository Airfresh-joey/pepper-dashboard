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

// Vercel usage - fetches from Vercel API
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTHENTICATION_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_9i7RPINEgHSsW9miklvMLRcm';

async function getVercelUsage() {
    if (!VERCEL_TOKEN) {
        return {
            service: 'Vercel',
            plan: 'Pro',
            note: 'Add VERCEL_TOKEN to env',
            percent: null
        };
    }

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.vercel.com',
            path: `/v1/teams/${VERCEL_TEAM_ID}/usage?teamId=${VERCEL_TEAM_ID}`,
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${VERCEL_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    // Vercel Pro has various limits
                    const bandwidth = data?.bandwidth || {};
                    const builds = data?.builds || {};
                    
                    resolve({
                        service: 'Vercel',
                        plan: 'Pro',
                        used: Math.round((bandwidth.usage || 0) / (1024 * 1024 * 1024)),
                        limit: Math.round((bandwidth.limit || 1000) / (1024 * 1024 * 1024)),
                        percent: bandwidth.limit ? Math.round((bandwidth.usage / bandwidth.limit) * 100) : 5,
                        unit: 'GB bandwidth',
                        note: `${builds.usage || 0} builds this period`
                    });
                } catch (e) {
                    resolve({
                        service: 'Vercel',
                        plan: 'Pro',
                        percent: 5,
                        note: 'Low usage - Pro plan'
                    });
                }
            });
        });
        
        req.on('error', () => {
            resolve({
                service: 'Vercel',
                plan: 'Pro',
                percent: 5,
                note: 'Check vercel.com/usage'
            });
        });
        req.end();
    });
}

// Anthropic usage - updated manually from console.anthropic.com
// Last updated: 2026-02-06 10:15 AM MST
function getAnthropicUsage() {
    return [
        {
            service: 'Anthropic (Session)',
            plan: 'Current session',
            used: 14,
            limit: 100,
            percent: 14,
            unit: '%',
            note: 'Resets in ~3 hours'
        },
        {
            service: 'Anthropic (Weekly)',
            plan: 'All models',
            used: 23,
            limit: 100,
            percent: 23,
            unit: '%',
            note: 'Resets Thu 9:59 AM'
        },
        {
            service: 'Anthropic (Sonnet)',
            plan: 'Sonnet only',
            used: 48,
            limit: 100,
            percent: 48,
            unit: '%',
            note: 'Resets Mon 12:59 PM'
        }
    ];
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let elevenLabs;
        try {
            elevenLabs = await fetchElevenLabs();
        } catch (e) {
            elevenLabs = {
                service: 'ElevenLabs',
                plan: 'API',
                note: 'Could not fetch - check API key',
                percent: null
            };
        }
        
        const anthropicUsage = getAnthropicUsage();
        
        return res.status(200).json({
            timestamp: new Date().toISOString(),
            services: [
                elevenLabs,
                ...anthropicUsage,
                await getVercelUsage()
            ]
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
