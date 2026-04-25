import re

def fix_swim_workout_formatting(description):
    """
    Comprehensive fix for swim workout formatting to match TrainingPeaks standards.
    """
    if not description:
        return ''
    
    lines = description.split('\n')
    result = []
    current_section = None
    section_content = []
    
    # Process line by line
    for line in lines:
        trimmed = line.strip()
        
        # Skip empty lines
        if not trimmed:
            continue
        
        # Check if line starts with a section header
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
                result.extend(format_section(current_section, section_content))
                result.append('')  # Blank line after section
            
            current_section = section_match
            section_content = []
            
            # Handle "Warm Up 400 as:" - keep the header with yardage
            if section_match == 'Warm Up' and 'as:' in trimmed.lower():
                section_content.append(trimmed)  # Keep the "400 as:" part
        elif current_section:
            # Add content to current section
            section_content.append(trimmed)
    
    # Don't forget last section
    if current_section:
        result.extend(format_section(current_section, section_content))
    
    # If no sections found, return original
    if not result:
        return description
    
    return '\n'.join(result).strip()


def format_section(section_name, content):
    """Format a section according to TrainingPeaks standards."""
    result = [section_name]
    
    if section_name == 'Warm Up':
        return format_warm_up(content)
    elif section_name == 'Drill Set':
        return format_drill_set(content)
    elif section_name == 'Pre-Set':
        return format_pre_set(content)
    elif section_name == 'Main Set':
        return format_main_set(content)
    elif section_name == 'Cool Down':
        return format_cool_down(content)
    
    return result


def format_warm_up(content):
    """
    Format Warm Up section:
    - Keep "400 as:" on same line as "Warm Up"
    - Each exercise gets "- " prefix
    - Consolidate consecutive kicks (7 x 25 + 1 x 25 = 8 x 25)
    - Move "Take Xs" to end of exercise with " - Take Xs"
    """
    result = []
    exercises = []
    
    # Check if first line is "XXX as:"
    header = "Warm Up"
    start_idx = 0
    
    if content and 'as:' in content[0].lower():
        # Extract yardage, e.g., "400 as:"
        header = "Warm Up"  # We'll add "400 as:" below
        start_idx = 1
    
    result.append(header)
    
    # Process exercises
    i = start_idx
    while i < len(content):
        line = content[i].strip()
        
        # Remove existing "- " prefix
        line = re.sub(r'^[-–—•]\s*', '', line)
        
        # Check if next line is "Take Xs"
        take_line = ''
        if i + 1 < len(content):
            next_line = content[i + 1].strip()
            if re.match(r'^[-–—•]?\s*Take\s+\d+s?', next_line, re.IGNORECASE):
                take_line = re.sub(r'^[-–—•]\s*', '', next_line)
                take_line = re.sub(r'\bs\b', ' sec', take_line, flags=re.IGNORECASE)
                i += 1  # Skip the Take line
        
        # Combine exercise with "Take" if present
        if take_line:
            line = f"{line} - {take_line}"
        
        # Fix "sec" vs "s"
        line = re.sub(r'\b(\d+)s\b', r'\1 sec', line)
        
        exercises.append(line)
        i += 1
    
    # Consolidate consecutive kicks
    exercises = consolidate_kicks(exercises)
    
    # Add "- " prefix to each exercise
    for ex in exercises:
        if ex.strip():
            result.append(f"- {ex}")
    
    return result


def consolidate_kicks(exercises):
    """Consolidate consecutive kick exercises: 7 x 25 + 1 x 25 = 8 x 25"""
    consolidated = []
    i = 0
    
    while i < len(exercises):
        current = exercises[i]
        
        # Check if this is a kick exercise
        kick_match = re.match(r'(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$', current, re.IGNORECASE)
        
        if kick_match and i + 1 < len(exercises):
            # Check if next is also a kick with same distance and rest
            next_line = exercises[i + 1]
            next_match = re.match(r'(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$', next_line, re.IGNORECASE)
            
            if next_match:
                reps1, dist1, rest1 = kick_match.groups()
                reps2, dist2, rest2 = next_match.groups()
                
                # Normalize rest text for comparison
                rest1_norm = rest1.strip().lower()
                rest2_norm = rest2.strip().lower()
                
                # If distances and rest match, consolidate
                if dist1 == dist2 and rest1_norm == rest2_norm:
                    total_reps = int(reps1) + int(reps2)
                    consolidated_kick = f"{total_reps} x {dist1} Kick"
                    if rest1.strip():
                        consolidated_kick += f" {rest1.strip()}"
                    consolidated.append(consolidated_kick)
                    i += 2  # Skip both
                    continue
        
        # Not a kick or no consolidation - add as-is
        consolidated.append(current)
        i += 1
    
    return consolidated


