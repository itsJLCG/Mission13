from flask import Flask
from flask_cors import CORS
import sys
import os

# Add the api directory to Python path
api_path = os.path.join(os.path.dirname(__file__), '..', 'api')
sys.path.insert(0, api_path)

from routes import api

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.register_blueprint(api)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)