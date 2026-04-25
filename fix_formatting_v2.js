// Comprehensive formatting fix for swim workouts
// Handles multi-line patterns like:
//   8x(25 Kick, 50 Swim @80%
//   - Take 10 sec
//   )

function fixWorkoutFormatting(description) {
  if (!description) return '';

  // Step 1: Normalize line breaks and remove empty lines
  let lines = description
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Step 2: Merge multi-line patterns BEFORE section parsing
  //   Pattern: "8x(...\n- Take X sec\n)"
  const merged = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line ends with an open parenthesis or incomplete set notation
    // AND next line is "- Take X sec" AND line after is ")"
    if (i + 2 < lines.length) {
      const nextLine = lines[i + 1];
      const lineAfterThat = lines[i + 2];
      
      // Pattern: "8x(25 Kick, 50 Swim @80%" + "- Take 10 sec" + ")"
      if (/\d+x\s*\([^)]*$/.test(line) && 
          /^[-–—•]?\s*Take\s+\d+/i.test(nextLine) && 
          lineAfterThat.trim() === ')') {
        
        // Extract "Take X sec"
        let takeText = nextLine.replace(/^[-–—•]\s*/, '').replace(/\bs\b/gi, ' sec');
        const secMatch = takeText.match(/Take\s+(\d+\s+sec)/i);
        const betweenReps = secMatch ? `${secMatch[1]} between reps` : takeText;
        
        // Combine: "8x(25 Kick, 50 Swim @80%)  - 10 sec between reps"
        merged.push(`${line})  - ${betweenReps}`);
        i += 3; // Skip the "- Take X sec" and ")" lines
        continue;
      }
    }
    
    merged.push(line);
    i++;
  }
  
  lines = merged;

  // Step 3: Parse into sections
  const sections = [];
  let currentSection = null;
  let sectionContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let sectionMatch = null;

    // Detect section headers
    if (trimmed.toLowerCase().startsWith('warm up')) {
      sectionMatch = 'Warm Up';
    } else if (trimmed.toLowerCase().startsWith('drill set')) {
      sectionMatch = 'Drill Set';
    } else if (trimmed.toLowerCase().startsWith('pre-set') || trimmed.toLowerCase().startsWith('pre set')) {
      sectionMatch = 'Pre-Set';
    } else if (trimmed.toLowerCase().startsWith('main set')) {
      sectionMatch = 'Main Set';
    } else if (trimmed.toLowerCase().startsWith('cool down')) {
      sectionMatch = 'Cool Down';
    }

    if (sectionMatch) {
      // Save previous section
      if (currentSection) {
        sections.push({
          name: currentSection,
          content: sectionContent
        });
      }

      currentSection = sectionMatch;
      sectionContent = [];

      // Handle "Warm Up 400 as:" - DON'T keep the "400 as:" part
      if (sectionMatch === 'Warm Up' && !trimmed.toLowerCase().includes(' as:')) {
        // If there's content after "Warm Up" that's not "as:", keep it
        const afterHeader = trimmed.substring('warm up'.length).trim();
        if (afterHeader && !afterHeader.toLowerCase().includes(' as:')) {
          sectionContent.push(afterHeader);
        }
      }
    } else if (currentSection) {
      // Add content to current section
      sectionContent.push(trimmed);
    }
  }

  // Don't forget last section
  if (currentSection) {
    sections.push({
      name: currentSection,
      content: sectionContent
    });
  }

  // Step 4: Format each section
  const result = [];
  for (const section of sections) {
    result.push(...formatSection(section.name, section.content));
    result.push(''); // Blank line after section
  }

  return result.join('\n').trim();
}

function formatSection(sectionName, content) {
  if (sectionName === 'Warm Up') {
    return formatWarmUp(content);
  } else if (sectionName === 'Drill Set') {
    return formatDrillSet(content);
  } else if (sectionName === 'Pre-Set') {
    return formatPreSet(content);
  } else if (sectionName === 'Main Set') {
    return formatMainSet(content);
  } else if (sectionName === 'Cool Down') {
    return formatCoolDown(content);
  }
  return [sectionName];
}

