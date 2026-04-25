// Simulate the formatting functions for testing
// (Copy of the functions from swim-planner.html)

function fixWorkoutFormatting(description) {
  if (!description) return '';
  
  const lines = description.split('\n');
  const result = [];
  let currentSection = null;
  let sectionContent = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) continue;
    
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
      if (currentSection) {
        result.push(...formatSection(currentSection, sectionContent));
        result.push('');
      }
      
      currentSection = sectionMatch;
      sectionContent = [];
      
      if (sectionMatch === 'Warm Up' && trimmed.toLowerCase().includes(' as:')) {
        sectionContent.push(trimmed);
      }
    } else if (currentSection) {
      sectionContent.push(trimmed);
    }
  }
  
  if (currentSection) {
    result.push(...formatSection(currentSection, sectionContent));
  }
  
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
  
  let startIdx = 0;
  if (content.length > 0 && content[0].toLowerCase().includes(' as:')) {
    startIdx = 1;
  }
  
  let i = startIdx;
  while (i < content.length) {
    let line = content[i].trim();
    line = line.replace(/^[-–—•]\s*/, '');
    
    let takeLine = '';
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+s?/i.test(nextLine)) {
        takeLine = nextLine.replace(/^[-–—•]\s*/, '');
        takeLine = takeLine.replace(/\bs\b/gi, ' sec');
        i++;
      }
    }
    
    if (takeLine) {
      line = `${line} - ${takeLine}`;
    }
    
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (line) {
      exercises.push(line);
    }
    i++;
  }
  
  const consolidated = consolidateKicks(exercises);
  
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
    const kickMatch = current.match(/^(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$/i);
    
    if (kickMatch && i + 1 < exercises.length) {
      const nextLine = exercises[i + 1];
      const nextMatch = nextLine.match(/^(\d+)\s*x\s*(\d+)\s+Kick\s*(.*)$/i);
      
      if (nextMatch) {
        const [, reps1, dist1, rest1] = kickMatch;
        const [, reps2, dist2, rest2] = nextMatch;
        
        const rest1Norm = rest1.trim().toLowerCase();
        const rest2Norm = rest2.trim().toLowerCase();
        
        if (dist1 === dist2 && rest1Norm === rest2Norm) {
          const totalReps = parseInt(reps1) + parseInt(reps2);
          let consolidatedKick = `${totalReps} x ${dist1} Kick`;
          if (rest1.trim()) {
            consolidatedKick += ` ${rest1.trim()}`;
          }
          consolidated.push(consolidatedKick);
          i += 2;
          continue;
        }
      }
    }
    
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
    
    if (/^[-–—•]?\s*Take\s+\d+/i.test(item)) {
      if (lines.length > 0) {
        let takeText = item.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        lines[lines.length - 1] += ` - ${takeText}`;
      }
      continue;
    }
    
    item = item.replace(/^[-–—•]\s*/, '');
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
    item = item.replace(/^[-–—•]\s*/, '');
    
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        item = `${item} - ${takeText}`;
        i++;
      }
    }
    
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
    item = item.replace(/^[-–—•]\s*/, '');
    
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        item = `${item} - ${takeText}`;
        i++;
      }
    }
    
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
    line = line.replace(/^[-–—•]\s*/, '');
    
    if (i + 1 < content.length) {
      const nextLine = content[i + 1].trim();
      if (/^[-–—•]?\s*Take\s+\d+/i.test(nextLine)) {
        let takeText = nextLine.replace(/^[-–—•]\s*/, '');
        takeText = takeText.replace(/\bs\b/gi, ' sec');
        line = `${line} - ${takeText}`;
        i++;
      }
    }
    
    line = line.replace(/\b(\d+)s\b/g, '$1 sec');
    
    if (line) {
      result.push(line);
    }
    i++;
  }
  
  return result;
}

// Test cases from user examples
const testCases = [
  {
    name: "Example 1: Warm Up with 'Take' on separate line",
    input: `Warm Up 400 as:
- 200 Swim @50-70%
- 100 Pull/Paddles @70%
2 x 25 FAST Swim
- Take 10s`,
    expected: `Warm Up
- 200 Swim @50-70%
- 100 Pull/Paddles @70%
- 2 x 25 FAST Swim - Take 10 sec`
  },
  {
    name: "Example 2: Consolidate kicks",
    input: `Warm Up
- 300 Swim @50–70%
- 7 x 25 Kick – Take 5s
- 1 x 25 Kick – Take 5s
- 100 Pull @60–70%`,
    expected: `Warm Up
- 300 Swim @50–70%
- 8 x 25 Kick – Take 5 sec
- 100 Pull @60–70%`
  },
  {
    name: "Example 3: Drill Set with separate lines",
    input: `Drill Set
7 x 25 Press Your Buoy Drill – Take 5–10s 7 x 25 TARZAN Swim – Take 5–10s`,
    expected: `Drill Set
7 x 25 Press Your Buoy Drill – Take 5–10 sec 7 x 25 TARZAN Swim – Take 5–10 sec`
  },
  {
    name: "Example 4: Cool Down with 'Take' on separate line",
    input: `Cool Down
2 x 25 Finger Tip Drag
- Take 5s
100 Swim br 3/5/7/3 by 25`,
    expected: `Cool Down
2 x 25 Finger Tip Drag - Take 5 sec
100 Swim br 3/5/7/3 by 25`
  }
];

console.log("\n🧪 RUNNING FORMATTING TESTS\n");
console.log("=".repeat(70));

let passed = 0;
let failed = 0;

for (const test of testCases) {
  console.log(`\n📝 ${test.name}`);
  console.log("-".repeat(70));
  
  const result = fixWorkoutFormatting(test.input);
  
  console.log("INPUT:");
  console.log(test.input);
  console.log("\nOUTPUT:");
  console.log(result);
  console.log("\nEXPECTED:");
  console.log(test.expected);
  
  if (result.trim() === test.expected.trim()) {
    console.log("\n✅ PASS");
    passed++;
  } else {
    console.log("\n❌ FAIL");
    console.log("DIFFERENCE:");
    console.log("Expected lines:", test.expected.trim().split('\n').length);
    console.log("Got lines:", result.trim().split('\n').length);
    failed++;
  }
}

console.log("\n" + "=".repeat(70));
console.log(`\n📊 TEST RESULTS: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log("\n🎉 ALL TESTS PASSED!");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} TEST(S) FAILED`);
  process.exit(1);
}

