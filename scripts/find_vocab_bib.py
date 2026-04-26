import subprocess, os, re

# Get the file
sha = 'cabab3c'
content = subprocess.check_output(['git', 'show', f'{sha}:index.html'], shell=True).decode('utf-8', errors='replace')
lines = content.splitlines()
print(f"Total lines: {len(lines)}")

# Find case 'vocabulario', case 'biblioteca', case 'telc'
patterns = [r"case\s+['\"]vocabulario['\"]", r"case\s+['\"]biblioteca['\"]", r"case\s+['\"]telc['\"]"]
for p in patterns:
    for i, line in enumerate(lines):
        if re.search(p, line):
            # Print block around it
            print(f"\n=== Found '{p}' at line {i} ===")
            for j in range(max(0,i-3), min(len(lines), i+50)):
                prefix = ">>" if j == i else "  "
                if len(lines[j]) > 200:
                    print(f"{prefix} {j}: {lines[j][:200]}...")
                else:
                    print(f"{prefix} {j}: {lines[j]}")
            break

# Also find VocabSRS, BibliotecaPanel, TelcLevels
for term in ['VocabSRS', 'BibliotecaPanel', 'TelcLevels']:
    for i, line in enumerate(lines):
        if term in line:
            if len(line) > 200:
                print(f"  Found '{term}' at line {i}: {line[:200]}...")
            else:
                print(f"  Found '{term}' at line {i}: {line}")