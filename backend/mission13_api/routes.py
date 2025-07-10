from flask import Blueprint, request, jsonify
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from chatbot import get_response
from daily_challenge import daily_challenge_manager

api_blueprint = Blueprint('api', __name__, url_prefix='/api')

@api_blueprint.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for frontend connection testing"""
    return jsonify({
        "status": "healthy",
        "message": "Mission13 API is running",
        "timestamp": "2025-07-06"
    }), 200

@api_blueprint.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        response = get_response(message)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/challenges', methods=['GET'])
def challenges():
    """Get challenges (returns current daily challenge)"""
    try:
        daily_challenge = daily_challenge_manager.get_daily_challenge()
        return jsonify([daily_challenge]), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get challenges: {str(e)}'}), 500

@api_blueprint.route('/daily-challenge', methods=['GET'])
def daily_challenge():
    """Get the current daily challenge with countdown timer"""
    try:
        challenge = daily_challenge_manager.get_daily_challenge()
        print(f"Serving AI-generated challenge: {challenge['title']} for {challenge['date']}")
        return jsonify(challenge), 200
    except Exception as e:
        print(f"Error getting daily challenge: {e}")
        return jsonify({'error': f'Failed to get daily challenge: {str(e)}'}), 500

@api_blueprint.route('/generate-new-challenge', methods=['POST'])
def generate_new_challenge():
    """Force generate a new daily challenge (for testing)"""
    try:
        # Clear current challenge to force regeneration
        daily_challenge_manager.current_challenge = None
        daily_challenge_manager.challenge_date = None
        
        challenge = daily_challenge_manager.get_daily_challenge()
        print(f"Generated new challenge: {challenge['title']}")
        return jsonify(challenge), 200
    except Exception as e:
        print(f"Error generating new challenge: {e}")
        return jsonify({'error': f'Failed to generate new challenge: {str(e)}'}), 500