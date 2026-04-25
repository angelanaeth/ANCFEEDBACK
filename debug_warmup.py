# Debug what's actually in the Warm Up content

workout = """Warm Up 400 as:
- 200 Swim @50–70%
2 x 25 Kick – Take 5s

- 100 Pull @70%"""

lines = workout.split('\n')
print("All lines:")
for i, line in enumerate(lines):
    print(f"  {i}: '{line}'")

print("\nWarm Up content (after detecting header):")
section_content = []
header_found = False
for line in lines:
    trimmed = line.strip()
    if not trimmed:
        continue
    
    if trimmed.startswith('Warm Up'):
        header_found = True
        print(f"  Header: '{trimmed}'")
        continue
    
    if header_found:
        section_content.append(trimmed)
        print(f"  Content: '{trimmed}'")
        if ' as:' in trimmed.lower():
            print(f"    ^ Contains ' as:' - would be SKIPPED!")

print(f"\nTotal content lines: {len(section_content)}")