function formatWarmUp(content) {
  const result = ['Warm Up'];
  const exercises = [];

  // Check if first line contains "as:" - skip it
  let startIdx = 0;
  if (content.length > 0 && content[0].toLowerCase().includes(' as:')) {
    startIdx = 1;
  }

  // Process exercises
  let i = startIdx;
  while (i < content.length) {
    let line = content[i].trim();

    // Remove existing prefix
    line = line.replace(/^[-–—•]\s*/, '');

    // Check if next line is standalone "Take Xs"
    let takeLine = '';
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        takeLine = nextLine.replace(/^[-–—•]\s*/, '');
        takeLine = takeLine.replace(/\bs\b/gi, ' sec');
        i++; // Skip the Take line
      }
    }

    // Combine exercise with "Take" if present
    if (takeLine) {
      const secMatch = takeLine.match(/Take\s+(\d+\s+sec)/i);
      if (secMatch) {
        line = `${line} - ${secMatch[1]} between reps`;
      } else {
        line = `${line} - ${takeLine}`;
      }
    }

    // Fix "sec" vs "s"
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');

    if (line) {
      exercises.push(line);
    }
    i++;
  }

  // Consolidate consecutive kicks
  const consolidated = consolidateKicks(exercises);

  // Add "- " prefix to each exercise
  for (const ex of consolidated) {
    if (ex.trim()) {
      result.push(`- ${ex}`);
    }
  }

  return result;
}

function formatDrillSet(content) {
  const result = ['Drill Set'];

  for (let line of content) {
    // Remove any existing prefix
    line = line.replace(/^[-–—•]\s*/, '');
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (line) {
      result.push(line);
    }
  }

  return result;
}

function formatPreSet(content) {
  const result = ['Pre-Set'];

  let i = 0;
  while (i < content.length) {
    let item = content[i].trim();

    // Remove prefix
    item = item.replace(/^[-–—•]\s*/, '');

    // Check if next line is "Take Xs"
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        const secMatch = takeText.match(/Take\s+(\d+\s+sec)/i);
        if (secMatch) {
          item = `${item}  - ${secMatch[1]} between reps`;
        } else {
          item = `${item} - ${takeText}`;
        }
        i++; // Skip the Take line
      }
    }

    // Fix "sec" vs "s"
    item = item.replace(/\b(\d+)s\b/g, '$1 sec');

    if (item) {
      result.push(item);
    }
    i++;
  }

  return result;
}

function formatMainSet(content) {
  const result = ['Main Set'];

  let i = 0;
  while (i < content.length) {
    let item = content[i].trim();

    // Remove prefix
    item = item.replace(/^[-–—•]\s*/, '');

    // Check if next line is "Take Xs"
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        item = `${item} - ${takeText}`;
        i++; // Skip the Take line
      }
    }

    // Fix "sec" vs "s"
    item = item.replace(/\b(\d+)s\b/g, '$1 sec');

    if (item) {
      result.push(item);
    }
    i++;
  }

  return result;
}

function formatCoolDown(content) {
  const result = ['Cool Down'];

  for (let line of content) {
    // Remove any existing prefix
    line = line.replace(/^[-–—•]\s*/, '');
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (line) {
      result.push(line);
    }
  }

  return result;
}

function consolidateKicks(exercises) {
  const consolidated = [];
  let i = 0;

  while (i < exercises.length) {
    const current = exercises[i];

    // Check if this is a kick exercise
    const kickMatch = current.match(/^(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$/i);

    if (kickMatch && i + 1 < exercises.length) {
      const nextLine = exercises[i + 1];
      const nextMatch = nextLine.match(/^(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$/i);

      if (nextMatch) {
        const [, reps1, dist1, rest1] = kickMatch;
        const [, reps2, dist2, rest2] = nextMatch;

        // Normalize rest text for comparison
        const rest1Norm = rest1.trim().toLowerCase();
        const rest2Norm = rest2.trim().toLowerCase();

        // If distances and rest match, consolidate
        if (dist1 === dist2 && rest1Norm === rest2Norm) {
          const totalReps = parseInt(reps1) + parseInt(reps2);
          let consolidatedKick = `${totalReps} x ${dist1} Kick`;
          if (rest1.trim()) {
            consolidatedKick += ` ${rest1.trim()}`;
          }
          consolidated.push(consolidatedKick);
          i += 2; // Skip both lines
          continue;
        }
      }
    }

    consolidated.push(current);
    i++;
  }

  return consolidated;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fixWorkoutFormatting };
}
