// ElevenLabs Text-to-Speech API for Pepper's Voice
const https = require('https');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Rachel voice - professional female, similar to Pepper
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

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
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text required' });
        }

        if (!ELEVENLABS_API_KEY) {
            return res.status(500).json({ error: 'ElevenLabs API key not configured' });
        }

        const audioBuffer = await generateSpeech(text);
        
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);

    } catch (error) {
        console.error('TTS error:', error);
        return res.status(500).json({ error: error.message });
    }
};

function generateSpeech(text) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        });

        const options = {
            hostname: 'api.elevenlabs.io',
            port: 443,
            path: `/v1/text-to-speech/${VOICE_ID}`,
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            }
        };

        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}
