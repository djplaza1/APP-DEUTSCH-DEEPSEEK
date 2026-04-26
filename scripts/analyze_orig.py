import re, subprocess

# Read the original file
sha = 'cabab3c'
content = subprocess.check_output(['git', 'show', f'{sha}:index.html'], shell=True).decode('utf-8', errors='replace')
lines = content.splitlines()
print(f"Total lines: {len(lines)}")

# Find the switch statement with cases
for i, line in enumerate(lines):
    if 'switch' in line and 'activeTab' in line:
        print(f"\n=== Switch at line {i+1}: {line.strip()[:100]} ===")
        for j in range(i, min(i+500, len(lines))):
            stripped = lines[j].strip()
            if 'case ' in stripped[:10]:
                case_content = stripped[:150]
                print(f"  Line {j+1}: {case_content}")
            if stripped == '})();':
                print(f"  (ends at line {j+1})")
                break

# Also search for specific function patterns that contain these tabs
print("\n=== Searching for tab rendering sections ===")

# Function to find sections between specific markers
def find_section(lines, start_marker, end_pattern):
    results = []
    in_section = False
    for i, line in enumerate(lines):
        if start_marker in line:
            in_section = True
            results.append({'start': i, 'lines': []})
        if in_section:
            results[-1]['lines'].append(i)
            if len(results[-1]['lines']) > 10 and re.search(end_pattern, line):
                results[-1]['end'] = i
                in_section = False
    return results

# Look for VocabSRS / Biblioteca / Telc Level sections
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('function ') or stripped.startswith('const ') and '=' in stripped:
        # Print first 80 chars of every function/const definition
        print(f"  Line {i+1}: {stripped[:120]}")