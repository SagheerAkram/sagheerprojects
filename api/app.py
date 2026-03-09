from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import random
import json
from dotenv import load_dotenv

# Import our new Library of Chaos
from library_of_chaos import chaos_db

env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
# Enable CORS for the Astro frontend
CORS(app)

GEMINI_KEYS = os.getenv("GEMINI_KEYS", "").split(",")
OPENROUTER_KEY = os.getenv("OPENROUTER_KEY", "")

SYSTEM_PROMPT = """
You are the Librarian of Chaos, an expert Minecraft NBT/SNBT architect.
Your job is to take raw, highly illegal/overpowered JSON NBT blueprints and convert them into strictly valid Game-Ready SNBT strings, while selectively customizing them based on the user's request.

INSTRUCTIONS:
1. I will provide a JSON object mapping slot names to their base item blueprints.
2. The user has requested a specific theme or name: "{user_prompt}"
3. Process EACH slot provided in the input.
4. For each blueprint, KEEP ALL illegal tags, massive enchantments, fireworks data, and attribute modifiers EXACTLY as they are. DO NOT nerf the item.
5. Modify ONLY the display.Name, display.Lore, or colors to personalize the item to the user's request. Make it sound badass and thematic.
6. Convert the final structure into a VALID Minecraft SNBT string (e.g., {{id:"minecraft:diamond_sword",Count:1b,tag:{{display:{{Name:'{{"text":"Doomblade","color":"red"}}'}},Enchantments:[...],...}}}})

OUTPUT FORMAT:
Return ONLY a strictly valid JSON object mapping the slot name to the final SNBT string.
Example:
{{
  "hotbar.0": "{{id:\\"minecraft:stick\\",Count:1b,tag:{{display:{{Name:'{{\\"text\\":\\"God Stick\\"}}'}},Enchantments:[{{id:\\"minecraft:sharpness\\",lvl:32767s}}]}}}}",
  "armor.helmet": "{{id:\\"minecraft:diamond_helmet\\",Count:1b,...}}"
}}
"""

def generate_with_gemini(prompt_text, api_key):
    models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-2.0-flash"]
    last_err = None
    
    for model in models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            headers = {'Content-Type': 'application/json'}
            data = {
                "contents": [{"parts": [{"text": prompt_text}]}],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 4096,
                }
            }
            
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    text = result['candidates'][0]['content']['parts'][0]['text'].strip()
                    if text: return text
            last_err = f"{model} failed: {response.status_code} {response.text}"
        except Exception as e:
            last_err = str(e)
            continue
            
    raise Exception(f"All Gemini models failed. Last error: {last_err}")

def generate_with_openrouter(prompt_text):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "google/gemini-2.0-flash-001", 
        "messages": [
            {"role": "user", "content": prompt_text}
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
    
    user_prompt = data['prompt']
    # If the frontend is new, it passes slots. If old, we default to full hotbar.
    slots_requested = data.get('slots', [f"hotbar.{i}" for i in range(9)])
    
    # 1. Database Retrieval (Librarian Phase)
    input_blueprints = {}
    for slot in slots_requested:
        cat = "misc"
        if "armor" in slot: cat = "armor"
        elif "weapon" in slot or "sword" in slot: cat = "swords"
        elif "offhand" in slot: cat = random.choice(["bows", "potions"])
        
        item = chaos_db.get_random_item(category=cat)
        if not item: # fallback if pool is empty
            item = chaos_db.get_random_item()
        
        if item:
            # Send just what the AI needs to construct the SNBT
            input_blueprints[slot] = {
                "id": item["id"],
                "tags": item.get("tag", {})
            }

    # 2. Dynamic Prompt Assembly
    final_prompt = SYSTEM_PROMPT.format(user_prompt=user_prompt)
    final_prompt += f"\n\nBLUEPRINTS DATABASE EXTRACT:\n{json.dumps(input_blueprints, indent=2)}"

    last_error = "Unknown error"
    
    # Try OpenRouter First
    snbt_result = None
    try:
        if not OPENROUTER_KEY:
             from dotenv import load_dotenv
             load_dotenv()
             globals()['OPENROUTER_KEY'] = os.getenv("OPENROUTER_KEY", "")
             
        if OPENROUTER_KEY:
            snbt_result = generate_with_openrouter(final_prompt)
            if snbt_result: print("Successfully generated using OpenRouter.")
    except Exception as e:
        last_error = f"OpenRouter failed: {str(e)}"
        print(last_error)

    # Fallback to direct Gemini Keys
    if not snbt_result:
        print("OpenRouter failed, falling back to direct Gemini keys...")
        random.shuffle(GEMINI_KEYS)
        for key in GEMINI_KEYS:
            if not key: continue
            try:
                snbt_result = generate_with_gemini(final_prompt, key)
                if snbt_result:
                    print("Successfully generated using a fallback Gemini key.")
                    break
            except Exception as e:
                last_err_gemini = f"Gemini Key failed: {str(e)}"
                print(last_err_gemini)
                last_error = f"{last_error} | {last_err_gemini}"
                continue

    if not snbt_result:
        return jsonify({
            "error": "AI Generation Failed",
            "details": f"Latest error: {last_error}",
            "status": "service_outage"
        }), 503

    # 3. Clean and Parse Response
    snbt_result = snbt_result.strip()
    if snbt_result.startswith("```json"):
        snbt_result = snbt_result[7:-3].strip()
    elif snbt_result.startswith("```"):
        snbt_result = snbt_result[3:-3].strip()
    
    final_items = {}
    try:
        parsed = json.loads(snbt_result)
        if isinstance(parsed, dict):
            final_items = parsed
            # For backward compatibility with the old frontend expecting an 'items' array
            # If the frontend hasn't been updated yet, it will crash without an array.
            # We map the dict values to an array based on the requested slots order.
            items_array = [final_items.get(slot, "{}") for slot in slots_requested]
            return jsonify({"items": items_array, "mapped_items": final_items})
    except Exception as e:
        print(f"Failed to parse JSON from AI: {e}")
        return jsonify({"error": "Invalid structure from AI", "raw": snbt_result}), 500

    return jsonify({"error": "Failed to generate usable items."}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Librarian is awake!", "db_items": len(chaos_db.items)})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
