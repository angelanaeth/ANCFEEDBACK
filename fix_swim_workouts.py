#!/usr/bin/env python3
"""
Fix all swim workouts with correct formatting and send-off intervals
"""

import re
import json
import math

def parse_time_to_seconds(time_str):
    """Convert time string to seconds (e.g., ':35' -> 35, '1:10' -> 70, '5:47' -> 347)"""
    time_str = time_str.strip()
    
    # Handle range (take upper bound)
    if '-' in time_str or '–' in time_str or '—' in time_str:
        parts = re.split(r'[-–—]', time_str)
        time_str = parts[-1].strip()
    
    # Remove any non-time characters
    time_str = re.sub(r'[^0-9:]', '', time_str)
    
    if not time_str:
        return 0
    
    if ':' in time_str:
        parts = time_str.split(':')
        if len(parts) == 2:
            mins = parts[0] if parts[0] else '0'
            secs = parts[1] if parts[1] else '0'
            return int(mins) * 60 + int(secs)
    else:
        try:
            return int(time_str)
        except:
            return 0
    
    return 0

def seconds_to_time(seconds):
    """Convert seconds to time string (e.g., 70 -> '1:10', 35 -> ':35')"""
    mins = seconds // 60
    secs = seconds % 60
    
    if mins == 0:
        return f':{secs:02d}'
    else:
        return f'{mins}:{secs:02d}'

