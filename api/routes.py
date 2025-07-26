from flask import Blueprint, request, jsonify
import sys
import os

from database import db_instance
import json
from bson import ObjectId
from datetime import datetime

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
        
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        email = data.get('email', '')
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"success": False, "message": "Email and password are required"}), 400
        
        # Get user from database
        user = auth.get_user_by_email(email)
        
        if not user:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
        
        # Verify password
        if not auth.verify_password(password, user['password']):
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
        
        # Return user data (without password)
        user_data = {
            "id": user.get('id', str(user.get('_id', ''))),
            "firstName": user['firstName'],
            "lastName": user['lastName'],
            "email": user['email'],
            "createdAt": user.get('createdAt', ''),
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
        return jsonify({"success": False, "message": "Internal server error"}), 500

@api.route('/api/user/profile', methods=['GET', 'PUT'])
def user_profile():
    """Get or update user profile"""
    try:
        if request.method == 'GET':
            # Get user profile
            email = request.args.get('email')
            if not email:
                return jsonify({"success": False, "message": "Email required"}), 400
            
            user = auth.get_user_by_email(email)
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404
            
            user_data = {
                "id": user.get('id', str(user.get('_id', ''))),
                "firstName": user['firstName'],
                "lastName": user['lastName'],
                "email": user['email'],
                "profile": user.get('profile', {}),
                "preferences": user.get('preferences', {})
            }
            
            return jsonify({"success": True, "user": user_data}), 200
            
        elif request.method == 'PUT':
            # Update user profile
            data = request.get_json()
            email = data.get('email')
            
            if not email:
                return jsonify({"success": False, "message": "Email required"}), 400
            
            # Update user data
            success, message = auth.update_user_profile(email, data)
            
            if success:
                return jsonify({"success": True, "message": message}), 200
            else:
                return jsonify({"success": False, "message": message}), 400
                
    except Exception as e:
        print(f"Profile endpoint error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

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

# Health check endpoint
@api.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API is running"}), 200


@api.route('/api/city-map/save', methods=['POST'])
def save_city_map():
    try:
        data = request.get_json()
        email = data.get('email')
        city_map = data.get('cityMap')
        
        if not email or not city_map:
            return jsonify({'success': False, 'message': 'Email and city map are required'}), 400
        
        # Get users collection
        users_collection = db_instance.get_users_collection()
        
        # Check if user exists and update/create city map
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Create city map document
        city_map_data = {
            'email': email,
            'cityMap': city_map,
            'updatedAt': datetime.utcnow(),
            'createdAt': datetime.utcnow() if 'cityMap' not in user else user.get('cityMap', {}).get('createdAt', datetime.utcnow())
        }
        
        # Update user document with city map
        result = users_collection.update_one(
            {'email': email},
            {
                '$set': {
                    'cityMap': city_map_data
                }
            }
        )
        
        if result.modified_count > 0 or result.matched_count > 0:
            return jsonify({'success': True, 'message': 'City map saved successfully'})
        else:
            return jsonify({'success': False, 'message': 'Failed to save city map'}), 500
        
    except Exception as e:
        print(f"Error saving city map: {e}")
        return jsonify({'success': False, 'message': 'Failed to save city map'}), 500

@api.route('/api/city-map/load', methods=['POST'])
def load_city_map():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        # Get users collection
        users_collection = db_instance.get_users_collection()
        
        # Find user and get city map
        user = users_collection.find_one({'email': email}, {'cityMap': 1})
        
        if user and 'cityMap' in user:
            city_map = user['cityMap']['cityMap']
            return jsonify({'success': True, 'cityMap': city_map})
        else:
            # Return empty city map if none exists
            return jsonify({'success': True, 'cityMap': None})
            
    except Exception as e:
        print(f"Error loading city map: {e}")
        return jsonify({'success': False, 'message': 'Failed to load city map'}), 500
    
@api.route('/api/carbon-emission/save', methods=['POST'])
def save_carbon_emission():
    """Save carbon emission data for a user"""
    try:
        data = request.get_json()
        email = data.get('email')
        emission = data.get('emission')
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        if emission is None:
            return jsonify({'success': False, 'message': 'Emission value is required'}), 400
        
        # Validate emission is a number
        try:
            emission_value = float(emission)
            # Round to 4 decimal places
            emission_value = round(emission_value, 4)
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Invalid emission value'}), 400
        
        # Get collections
        users_collection = db_instance.get_users_collection()
        carbon_collection = db_instance.get_carbon_emission_collection()
        
        # Verify user exists
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Create carbon emission document
        carbon_data = {
            'email': email,
            'userId': user.get('_id'),
            'emission': emission_value,
            'timestamp': datetime.utcnow(),
            'createdAt': datetime.utcnow()
        }
        
        # Insert or update carbon emission record
        # Check if there's already a record for this user
        existing_record = carbon_collection.find_one({'email': email})
        
        if existing_record:
            # Update existing record
            result = carbon_collection.update_one(
                {'email': email},
                {
                    '$set': {
                        'emission': emission_value,
                        'timestamp': datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                return jsonify({'success': True, 'message': 'Carbon emission updated successfully'})
            else:
                return jsonify({'success': False, 'message': 'Failed to update carbon emission'}), 500
        else:
            # Insert new record
            result = carbon_collection.insert_one(carbon_data)
            
            if result.inserted_id:
                return jsonify({'success': True, 'message': 'Carbon emission saved successfully'})
            else:
                return jsonify({'success': False, 'message': 'Failed to save carbon emission'}), 500
        
    except Exception as e:
        print(f"Error saving carbon emission: {e}")
        return jsonify({'success': False, 'message': 'Failed to save carbon emission'}), 500

@api.route('/api/carbon-emission/load', methods=['POST'])
def load_carbon_emission():
    """Load carbon emission data for a user"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        # Get carbon emission collection
        carbon_collection = db_instance.get_carbon_emission_collection()
        
        # Find carbon emission record for user
        carbon_record = carbon_collection.find_one({'email': email})
        
        if carbon_record:
            # Convert ObjectId to string for JSON serialization
            carbon_record['_id'] = str(carbon_record['_id'])
            if 'userId' in carbon_record:
                carbon_record['userId'] = str(carbon_record['userId'])
            
            return jsonify({
                'success': True, 
                'carbonEmission': {
                    'emission': carbon_record['emission'],
                    'timestamp': carbon_record['timestamp'].isoformat() if carbon_record.get('timestamp') else None,
                    'createdAt': carbon_record['createdAt'].isoformat() if carbon_record.get('createdAt') else None
                }
            })
        else:
            # Return default emission if no record exists
            return jsonify({
                'success': True, 
                'carbonEmission': {
                    'emission': 100.0000,
                    'timestamp': None,
                    'createdAt': None
                }
            })
            
    except Exception as e:
        print(f"Error loading carbon emission: {e}")
        return jsonify({'success': False, 'message': 'Failed to load carbon emission'}), 500

@api.route('/api/carbon-emission/history', methods=['POST'])
def get_carbon_emission_history():
    """Get carbon emission history for a user (for future use)"""
    try:
        data = request.get_json()
        email = data.get('email')
        limit = data.get('limit', 10)  # Default to last 10 records
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        # Get carbon emission collection
        carbon_collection = db_instance.get_carbon_emission_collection()
        
        # Find all carbon emission records for user, sorted by timestamp (newest first)
        carbon_records = list(carbon_collection.find(
            {'email': email}
        ).sort('timestamp', -1).limit(limit))
        
        # Convert ObjectIds to strings for JSON serialization
        for record in carbon_records:
            record['_id'] = str(record['_id'])
            if 'userId' in record:
                record['userId'] = str(record['userId'])
            if 'timestamp' in record and record['timestamp']:
                record['timestamp'] = record['timestamp'].isoformat()
            if 'createdAt' in record and record['createdAt']:
                record['createdAt'] = record['createdAt'].isoformat()
        
        return jsonify({
            'success': True, 
            'history': carbon_records,
            'count': len(carbon_records)
        })
            
    except Exception as e:
        print(f"Error loading carbon emission history: {e}")
        return jsonify({'success': False, 'message': 'Failed to load carbon emission history'}), 500
    

@api.route('/api/daily-challenges/save', methods=['POST'])
def save_daily_challenge():
    """Save current AI-generated daily challenge to database (alternative endpoint)"""
    try:
        # Get current daily challenge
        current_challenge = daily_challenge_manager.get_daily_challenge()
        
        if not current_challenge:
            return jsonify({'success': False, 'message': 'No current challenge available'}), 404
        
        # Save to database using the daily challenge manager
        success = daily_challenge_manager.save_challenge_to_database(current_challenge)
        
        if success:
            return jsonify({
                'success': True, 
                'message': 'Current daily challenge saved to database',
                'challenge': current_challenge
            }), 200
        else:
            return jsonify({'success': False, 'message': 'Failed to save challenge to database'}), 500
            
    except Exception as e:
        print(f"Error saving daily challenge: {e}")
        return jsonify({'success': False, 'message': 'Failed to save daily challenge'}), 500

# Add update and delete endpoints too
@api.route('/api/daily-challenges/<challenge_id>', methods=['PUT'])
def update_daily_challenge(challenge_id):
    """Update an existing daily challenge"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        challenges_collection = db_instance.get_daily_challenges_collection()
        
        # Prepare update data
        update_data = {
            'updatedAt': datetime.utcnow()
        }
        
        # Update allowed fields
        allowed_fields = ['challenge', 'description', 'rewardPoints', 'difficulty', 'impact', 'isActive']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        # Update in database
        result = challenges_collection.update_one(
            {'_id': ObjectId(challenge_id)},
            {'$set': update_data}
        )
        
        if result.modified_count > 0:
            # Get updated challenge
            updated_challenge = challenges_collection.find_one({'_id': ObjectId(challenge_id)})
            if updated_challenge:
                updated_challenge['_id'] = str(updated_challenge['_id'])
                if 'createdAt' in updated_challenge:
                    updated_challenge['createdAt'] = updated_challenge['createdAt'].isoformat()
                if 'updatedAt' in updated_challenge:
                    updated_challenge['updatedAt'] = updated_challenge['updatedAt'].isoformat()
                if 'expiresAt' in updated_challenge:
                    updated_challenge['expiresAt'] = updated_challenge['expiresAt'].isoformat()
            
            return jsonify({
                'success': True,
                'message': 'Daily challenge updated successfully',
                'challenge': updated_challenge
            }), 200
        else:
            return jsonify({'success': False, 'message': 'Challenge not found or no changes made'}), 404
            
    except Exception as e:
        print(f"Error updating daily challenge: {e}")
        return jsonify({'success': False, 'message': 'Failed to update daily challenge'}), 500

@api.route('/api/daily-challenges/<challenge_id>', methods=['DELETE'])
def delete_daily_challenge(challenge_id):
    """Delete a daily challenge"""
    try:
        challenges_collection = db_instance.get_daily_challenges_collection()
        
        result = challenges_collection.delete_one({'_id': ObjectId(challenge_id)})
        
        if result.deleted_count > 0:
            return jsonify({
                'success': True,
                'message': 'Daily challenge deleted successfully'
            }), 200
        else:
            return jsonify({'success': False, 'message': 'Challenge not found'}), 404
            
    except Exception as e:
        print(f"Error deleting daily challenge: {e}")
        return jsonify({'success': False, 'message': 'Failed to delete daily challenge'}), 500
    
@api.route('/api/user-challenges/accept', methods=['POST'])
def accept_user_challenge():
    """Accept a daily challenge and save user's submission"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Extract required fields
        user_email = data.get('userEmail')
        challenge_id = data.get('challengeId')
        description = data.get('description')
        proof_image = data.get('proofImage')  # This could be base64 string or file path
        
        if not user_email or not challenge_id or not description:
            return jsonify({
                'success': False, 
                'message': 'User email, challenge ID, and description are required'
            }), 400
        
        # Get collections
        users_collection = db_instance.get_users_collection()
        user_challenges_collection = db_instance.get_user_challenges_collection()
        
        # Verify user exists
        user = users_collection.find_one({'email': user_email})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Check if user already accepted this challenge
        existing_submission = user_challenges_collection.find_one({
            'userEmail': user_email,
            'challengeId': challenge_id
        })
        
        if existing_submission:
            return jsonify({
                'success': False, 
                'message': 'You have already accepted this challenge'
            }), 400
        
        # Create user challenge document
        user_challenge_data = {
            'userEmail': user_email,
            'userId': str(user.get('_id')),
            'challengeId': challenge_id,  # Store as is, don't convert to ObjectId
            'description': description,
            'proofImage': proof_image,
            'ifDone': 0,  # 0 = not done, 1 = done (to be set by admin)
            'acceptedAt': datetime.utcnow(),
            'createdAt': datetime.utcnow()
        }
        
        # Insert user challenge
        result = user_challenges_collection.insert_one(user_challenge_data)
        
        if result.inserted_id:
            # Return success with the created record
            user_challenge_data['_id'] = str(result.inserted_id)
            user_challenge_data['acceptedAt'] = user_challenge_data['acceptedAt'].isoformat()
            user_challenge_data['createdAt'] = user_challenge_data['createdAt'].isoformat()
            
            return jsonify({
                'success': True,
                'message': 'Challenge accepted successfully',
                'userChallenge': user_challenge_data
            }), 201
        else:
            return jsonify({
                'success': False, 
                'message': 'Failed to accept challenge'
            }), 500
        
    except Exception as e:
        print(f"Error accepting user challenge: {e}")
        return jsonify({'success': False, 'message': 'Failed to accept challenge'}), 500

@api.route('/api/user-challenges/user/<user_email>', methods=['GET'])
def get_user_challenges(user_email):
    """Get all challenges accepted by a specific user"""
    try:
        user_challenges_collection = db_instance.get_user_challenges_collection()
        
        # Find all challenges for the user
        user_challenges = list(user_challenges_collection.find({'userEmail': user_email}))
        
        # Convert ObjectIds to strings for JSON serialization
        for challenge in user_challenges:
            challenge['_id'] = str(challenge['_id'])
            if 'acceptedAt' in challenge and challenge['acceptedAt']:
                challenge['acceptedAt'] = challenge['acceptedAt'].isoformat()
            if 'createdAt' in challenge and challenge['createdAt']:
                challenge['createdAt'] = challenge['createdAt'].isoformat()
        
        return jsonify({
            'success': True,
            'userChallenges': user_challenges,
            'count': len(user_challenges)
        }), 200
        
    except Exception as e:
        print(f"Error getting user challenges: {e}")
        return jsonify({'success': False, 'message': 'Failed to get user challenges'}), 500

@api.route('/api/user-challenges/check/<user_email>/<challenge_id>', methods=['GET'])
def check_user_challenge_status(user_email, challenge_id):
    """Check if user has already accepted a specific challenge"""
    try:
        user_challenges_collection = db_instance.get_user_challenges_collection()
        
        # Check if user already accepted this challenge
        existing_submission = user_challenges_collection.find_one({
            'userEmail': user_email,
            'challengeId': challenge_id
        })
        
        if existing_submission:
            existing_submission['_id'] = str(existing_submission['_id'])
            if 'acceptedAt' in existing_submission and existing_submission['acceptedAt']:
                existing_submission['acceptedAt'] = existing_submission['acceptedAt'].isoformat()
            if 'createdAt' in existing_submission and existing_submission['createdAt']:
                existing_submission['createdAt'] = existing_submission['createdAt'].isoformat()
            
            return jsonify({
                'success': True,
                'hasAccepted': True,
                'userChallenge': existing_submission
            }), 200
        else:
            return jsonify({
                'success': True,
                'hasAccepted': False,
                'userChallenge': None
            }), 200
        
    except Exception as e:
        print(f"Error checking user challenge status: {e}")
        return jsonify({'success': False, 'message': 'Failed to check challenge status'}), 500
