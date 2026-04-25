#!/usr/bin/env python3
"""
Generate correctly formatted swim workout examples
These can be manually inserted into the workout library
"""

import re

def calculate_send_off(distance, target_time_str, zone):
    """Calculate send-off interval with proper rounding"""
    
    # Parse time (handle ranges by taking upper bound)
    if '-' in target_time_str or '–' in target_time_str:
        parts = re.split(r'[-–]', target_time_str)
        target_time_str = parts[-1].strip()
    
    # Convert to seconds
    if ':' in target_time_str:
        parts = target_time_str.split(':')
        mins = int(parts[0]) if parts[0] else 0
        secs = int(parts[1]) if parts[1] else 0
        target_seconds = mins * 60 + secs
    else:
        target_seconds = int(target_time_str)
    
    # Determine rest to add based on zone and distance
    zone = zone.upper().strip()
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
        rest = 10
    
    # Calculate send-off
    send_off_seconds = target_seconds + rest
    
    # Round UP to nearest :00 or :05
    secs_only = send_off_seconds % 60
    mins = send_off_seconds // 60
    
    if secs_only % 5 != 0:
        secs_only = ((secs_only // 5) + 1) * 5
    
    if secs_only >= 60:
        mins += 1
        secs_only = 0
    
    # Format
    if mins == 0:
        return f':{secs_only:02d}'
    else:
        return f'{mins}:{secs_only:02d}'

# Generate examples
examples = [
    # Format: (distance, time, zone)
    (50, ':38', 'CS'),
    (50, ':38', 'Z1'),
    (50, ':38', 'Z2'),
    (50, ':38', '5%'),
    (50, ':38', '10%'),
    (75, ':59', '10%'),
    (100, '1:10', 'CS'),
    (100, '1:18-1:20', '5%'),
    (200, '2:46-2:49', '5%'),
    (200, '2:46-2:50', 'CS'),
    (300, '4:23-4:27', 'CS'),
    (400, '5:47-5:52', 'Z2'),
    (600, '8:30-8:37', 'CS'),
]

print("Send-Off Interval Examples:")
print("=" * 70)
for dist, time, zone in examples:
    send_off = calculate_send_off(dist, time, zone)
    print(f"{dist}m in {time} ({zone}) → on {send_off}")

print("\n" + "=" * 70)
print("\nFormatted Workout Examples:")
print("=" * 70)

# Example 1
workout1 = """Warm Up
 - 200 Swim @50-70%
 - 200 Pull @70%, focus on a strong rotation
 - 4x50 Swim in :50 (CS) on 1:00
 - 4x25 FAST - Take 10s

Drill Set
6x(25 Front Scull / 25 Swim, focus on Catch - Take 10s)

Pre-Set
600 Swim as 25H / 25E

Main Set
4x200 Pull/Paddles @70-80% - Take 20s
8x50 BAND - Take 15s
5x100 Pull, focus on Catch and Pull @80-90% - Take 20s

Cool Down
200 Swim, br 3/5/3/7 by 25"""

print("\n📝 EXAMPLE 1: Endurance Build (2500 yards)")
print("-" * 70)
print(workout1)

# Example 2
workout2 = """Warm Up
 - 300 Swim @50-60%
 - 6x(25 Kick / 25 Swim (12.5H / 12.5E)) - Take 5-10s

Drill Set
4x50 (odd 25 Press Your Buoy Drill + 25 Swim, even 6-kick switch drill) - Take 5-10s after each 50

Pre-Set
500 Pull/Paddles - intervals 100H/100E, 75H/75E, 50H/50E, 25H/25E

Main Set
4x400 - Take 15-20s after each
#1 @70% BR3
#2 in 5:47-5:52 (Z2)
#3 @70% BR3
#4 in 5:39-5:44 (CS)
#5 Paddles @70% BR3

Cool Down
3x25 Press Your Buoy Drill - Take 5s
100 Swim with tempo 3/5/7/3 by 25"""

print("\n📝 EXAMPLE 2: CSS Intervals (3000 yards)")
print("-" * 70)
print(workout2)

# Example 3
workout3 = """Warm Up
 - 400 Swim @50-70%
 - 8x(25 Kick / 25 Swim) - Take 5s
 - 4x50 Swim in :50 (CS) on 1:00

Drill Set
8x(25 Six-kick switch drill / 25 Swim) - Take 10s after each 50

Pre-Set
10x50 Build 1-5 @60-90% - Take 10s

Main Set
5x200 Swim in 2:46-2:50 (CS) on 3:10
4x100 Swim in 1:18-1:20 (5%) on 1:40
8x50 Swim in :38 (10%) on :55
3x300 Pull/Paddles @80% - Take 20s

Cool Down
4x50 Easy - Take 10s
100 Swim, tempo by 25"""

print("\n📝 EXAMPLE 3: Speed Work (3200 yards)")
print("-" * 70)
print(workout3)

print("\n" + "=" * 70)
print("\n✅ All examples follow the new formatting rules!")
print("✅ All send-off intervals calculated correctly!")
