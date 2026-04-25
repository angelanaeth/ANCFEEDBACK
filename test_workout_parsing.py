# Test the actual workout formatting issue

workout = """Warm Up 400 as:
- 200 Swim @50–70%
2 x 25 Kick – Take 5s

- 100 Pull @70%

Drill Set
6 x (25 Front Scull / 25 Swim, focus on Catch – Take 10s)

Pre-Set
600 Swim as 25H / 25E

Main Set
3 x 600 Swim with Variation
- 600 at 7:10 (Z2)
- 600 at 7:03 (Z1)  
- 600 at 6:55–6:59 (CS)

Cool Down
200 Swim, br 3/5/3/7 by 25"""

print("=" * 80)
print("ORIGINAL WORKOUT:")
print("=" * 80)
print(workout)
print()

# Now let's see what the sections should be:
lines = workout.split('\n')
print("=" * 80)
print("LINE BY LINE ANALYSIS:")
print("=" * 80)
for i, line in enumerate(lines):
    print(f"{i:3d}: '{line}'")
print()

# What sections do we detect?
print("=" * 80)
print("SECTION DETECTION:")
print("=" * 80)

current_section = None
for i, line in enumerate(lines):
    trimmed = line.strip()
    if trimmed.startswith('Warm Up'):
        print(f"Line {i}: Detected WARM UP header: '{trimmed}'")
        current_section = 'Warm Up'
    elif trimmed.startswith('Drill Set'):
        print(f"Line {i}: Detected DRILL SET header: '{trimmed}'")
        current_section = 'Drill Set'
    elif trimmed.startswith('Pre-Set') or trimmed.startswith('Pre Set'):
        print(f"Line {i}: Detected PRE-SET header: '{trimmed}'")
        current_section = 'Pre-Set'
    elif trimmed.startswith('Main Set'):
        print(f"Line {i}: Detected MAIN SET header: '{trimmed}'")
        current_section = 'Main Set'
    elif trimmed.startswith('Cool Down'):
        print(f"Line {i}: Detected COOL DOWN header: '{trimmed}'")
        current_section = 'Cool Down'
    elif trimmed:
        print(f"Line {i}: Content in {current_section}: '{trimmed}'")

