import bcrypt
from database import db_instance
from datetime import datetime
import re

class UserAuth:
    def __init__(self):
        self.users = db_instance.get_users_collection()
    
    def validate_email(self, email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def validate_password(self, password):
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        return True, "Password is valid"
    
    def hash_password(self, password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed
    
    def verify_password(self, password, hashed):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed)
    
    def user_exists(self, email):
        """Check if user already exists"""
        return self.users.find_one({"email": email}) is not None
    
    def register_user(self, user_data):
        """Register a new user"""
        try:
            # Validate required fields
            required_fields = ['firstName', 'lastName', 'email', 'password']
            for field in required_fields:
                if not user_data.get(field):
                    return False, f"{field} is required"
            
            # Validate email format
            if not self.validate_email(user_data['email']):
                return False, "Invalid email format"
            
            # Validate password
            is_valid, message = self.validate_password(user_data['password'])
            if not is_valid:
                return False, message
            
            # Check if user already exists
            if self.user_exists(user_data['email']):
                return False, "User with this email already exists"
            
            # Hash password
            hashed_password = self.hash_password(user_data['password'])
            
            # Prepare user document
            user_document = {
                "firstName": user_data['firstName'].strip(),
                "lastName": user_data['lastName'].strip(),
                "email": user_data['email'].lower().strip(),
                "password": hashed_password,
                "createdAt": datetime.utcnow(),
                "isActive": True,
                "profile": {
                    "bio": "",
                    "location": "",
                    "phone": "",
                    "dateOfBirth": None
                },
                "preferences": {
                    "notifications": True,
                    "newsletter": True,
                    "challenges": True,
                    "tips": False
                },
                "stats": {
                    "totalPoints": 0,
                    "challengesCompleted": 0,
                    "currentStreak": 0,
                    "longestStreak": 0
                }
            }
            
            # Insert user into database
            result = self.users.insert_one(user_document)
            
            if result.inserted_id:
                return True, "User registered successfully"
            else:
                return False, "Failed to register user"
                
        except Exception as e:
            print(f"Registration error: {e}")
            return False, "Internal server error"
    
    def get_user_by_email(self, email):
        """Get user by email"""
        return self.users.find_one({"email": email.lower().strip()})

# Create global auth instance
auth = UserAuth()