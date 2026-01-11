game_id = "2048-game"
file_path = r'e:\做过的一些小网站\Soldier-of-Ruins\games-data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

found = False
start_line = 0
brace_count = 0

for i, line in enumerate(lines):
    if f'"{game_id}"' in line or f"'{game_id}'" in line:
        # Found the ID, now search backwards for the start of the object
        # This is a simple heuristic assuming standard formatting
        for j in range(i, 0, -1):
            if '{' in lines[j]:
                start_line = j + 1 # 1-based
                found = True
                # Now search forward for the end
                balance = 0
                for k in range(j, len(lines)):
                    balance += lines[k].count('{')
                    balance -= lines[k].count('}')
                    if balance == 0:
                        end_line = k + 1
                        print(f"Found {game_id} at lines {start_line}-{end_line}")
                        break
                break
        break

if not found:
    print(f"Could not find {game_id}")
