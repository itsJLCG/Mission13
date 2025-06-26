#!/usr/bin/env python3

import sys
import os

# Add the current directory to sys.path to find our modules
sys.path.insert(0, os.path.dirname(__file__))

from chatbot import get_response

def test_chatbot():
    try:
        print("Testing chatbot...")
        response = get_response("Hello, how are you?")
        print(f"Chatbot response: {response}")
        return True
    except Exception as e:
        print(f"Error testing chatbot: {e}")
        return False

if __name__ == "__main__":
    success = test_chatbot()
    if success:
        print("✅ Chatbot test passed!")
    else:
        print("❌ Chatbot test failed!")
