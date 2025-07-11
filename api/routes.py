from flask import Blueprint, request, jsonify
import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from chatbot import get_response
from daily_challenge import daily_challenge_manager
from auth import auth

api = Blueprint('api', __name__)

# Add the new authentication routes
@api.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract user data
        user_data = {
            'firstName': data.get('firstName', ''),
            'lastName': data.get('lastName', ''),
            'email': data.get('email', ''),
            'password': data.get('password', ''),
            'confirmPassword': data.get('confirmPassword', '')
        }
        
        # Check if passwords match
        if user_data['password'] != user_data['confirmPassword']:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Register user
        success, message = auth.register_user(user_data)
        
        if success:
            return jsonify({
                "success": True,
                "message": message
            }), 201
        else:
            return jsonify({
                "success": False,
                "error": message
            }), 400
            
    except Exception as e:
        print(f"Registration endpoint error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@api.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')
        
        # Get user from database
        user = auth.get_user_by_email(email)
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Verify password
        if not auth.verify_password(password, user['password']):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Return user data (without password)
        user_data = {
            "id": str(user['_id']),
            "firstName": user['firstName'],
            "lastName": user['lastName'],
            "email": user['email'],
            "profile": user.get('profile', {}),
            "preferences": user.get('preferences', {}),
            "stats": user.get('stats', {})
        }
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user_data
        }), 200
        
    except Exception as e:
        print(f"Login endpoint error: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Keep all your existing routes
@api.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    try:
        response = get_response(message)
        return jsonify({'response': response}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/challenges', methods=['GET'])
def challenges():
    try:
        # Get the current daily challenge
        daily_challenge = daily_challenge_manager.get_daily_challenge()
        
        # Return as a list with the single daily challenge
        challenges_data = [daily_challenge]
        
        return jsonify(challenges_data), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get daily challenge: {str(e)}'}), 500

@api.route('/api/daily-challenge', methods=['GET'])
def daily_challenge():
    """Get the current daily challenge with countdown timer"""
    try:
        challenge = daily_challenge_manager.get_daily_challenge()
        return jsonify(challenge), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get daily challenge: {str(e)}'}), 500

@api.route('/api/generate-new-challenge', methods=['POST'])
def generate_new_challenge():
    """Force generate a new daily challenge (for testing purposes)"""
    try:
        # Remove the existing challenge file to force regeneration
        challenges_file = os.path.join(os.path.dirname(__file__), '..', 'backend', 'daily_challenges.json')
        if os.path.exists(challenges_file):
            os.remove(challenges_file)
        
        challenge = daily_challenge_manager.get_daily_challenge()
        return jsonify(challenge), 200
    except Exception as e:
        return jsonify({'error': f'Failed to generate new challenge: {str(e)}'}), 500