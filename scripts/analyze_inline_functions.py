import re

with open('index.html', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
print(f"\n{'='*60}")
print("DEFINICIONES DE FUNCIONES/CONST DENTRO DE App() INLINE (líneas 515-7938)")
print(f"{'='*60}")

# Find function/const definitions inside the inline (after App() opens, before FloatingButtons)
in_app = False
app_brace_depth = 0

for i, line in enumerate(lines):
    stripped = line.strip()
    line_num = i + 1
    
    if line_num == 515 and 'function App()' in stripped:
        in_app = True
        continue
    
    if in_app and line_num >= 7750 and 'function FloatingButtons()' in stripped:
        break
    
    if in_app:
        # Count braces to track depth
        app_brace_depth += stripped.count('{') - stripped.count('}')
        
        # Look for function definitions (named functions)
        m = re.match(r'^(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|function\s*(?:\([^)]*\))?\s*(?:=>)?)', stripped)
        if m and app_brace_depth > 0 and app_brace_depth < 10:
            print(f"  Line {line_num}: const {m.group(1)} = ...")
            continue
        
        m = re.match(r'^function\s+(\w+)\(', stripped)
        if m and m.group(1) != 'App':
            print(f"  Line {line_num}: function {m.group(1)}(...)")

print(f"\n{'='*60}")
print("CASES DEL SWITCH dentro de App() inline")
print(f"{'='*60}")

# Find the switch cases
for i, line in enumerate(lines):
    stripped = line.strip()
    line_num = i + 1
    if re.match(r"case\s+'(\w+)':", stripped) or re.match(r'case\s+"(\w+)":', stripped):
        m = re.match(r"case\s+'(\w+)':", stripped) or re.match(r'case\s+"(\w+)":', stripped)
        print(f"  Line {line_num}: case '{m.group(1)}':")
        # Print next 3 lines to see what component is used
        for j in range(1, 5):
            if i+j < len(lines):
                next_stripped = lines[i+j].strip()
                if next_stripped:
                    print(f"    -> {next_stripped[:120]}")
                    break