import re
import urllib.request
import urllib.error
import socket
import json

# Define the file path
file_path = r'e:\做过的一些小网站\Soldier-of-Ruins\games-data.js'

def parse_js_objects(text):
    """
    Parses a JS array string and returns a list of dictionaries.
    Handles nested braces by counting balance.
    """
    objects = []
    brace_balance = 0
    in_string = False
    string_char = ''
    start_index = -1
    
    # Simple state machine
    for i, char in enumerate(text):
        if in_string:
            if char == string_char and text[i-1] != '\\':
                in_string = False
            continue
            
        if char == '"' or char == "'":
            in_string = True
            string_char = char
            continue
            
        if char == '{':
            if brace_balance == 0:
                start_index = i
            brace_balance += 1
        elif char == '}':
            brace_balance -= 1
            if brace_balance == 0 and start_index != -1:
                # Found a complete object string
                obj_str = text[start_index:i+1]
                
                # Now we need to extract info from this object block
                # We can't easily json.loads it because of keys without quotes etc.
                # So we regex search INSIDE this block.
                # But we must be careful about nested objects.
                # Since we only want the top-level 'iframe', 'title', 'id',
                # we can use simple regex, assuming they appear before nested structures 
                # or we just search the whole block and hope for no collision with nested keys.
                # Collision is possible (e.g. similarGames having an 'id').
                # However, for checking links, checking duplicates/similars isn't the end of the world.
                objects.append(obj_str)
                start_index = -1

    return objects

def check_games():
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Extract the array content using regex
    match = re.search(r'const gamesData = (\[[\s\S]*\]);', content)
    if not match:
        print("Could not find gamesData array in the file.")
        return

    json_str = match.group(1)
    
    # Strip the outer [ ] to just iterate the content
    inner_content = json_str.strip()[1:-1]
    
    print(f"Parsing games from {file_path}...\n")
    game_blocks = parse_js_objects(inner_content)
    
    games_to_check = []
    
    for block in game_blocks:
        # Extract properties
        # We use regex to find key: value pairs.
        # We need to be careful not to match inside nested structures if possible.
        # But 'iframe' usually isn't in similarGames. 'id' and 'title' are.
        # Let's verify if 'iframe' exists first.
        
        iframe_match = re.search(r'[\"\']?iframe[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block)
        if iframe_match:
             # If we found an iframe, this is likely a main game object (or a weird similarGame with iframe?)
             # Usually similarGames only have id, title, category, type, thumbnail, rating.
             # So presence of iframe is a good filter.
             
             url = iframe_match.group(1)
             
             # Extract ID and Title - taking the FIRST occurrence which should be the main object's
             id_match = re.search(r'[\"\']?id[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block)
             title_match = re.search(r'[\"\']?title[\"\']?\s*:\s*[\"\']([^\"\']+)[\"\']', block)
             
             game_id = id_match.group(1) if id_match else "unknown"
             title = title_match.group(1) if title_match else "Unknown Title"
             
             games_to_check.append({
                'id': game_id,
                'title': title,
                'url': url
             })

    print(f"Found {len(games_to_check)} games with iframe URLs to check.\n")
    
    failed_games = []
    
    socket.setdefaulttimeout(10) # 10s timeout
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for game in games_to_check:
        url = game['url']
        # Print without newline to show progress
        print(f"Checking {game['title']} (ID: {game['id']})...", end=" ", flush=True)
        
        try:
            req = urllib.request.Request(url, headers=headers, method='HEAD')
            try:
                with urllib.request.urlopen(req) as response:
                    print(f"OK")
            except urllib.error.HTTPError as e:
                # 405 Method Not Allowed - HEAD not supported, try GET
                if e.code == 405 or e.code == 404 or e.code == 403:
                     # Check 404/403 with GET too, sometimes servers block HEAD or return weird 404s for HEAD
                    try:
                        req_get = urllib.request.Request(url, headers=headers, method='GET')
                        with urllib.request.urlopen(req_get) as response_get:
                            print(f"OK (GET)")
                    except urllib.error.HTTPError as e_get:
                        print(f"FAIL ({e_get.code})")
                        if e_get.code != 403: # 403 might just be anti-bot, but 404 is definitely broken link
                            failed_games.append(game)
                        else:
                            print("  (Warning: 403 Forbidden - probably alive but blocks bots)")
                    except Exception as e_get_misc:
                        print(f"FAIL ({e_get_misc})")
                        failed_games.append(game)
                else:
                    print(f"FAIL ({e.code})")
                    failed_games.append(game)
            except urllib.error.URLError as e:
                print(f"FAIL ({e.reason})")
                failed_games.append(game)
        except Exception as e:
            print(f"ERROR ({str(e)})")
            failed_games.append(game)

    print("\n" + "="*50)
    print("Link Check Summary")
    print("="*50)
    
    if failed_games:
        print(f"Found {len(failed_games)} problematic games:")
        for game in failed_games:
            print(f"- {game['title']} (ID: {game['id']})")
            print(f"  URL: {game['url']}")
    else:
        print("All analyzed game links appear reachable!")

if __name__ == "__main__":
    check_games()
