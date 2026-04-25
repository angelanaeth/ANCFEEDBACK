// NEW COMPREHENSIVE FORMATTING FUNCTIONS

function fixWorkoutFormatting(description) {
  if (!description) return '';
  
  const lines = description.split('\n');
  const result = [];
  let currentSection = null;
  let sectionContent = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) continue;
    
    // Check if line starts with a section header
    let sectionMatch = null;
    if (trimmed.startsWith('Warm Up')) {
      sectionMatch = 'Warm Up';
    } else if (trimmed.startsWith('Drill Set')) {
      sectionMatch = 'Drill Set';
    } else if (trimmed.startsWith('Pre-Set') || trimmed.startsWith('Pre Set')) {
      sectionMatch = 'Pre-Set';
    } else if (trimmed.startsWith('Main Set')) {
      sectionMatch = 'Main Set';
    } else if (trimmed.startsWith('Cool Down')) {
      sectionMatch = 'Cool Down';
    }
    
    if (sectionMatch) {
      // Save previous section
      if (currentSection) {
        result.push(...formatSection(currentSection, sectionContent));
        result.push(''); // Blank line after section
      }
      
      currentSection = sectionMatch;
      sectionContent = [];
      
      // Handle "Warm Up 400 as:" - keep for processing
      if (sectionMatch === 'Warm Up' && trimmed.toLowerCase().includes(' as:')) {
        sectionContent.push(trimmed);
      }
    } else if (currentSection) {
      // Add content to current section
      sectionContent.push(trimmed);
    }
  }
  
  // Don't forget last section
  if (currentSection) {
    result.push(...formatSection(currentSection, sectionContent));
  }
  
  // If no sections found, return original
  if (result.length === 0) {
    return description;
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
  
  // Check if first line contains "as:"
  let startIdx = 0;
  if (content.length > 0 && content[0].toLowerCase().includes(' as:')) {
    startIdx = 1; // Skip the "400 as:" line
  }
  
  // Process exercises
  let i = startIdx;
  while (i < content.length) {
    let line = content[i].trim();
    
    // Remove existing prefix
    line = line.replace(/^[-–—•]\s*/, '');
    
    // Check if next line is "Take Xs"
    let takeLine = '';
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+s?/i.test(nextLine)) {
        takeLine = nextLine.replace(/^[-–—•]\s*/, '');
        takeLine = takeLine.replace(/\bs\b/gi, ' sec');
        i++; // Skip the Take line
      }
    }
    
    // Combine exercise with "Take" if present
    if (takeLine) {
      line = `${line} - ${takeLine}`;
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
          i += 2; // Skip both
          continue;
        }
      }
    }
    
    // Not a kick or no consolidation - add as-is
    consolidated.push(current);
    i++;
  }
  
  return consolidated;
}

function formatDrillSet(content) {
  const result = ['Drill Set'];
  const lines = [];
  
  for (let i = 0; i < content.length; i++) {
    let item = content[i].trim();
    
    // Check if this is "Take Xs" line
    if (/^[-–—•]?\s*Take\s+\d+/i.test(item)) {
      // Attach to previous line
      if (lines.length > 0) {
        let takeText = item.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        lines[lines.length - 1] += ` - ${takeText}`;
      }
      continue;
    }
    
    // Remove prefix
    item = item.replace(/^[-–—•]\s*/, '');
    
    // Fix sec vs s
    item = item.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (item) {
      lines.push(item);
    }
  }
  
  result.push(...lines);
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
        item = `${item} - ${takeText}`;
        i++; // Skip the Take line
      }
    }
    
    // Fix spacing before "- Take"
    item = item.replace(/\)\s*[-–—]\s*Take/g, ') - Take');
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
    
    // Fix "- Take" spacing
    item = item.replace(/\s+[-–—]\s*Take/g, ' - Take');
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
  
  let i = 0;
  while (i < content.length) {
    let line = content[i].trim();
    
    // Remove prefix
    line = line.replace(/^[-–—•]\s*/, '');
    
    // Check if next line is "Take Xs"
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        line = `${line} - ${takeText}`;
        i++; // Skip the Take line
      }
    }
    
    // Fix sec
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (line) {
      result.push(line);
    }
    i++;
  }
  
  return result;
}

console.log("✅ New formatting functions defined");
