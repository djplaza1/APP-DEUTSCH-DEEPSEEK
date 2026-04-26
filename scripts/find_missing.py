import subprocess
import sys

def main():
    sha = sys.argv[1] if len(sys.argv) > 1 else 'cabab3c'
    content = subprocess.check_output(['git', 'show', f'{sha}:index.html'], shell=True).decode('utf-8', errors='replace')
    lines = content.splitlines()
    
    print(f"Total lines: {len(lines)}")
    
    searches = [
        ("case 'vocabulario'", 'vocabulario'),
        ("case 'biblioteca'", 'biblioteca'),
        ("case 'telc'", 'telc'),
    ]
    
    for search_term, label in searches:
        for i, line in enumerate(lines):
            if search_term in line or search_term.replace("'", '"') in line:
                print(f"\n=== Found '{label}' at line {i} ===")
                # Print 5 lines before and 30 after
                start = max(0, i - 5)
                end = min(len(lines), i + 35)
                for j in range(start, end):
                    prefix = ">>" if j == i else "  "
                    print(f"{prefix} {j}: {lines[j]}")

if __name__ == '__main__':
    main()