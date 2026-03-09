import json
import random
import os

class LibraryOfChaos:
    def __init__(self, db_path="C:/Users/SM/Downloads/hotbar.json"):
        self.db_path = db_path
        self.items = []
        self.categories = {
            "armor": [],
            "swords": [],
            "tools": [],
            "bows": [],
            "fireworks": [],
            "spawn_eggs": [],
            "potions": [],
            "blocks": [],
            "misc": []
        }
        self.load_database()

    def _determine_category(self, item_id, tags):
        item_id = item_id.lower()
        if any(x in item_id for x in ["helmet", "chestplate", "leggings", "boots"]):
            return "armor"
        elif "sword" in item_id:
            return "swords"
        elif any(x in item_id for x in ["pickaxe", "axe", "shovel", "hoe"]):
            return "tools"
        elif "bow" in item_id or "crossbow" in item_id:
            return "bows"
        elif "firework" in item_id or "rocket" in item_id:
            return "fireworks"
        elif "spawn_egg" in item_id:
            return "spawn_eggs"
        elif "potion" in item_id:
            return "potions"
        elif any(x in item_id for x in ["block", "dirt", "stone", "glass", "ore", "planks"]):
            return "blocks"
        return "misc"

    def load_database(self):
        try:
            if not os.path.exists(self.db_path):
                print(f"Warning: Database file {self.db_path} not found.")
                return

            with open(self.db_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            def extract_items(obj):
                if isinstance(obj, dict):
                    if 'id' in obj and 'Count' in obj:
                        item_id = obj['id'].get('value', obj['id']) if isinstance(obj['id'], dict) else obj['id']
                        
                        tags = []
                        raw_tag = None
                        if 'tag' in obj:
                            raw_tag = obj['tag']
                            tag_val = obj['tag'].get('value', obj['tag'])
                            if isinstance(tag_val, dict):
                                tags = list(tag_val.keys())
                        
                        if isinstance(item_id, str):
                            category = self._determine_category(item_id, tags)
                            
                            item_record = {
                                "id": item_id,
                                "count": obj['Count'].get('value', 1) if isinstance(obj['Count'], dict) else obj['Count'],
                                "tag": raw_tag, # Keep the raw unparsed tag dictionary for the AI blueprint
                                "tags_list": tags
                            }
                            self.items.append(item_record)
                            self.categories[category].append(item_record)
                    
                    for v in obj.values():
                        extract_items(v)
                elif isinstance(obj, list):
                    for i in obj:
                        extract_items(i)
                        
            extract_items(data)
            print(f"Library of Chaos loaded securely. Total items cataloged: {len(self.items)}")
            
        except Exception as e:
            print(f"Error loading Library of Chaos: {e}")

    def get_random_item(self, category=None):
        if category and category in self.categories and len(self.categories[category]) > 0:
            return random.choice(self.categories[category])
        elif len(self.items) > 0:
            return random.choice(self.items)
        return None

    def get_random_items(self, category=None, count=1):
        results = []
        pool = self.categories.get(category, self.items) if category else self.items
        if not pool:
            return results
            
        for _ in range(count):
            results.append(random.choice(pool))
        return results

# Singleton instance for the app to use
chaos_db = LibraryOfChaos()
