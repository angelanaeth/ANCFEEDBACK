#!/usr/bin/env python3
"""
TrainingPeaks OAuth Forwarder
This script runs on port 5000 and forwards OAuth callbacks to the sandbox.
"""

from flask import Flask, request, redirect
import sys

app = Flask(__name__)

# Your sandbox URL
SANDBOX_URL = "https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai"

@app.route('/handle_trainingpeaks_authorization')
def callback():
    """Forward TrainingPeaks OAuth callback to sandbox"""
    code = request.args.get('code')
    
    if not code:
        return "Error: No authorization code received", 400
    
    print(f"✅ Received OAuth code: {code[:20]}...")
    print(f"🔄 Forwarding to sandbox: {SANDBOX_URL}")
    
    # Forward to sandbox with the code
    forward_url = f'{SANDBOX_URL}/handle_trainingpeaks_authorization?code={code}'
    
    print(f"📤 Redirecting to: {forward_url}")
    
    return redirect(forward_url)

@app.route('/')
def index():
    return """
    <html>
    <head><title>TrainingPeaks OAuth Forwarder</title></head>
    <body style="font-family: Arial; padding: 40px;">
        <h1>🔄 TrainingPeaks OAuth Forwarder</h1>
        <p>This server is running on <strong>http://127.0.0.1:5000</strong></p>
        <p>It forwards OAuth callbacks to the Angela Coach sandbox.</p>
        <hr>
        <h2>Status: ✅ Ready</h2>
        <p>Waiting for TrainingPeaks OAuth callback...</p>
        <hr>
        <h3>Test OAuth Flow:</h3>
        <p>Click: <a href="https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach" target="_blank">
            Start Coach OAuth Flow
        </a></p>
    </body>
    </html>
    """

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 TrainingPeaks OAuth Forwarder")
    print("=" * 60)
    print(f"Running on: http://127.0.0.1:5000")
    print(f"Forwarding to: {SANDBOX_URL}")
    print("=" * 60)
    print("\n✅ Server starting...\n")
    
    try:
        app.run(host='127.0.0.1', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped")
        sys.exit(0)
