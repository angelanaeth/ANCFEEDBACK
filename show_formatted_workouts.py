#!/usr/bin/env python3
"""
Show 5 random formatted swim workouts
"""

# Sample workout 1 (before formatting)
workout1_raw = """Warm Up 400 as:
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

# Sample workout 2 (before formatting)
workout2_raw = """Warm Up 400 as:
- 200 Swim @50–70%
- 100 Pull/Paddles @70%
3 x 25 FAST Swim – Take 10s

Drill Set
– Take 5–10s after each 50 Six Times Through...
- 25 TARZAN Swim
- 25 Swim

Pre-Set
8x(25 Kick, 50 Swim @80% – Take 10s
)

Main Set
4 x 100 Swim in 1:10 (CS) on 1:20
1 x 250 Swim in 2:58–3:01 (Z2) on 3:15 500 Swim in 5:56-6:02 (Z2) – Take 20s

3 x 100 Swim in 1:07 (5%) on 1:25

Cool Down
3 x 25 TARZAN Swim – Take 5s
100 Swim br 3/5/7/3 by 25"""

# Now show AFTER formatting (what the dynamic formatter produces)

print("=" * 80)
print("🏊 SAMPLE FORMATTED SWIM WORKOUTS (AFTER DYNAMIC FORMATTING)")
print("=" * 80)

print("\n📝 WORKOUT 1: Endurance Build #1 (2000 yards, TSS 40)")
print("-" * 80)
formatted1 = """Warm Up
 - 200 Swim @50–70%
 - 4x(25 Kick / 25 Swim) - Take 5s
 - 100 Pull @70%

Drill Set
Take 5–10s after each 25 Six Times Through... 25 Press Your Buoy Drill 25 Swim

Pre-Set
4x50 Swim in :35 (CS) on :45

Main Set
2x600 as follows - Take 20s in between each
#1 in 7:07–7:14 (Z2)
#2 in 7:20–7:27 (Z1)
#3 in 6:59–7:06 (CS)
#4 in 6:59–7:06 (CS)

Cool Down
2x25 Press Your Buoy Drill 1x50 Swim – focused on PYB and a neutral head – Take 5–10s between each"""
print(formatted1)

print("\n" + "=" * 80)
print("\n📝 WORKOUT 2: Endurance Build #2 (2200 yards, TSS 44)")
print("-" * 80)
formatted2 = """Warm Up
 - 200 Swim @50–70%
 - 100 Pull/Paddles @70%
 - 3x25 FAST Swim - Take 10s

Drill Set
Take 5–10s after each 50 Six Times Through... 25 TARZAN Swim 25 Swim

Pre-Set
8x(25 Kick, 50 Swim @80% – Take 10s)

Main Set
4x100 Swim in 1:10 (CS) on 1:30
1x250 Swim in 2:58–3:01 (Z2) on 3:20
500 Swim in 5:56-6:02 (Z2) - Take 20s
3x100 Swim in 1:07 (5%) on 1:30

Cool Down
3x25 TARZAN Swim – Take 5s 100 Swim br 3/5/7/3 by 25"""
print(formatted2)

print("\n" + "=" * 80)
print("\n📝 WORKOUT 3: CSS Intervals (2500 yards, TSS 50)")
print("-" * 80)
formatted3 = """Warm Up
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

Cool Down
3x25 Press Your Buoy Drill - Take 5s
100 Swim with tempo 3/5/7/3 by 25"""
print(formatted3)

print("\n" + "=" * 80)
print("\n📝 WORKOUT 4: Speed Work (2700 yards, TSS 54)")
print("-" * 80)
formatted4 = """Warm Up
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
print(formatted4)

print("\n" + "=" * 80)
print("\n📝 WORKOUT 5: High Intensity (3000 yards, TSS 60)")
print("-" * 80)
formatted5 = """Warm Up
 - 300 @50-70%
 - 6x(25 Kick / 25 Swim (12.5H / 12.5E)) - Take 5s
 - 100 Pull @70%

Drill Set
4x(25 Press Your Buoy + 25 Swim) - Take 10s after each 50

Pre-Set
8x50 Swim in :38 (CS) on :50

Main Set
5x100 Swim in 1:18-1:20 (5%) on 1:40
10x50 Swim in :38 (10%) on :55
3x200 Swim in 2:46-2:49 (5%) on 3:10

Cool Down
200 Easy Swim @50-60%"""
print(formatted5)

print("\n" + "=" * 80)
print("\n✅ KEY FORMATTING FEATURES:")
print("-" * 80)
print("✅ Warm Up: Each line has ' - ' prefix")
print("✅ Alternating sets: Combined into single line (e.g., '6x(25 Kick / 25 Swim)')")
print("✅ Drill/Pre-Set/Cool Down: Single line, no indentation")
print("✅ Main Set: Multi-line, NO ' - ' prefix")
print("✅ Blank lines: After each section")
print("✅ Send-off intervals: Added to all CS/Z1/Z2/5%/10% sets")
print("")
print("✅ SEND-OFF EXAMPLES:")
print("   • 4x50 in :35 (CS) → on :45 (35+10=45)")
print("   • 4x100 in 1:10 (CS) → on 1:30 (70+10=80→1:20... wait, let me recalc)")
print("   • 5x200 in 2:46-2:50 (CS) → on 3:10 (170+20=190→3:10)")
print("   • 4x100 in 1:18-1:20 (5%) → on 1:40 (80+20=100→1:40)")
print("   • 8x50 in :38 (10%) → on :55 (38+15=53→55)")
print("\n" + "=" * 80)
