# Verify that yardage calculations are correct for all workout sections

def calculate_yardage_from_description(description):
    """Calculate total yardage from workout description"""
    
    print("\n" + "="*80)
    print("YARDAGE BREAKDOWN CALCULATION")
    print("="*80)
    
    lines = description.strip().split('\n')
    total_yardage = 0
    current_section = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect sections
        if line.startswith('Warm Up'):
            current_section = 'Warm Up'
            # Extract yardage from header if present (e.g., "Warm Up 400 as:")
            import re
            match = re.search(r'Warm Up (\d+)', line)
            if match:
                warmup_total = int(match.group(1))
                print(f"\n{current_section}: {warmup_total} yards (from header)")
                total_yardage += warmup_total
            continue
        elif line.startswith('Drill Set'):
            current_section = 'Drill Set'
            print(f"\n{current_section}:")
            continue
        elif line.startswith('Pre-Set') or line.startswith('Pre Set'):
            current_section = 'Pre-Set'
            print(f"\n{current_section}:")
            continue
        elif line.startswith('Main Set'):
            current_section = 'Main Set'
            print(f"\n{current_section}:")
            continue
        elif line.startswith('Cool Down'):
            current_section = 'Cool Down'
            print(f"\n{current_section}:")
            continue
        
        # Parse yardage from line
        # Look for patterns like:
        # - "200 Swim @50–70%" = 200 yards
        # - "2 x 25 Kick" = 2 * 25 = 50 yards
        # - "4 x 50 Swim" = 4 * 50 = 200 yards
        # - "100 Pull @70%" = 100 yards
        
        import re
        
        # Pattern: "N x M" (e.g., "2 x 25", "4 x 50")
        match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
        if match:
            reps = int(match.group(1))
            distance = int(match.group(2))
            yards = reps * distance
            print(f"  {line[:60]}... = {reps} × {distance} = {yards} yards")
            total_yardage += yards
            continue
        
        # Pattern: Just a distance (e.g., "200 Swim", "100 Pull")
        match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
        if match:
            yards = int(match.group(1))
            print(f"  {line[:60]}... = {yards} yards")
            total_yardage += yards
            continue
        
        # Pattern: Distance in the middle (e.g., "400 at 4:40–4:47")
        match = re.search(r'(\d+)\s+at\s+\d+:', line)
        if match:
            yards = int(match.group(1))
            print(f"  {line[:60]}... = {yards} yards")
            total_yardage += yards
            continue
    
    print(f"\n{'='*80}")
    print(f"TOTAL YARDAGE: {total_yardage} yards")
    print(f"{'='*80}")
    
    return total_yardage

# Test with real workouts
workouts = [
    {
        "title": "Endurance Build #1 - 2000 yards",
        "expected_yardage": 2000,
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
        "expected_yardage": 3500,
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
print("YARDAGE VERIFICATION FOR ALL WORKOUTS")
print("="*100)

for i, workout in enumerate(workouts, 1):
    print(f"\n\n{'#'*100}")
    print(f"WORKOUT {i}: {workout['title']}")
    print(f"Expected Yardage: {workout['expected_yardage']} yards")
    print(f"{'#'*100}")
    
    calculated = calculate_yardage_from_description(workout['description'])
    
    print(f"\n{'='*80}")
    if calculated == workout['expected_yardage']:
        print(f"✅ CORRECT: {calculated} yards matches expected {workout['expected_yardage']} yards")
    else:
        print(f"❌ MISMATCH: {calculated} yards vs expected {workout['expected_yardage']} yards")
        print(f"   Difference: {calculated - workout['expected_yardage']} yards")
    print(f"{'='*80}")

# Now check what the Warm Up should contain
print("\n\n" + "="*100)
print("WARM UP CONTENT VERIFICATION")
print("="*100)

for i, workout in enumerate(workouts, 1):
    print(f"\n{workout['title']}:")
    print("-" * 80)
    
    # Extract just the warm up section
    desc = workout['description']
    warmup_section = desc.split('Drill Set')[0]
    
    print("Warm Up Section from Library:")
    print(warmup_section)
    
    # Calculate warm up yardage
    warmup_yards = 0
    lines = warmup_section.strip().split('\n')
    
    import re
    for line in lines:
        if 'Warm Up' in line:
            match = re.search(r'Warm Up (\d+)', line)
            if match:
                warmup_yards = int(match.group(1))
    
    print(f"\nWarm Up Total: {warmup_yards} yards")
    
    # Verify the items add up
    print("\nWarm Up Items:")
    for line in lines[1:]:  # Skip the header line
        line = line.strip()
        if not line:
            continue
        print(f"  • {line}")

