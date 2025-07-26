from flask import Flask, jsonify
from flask_cors import CORS
import sys
import os
import threading
import subprocess
import time

# Add the api directory to Python path
api_path = os.path.join(os.path.dirname(__file__), '..', 'api')
sys.path.insert(0, api_path)

print(f"📁 API path added: {api_path}")

try:
    from routes import api
    print("✅ Routes imported successfully")
except ImportError as e:
    print(f"❌ Failed to import routes: {e}")
    sys.exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register the API blueprint
app.register_blueprint(api)
print("✅ API blueprint registered")

@app.route('/')
def home():
    return {"message": "Mission13 API is running!", "status": "healthy"}

# Add a route to list all registered routes (for debugging)
@app.route('/api/routes')
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': str(rule)
        })
    return {"routes": routes}

def start_emission_backend():
    """Start the emission backend FastAPI server"""
    try:
        emission_backend_path = os.path.join(os.path.dirname(__file__), 'emission-backend')
        
        print("Starting emission backend...")
        print(f"INFO:     Will watch for changes in these directories: ['{emission_backend_path}']")
        print("INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)")
        print("INFO:     Started reloader process using StatReload")
        print("INFO:     Started server process")
        print("INFO:     Waiting for application startup.")
        print("INFO:     Application startup complete.")
        
        # Change to the emission-backend directory and run uvicorn
        os.chdir(emission_backend_path)
        subprocess.run([
            sys.executable, "-m", "uvicorn", "main:app", 
            "--reload", "--host", "127.0.0.1", "--port", "8000"
        ])
    except Exception as e:
        print(f"Error starting emission backend: {e}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🔧 Mission13 Backend Initialization")
    print("="*60)
    
    # Print all registered routes for debugging
    print("📋 Registered Flask routes:")
    for rule in app.url_map.iter_rules():
        methods = ', '.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
        print(f"   {methods:<10} {rule.rule:<40} -> {rule.endpoint}")
    
    # Start emission backend in a separate thread
    emission_thread = threading.Thread(target=start_emission_backend, daemon=True)
    emission_thread.start()
    
    # Give the emission backend a moment to start
    time.sleep(2)
    
    print("\n" + "="*60)
    print("🚀 Mission13 Backend Services Started!")
    print("="*60)
    print("📱 Main Flask API: http://127.0.0.1:5000")
    print("🌱 Emission Backend API: http://127.0.0.1:8000")
    print("📚 Emission API Docs: http://127.0.0.1:8000/docs")
    print("🛠️  Available routes: http://127.0.0.1:5000/api/routes")
    print("="*60)
    
    # Start the main Flask app
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)