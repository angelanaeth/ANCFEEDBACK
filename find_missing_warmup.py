# Find what's being removed from the warm up

import re

raw_workout = """Warm Up 400 as:
- 200 Swim @50–70%
2 x 25 Kick – Take 5s

- 100 Pull @70%

Drill Set
– Take 5–10s after each 25 Six Times Through... 25 Press Your Buoy Drill 25 Swim"""

print("="*80)
print("RAW WARM UP SECTION:")
print("="*80)

warmup = raw_workout.split('Drill Set')[0]
print(warmup)

print("\n" + "="*80)
print("CALCULATING YARDAGE:")
print("="*80)

lines = warmup.strip().split('\n')
total = 0

for line in lines:
    line = line.strip()
    if not line or 'Warm Up' in line:
        continue
    
    print(f"Line: '{line}'")
    
    # Check for N x M pattern
    match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
    if match:
        reps = int(match.group(1))
        dist = int(match.group(2))
        yards = reps * dist
        print(f"  → {reps} × {dist} = {yards} yards")
        total += yards
        continue
    
    # Check for distance + type
    match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
    if match:
        yards = int(match.group(1))
        print(f"  → {yards} yards")
        total += yards
        continue
    
    print(f"  → NOT COUNTED")

print(f"\nTotal: {total} yards")
print(f"Header says: 400 yards")
print(f"Missing: {400 - total} yards")

print("\n" + "="*80)
print("AFTER fixWorkoutFormatting():")
print("="*80)

# Simulate the formatter
def fixWorkoutFormatting(description):
    lines = description.split('\n')
    result = []
    currentSection = None
    sectionContent = []
    
    for line in lines:
        trimmed = line.strip()
        if not trimmed:
            continue
        
        sectionMatch = None
        if trimmed.startswith('Warm Up'):
            sectionMatch = 'Warm Up'
        elif trimmed.startswith('Drill Set'):
            sectionMatch = 'Drill Set'
        
        if sectionMatch:
            if currentSection:
                result.extend(formatSection(currentSection, sectionContent))
                result.append('')
            currentSection = sectionMatch
            sectionContent = []
        elif currentSection:
            sectionContent.append(trimmed)
    
    if currentSection:
        result.extend(formatSection(currentSection, sectionContent))
    
    return '\n'.join(result).strip()

def formatSection(sectionName, content):
    result = [sectionName]
    
    if sectionName == 'Warm Up':
        print(f"\nFormatting Warm Up with {len(content)} items:")
        for i, item in enumerate(content):
            print(f"  [{i}] '{item}'")
            # THE PROBLEM: This line skips anything with ' as:' in it!
            if ' as:' in item.lower():
                print(f"      ⚠️  SKIPPED because contains ' as:'")
                continue
            
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(f' - {cleaned}')
                print(f"      ✓ Added: ' - {cleaned}'")
    
    return result

formatted = fixWorkoutFormatting(raw_workout)
print("\nFormatted output:")
print(formatted)

# Calculate yardage from formatted
print("\n" + "="*80)
print("YARDAGE FROM FORMATTED OUTPUT:")
print("="*80)

formatted_lines = formatted.split('\n')
formatted_total = 0

for line in formatted_lines:
    line = line.strip()
    if not line or 'Warm Up' in line:
        continue
    
    # Check for N x M pattern
    match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
    if match:
        reps = int(match.group(1))
        dist = int(match.group(2))
        yards = reps * dist
        print(f"  {line} = {yards} yards")
        formatted_total += yards
        continue
    
    # Check for distance + type
    match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
    if match:
        yards = int(match.group(1))
        print(f"  {line} = {yards} yards")
        formatted_total += yards
        continue

print(f"\nFormatted total: {formatted_total} yards")
print(f"Original header: 400 yards")
print(f"Lost: {400 - formatted_total} yards")

