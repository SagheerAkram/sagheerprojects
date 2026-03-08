from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import random
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for the Astro frontend (adjust origins in production!)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Configuration & Keys ---
# Loaded from .env file or environment variables
GEMINI_KEYS = os.getenv("GEMINI_KEYS", "").split(",")
OPENROUTER_KEY = os.getenv("OPENROUTER_KEY", "")

# System prompt to ensure safe, legitimate SNBT generation
SYSTEM_PROMPT = """
You are an expert Minecraft NBT/SNBT generator. 
The user will ask for one or more custom Minecraft items.
Your job is to generate the exact SNBT (Stringified NBT) for each requested item.

OUTPUT FORMAT:
Return a JSON object with an "items" key containing an array of SNBT strings.
Example: {"items": ["{id:\\"minecraft:stick\\",Count:1b,tag:{...}}", "{id:\\"minecraft:diamond_sword\\",Count:1b,tag:{...}}"]}

RULES:
1. Return ONLY the raw JSON object. No markdown, no explanations. 
2. You can generate up to 9 items (matching the hotbar). If they ask for more, pick the best 9.
3. The SNBT MUST be perfectly valid for Minecraft Java Edition.
4. Keep enchantments within the legal maximum integer limit (255).
5. Do NOT generate nesting shulker boxes or crash payloads. Stick to high-stat items (e.g., Sharpness 255, custom Lore, Unbreakable tags).
6. If the user asks for a specific slot or "all types", spread them across the list.

If the user asks for something unsafe, generate a safe, funny item instead.
"""

def generate_with_gemini(prompt, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
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
        "model": "google/gemini-2.0-flash-001", 
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

    last_error = "Unknown error"
    # 1. Try OpenRouter First
    snbt_result = None
    try:
        if not OPENROUTER_KEY:
             # re-attempt load if somehow empty
             from dotenv import load_dotenv
             load_dotenv()
             globals()['OPENROUTER_KEY'] = os.getenv("OPENROUTER_KEY", "")
             
        snbt_result = generate_with_openrouter(prompt)
        if snbt_result:
            print("Successfully generated using OpenRouter.")
    except Exception as e:
        last_error = f"OpenRouter failed: {str(e)}"
        print(last_error)

    # 2. Fallback to direct Gemini Keys if OpenRouter fails
    if not snbt_result:
        print("OpenRouter failed, falling back to direct Gemini keys...")
        random.shuffle(GEMINI_KEYS)
        for key in GEMINI_KEYS:
            try:
                snbt_result = generate_with_gemini(prompt, key)
                if snbt_result:
                    print("Successfully generated using a fallback Gemini key.")
                    break
            except Exception as e:
                last_err_gemini = f"Gemini Key failed: {str(e)}"
                print(last_err_gemini)
                last_error = f"{last_error} | {last_err_gemini}"
                continue

    if not snbt_result:
        print(f"FAILED COMPLETELY: {last_error}")
        return jsonify({
            "error": "AI Generation Failed",
            "details": f"Latest error: {last_error}",
            "status": "service_outage"
        }), 503

    # Clean up common AI markdown formatting if it ignored rules
    snbt_result = snbt_result.strip()
    if snbt_result.startswith("```json"):
        snbt_result = snbt_result[7:-3].strip()
    elif snbt_result.startswith("```"):
        snbt_result = snbt_result[3:-3].strip()
    
    # Try to parse as JSON for multi-item support
    items = []
    try:
        parsed = json.loads(snbt_result)
        if isinstance(parsed, dict) and 'items' in parsed:
            items = parsed['items']
        elif isinstance(parsed, list):
            items = parsed
        else:
            items = [snbt_result] # Fallback to single item if JSON isn't as expected
    except:
        # If it's not valid JSON, it might be a single raw SNBT string
        items = [snbt_result.strip('`').strip()]

    return jsonify({"items": items})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!", "key_loaded": bool(OPENROUTER_KEY)})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
