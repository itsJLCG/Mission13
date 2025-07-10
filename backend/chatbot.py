import os
import requests
import random
from dotenv import load_dotenv

load_dotenv()

# Load and parse multiple API keys
api_keys_string = os.getenv("OPENROUTER_API_KEY")
if not api_keys_string:
    raise ValueError("Missing OPENROUTER_API_KEY in .env file")

# Split by comma and clean whitespace
api_keys = [key.strip() for key in api_keys_string.split(',')]
print(f"Debug: Loaded {len(api_keys)} API keys")

current_key_index = 0

def get_current_api_key():
    """Get the current API key, with rotation support"""
    global current_key_index
    return api_keys[current_key_index]

def rotate_api_key():
    """Rotate to the next API key"""
    global current_key_index
    current_key_index = (current_key_index + 1) % len(api_keys)
    print(f"Debug: Rotated to API key #{current_key_index + 1}")

def get_random_api_key():
    """Get a random API key"""
    return random.choice(api_keys)

def get_response(message, use_fallback=True):
    """
    Get response with fallback support
    use_fallback: If True, try other keys if current one fails
    """
    url = "https://openrouter.ai/api/v1/chat/completions"
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "user", "content": message}]
    }

    # Try current key first
    for attempt in range(len(api_keys) if use_fallback else 1):
        current_key = get_current_api_key()
        
        headers = {
            "Authorization": f"Bearer {current_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://yourdomain.com",
            "X-Title": "SimpleChatbot"
        }

        try:
            print(f"Debug: Trying API key #{current_key_index + 1}")
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            response_data = response.json()
            if 'choices' in response_data and len(response_data['choices']) > 0:
                return response_data['choices'][0]['message']['content']
            else:
                return "Sorry, I couldn't generate a response. Please try again."
                
        except requests.exceptions.HTTPError as e:
            print(f"HTTP Error with key #{current_key_index + 1}: {e}")
            
            if use_fallback and attempt < len(api_keys) - 1:
                print("Trying next API key...")
                rotate_api_key()
                continue
            else:
                print(f"Response: {response.text}")
                raise Exception(f"All API keys failed. Last error: {e}")
                
        except Exception as e:
            print(f"Unexpected error with key #{current_key_index + 1}: {e}")
            
            if use_fallback and attempt < len(api_keys) - 1:
                print("Trying next API key...")
                rotate_api_key()
                continue
            else:
                raise Exception(f"All API keys failed. Last error: {e}")

def get_response_random_key(message):
    """Get response using a random API key (for load balancing)"""
    url = "https://openrouter.ai/api/v1/chat/completions"
    current_key = get_random_api_key()
    
    headers = {
        "Authorization": f"Bearer {current_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com",
        "X-Title": "SimpleChatbot"
    }
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "user", "content": message}]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        response_data = response.json()
        if 'choices' in response_data and len(response_data['choices']) > 0:
            return response_data['choices'][0]['message']['content']
        else:
            return "Sorry, I couldn't generate a response. Please try again."
            
    except Exception as e:
        print(f"Error with random key: {e}")
        # Fallback to the main method with fallback support
        return get_response(message, use_fallback=True)

def main():
    print(f"🤖 Chatbot initialized with {len(api_keys)} API keys! Type 'exit' to quit.")
    print("Commands: 'rotate' (switch key), 'random' (use random key mode)\n")
    
    use_random = False
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Bot: Goodbye!")
            break
        elif user_input.lower() == "rotate":
            rotate_api_key()
            print(f"Now using API key #{current_key_index + 1}")
            continue
        elif user_input.lower() == "random":
            use_random = not use_random
            print(f"Random key mode: {'ON' if use_random else 'OFF'}")
            continue
            
        try:
            if use_random:
                reply = get_response_random_key(user_input)
            else:
                reply = get_response(user_input)
            print(f"Bot: {reply}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()