def format_drill_set(content):
    """
    Format Drill Set:
    - Each drill on separate line
    - Keep "One Times Through..." and similar phrases
    - Move "Take Xs" to end of line with " - Take Xs"
    """
    result = ["Drill Set"]
    
    # Join content but preserve meaningful breaks
    full_text = ' '.join(content)
    
    # Split by drill patterns
    lines = []
    current_line = []
    
    for item in content:
        # Check if this is "Take Xs" line
        if re.match(r'^[-–—•]?\s*Take\s+\d+', item, re.IGNORECASE):
            # Attach to previous line
            if lines:
                take_text = re.sub(r'^[-–—•]\s*', '', item)
                take_text = re.sub(r'\bs\b', ' sec', take_text, flags=re.IGNORECASE)
                lines[-1] += f" - {take_text}"
            continue
        
        # Remove prefix
        item = re.sub(r'^[-–—•]\s*', '', item)
        
        # Check for drill repetition patterns (e.g., "7 x 25 Press Your Buoy")
        if re.match(r'\d+\s*x\s*\d+', item):
            if current_line:
                lines.append(' '.join(current_line))
                current_line = []
            lines.append(item)
        elif 'Times Through' in item or 'after each' in item:
            if current_line:
                lines.append(' '.join(current_line))
                current_line = []
            lines.append(item)
        else:
            lines.append(item)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    # Fix sec vs s
    lines = [re.sub(r'\b(\d+)s\b', r'\1 sec', line) for line in lines]
    
    result.extend(lines)
    return result


def format_pre_set(content):
    """
    Format Pre-Set:
    - Each set on separate line
    - Fix parentheses: "8x(25 Kick, 50 Swim @80%)" becomes "8x(25 Kick, 50 Swim @80%) - Take 10s"
    """
    result = ["Pre-Set"]
    
    # Process each line
    for item in content:
        # Remove prefix
        item = re.sub(r'^[-–—•]\s*', '', item)
        
        # Check if next line is "Take Xs"
        # (This logic needs to be in the main formatter)
        
        # Fix spacing before "- Take"
        item = re.sub(r'\)\s*[-–—]\s*Take', r') - Take', item)
        item = re.sub(r'\b(\d+)s\b', r'\1 sec', item)
        
        if item.strip():
            result.append(item)
    
    return result


def format_main_set(content):
    """
    Format Main Set:
    - Each set on separate line
    - Preserve "One Times Through...", "Two Times Through...", etc.
    - Keep "#1", "#2" numbering
    """
    result = ["Main Set"]
    
    for item in content:
        # Remove prefix
        item = re.sub(r'^[-–—•]\s*', '', item)
        
        # Fix "- Take" spacing
        item = re.sub(r'\s+[-–—]\s*Take', ' - Take', item)
        item = re.sub(r'\b(\d+)s\b', r'\1 sec', item)
        
        if item.strip():
            result.append(item)
    
    return result


def format_cool_down(content):
    """
    Format Cool Down:
    - Each exercise on separate line
    - Move "Take Xs" to end of exercise
    """
    result = ["Cool Down"]
    
    i = 0
    while i < len(content):
        line = content[i].strip()
        
        # Remove prefix
        line = re.sub(r'^[-–—•]\s*', '', line)
        
        # Check if next line is "Take Xs"
        if i + 1 < len(content):
            next_line = content[i + 1].strip()
            if re.match(r'^[-–—•]?\s*Take\s+\d+', next_line, re.IGNORECASE):
                take_text = re.sub(r'^[-–—•]\s*', '', next_line)
                take_text = re.sub(r'\bs\b', ' sec', take_text, flags=re.IGNORECASE)
                line = f"{line} - {take_text}"
                i += 1  # Skip the Take line
        
        # Fix sec
        line = re.sub(r'\b(\d+)s\b', r'\1 sec', line)
        
        if line:
            result.append(line)
        i += 1
    
    return result


# Test with examples
examples = [
    """Warm Up 400 as:
- 200 Swim @50-70%
- 100 Pull/Paddles @70%
2 x 25 FAST Swim
- Take 10s""",
    
    """Warm Up
- 300 Swim @50–70%
- 7 x 25 Kick – Take 5s
- 1 x 25 Kick – Take 5s
- 100 Pull @60–70%"""
]

print("🧪 TESTING FIX:\n")
for i, ex in enumerate(examples, 1):
    print(f"{'='*60}")
    print(f"EXAMPLE {i}:")
    print(f"{'='*60}")
    print("BEFORE:")
    print(ex)
    print("\nAFTER:")
    result = fix_swim_workout_formatting(ex)
    print(result)
    print()

