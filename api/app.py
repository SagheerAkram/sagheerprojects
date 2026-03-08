from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import random
import json

app = Flask(__name__)
# Enable CORS for the Astro frontend (adjust origins in production!)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Configuration & Keys ---
# In production on cPanel, you would set these as Environment Variables.
# For now, we hardcode the provided keys per request.
GEMINI_KEYS = [
    "AIzaSyDatyVlhOUNbxMq4cgUCX1ncZtNEmQ7rRg",
    "AIzaSyCOzC0N2SOTRclsRKrSDI0Kj7Vn9Y88r8A",
    "AIzaSyDmfPRlo_RarTQ2f3d-0wuIsWlsXBCC6yQ",
    "AIzaSyBxL0wlyZzN4h9InrJlq1dxzfNGvYB0ZFI",
    "AIzaSyDZs3LbuuXpfQ0vUpq-P6FV2D9aRNNveiM",
    "AIzaSyB5lHWXakvTUxfHw9Gg1eVtYwgai2uDcO0"
]
OPENROUTER_KEY = "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"

# System prompt to ensure safe, legitimate SNBT generation
SYSTEM_PROMPT = """
You are an expert Minecraft NBT/SNBT generator. 
The user will ask for a custom Minecraft item (e.g., a sword, armor, or a fun tool).
Your ONLY job is to output the exact, raw SNBT (Stringified NBT) for the requested item(s).

RULES:
1. ONLY output the raw SNBT string. Do not include markdown formatting (like ``` json), explanations, or any other text.
2. The SNBT MUST be perfectly valid for Minecraft Java Edition.
3. Keep enchantments within the legal maximum integer limit (e.g., 255 for standard enchants, do not use 999999999 as it crashes the game).
4. Do NOT generate nesting shulker boxes, book-based crash payloads, or any data designed to overload server memory or crash the game. Stick to high-stat but game-safe items (e.g., Sharpness 255, custom Lore, Unbreakable tags).
5. Output format must exactly match: {id:"minecraft:item_name",Count:1b,tag:{display:{Name:'{"text":"Custom Name"}'},Enchantments:[{id:"minecraft:sharpness",lvl:255s}]}}

If the user asks for something that violates rule 4 (e.g., "give me a server crasher"), generate a safe, funny item instead (like a "Potato of Disappointment").
"""

def generate_with_gemini(prompt, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{"parts": [{"text": SYSTEM_PROMPT + "\n\nUser Request: " + prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800,
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status() # Raise exception for bad status codes
    
    result = response.json()
    if 'candidates' in result and len(result['candidates']) > 0:
        return result['candidates'][0]['content']['parts'][0]['text'].strip()
    return None

def generate_with_openrouter(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sagheerprojects.fun", # Optional
        "X-Title": "SagheerProjects NBT Tool" # Optional
    }
    data = {
        "model": "google/gemini-pro", # Or another available model
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    result = response.json()
    if 'choices' in result and len(result['choices']) > 0:
        return result['choices'][0]['message']['content'].strip()
    return None

@app.route('/api/generate-nbt', methods=['POST'])
def generate_nbt():
    data = request.json
    if not data or 'prompt' not in data:
        return jsonify({"error": "Missing 'prompt' in request body"}), 400
    
    prompt = data['prompt']
    uploaded_nbt = data.get('uploaded_nbt', None) # If they attached a file text
    
    if uploaded_nbt:
        prompt = f"Modify this existing SNBT based on the request.\nExisting SNBT:\n{uploaded_nbt}\n\nRequest: {prompt}"

    # 1. Try Gemini Keys randomly to distribute load
    random.shuffle(GEMINI_KEYS)
    snbt_result = None
    
    for key in GEMINI_KEYS:
        try:
            snbt_result = generate_with_gemini(prompt, key)
            if snbt_result:
                print("Successfully generated using a Gemini key.")
                break
        except Exception as e:
            print(f"Gemini Key failed: {e}")
            continue
            
    # 2. Fallback to OpenRouter if all Gemini keys fail
    if not snbt_result:
        print("All Gemini keys failed. Falling back to OpenRouter...")
        try:
            snbt_result = generate_with_openrouter(prompt)
        except Exception as e:
            print(f"OpenRouter failed: {e}")
            return jsonify({"error": "All AI generation services failed. Please try again later."}), 500

    # Clean up common AI markdown formatting if it ignored rule 1
    if snbt_result.startswith("```json"):
        snbt_result = snbt_result[7:-3].strip()
    elif snbt_result.startswith("```snbt"):
        snbt_result = snbt_result[7:-3].strip()
    elif snbt_result.startswith("```"):
        snbt_result = snbt_result[3:-3].strip()

    return jsonify({"snbt": snbt_result})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!"})

if __name__ == '__main__':
    # Run locally on port 5000
    app.run(debug=True, port=5000)
