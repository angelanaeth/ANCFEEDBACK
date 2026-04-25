# Test what the regex replacements do

formatted_workout = """Warm Up
 - 200 Swim @50–70%
 - 2 x 25 Kick – Take 5s
 - 100 Pull @70%

Drill Set
6 x (25 Front Scull / 25 Swim, focus on Catch – Take 10s)

Pre-Set
600 Swim as 25H / 25E

Main Set
3 x 600 Swim with Variation
600 at 7:10 (Z2)
600 at 7:03 (Z1)
600 at 6:55–6:59 (CS)

Cool Down
200 Swim, br 3/5/3/7 by 25"""

print("=" * 80)
print("AFTER fixWorkoutFormatting:")
print("=" * 80)
print(formatted_workout)
print()

# Now apply the regex replacements from lines 152064-152081
import re

description = formatted_workout

# Add line break before each section header
description = re.sub(r'(\s+)(Warm Up)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Drill Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Pre[- ]?Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Main Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Cool Down)', r'\n\n\2', description, flags=re.IGNORECASE)

# Add line breaks after section headers
description = re.sub(r'(Warm Up|Drill Set|Pre[- ]?Set|Main Set|Cool Down)(\s+)', r'\1\n', description, flags=re.IGNORECASE)

# Add line breaks before list items (lines starting with -)
description = re.sub(r'\s+-\s+', '\n- ', description)

# Add line breaks before numbered items
description = re.sub(r'\s+#(\d+)', r'\n#\1', description)

# Add line breaks before "x" repetitions
description = re.sub(r'\s+(\d+x\d+)', r'\n\1', description, flags=re.IGNORECASE)
description = re.sub(r'\s+(\d+X\d+)', r'\n\1', description, flags=re.IGNORECASE)

# Clean up multiple consecutive newlines (max 2)
description = re.sub(r'\n{3,}', '\n\n', description)
description = description.strip()

print("=" * 80)
print("AFTER REGEX REPLACEMENTS:")
print("=" * 80)
print(description)
print()

print("=" * 80)
print("COMPARISON:")
print("=" * 80)
print(f"Before regex: {len(formatted_workout.split(chr(10)))} lines")
print(f"After regex: {len(description.split(chr(10)))} lines")

