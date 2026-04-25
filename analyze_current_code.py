# Let's trace through what the ACTUAL code does step by step

import re

# This is a real workout from the library
raw_workout = """Warm Up 400 as:
- 200 Swim @50–70%
2 x 25 Kick – Take 5s

- 100 Pull @70%

Drill Set
– Take 5–10s after each 25 Six Times Through... 25 Press Your Buoy Drill 25 Swim

Pre-Set
4 x 50 Swim in :35 (CS) on :45

Main Set
2 x 600 as follows, w/ 20s in between each:
#1 in 7:07–7:14 (Z2)
#2 in 7:20–7:27 (Z1)
#3 in 6:59–7:06 (CS)
#4 in 6:59–7:06 (CS)

Cool Down
2 x 25 Press Your Buoy Drill
1 x 50 Swim – focused on PYB and a neutral head – Take 5–10s between each"""

print("="*80)
print("STEP 1: RAW WORKOUT FROM LIBRARY")
print("="*80)
print(raw_workout)
print(f"\nLength: {len(raw_workout)} characters")
print()

# STEP 2: addSendOffsToWorkout (this doesn't change structure, just adds "on X:XX")
# Skipping this for now since it just adds text

# STEP 3: fixWorkoutFormatting
def fixWorkoutFormatting(description):
    if not description:
        return ''
    
    lines = description.split('\n')
    result = []
    currentSection = None
    sectionContent = []
    
    print("PARSING LINES:")
    for i, line in enumerate(lines):
        trimmed = line.strip()
        
        # Skip empty lines
        if not trimmed:
            print(f"  Line {i}: [EMPTY - SKIP]")
            continue
        
        # Check if line STARTS with a section header
        sectionMatch = None
        if trimmed.startswith('Warm Up'):
            sectionMatch = 'Warm Up'
        elif trimmed.startswith('Drill Set'):
            sectionMatch = 'Drill Set'
        elif trimmed.startswith('Pre-Set') or trimmed.startswith('Pre Set'):
            sectionMatch = 'Pre-Set'
        elif trimmed.startswith('Main Set'):
            sectionMatch = 'Main Set'
        elif trimmed.startswith('Cool Down'):
            sectionMatch = 'Cool Down'
        
        if sectionMatch:
            print(f"  Line {i}: [HEADER] {sectionMatch}")
            # Save previous section
            if currentSection:
                formatted = formatSection(currentSection, sectionContent)
                result.extend(formatted)
                result.append('')  # Blank line after section
            
            currentSection = sectionMatch
            sectionContent = []
        elif currentSection:
            print(f"  Line {i}: [CONTENT for {currentSection}] '{trimmed}'")
            # Add content to current section
            sectionContent.append(trimmed)
        else:
            print(f"  Line {i}: [NO SECTION YET] '{trimmed}'")
    
    # Don't forget last section
    if currentSection:
        formatted = formatSection(currentSection, sectionContent)
        result.extend(formatted)
    
    if not result:
        return description
    
    return '\n'.join(result).strip()

def formatSection(sectionName, content):
    print(f"\n  → Formatting {sectionName} with {len(content)} items:")
    result = [sectionName]
    
    if sectionName == 'Warm Up':
        for i, item in enumerate(content):
            print(f"    [{i}] '{item}'")
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                print(f"        ⚠️  CONTAINS ' as:' - SKIPPING!")
                continue
            
            # Remove existing prefixes
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(f' - {cleaned}')
                print(f"        ✓ Added: ' - {cleaned}'")
    
    elif sectionName in ['Drill Set', 'Pre-Set', 'Cool Down']:
        combined = ' '.join(content)
        combined = re.sub(r'\s+', ' ', combined)
        result.append(combined)
        print(f"    Combined into: '{combined[:60]}...'")
    
    elif sectionName == 'Main Set':
        for i, item in enumerate(content):
            print(f"    [{i}] '{item}'")
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                print(f"        ⚠️  CONTAINS ' as:' - SKIPPING!")
                continue
            
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(cleaned)
                print(f"        ✓ Added: '{cleaned}'")
    
    print(f"  → Result has {len(result)} lines (including header)\n")
    return result

print("="*80)
print("STEP 2: AFTER fixWorkoutFormatting")
print("="*80)
formatted = fixWorkoutFormatting(raw_workout)
print("\nFINAL FORMATTED OUTPUT:")
print(formatted)
print(f"\nLength: {len(formatted)} characters")

