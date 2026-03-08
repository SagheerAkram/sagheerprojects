import requests
import os
from dotenv import load_dotenv

load_dotenv('api/.env')

def test_gemini():
    print("\n--- Testing Gemini Keys ---")
    keys = os.getenv("GEMINI_KEYS", "").split(",")
    if not keys or not keys[0]:
        print("❌ No Gemini keys found in .env")
        return

    for i, key in enumerate(keys):
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={key}"
        try:
            r = requests.post(url, json={"contents": [{"parts": [{"text": "hi"}]}]})
            if r.status_code == 200:
                print(f"✅ Key {i+1}: Working!")
            else:
                print(f"❌ Key {i+1}: Failed ({r.status_code}) - {r.json().get('error', {}).get('message', 'Unknown Error')}")
        except Exception as e:
            print(f"❌ Key {i+1}: Error - {e}")

def test_openrouter():
    print("\n--- Testing OpenRouter Key ---")
    key = os.getenv("OPENROUTER_KEY")
    if not key:
        print("❌ No OpenRouter key found in .env")
        return

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {"Authorization": f"Bearer {key}"}
    try:
        r = requests.post(url, headers=headers, json={
            "model": "google/gemini-pro-1.5",
            "messages": [{"role": "user", "content": "hi"}]
        })
        if r.status_code == 200:
            print("✅ OpenRouter: Working!")
        else:
            print(f"❌ OpenRouter: Failed ({r.status_code}) - {r.text}")
    except Exception as e:
        print(f"❌ OpenRouter: Error - {e}")

if __name__ == "__main__":
    test_gemini()
    test_openrouter()
    print("\n--- Summary ---")
    print("If you see 'PERMISSION_DENIED' or 'reported as leaked', you MUST get new keys.")
    print("Get free Gemini keys at: https://aistudio.google.com/")
