import os
import json
from datetime import datetime, timedelta
from chatbot import get_response

class DailyChallengeManager:
    def __init__(self):
        # Remove file dependency - everything is generated dynamically
        self.current_challenge = None
        self.challenge_date = None
    
    def generate_daily_challenge(self):
        """Generate a completely new daily challenge using AI"""
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        # Create a unique prompt based on the current date for variety
        prompt = f"""Generate a unique daily climate action challenge for {current_date}. 
        Create something fresh and engaging that promotes environmental sustainability.
        
        The challenge should be:
        - Practical and achievable in one day
        - Focused on environmental/climate action (water saving, energy efficiency, waste reduction, sustainable transport, etc.)
        - Specific with clear actionable steps
        - Engaging and motivating
        - Different from typical challenges (be creative!)
        
        Respond with ONLY a JSON object in this exact format:
        {{
            "title": "Creative Challenge Title",
            "description": "Detailed description of what to do with specific steps",
            "impact": "Brief explanation of environmental impact",
            "difficulty": "Easy/Medium/Hard",
            "points": 50-100,
            "category": "water/energy/waste/transport/food/lifestyle"
        }}
        
        Make it unique and interesting. Do not include any other text."""
        
        try:
            ai_response = get_response(prompt)
            # Clean up the response to extract just the JSON
            ai_response = ai_response.strip()
            
            # Remove markdown formatting if present
            if ai_response.startswith('```json'):
                ai_response = ai_response[7:-3]
            elif ai_response.startswith('```'):
                ai_response = ai_response[3:-3]
            
            # Parse the JSON response
            challenge_data = json.loads(ai_response)
            
            # Add metadata
            now = datetime.now()
            challenge_data.update({
                "id": f"daily_{now.strftime('%Y%m%d')}",
                "date": current_date,
                "generated_at": now.isoformat(),
                "expires_at": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat(),
                "type": "daily"
            })
            
            return challenge_data
            
        except Exception as e:
            print(f"Error generating AI challenge: {e}")
            # If AI fails, generate a simple dynamic challenge based on date
            return self.generate_fallback_challenge()
    
    def generate_fallback_challenge(self):
        """Generate a fallback challenge if AI fails"""
        now = datetime.now()
        current_date = now.strftime('%Y-%m-%d')
        
        # Use date-based seed for variety even in fallback
        import random
        random.seed(now.day + now.month + now.year)
        
        fallback_challenges = [
            {
                "title": "Water Conservation Hero",
                "description": "Take 5-minute showers only, turn off taps while brushing teeth, and fix any leaky faucets you find today.",
                "impact": "Can save up to 50 gallons of water per day per person",
                "difficulty": "Easy",
                "points": 60,
                "category": "water"
            },
            {
                "title": "Energy Ninja Challenge",
                "description": "Unplug all electronics when not in use, use natural light during the day, and air-dry clothes instead of using the dryer.",
                "impact": "Reduces household energy consumption by 10-15%",
                "difficulty": "Medium",
                "points": 75,
                "category": "energy"
            },
            {
                "title": "Zero Waste Warrior",
                "description": "Bring reusable bags for shopping, refuse single-use plastics, and compost all organic waste today.",
                "impact": "Prevents 2-5 pounds of waste from entering landfills",
                "difficulty": "Medium",
                "points": 80,
                "category": "waste"
            },
            {
                "title": "Sustainable Transport Day",
                "description": "Walk, bike, or use public transport for all trips today. If driving is necessary, combine multiple errands into one trip.",
                "impact": "Reduces carbon emissions by 2-4 pounds per day",
                "difficulty": "Hard",
                "points": 90,
                "category": "transport"
            },
            {
                "title": "Plant-Based Power",
                "description": "Eat one completely plant-based meal today and learn about sustainable food choices.",
                "impact": "Saves 1-2 pounds of CO2 equivalent per meal",
                "difficulty": "Easy",
                "points": 55,
                "category": "food"
            }
        ]
        
        selected_challenge = random.choice(fallback_challenges)
        selected_challenge.update({
            "id": f"daily_{now.strftime('%Y%m%d')}",
            "date": current_date,
            "generated_at": now.isoformat(),
            "expires_at": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat(),
            "type": "daily"
        })
        
        return selected_challenge
    
    def get_daily_challenge(self):
        """Get the current daily challenge, generating a new one if needed"""
        now = datetime.now()
        current_date = now.strftime('%Y-%m-%d')
        
        # Check if we need a new challenge (new day or no challenge exists)
        if not self.current_challenge or self.challenge_date != current_date:
            print(f"Generating new daily challenge for {current_date}...")
            self.current_challenge = self.generate_daily_challenge()
            self.challenge_date = current_date
        
        # Add time remaining information
        challenge = self.current_challenge.copy()
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
                # Challenge expired, generate new one
                print("Challenge expired, generating new one...")
                self.current_challenge = self.generate_daily_challenge()
                self.challenge_date = current_date
                challenge = self.current_challenge.copy()
                
                # Recalculate time remaining
                expires_at = datetime.fromisoformat(challenge['expires_at'])
                time_remaining = expires_at - now
                hours = int(time_remaining.total_seconds() // 3600)
                minutes = int((time_remaining.total_seconds() % 3600) // 60)
                challenge['time_remaining'] = {
                    "hours": hours,
                    "minutes": minutes,
                    "total_seconds": int(time_remaining.total_seconds())
                }
        except ValueError:
            challenge['time_remaining'] = {
                "hours": 24,
                "minutes": 0,
                "total_seconds": 86400
            }
        
        return challenge

# Global instance
daily_challenge_manager = DailyChallengeManager()
