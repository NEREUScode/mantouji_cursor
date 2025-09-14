#!/usr/bin/env python3
"""
Simple test Flask app to verify basic functionality
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'Mantouji.ma API is running!',
        'status': 'healthy',
        'version': '1.0.0'
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'API is working correctly'
    })

if __name__ == '__main__':
    print("Starting Mantouji.ma API...")
    print("API will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    app.run(host='0.0.0.0', port=5000, debug=True)
