# Test the PROPER fix for workout formatting

def fixWorkoutFormatting(description):
    """
    Properly format a workout description with sections.
    
    Expected format:
    Warm Up
     - item 1
     - item 2
    
    Drill Set
    single line content
    
    Pre-Set
    single line content
    
    Main Set
    item 1
    item 2
    
    Cool Down
    single line content
    """
    if not description:
        return ''
    
    lines = description.split('\n')
    result = []
    current_section = None
    section_content = []
    
    for line in lines:
        trimmed = line.strip()
        
        # Skip empty lines
        if not trimmed:
            continue
        
        # Check if this is a section header
        section_match = None
        if trimmed.startswith('Warm Up'):
            section_match = 'Warm Up'
        elif trimmed.startswith('Drill Set'):
            section_match = 'Drill Set'
        elif trimmed.startswith('Pre-Set') or trimmed.startswith('Pre Set'):
            section_match = 'Pre-Set'
        elif trimmed.startswith('Main Set'):
            section_match = 'Main Set'
        elif trimmed.startswith('Cool Down'):
            section_match = 'Cool Down'
        
        if section_match:
            # Save previous section
            if current_section:
                result.extend(formatSection(current_section, section_content))
                result.append('')  # Blank line after section
            
            current_section = section_match
            section_content = []
            # DO NOT add the header line itself to content
        elif current_section:
            # Add content to current section
            section_content.append(trimmed)
    
    # Don't forget last section
    if current_section:
        result.extend(formatSection(current_section, section_content))
    
    # If no sections found, return original description
    if not result:
        return description
    
    return '\n'.join(result).strip()


def formatSection(section_name, content):
    """Format a section according to its type."""
    result = [section_name]
    
    if section_name == 'Warm Up':
        # Each item gets " - " prefix
        for item in content:
            # Remove existing prefixes
            cleaned = item.lstrip('- –—•').strip()
            if cleaned:
                result.append(f' - {cleaned}')
    
    elif section_name in ['Drill Set', 'Pre-Set', 'Cool Down']:
        # Single line, no prefix
        combined = ' '.join(content).strip()
        if combined:
            result.append(combined)
    
    elif section_name == 'Main Set':
        # Multiple lines, no prefix
        for item in content:
            # Remove existing prefixes
            cleaned = item.lstrip('- –—•').strip()
            if cleaned:
                result.append(cleaned)
    
    return result


# Test with actual workout
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
print("ORIGINAL:")
print("=" * 80)
print(workout)
print()

formatted = fixWorkoutFormatting(workout)
print("=" * 80)
print("FORMATTED:")
print("=" * 80)
print(formatted)
print()

print("=" * 80)
print("LINE COUNT:")
print("=" * 80)
print(f"Original: {len(workout.split(chr(10)))} lines")
print(f"Formatted: {len(formatted.split(chr(10)))} lines")

