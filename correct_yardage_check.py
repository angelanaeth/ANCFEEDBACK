# Correctly calculate yardage - don't double-count the warm up!

import re

def calculate_correct_yardage(description):
    """Calculate yardage correctly - treat 'Warm Up 400 as:' as a header only"""
    
    lines = description.strip().split('\n')
    total = 0
    sections = {}
    current_section = None
    section_total = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Section headers
        if line.startswith('Warm Up'):
            if current_section:
                sections[current_section] = section_total
            current_section = 'Warm Up'
            section_total = 0
            # Extract the total from header if present
            match = re.search(r'Warm Up (\d+)', line)
            if match:
                warmup_total = int(match.group(1))
                print(f"Warm Up: {warmup_total} yards (specified in header)")
                sections[current_section] = warmup_total
                total += warmup_total
                current_section = 'Warm Up (items)'  # Don't double-count
            continue
        elif line.startswith('Drill Set'):
            if current_section and current_section != 'Warm Up':
                sections[current_section] = section_total
                total += section_total
            current_section = 'Drill Set'
            section_total = 0
            continue
        elif line.startswith('Pre-Set') or line.startswith('Pre Set'):
            if current_section and current_section != 'Warm Up':
                sections[current_section] = section_total
                total += section_total
            current_section = 'Pre-Set'
            section_total = 0
            continue
        elif line.startswith('Main Set'):
            if current_section and current_section != 'Warm Up':
                sections[current_section] = section_total
                total += section_total
            current_section = 'Main Set'
            section_total = 0
            continue
        elif line.startswith('Cool Down'):
            if current_section and current_section != 'Warm Up':
                sections[current_section] = section_total
                total += section_total
            current_section = 'Cool Down'
            section_total = 0
            continue
        
        # Skip if we already counted the warm up from header
        if current_section == 'Warm Up (items)':
            continue
        
        # Parse line for yardage
        # Pattern: "N x M"
        match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
        if match:
            yards = int(match.group(1)) * int(match.group(2))
            section_total += yards
            continue
        
        # Pattern: "M Swim/Pull/Kick"
        match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
        if match:
            yards = int(match.group(1))
            section_total += yards
            continue
        
        # Pattern: "M at time"
        match = re.search(r'(\d+)\s+at\s+\d+:', line)
        if match:
            yards = int(match.group(1))
            section_total += yards
            continue
    
    # Add last section
    if current_section and current_section != 'Warm Up (items)':
        sections[current_section] = section_total
        total += section_total
    
    return total, sections

workouts = [
    {
        "title": "Endurance Build #1 - 2000 yards",
        "expected": 2000,
        "description": """Warm Up 400 as:
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

Cool Down
2 x 25 Press Your Buoy Drill
1 x 50 Swim – focused on PYB and a neutral head – Take 5–10s between each"""
    },
    {
        "title": "Endurance Build #1 - 3500 yards",
        "expected": 3500,
        "description": """Warm Up 400 as:
- 200 Swim @50–70%
4 x 25 Kick – Take 5s

- 100 Pull @70%

Drill Set
– Take 5–10s after each 25 Six Times Through... 25 Press Your Buoy Drill 25 Swim

Pre-Set
8 x 50 Swim in :35 (CS) on :45

Main Set
4 x 600 as follows, w/ 20s in between each:
#1 in 7:07–7:14 (Z2)
#2 in 7:20–7:27 (Z1)
#3 in 6:59–7:06 (CS)
#4 in 6:59–7:06 (CS)

Cool Down
4 x 25 Press Your Buoy Drill
2 x 50 Swim – focused on PYB and a neutral head – Take 5–10s between each"""
    }
]

print("="*100)
print("CORRECT YARDAGE CALCULATION")
print("="*100)

for workout in workouts:
    print(f"\n{workout['title']}")
    print("-" * 100)
    
    total, sections = calculate_correct_yardage(workout['description'])
    
    print(f"\nSection Breakdown:")
    for section, yards in sections.items():
        print(f"  {section}: {yards} yards")
    
    print(f"\n  TOTAL: {total} yards")
    print(f"  Expected: {workout['expected']} yards")
    
    if total == workout['expected']:
        print(f"  ✅ MATCH!")
    else:
        print(f"  ❌ MISMATCH - Difference: {total - workout['expected']} yards")

# Now let's verify what the ACTUAL warm up items add up to
print("\n\n" + "="*100)
print("WARM UP ITEM VERIFICATION")
print("="*100)

for workout in workouts:
    print(f"\n{workout['title']}")
    print("-" * 100)
    
    warmup_section = workout['description'].split('Drill Set')[0]
    lines = warmup_section.strip().split('\n')
    
    print("Warm Up Items:")
    item_total = 0
    for line in lines[1:]:  # Skip header
        line = line.strip()
        if not line:
            continue
        
        # Calculate yards for this item
        match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
        if match:
            yards = int(match.group(1)) * int(match.group(2))
            print(f"  • {line} = {yards} yards")
            item_total += yards
            continue
        
        match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
        if match:
            yards = int(match.group(1))
            print(f"  • {line} = {yards} yards")
            item_total += yards
            continue
    
    # Get header total
    header_total = None
    for line in lines:
        if 'Warm Up' in line:
            match = re.search(r'Warm Up (\d+)', line)
            if match:
                header_total = int(match.group(1))
                break
    
    print(f"\n  Items add up to: {item_total} yards")
    print(f"  Header says: {header_total} yards")
    
    if item_total == header_total:
        print(f"  ✅ MATCH - Items correctly add up to header total!")
    else:
        print(f"  ⚠️  DIFFERENCE: {item_total - header_total} yards")
        print(f"     This is OK if some items are not yardage-based (e.g., drills)")

