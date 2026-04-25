# Test the COMPLETE pipeline including the regex replacements

import re

formatted = """Warm Up
 - 200 Swim @50–70%
 - 2 x 25 Kick – Take 5s
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
2 x 25 Press Your Buoy Drill 1 x 50 Swim – focused on PYB and a neutral head – Take 5–10s between each"""

print("="*80)
print("AFTER fixWorkoutFormatting:")
print("="*80)
print(formatted)
print()

# Now apply lines 152056-152081 (the regex replacements)
description = formatted

print("="*80)
print("APPLYING REGEX REPLACEMENTS:")
print("="*80)

# Strip markdown from description
description = description.replace('**', '')  # Remove bold markers
description = re.sub(r'\*([^*]+)\*', r'\1', description)  # Remove italic
description = re.sub(r'#{1,6}\s+', '', description)  # Remove headers
description = description.strip()
print("1. After strip markdown:", len(description), "chars")

# Format swim workout description with proper line breaks
# Add line break before each section header
description = re.sub(r'(\s+)(Warm Up)', r'\n\n\2', description, flags=re.IGNORECASE)
print("2. After add \\n\\n before 'Warm Up':", len(description), "chars")

description = re.sub(r'(\s+)(Drill Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Pre[- ]?Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Main Set)', r'\n\n\2', description, flags=re.IGNORECASE)
description = re.sub(r'(\s+)(Cool Down)', r'\n\n\2', description, flags=re.IGNORECASE)
print("3. After add \\n\\n before all section headers:", len(description), "chars")

# Add line breaks after section headers
description = re.sub(r'(Warm Up|Drill Set|Pre[- ]?Set|Main Set|Cool Down)(\s+)', r'\1\n', description, flags=re.IGNORECASE)
print("4. After add \\n after section headers:", len(description), "chars")
print("   First 100 chars:", repr(description[:100]))

# Add line breaks before list items (lines starting with -)
description = re.sub(r'\s+-\s+', '\n- ', description)
print("5. After fix list items:", len(description), "chars")

# Add line breaks before numbered items
description = re.sub(r'\s+#(\d+)', r'\n#\1', description)
print("6. After fix numbered items:", len(description), "chars")

# Add line breaks before "x" repetitions (e.g., "4x50")
description = re.sub(r'\s+(\d+x\d+)', r'\n\1', description, flags=re.IGNORECASE)
description = re.sub(r'\s+(\d+X\d+)', r'\n\1', description, flags=re.IGNORECASE)
print("7. After fix x repetitions:", len(description), "chars")

# Clean up multiple consecutive newlines (max 2)
description = re.sub(r'\n{3,}', '\n\n', description)
description = description.strip()
print("8. After cleanup:", len(description), "chars")

print()
print("="*80)
print("FINAL OUTPUT SENT TO API:")
print("="*80)
print(description)

