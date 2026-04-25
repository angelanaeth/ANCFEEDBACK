# Debug the FULL workout parsing

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

def fixWorkoutFormatting(description):
    if not description:
        return ''
    
    lines = description.split('\n')
    result = []
    currentSection = None
    sectionContent = []
    
    for line in lines:
        trimmed = line.strip()
        
        # Skip empty lines
        if not trimmed:
            continue
        
        # Check if line STARTS with a section header
        sectionMatch = None
        if trimmed.startswith('Warm Up'):
            sectionMatch = 'Warm Up'
        elif trimmed.startswith('Drill Set'):
            sectionMatch = 'Drill Set'
        elif trimmed.startswith('Pre-Set') or trimmed.startswith('Pre Set'):
            sectionMatch = 'Pre-Set'
        elif trimmed.startswith('Main Set'):
            sectionMatch = 'Main Set'
        elif trimmed.startswith('Cool Down'):
            sectionMatch = 'Cool Down'
        
        if sectionMatch:
            # Save previous section
            if currentSection:
                print(f"\n📦 Formatting section: {currentSection}")
                print(f"   Content lines: {len(sectionContent)}")
                for i, item in enumerate(sectionContent):
                    print(f"   [{i}] '{item}'")
                formatted = formatSection(currentSection, sectionContent)
                print(f"   Result lines: {len(formatted)}")
                for i, item in enumerate(formatted):
                    print(f"   [{i}] '{item}'")
                result.extend(formatted)
                result.append('')  # Blank line after section
            
            currentSection = sectionMatch
            sectionContent = []
            print(f"\n🔵 New section detected: {sectionMatch}")
        elif currentSection:
            # Add content to current section
            sectionContent.append(trimmed)
            print(f"   + Add content: '{trimmed}'")
    
    # Don't forget last section
    if currentSection:
        print(f"\n📦 Formatting final section: {currentSection}")
        print(f"   Content lines: {len(sectionContent)}")
        formatted = formatSection(currentSection, sectionContent)
        print(f"   Result lines: {len(formatted)}")
        result.extend(formatted)
    
    if not result:
        return description
    
    return '\n'.join(result).strip()

def formatSection(sectionName, content):
    result = [sectionName]
    
    if sectionName == 'Warm Up':
        # Each item gets " - " prefix
        for item in content:
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                print(f"      ⚠️  SKIPPING (contains ' as:'): '{item}'")
                continue
            
            # Remove existing prefixes
            import re
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(f' - {cleaned}')
    
    elif sectionName in ['Drill Set', 'Pre-Set', 'Cool Down']:
        # Single line, no prefix
        import re
        combined = ' '.join(content)
        combined = re.sub(r'\s+', ' ', combined)
        result.append(combined)
    
    elif sectionName == 'Main Set':
        # Multiple lines, no prefix
        for item in content:
            # Skip "XXX as:" lines
            if ' as:' in item.lower():
                print(f"      ⚠️  SKIPPING (contains ' as:'): '{item}'")
                continue
            
            # Remove existing prefixes
            import re
            cleaned = re.sub(r'^[-–—•]\s*', '', item)
            if cleaned:
                result.append(cleaned)
    
    return result

print("=" * 80)
print("PROCESSING WORKOUT:")
print("=" * 80)
formatted = fixWorkoutFormatting(workout)

print("\n" + "=" * 80)
print("FINAL RESULT:")
print("=" * 80)
print(formatted)

