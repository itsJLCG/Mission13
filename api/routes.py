from flask import Blueprint, request, jsonify
import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

from chatbot import get_response
from daily_challenge import daily_challenge_manager

api = Blueprint('api', __name__)

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
        import os
        # Remove the existing challenge file to force regeneration
        challenges_file = os.path.join(os.path.dirname(__file__), '..', 'backend', 'daily_challenges.json')
        if os.path.exists(challenges_file):
            os.remove(challenges_file)
        
        challenge = daily_challenge_manager.get_daily_challenge()
        return jsonify(challenge), 200
    except Exception as e:
        return jsonify({'error': f'Failed to generate new challenge: {str(e)}'}), 500