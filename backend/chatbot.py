import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("Missing OPENROUTER_API_KEY in .env file")

def get_response(message):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
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
            
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Response: {response.text}")
        raise Exception(f"API request failed: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise Exception(f"Failed to get response: {e}")

def main():
    print("🤖 Free Chatbot via OpenRouter initialized! Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Bot: Goodbye!")
            break
        try:
            reply = get_response(user_input)
            print(f"Bot: {reply}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
