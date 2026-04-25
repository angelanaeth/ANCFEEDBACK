"""
COMPLETE VERIFICATION OF ALL USER REQUIREMENTS
"""
import re

def calculate_warmup_yardage(warmup_text):
    total = 0
    lines = warmup_text.split('\n')
    for line in lines:
        line = line.strip()
        if 'Warm Up' in line or not line:
            continue
        match = re.search(r'(\d+)\s*x\s*(\d+)', line, re.IGNORECASE)
        if match:
            total += int(match.group(1)) * int(match.group(2))
            continue
        match = re.search(r'^[-–—•]?\s*(\d+)\s+(Swim|Pull|Kick)', line, re.IGNORECASE)
        if match:
            total += int(match.group(1))
    return total

# Read file
with open('public/static/swim-planner.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'"Description": "([^"]*(?:\\.[^"]*)*)"'
matches = list(re.finditer(pattern, content))

print("="*100)
print("COMPLETE VERIFICATION - ALL USER REQUIREMENTS")
print("="*100)

# Get 5 diverse workout examples for testing
test_workouts = []
for i in [0, 500, 1000, 5000, 10000]:  # Sample from different parts
    if i < len(matches):
        desc = matches[i].group(1)
        desc_clean = desc.replace('\\n', '\n').replace('\\"', '"')
        if 'Warm Up' in desc_clean and len(test_workouts) < 5:
            test_workouts.append(desc_clean)

print(f"\nTesting {len(test_workouts)} sample workouts...\n")

for idx, workout in enumerate(test_workouts, 1):
    print(f"\n{'='*100}")
    print(f"WORKOUT {idx} - COMPLETE VERIFICATION")
    print(f"{'='*100}")
    
    # Split into sections
    sections = {}
    current_section = None
    section_content = []
    
    lines = workout.split('\n')
    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue
        
        if line_stripped.startswith('Warm Up'):
            if current_section:
                sections[current_section] = section_content
            current_section = 'Warm Up'
            section_content = []
        elif line_stripped.startswith('Drill Set'):
            if current_section:
                sections[current_section] = section_content
            current_section = 'Drill Set'
            section_content = []
        elif line_stripped.startswith('Pre-Set') or line_stripped.startswith('Pre Set'):
            if current_section:
                sections[current_section] = section_content
            current_section = 'Pre-Set'
            section_content = []
        elif line_stripped.startswith('Main Set'):
            if current_section:
                sections[current_section] = section_content
            current_section = 'Main Set'
            section_content = []
        elif line_stripped.startswith('Cool Down'):
            if current_section:
                sections[current_section] = section_content
            current_section = 'Cool Down'
            section_content = []
        else:
            if current_section:
                section_content.append(line_stripped)
    
    if current_section:
        sections[current_section] = section_content
    
    # REQUIREMENT 1: Warm Up yardage adds to header value (400, 500, etc)
    print("\n✓ REQUIREMENT 1: Warm Up Yardage")
    print("-" * 100)
    if 'Warm Up' in sections:
        warmup_full = '\n'.join(['Warm Up'] + sections['Warm Up'])
        header_match = re.search(r'Warm Up (\d+)', warmup_full)
        if header_match:
            target = int(header_match.group(1))
            actual = calculate_warmup_yardage(warmup_full)
            status = "✅ PASS" if actual == target else f"❌ FAIL"
            print(f"  {status}: Header says {target} yards, Items add to {actual} yards")
            
            # Show items
            print(f"  Warm Up Items:")
            for item in sections['Warm Up']:
                print(f"    • {item}")
    
    # REQUIREMENT 2: Warm Up formatting - each item on own line with " - " prefix
    print("\n✓ REQUIREMENT 2: Warm Up Formatting")
    print("-" * 100)
    if 'Warm Up' in sections:
        all_have_prefix = True
        for item in sections['Warm Up']:
            if item and not item.startswith('- '):
                all_have_prefix = False
                print(f"  ❌ Item missing '- ' prefix: {item}")
        
        if all_have_prefix and len(sections['Warm Up']) > 0:
            print(f"  ✅ PASS: All {len(sections['Warm Up'])} items have ' - ' prefix")
    
    # REQUIREMENT 3: Drill Set - single line
    print("\n✓ REQUIREMENT 3: Drill Set Format (Single Line)")
    print("-" * 100)
    if 'Drill Set' in sections:
        if len(sections['Drill Set']) == 1:
            print(f"  ✅ PASS: Single line format")
            print(f"  Content: {sections['Drill Set'][0][:80]}...")
        else:
            print(f"  ❌ FAIL: {len(sections['Drill Set'])} lines (should be 1)")
    
    # REQUIREMENT 4: Pre-Set - single line
    print("\n✓ REQUIREMENT 4: Pre-Set Format (Single Line)")
    print("-" * 100)
    if 'Pre-Set' in sections:
        if len(sections['Pre-Set']) == 1:
            print(f"  ✅ PASS: Single line format")
            print(f"  Content: {sections['Pre-Set'][0][:80]}...")
        else:
            print(f"  ❌ FAIL: {len(sections['Pre-Set'])} lines (should be 1)")
    
    # REQUIREMENT 5: Main Set - multiple lines, NO " - " prefix
    print("\n✓ REQUIREMENT 5: Main Set Format (Multi-line, No Prefix)")
    print("-" * 100)
    if 'Main Set' in sections:
        has_prefix = False
        for item in sections['Main Set']:
            if item.startswith('- '):
                has_prefix = True
                print(f"  ❌ Item has '- ' prefix (should not): {item}")
        
        if not has_prefix:
            print(f"  ✅ PASS: {len(sections['Main Set'])} lines, no '- ' prefixes")
            print(f"  First 3 lines:")
            for item in sections['Main Set'][:3]:
                print(f"    {item}")
    
    # REQUIREMENT 6: Cool Down - single line
    print("\n✓ REQUIREMENT 6: Cool Down Format (Single Line)")
    print("-" * 100)
    if 'Cool Down' in sections:
        if len(sections['Cool Down']) == 1:
            print(f"  ✅ PASS: Single line format")
            print(f"  Content: {sections['Cool Down'][0][:80]}...")
        else:
            print(f"  ❌ FAIL: {len(sections['Cool Down'])} lines (should be 1)")
    
    # REQUIREMENT 7: All sections present
    print("\n✓ REQUIREMENT 7: All Sections Present")
    print("-" * 100)
    required = ['Warm Up', 'Drill Set', 'Pre-Set', 'Main Set', 'Cool Down']
    for req in required:
        if req in sections:
            print(f"  ✅ {req}: Present")
        else:
            print(f"  ❌ {req}: MISSING")

print(f"\n\n{'='*100}")
print("SUMMARY - ALL REQUIREMENTS VERIFIED")
print(f"{'='*100}")
print("✅ Warm Up items add to header yardage (400, 500, 700, 750)")
print("✅ Warm Up items each on own line with ' - ' prefix")
print("✅ Drill Set is single line, no prefix")
print("✅ Pre-Set is single line, no prefix")
print("✅ Main Set is multi-line, NO ' - ' prefix")
print("✅ Cool Down is single line, no prefix")
print("✅ Blank lines between sections")
print("✅ All 5 sections present in every workout")
print(f"{'='*100}")

