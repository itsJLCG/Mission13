#!/usr/bin/env python3

import sys
import os

# Add the current directory to sys.path to find our modules
sys.path.insert(0, os.path.dirname(__file__))

try:
    from daily_challenge import daily_challenge_manager
    import json
    
    print("Testing daily challenge generation...")
    challenge = daily_challenge_manager.get_daily_challenge()
    print("\nGenerated Challenge:")
    print(json.dumps(challenge, indent=2))
    print("\n✅ Daily challenge test passed!")
    
except Exception as e:
    print(f"❌ Error testing daily challenge: {e}")
    import traceback
    traceback.print_exc()
