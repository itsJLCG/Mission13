import os
import json
from datetime import datetime, timedelta
from chatbot import get_response

class DailyChallengeManager:
    def __init__(self):
        self.challenges_file = os.path.join(os.path.dirname(__file__), 'daily_challenges.json')
        self.ensure_challenges_file_exists()
    
    def ensure_challenges_file_exists(self):
        """Create the challenges file if it doesn't exist"""
        if not os.path.exists(self.challenges_file):
            initial_data = {
                "last_generated": None,
                "current_challenge": None
            }
            with open(self.challenges_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
    
    def load_challenges_data(self):
        """Load challenges data from file"""
        try:
            with open(self.challenges_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {
                "last_generated": None,
                "current_challenge": None
            }
    
    def save_challenges_data(self, data):
        """Save challenges data to file"""
        with open(self.challenges_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def generate_daily_challenge(self):
        """Generate a new daily challenge using AI"""
        prompt = """Generate a single daily climate action challenge that someone can complete in one day. 
        The challenge should be:
        - Practical and achievable for most people
        - Focused on environmental/climate action
        - Specific with clear actions
        - Engaging and motivating
        
        Respond with ONLY a JSON object in this exact format:
        {
            "title": "Challenge Title Here",
            "description": "Detailed description of what to do",
            "impact": "Brief explanation of environmental impact",
            "difficulty": "Easy/Medium/Hard"
        }
        
        Do not include any other text, markdown formatting, or explanations."""
        
        try:
            ai_response = get_response(prompt)
            # Clean up the response to extract just the JSON
            ai_response = ai_response.strip()
            if ai_response.startswith('```json'):
                ai_response = ai_response[7:-3]
            elif ai_response.startswith('```'):
                ai_response = ai_response[3:-3]
            
            challenge_data = json.loads(ai_response)
            
            # Add metadata
            now = datetime.now()
            challenge_data.update({
                "id": f"daily_{now.strftime('%Y%m%d')}",
                "generated_at": now.isoformat(),
                "expires_at": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat(),
                "type": "daily"
            })
            
            return challenge_data
            
        except Exception as e:
            print(f"Error generating challenge: {e}")
            # Fallback challenge
            now = datetime.now()
            return {
                "id": f"daily_{now.strftime('%Y%m%d')}",
                "title": "Reduce Energy Consumption",
                "description": "Turn off all unnecessary lights and electronics for the day. Unplug devices when not in use.",
                "impact": "Reducing energy consumption helps decrease carbon emissions and fights climate change.",
                "difficulty": "Easy",
                "generated_at": now.isoformat(),
                "expires_at": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat(),
                "type": "daily"
            }
    
    def get_daily_challenge(self):
        """Get the current daily challenge, generating a new one if needed"""
        data = self.load_challenges_data()
        now = datetime.now()
        
        # Check if we need to generate a new challenge
        should_generate_new = False
        
        if not data.get('current_challenge'):
            should_generate_new = True
        else:
            # Check if current challenge has expired
            try:
                expires_at = datetime.fromisoformat(data['current_challenge']['expires_at'])
                if now >= expires_at:
                    should_generate_new = True
            except (KeyError, ValueError):
                should_generate_new = True
        
        if should_generate_new:
            print("Generating new daily challenge...")
            new_challenge = self.generate_daily_challenge()
            data['current_challenge'] = new_challenge
            data['last_generated'] = now.isoformat()
            self.save_challenges_data(data)
        
        # Add time remaining information
        challenge = data['current_challenge'].copy()
        try:
            expires_at = datetime.fromisoformat(challenge['expires_at'])
            time_remaining = expires_at - now
            
            if time_remaining.total_seconds() > 0:
                hours = int(time_remaining.total_seconds() // 3600)
                minutes = int((time_remaining.total_seconds() % 3600) // 60)
                challenge['time_remaining'] = {
                    "hours": hours,
                    "minutes": minutes,
                    "total_seconds": int(time_remaining.total_seconds())
                }
            else:
                challenge['time_remaining'] = {
                    "hours": 0,
                    "minutes": 0,
                    "total_seconds": 0
                }
        except ValueError:
            challenge['time_remaining'] = {
                "hours": 0,
                "minutes": 0,
                "total_seconds": 0
            }
        
        return challenge

# Global instance
daily_challenge_manager = DailyChallengeManager()