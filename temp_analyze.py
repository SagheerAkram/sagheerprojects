import json

try:
    with open('C:/Users/SM/Downloads/hotbar.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    advanced_stats = {
        'total_items_found_recursively': 0,
        'has_custom_name': 0,
        'has_lore': 0,
        'has_enchantments': 0,
        'has_entity_tag': 0,
        'has_fireworks': 0,
        'has_attribute_modifiers': 0,
        'has_public_bukkit_values': 0
    }
    
    unique_ids = set()

    def analyze_item(tag_dict):
        if 'display' in tag_dict:
            disp = tag_dict['display'].get('value', {})
            if 'Name' in disp: advanced_stats['has_custom_name'] += 1
            if 'Lore' in disp: advanced_stats['has_lore'] += 1
        if 'Enchantments' in tag_dict or 'StoredEnchantments' in tag_dict:
            advanced_stats['has_enchantments'] += 1
        if 'EntityTag' in tag_dict:
            advanced_stats['has_entity_tag'] += 1
        if 'Fireworks' in tag_dict:
            advanced_stats['has_fireworks'] += 1
        if 'AttributeModifiers' in tag_dict:
            advanced_stats['has_attribute_modifiers'] += 1
        if 'PublicBukkitValues' in tag_dict:
            advanced_stats['has_public_bukkit_values'] += 1

    def find_items(obj):
        if isinstance(obj, dict):
            if 'id' in obj and 'Count' in obj:
                advanced_stats['total_items_found_recursively'] += 1
                
                item_id = obj['id'].get('value', obj['id']) if isinstance(obj['id'], dict) else obj['id']
                if isinstance(item_id, str):
                    unique_ids.add(item_id)
                
                if 'tag' in obj:
                    tag_val = obj['tag'].get('value', obj['tag'])
                    if isinstance(tag_val, dict):
                        analyze_item(tag_val)
            
            for v in obj.values():
                find_items(v)
        elif isinstance(obj, list):
            for i in obj:
                find_items(i)
                
    find_items(data)
    
    with open('analysis_results_utf8.txt', 'w', encoding='utf-8') as out:
        out.write("--- STATS ---\n")
        for k, v in advanced_stats.items():
            out.write(f"{k}: {v}\n")
        out.write(f"\nUnique Item IDs ({len(unique_ids)}):\n")
        out.write(", ".join(list(unique_ids)[:50]) + ("..." if len(unique_ids) > 50 else ""))

except Exception as e:
    print(f'Error analyzing: {e}')
