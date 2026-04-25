# Test with an actual library workout

import re

# This is the exact raw description from the library (line 647 of swim-planner.html)
raw_description = """Warm Up 400 as:
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

print("=" * 80)
print("STEP 1 - RAW DESCRIPTION FROM LIBRARY:")
print("=" * 80)
print(raw_description)
print()

# Apply fixWorkoutFormatting (simulate the JavaScript function)
def fixWorkoutFormatting(description):
    if not description:
        return ''
    
    lines = description.split('\n')
    result = []
    currentSection = None
    sectionContent = []
    
    for line in lines:
        trimmed = line.strip()
        
        # Skip empty lines
        if not trimmed:
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
            # Save previous section
            if currentSection:
                result.extend(formatSection(currentSection, sectionContent))
                result.append('')  # Blank line after section
            
            currentSection = sectionMatch
            sectionContent = []
        elif currentSection:
            # Add content to current section
            sectionContent.append(trimmed)
    
    # Don't forget last section
    if currentSection:
        result.extend(formatSection(currentSection, sectionContent))
    
    if not result:
        return description
    
    return '\n'.join(result).strip()

def formatSection(sectionName, content):
    result = [sectionName]
    
    if sectionName == 'Warm Up':
        # Each item gets " - " prefix
        for item in content:
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                continue
            
            # Remove existing prefixes
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(f' - {cleaned}')
    
    elif sectionName in ['Drill Set', 'Pre-Set', 'Cool Down']:
        # Single line, no prefix
        combined = ' '.join(content)
        combined = re.sub(r'\s+', ' ', combined)
        result.append(combined)
    
    elif sectionName == 'Main Set':
        # Multiple lines, no prefix
        for item in content:
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                continue
            
            # Remove existing prefixes
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(cleaned)
    
    return result

formatted = fixWorkoutFormatting(raw_description)

print("=" * 80)
print("STEP 2 - AFTER fixWorkoutFormatting():")
print("=" * 80)
print(formatted)
print()

