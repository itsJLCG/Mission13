import os
import json
import random
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database import db_instance

# Load API keys from .env
load_dotenv()
api_keys = [k.strip() for k in os.getenv("OPENROUTER_API_KEY", "").split(",") if k.strip()]
if not api_keys:
    raise ValueError("No OPENROUTER_API_KEY found in .env")

def get_ai_response(prompt: str) -> str:
    """Try multiple OpenRouter API keys until one works."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers_base = {
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    for api_key in api_keys:
        headers = headers_base.copy()
        headers["Authorization"] = f"Bearer {api_key}"
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=20)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"⚠️ API key failed: {api_key[:6]}... — {e}")
            continue

    raise RuntimeError("All OpenRouter API keys failed.")


class DailyChallengeManager:
    def __init__(self):
        self.challenges_file = os.path.join(os.path.dirname(__file__), 'daily_challenges.json')
        self.ensure_challenges_file_exists()
    
    def ensure_challenges_file_exists(self):
        if not os.path.exists(self.challenges_file):
            with open(self.challenges_file, 'w') as f:
                json.dump({"last_generated": None, "current_challenge": None}, f, indent=2)
    
    def load_challenges_data(self):
        try:
            with open(self.challenges_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"last_generated": None, "current_challenge": None}
    
    def save_challenges_data(self, data):
        with open(self.challenges_file, 'w') as f:
            json.dump(data, f, indent=2)

    def save_challenge_to_database(self, challenge_data):
        try:
            challenges_collection = db_instance.get_daily_challenges_collection()

            difficulty_to_points = {"Easy": 25, "Medium": 50, "Hard": 75}
            reward_points = difficulty_to_points.get(challenge_data.get('difficulty', 'Medium'), 50)

            challenge_document = {
                'challenge': challenge_data.get('title', challenge_data.get('challenge', 'Daily Challenge')),
                'description': challenge_data.get('description', ''),
                'rewardPoints': reward_points,
                'difficulty': challenge_data.get('difficulty', 'Medium'),
                'impact': challenge_data.get('impact', ''),
                'type': challenge_data.get('type', 'daily'),
                'challengeId': challenge_data.get('id', f"daily_{datetime.utcnow().strftime('%Y%m%d')}"),
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
                'isActive': True,
                'expiresAt': datetime.utcnow() + timedelta(days=1),
                'generatedBy': 'AI'
            }

            today = datetime.utcnow().date()
            existing = challenges_collection.find_one({
                'challengeId': challenge_data.get('id'),
                'createdAt': {
                    '$gte': datetime.combine(today, datetime.min.time()),
                    '$lt': datetime.combine(today + timedelta(days=1), datetime.min.time())
                }
            })

            if not existing:
                result = challenges_collection.insert_one(challenge_document)
                if result.inserted_id:
                    print(f"✅ AI Challenge saved: {challenge_document['challenge']}")
                    return True
                else:
                    print("❌ Failed to save challenge.")
                    return False
            else:
                print("ℹ️ Challenge already exists for today.")
                return True
        except Exception as e:
            print(f"❌ DB Save Error: {e}")
            return False

    def generate_daily_challenge(self):
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
}"""

        try:
            ai_response = get_ai_response(prompt).strip()
            if ai_response.startswith("```json"):
                ai_response = ai_response[7:-3]
            elif ai_response.startswith("```"):
                ai_response = ai_response[3:-3]

            challenge_data = json.loads(ai_response)

            now = datetime.now()
            challenge_data.update({
                "id": f"daily_{now.strftime('%Y%m%d')}",
                "generated_at": now.isoformat(),
                "expires_at": (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat(),
                "type": "daily"
            })
            return challenge_data

        except Exception as e:
            print(f"❌ AI Generation failed. Using fallback. Error: {e}")

    def get_daily_challenge(self):
        data = self.load_challenges_data()
        now = datetime.now()

        should_generate_new = False
        if not data.get("current_challenge"):
            should_generate_new = True
        else:
            try:
                expires_at = datetime.fromisoformat(data["current_challenge"]["expires_at"])
                if now >= expires_at:
                    should_generate_new = True
            except (KeyError, ValueError):
                should_generate_new = True

        if should_generate_new:
            print("🔄 Generating new daily challenge...")
            new_challenge = self.generate_daily_challenge()
            self.save_challenge_to_database(new_challenge)
            data["current_challenge"] = new_challenge
            data["last_generated"] = now.isoformat()
            self.save_challenges_data(data)

        challenge = data["current_challenge"].copy()
        try:
            expires_at = datetime.fromisoformat(challenge["expires_at"])
            time_remaining = expires_at - now
            total_seconds = max(0, int(time_remaining.total_seconds()))
            challenge["time_remaining"] = {
                "hours": total_seconds // 3600,
                "minutes": (total_seconds % 3600) // 60,
                "total_seconds": total_seconds
            }
        except:
            challenge["time_remaining"] = {
                "hours": 0,
                "minutes": 0,
                "total_seconds": 0
            }

        return challenge


# Global instance
daily_challenge_manager = DailyChallengeManager()
