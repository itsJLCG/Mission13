import os
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
from datetime import datetime

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()
    
    def connect(self):
        try:
            mongodb_uri = os.getenv('MONGODB_URI')
            if not mongodb_uri:
                raise ValueError("MONGODB_URI not found in environment variables")
            
            self.client = MongoClient(mongodb_uri)
            self.db = self.client['Mission13']
            
            # Test connection
            self.client.admin.command('ping')
            print("✅ MongoDB connection successful!")
            
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            raise e
    
    def get_users_collection(self):
        """Get users collection"""
        return self.db['users']
    
    def get_carbon_emission_collection(self):
        """Get carbon emission collection"""
        return self.db['carbonemission']
    
    def get_daily_challenges_collection(self):
        """Get daily challenges collection"""
        return self.db['dailyChallenges']
    
    def get_user_challenges_collection(self):
        """Get user challenges collection"""
        return self.db['UserChallenge']
    
    def close_connection(self):
        if self.client:
            self.client.close()

# Create global database instance
db_instance = Database()