import re
import json

file_path = r'e:\做过的一些小网站\Soldier-of-Ruins\games-data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract games array
match = re.search(r'const gamesData = (\[[\s\S]*\]);', content)
json_str = match.group(1)

# Parse to find high-rated games with placeholders
games_needing_update = []
game_blocks = re.finditer(r'\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}', json_str)

for block in game_blocks:
    block_content = block.group(1)
    
    # Extract fields
    id_match = re.search(r'[\"\']?id[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block_content)
    title_match = re.search(r'[\"\']?title[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block_content)
    rating_match = re.search(r'[\"\']?rating[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block_content)
    thumbnail_match = re.search(r'[\"\']?thumbnail[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block_content)
    iframe_match = re.search(r'[\"\']?iframe[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block_content)
    
    if all([id_match, title_match, rating_match, thumbnail_match, iframe_match]):
        game_id = id_match.group(1)
        title = title_match.group(1)
        rating = float(rating_match.group(1))
        thumbnail = thumbnail_match.group(1)
        iframe = iframe_match.group(1)
        
        # Check if placeholder and high-rated
        if 'placehold.co' in thumbnail and rating >= 4.5:
            games_needing_update.append({
                'id': game_id,
                'title': title,
                'rating': rating,
                'iframe': iframe,
                'current_thumbnail': thumbnail
            })

print(f"Found {len(games_needing_update)} high-rated games needing thumbnail updates:\n")
for game in sorted(games_needing_update, key=lambda x: x['rating'], reverse=True):
    print(f"⭐ {game['rating']} - {game['title']} (ID: {game['id']})")
    print(f"   URL: {game['iframe']}")
    print()
