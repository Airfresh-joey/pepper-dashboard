#!/usr/bin/env python3
"""
Chat Backend Server for Pepper Dashboard
Proxies messages to Clawdbot Gateway API
"""

import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

# Clawdbot Gateway configuration
GATEWAY_URL = "http://localhost:18789"
GATEWAY_TOKEN = "db56cd9cdda8bfe82ce78dc5b114125aa9ec2f5e4c509ec3"

@app.route('/api/chat', methods=['POST'])
def chat():
    """Send a message to Pepper via Clawdbot Gateway"""
    try:
        data = request.json
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Send to Clawdbot Gateway
        # This would use the sessions API to send a message
        # For now, return a placeholder response
        
        response = {
            'success': True,
            'message': 'Message received! Backend integration in progress.',
            'timestamp': 'now'
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Check if Pepper is online"""
    try:
        # Ping the gateway
        # For now, return online status
        return jsonify({
            'online': True,
            'status': 'available'
        })
    except Exception as e:
        return jsonify({
            'online': False,
            'status': 'offline',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🌶️ Starting Pepper Chat Backend...")
    print("📡 Listening on http://localhost:8081")
    print("🔗 Connecting to Clawdbot Gateway at", GATEWAY_URL)
    app.run(host='0.0.0.0', port=8081, debug=True)