def round_up_to_interval(seconds, interval=5):
    """Round up to nearest :00 or :05"""
    # Get just the seconds part
    secs_only = seconds % 60
    mins = seconds // 60
    
    # Round up to nearest 5
    if secs_only % interval == 0:
        rounded_secs = secs_only
    else:
        rounded_secs = ((secs_only // interval) + 1) * interval
    
    # Handle overflow
    if rounded_secs >= 60:
        mins += rounded_secs // 60
        rounded_secs = rounded_secs % 60
    
    return mins * 60 + rounded_secs

def calculate_send_off(distance, target_time, zone):
    """
    Calculate send-off interval based on distance, target time, and zone
    
    Rules:
    - Z1: ≤400 add 10s, >400 add 15s
    - Z2: ≤300 add 10s, >300 add 15s
    - CS: ≤200 add 10s, >200 add 20s
    - 5%: ≤100 add 15s, >100 add 20s
    - 10%: ≤50 add 15s, >50 add 20s
    
    All results rounded UP to nearest :00 or :05
    """
    zone = zone.upper().strip()
    
    # Parse target time (take upper bound if range)
    target_seconds = parse_time_to_seconds(target_time)
    
    # Determine rest to add
    rest = 0
    if zone == 'Z1':
        rest = 10 if distance <= 400 else 15
    elif zone == 'Z2':
        rest = 10 if distance <= 300 else 15
    elif zone == 'CS':
        rest = 10 if distance <= 200 else 20
    elif '5%' in zone:
        rest = 15 if distance <= 100 else 20
    elif '10%' in zone:
        rest = 15 if distance <= 50 else 20
    else:
        # Default for unknown zones
        rest = 10
    
    # Calculate send-off
    send_off_seconds = target_seconds + rest
    
    # Round up to nearest :00 or :05
    send_off_seconds = round_up_to_interval(send_off_seconds, 5)
    
    return seconds_to_time(send_off_seconds)

def fix_workout_format(description):
    """Fix workout formatting according to new rules"""
    lines = description.split('\n')
    
    result = []
    current_section = None
    section_content = []
    
    for line in lines:
        line_stripped = line.strip()
        
        # Check if this is a section header
        if line_stripped in ['Warm Up', 'Drill Set', 'Pre-Set', 'Main Set', 'Cool Down']:
            # Save previous section
            if current_section:
                formatted = format_section(current_section, section_content)
                result.extend(formatted)
                result.append('')  # Blank line after section
            
            # Start new section
            current_section = line_stripped
            section_content = []
        elif line_stripped and current_section:
            section_content.append(line_stripped)
    
    # Don't forget last section
    if current_section:
        formatted = format_section(current_section, section_content)
        result.extend(formatted)
    
    return '\n'.join(result).strip()

def format_section(section_name, content):
    """Format a section according to rules"""
    result = [section_name]
    
    if section_name == 'Warm Up':
        # Process warm up items
        for item in content:
            # Skip "XXX as:" lines
            if 'as:' in item.lower():
                continue
            # Remove leading dashes/bullets
            item = re.sub(r'^[-–—•]\s*', '', item)
            # Add proper prefix
            if item:
                result.append(f' - {item}')
    
    elif section_name in ['Drill Set', 'Pre-Set', 'Cool Down']:
        # Single line, no prefix
        combined = ' '.join(content)
        # Clean up formatting
        combined = re.sub(r'\n', ' ', combined)
        combined = re.sub(r'\s+', ' ', combined)
        result.append(combined)
    
    elif section_name == 'Main Set':
        # Multiple lines, no prefix
        for item in content:
            # Skip "XXX as:" lines
            if 'as:' in item.lower():
                continue
            # Remove leading dashes/bullets
            item = re.sub(r'^[-–—•]\s*', '', item)
            if item:
                result.append(item)
    
    return result

def add_send_offs_to_workout(description):
    """Add send-off intervals to all CS-based sets"""
    
    # Pattern to match swim sets with zones
    # Examples: "4x50 Swim in :35 (CS)", "3x100 Swim in 1:10 (5%)", "5x200 Swim in 2:46-2:49 (CS)"
    pattern = r'(\d+)\s*x\s*(\d+)\s+Swim\s+in\s+([\d:–—-]+)\s+\(([^)]+)\)'
    
    def replace_with_sendoff(match):
        reps = match.group(1)
        distance = int(match.group(2))
        time = match.group(3)
        zone = match.group(4)
        
        # Only add send-off for CS-based zones
        if zone.upper() in ['CS', 'Z1', 'Z2'] or '5%' in zone or '10%' in zone:
            send_off = calculate_send_off(distance, time, zone)
            return f'{reps}x{distance} Swim in {time} ({zone}) on {send_off}'
        else:
            return match.group(0)
    
    return re.sub(pattern, replace_with_sendoff, description)

def fix_all_workouts(input_file, output_file):
    """Process entire workout library"""
    print(f"Reading {input_file}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Processing workouts...")
    
    # Find the workout library section
    # It's a JavaScript object starting with "const workoutLibrary = {"
    start_marker = 'const workoutLibrary = {'
    end_marker = '};'
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("ERROR: Could not find workoutLibrary")
        return
    
    # Find the end of the workoutLibrary object
    # This is tricky - we need to find the matching closing brace
    # For now, let's extract everything from start_marker to a reasonable endpoint
    
    print("Extracting workout descriptions...")
    
    # Use regex to find all Description fields
    pattern = r'"Description":\s*"([^"]*(?:\\.[^"]*)*)"'
    
    matches = list(re.finditer(pattern, content))
    print(f"Found {len(matches)} workout descriptions")
    
    # Process each match
    replacements = []
    for i, match in enumerate(matches):
        old_desc = match.group(1)
        
        # Unescape the description
        old_desc_unescaped = old_desc.encode().decode('unicode_escape')
        
        # Fix format
        new_desc = fix_workout_format(old_desc_unescaped)
        
        # Add send-offs
        new_desc = add_send_offs_to_workout(new_desc)
        
        # Escape for JSON
        new_desc_escaped = json.dumps(new_desc)[1:-1]  # Remove surrounding quotes
        
        replacements.append((match.start(1), match.end(1), new_desc_escaped))
        
        if (i + 1) % 100 == 0:
            print(f"Processed {i + 1}/{len(matches)} workouts...")
    
    # Apply replacements in reverse order to preserve indices
    print("Applying changes...")
    result = content
    for start, end, new_text in reversed(replacements):
        result = result[:start] + new_text + result[end:]
    
    print(f"Writing to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(result)
    
    print("Done!")

if __name__ == '__main__':
    input_file = '/home/user/webapp/public/static/swim-planner.html'
    output_file = '/home/user/webapp/public/static/swim-planner-fixed.html'
    
    fix_all_workouts(input_file, output_file)
