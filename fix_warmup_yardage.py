#!/usr/bin/env python3
"""
Fix all workout warm-ups to have correct yardage.
Warm-ups should add to exactly 400 yards (or 500 if specified).
"""

import re
import json

def calculate_warmup_yardage(warmup_text):
    """Calculate total yardage from warm-up items"""
    total = 0
    lines = warmup_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if 'Warm Up' in line or not line:
            continue
        
        # Pattern: N x M
        match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
        if match:
            total += int(match.group(1)) * int(match.group(2))
            continue
        
        # Pattern: Distance + type
        match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
        if match:
            total += int(match.group(1))
            continue
    
    return total

def fix_warmup(description):
    """Fix warm-up section to add to exactly 400 yards"""
    
    if 'Warm Up' not in description:
        return description
    
    # Extract warm-up section
    parts = description.split('Drill Set')
    if len(parts) < 2:
        parts = description.split('Pre-Set')
        if len(parts) < 2:
            return description  # Can't find drill or pre-set
        drill_marker = 'Pre-Set'
    else:
        drill_marker = 'Drill Set'
    
    warmup_section = parts[0]
    rest_of_workout = drill_marker + parts[1]
    
    # Get target yardage from header
    header_match = re.search(r'Warm Up (\d+)', warmup_section)
    if not header_match:
        return description
    
    target_yards = int(header_match.group(1))
    
    # Calculate current yardage
    current_yards = calculate_warmup_yardage(warmup_section)
    missing_yards = target_yards - current_yards
    
    if missing_yards == 0:
        return description  # Already correct!
    
    # Add missing yardage as kick sets
    if missing_yards == 50:
        # Add 2 x 25 Kick
        fix_item = "2 x 25 Kick – Take 5s"
    elif missing_yards == 25:
        # Add 1 x 25 Kick
        fix_item = "1 x 25 Kick – Take 5s"
    else:
        print(f"  ⚠️  Unusual missing yardage: {missing_yards} yards - skipping")
        return description
    
    # Insert the fix before the last item (usually "- 100 Pull @70%")
    lines = warmup_section.split('\n')
    
    # Find where to insert (before last "- " line)
    insert_idx = -1
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip().startswith('- '):
            insert_idx = i
            break
    
    if insert_idx == -1:
        # Can't find insertion point, add at end
        warmup_section += f"\n{fix_item}\n"
    else:
        # Insert before the last item
        lines.insert(insert_idx, fix_item)
        warmup_section = '\n'.join(lines)
    
    return warmup_section + '\n\n' + rest_of_workout

# Test with sample workout
test_workout = """Warm Up 400 as:
- 200 Swim @50–70%
2 x 25 Kick – Take 5s

- 100 Pull @70%

Drill Set
– Take 5–10s after each 25 Six Times Through... 25 Press Your Buoy Drill 25 Swim

Pre-Set
4 x 50 Swim in :35 (CS) on :45"""

print("="*100)
print("TEST WARM-UP FIX")
print("="*100)

print("\nORIGINAL:")
print(test_workout[:200])

warmup = test_workout.split('Drill Set')[0]
current = calculate_warmup_yardage(warmup)
print(f"\nCurrent yardage: {current} yards (target: 400)")
print(f"Missing: {400 - current} yards")

fixed = fix_warmup(test_workout)

print("\nFIXED:")
print(fixed[:250])

warmup_fixed = fixed.split('Drill Set')[0]
new_yards = calculate_warmup_yardage(warmup_fixed)
print(f"\nNew yardage: {new_yards} yards")
print(f"✅ Fixed!" if new_yards == 400 else f"❌ Still wrong!")

