// ElevenLabs Conversational AI Connection
const AGENT_ID = 'agent_5401kgazy4nne67ra11fcyprrbhm';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Return agent config for client-side connection
    return res.status(200).json({
        agentId: AGENT_ID,
        // Signed URL would go here for secure connections
    });
};
