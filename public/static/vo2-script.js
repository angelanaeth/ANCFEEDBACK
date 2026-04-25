/* ============================================================
   VO2 PRESCRIBER — Sport switch + Bike + Run calculators
   ============================================================ */

/* ---- Sport tab switch ---- */
function vo2SwitchSport(sport) {
  document.getElementById('vo2-bike-panel').style.display = sport === 'bike' ? '' : 'none';
  document.getElementById('vo2-run-panel').style.display  = sport === 'run'  ? '' : 'none';
  document.getElementById('vo2-tab-bike').className = 'vo2-sport-tab' + (sport === 'bike' ? ' active' : '');
  document.getElementById('vo2-tab-run').className  = 'vo2-sport-tab' + (sport === 'run'  ? ' active' : '');
}

/* ============================================================
   BIKE VO2 PRESCRIBER
   ============================================================ */

function vo2bRoundQ(s) { return Math.round(s / 15) * 15; }
function vo2bFmtDur(s) {
  if (s < 60) return s + 's';
  var m = Math.floor(s / 60), r = s % 60;
  return r === 0 ? m + ':00' : m + ':' + (r < 10 ? '0' : '') + r;
}
function vo2bRoundW(w) { return Math.round(w / 5) * 5; }
function vo2bFmtW(w, cp) { return w + 'W (' + Math.round((w / cp) * 100) + '% CP)'; }
function vo2bSegTSS(w, d, cp) { var IF = w / cp; return (d / 3600) * IF * IF * 100; }
function vo2bCalcTSS(segs, cp) {
  return Math.round(segs.reduce(function(a, s) { return a + vo2bSegTSS(s.w, s.d, cp); }, 0));
}
function vo2bGapColor(gap) {
  if (gap < 50) return '#dc2626'; if (gap <= 90) return '#d97706'; return '#16a34a';
}

function vo2bPrescribeData(cp, wprime, pvo2) {
  var burnRate = pvo2 - cp;
  var timeToEx = Math.round(wprime / burnRate);
  var maxRepDur = vo2bRoundQ(Math.floor((0.35 * wprime) / burnRate));
  var gap = burnRate;
  var profileType, profileLabel, profileDesc;
  if (gap < 50) {
    profileType = 'compressed'; profileLabel = 'Compressed Profile';
    profileDesc = 'Only ' + gap + 'W separates your ceiling from your roof. VO2 work and threshold work are nearly the same physiological session. The priority is widening this gap over time by raising CP.';
  } else if (gap <= 90) {
    profileType = 'moderate'; profileLabel = 'Moderate Profile';
    profileDesc = 'A ' + gap + 'W gap gives reasonable design flexibility. Both classic repeats and micro-interval structures are viable depending on kinetic profile.';
  } else {
    profileType = 'wide'; profileLabel = 'Wide Profile';
    profileDesc = 'A ' + gap + 'W gap means substantial anaerobic machinery above CP. Classic longer repeats are viable. Risk is using W\u2019 to power through intervals rather than driving VO2 stimulus.';
  }
  var wPrimeLabel = wprime < 10000 ? 'Small Tank' : wprime < 18000 ? 'Moderate Tank' : 'Large Tank';
  var wPrimeNote = wprime < 10000
    ? 'Small W\u2019 means rep duration must be tightly controlled. The W\u2019 budget is the primary design constraint.'
    : wprime < 18000
    ? 'Moderate W\u2019. Solid design flexibility but still requires disciplined pacing on early reps.'
    : 'Large W\u2019. Athlete has significant anaerobic buffer \u2014 risk is masking poor VO2 stimulus with anaerobic contribution.';

  /* W1 */
  var w1IntI = vo2bRoundW(cp + burnRate * 0.85);
  var w1Burn = w1IntI - cp;
  var w1;
  if (maxRepDur >= 180) {
    var rd = vo2bRoundQ(Math.min(300, maxRepDur));
    var wSp = Math.round(w1Burn * rd);
    var wPct = Math.round((wSp / wprime) * 100);
    var reps = rd >= 240 ? 4 : 5;
    var recW = vo2bRoundW(cp * 0.65);
    var segs = [];
    for (var i = 0; i < reps; i++) { segs.push({w: w1IntI, d: rd}); segs.push({w: recW, d: rd}); }
    w1 = { name: 'Classic VO2 Repeats', subtitle: 'Ceiling-Limited Protocol',
      goal: 'Maximize sustained time between ceiling and roof with controlled W\u2019 spend per rep.',
      structure: reps + ' x ' + vo2bFmtDur(rd) + ' @ ' + vo2bFmtW(w1IntI, cp), tss: vo2bCalcTSS(segs, cp),
      details: [['Work Interval', vo2bFmtDur(rd) + ' @ ' + vo2bFmtW(w1IntI, cp)], ['W\u2019 Spend / Rep', wSp.toLocaleString() + ' J (' + wPct + '% of W\u2019)'], ['Recovery', vo2bFmtDur(rd) + ' @ ' + vo2bFmtW(recW, cp)], ['Total Reps', '' + reps], ['Total Work Time', Math.round(reps * rd / 60) + ' min'], ['Set TSS', '~' + vo2bCalcTSS(segs, cp)]],
      progression: ['Add reps first: +1 rep per block', 'Tighten recovery by 30s', 'Raise intensity by 5W only when quality holds'],
      cues: ['HR ramps reps 1-2, plateaus reps 3+', 'Breathing dominant over leg burn by rep 3', 'Power holds within 5-8W across all reps', 'Does NOT require 2 days to recover'],
      flags: ['Power collapse after rep 2 => intensity too high, reduce by 10W', 'HR never climbs => recovery too long, tighten by 30s', 'Legs-only sensation => likely anaerobic, not VO2 stimulus'] };
  } else if (maxRepDur >= 60) {
    var rd2 = vo2bRoundQ(Math.min(maxRepDur, 90));
    var wSp2 = Math.round(w1Burn * rd2);
    var wPct2 = Math.round((wSp2 / wprime) * 100);
    var recW2 = vo2bRoundW(cp * 0.6);
    var segs2 = [];
    for (var j = 0; j < 8; j++) { segs2.push({w: w1IntI, d: rd2}); segs2.push({w: recW2, d: rd2}); }
    w1 = { name: 'Short Power Repeats', subtitle: 'Ceiling-Limited Protocol',
      goal: 'Accumulate time near pVO2max through repetition. Early reps warm up kinetics; back half delivers the stimulus.',
      structure: '8 x ' + vo2bFmtDur(rd2) + ' @ ' + vo2bFmtW(w1IntI, cp), tss: vo2bCalcTSS(segs2, cp),
      details: [['Work Interval', vo2bFmtDur(rd2) + ' @ ' + vo2bFmtW(w1IntI, cp)], ['W\u2019 Spend / Rep', wSp2.toLocaleString() + ' J (' + wPct2 + '% of W\u2019)'], ['Recovery', vo2bFmtDur(rd2) + ' @ ' + vo2bFmtW(recW2, cp) + ' (1:1)'], ['Total Reps', '8'], ['Total Work Time', Math.round(8 * rd2 / 60) + ' min'], ['Set TSS', '~' + vo2bCalcTSS(segs2, cp)]],
      progression: ['Add reps: 6 -> 8 -> 10', 'Tighten recovery to 0.75:1', 'Raise intensity by 3-5W only when full set is clean'],
      cues: ['Progressive HR climb across reps 1-5', 'Reps 6-8 feel aerobically maximal', 'Breathing becomes dominant in back half', 'First 2 reps feel manageable - that is correct'],
      flags: ['Collapse before rep 6 => W\u2019 budget too aggressive, reduce intensity 5W', 'Session feels sprint-like throughout => intensity too far above pVO2max', 'No respiratory stress => reps too short or recovery too long'] };
  } else {
    var recW3 = vo2bRoundW(cp * 0.6);
    var wSp3 = Math.round(w1Burn * 45);
    var wPct3 = Math.round((wSp3 / wprime) * 100);
    var segs3 = [];
    for (var k = 0; k < 10; k++) { segs3.push({w: w1IntI, d: 45}); segs3.push({w: recW3, d: 45}); }
    w1 = { name: 'Ultra-Short Repeats', subtitle: 'Ceiling-Limited Protocol',
      goal: 'W\u2019 is very small \u2014 use high-density short efforts to accumulate aerobic stress without single large W\u2019 draws.',
      structure: '10 x 45s @ ' + vo2bFmtW(w1IntI, cp), tss: vo2bCalcTSS(segs3, cp),
      details: [['Work Interval', '45s @ ' + vo2bFmtW(w1IntI, cp)], ['W\u2019 Spend / Rep', wSp3.toLocaleString() + ' J (' + wPct3 + '% of W\u2019)'], ['Recovery', '45s @ ' + vo2bFmtW(recW3, cp)], ['Total Reps', '10'], ['Total Work Time', '7:30'], ['Set TSS', '~' + vo2bCalcTSS(segs3, cp)]],
      progression: ['Add reps to 12, then 14', 'Tighten recovery to 30s', 'Raise intensity in 3W increments only'],
      cues: ['Respiratory stress should arrive by rep 4-5', 'Power should hold evenly across all reps', 'HR should be pinned high by rep 6+'],
      flags: ['Early collapse => reduce intensity', 'No respiratory drive => shorten recovery', 'Session feels anaerobic => intensity likely too high for this W\u2019'] };
  }

  /* W2 */
  var priI = vo2bRoundW(cp + burnRate * 0.4);
  var priDur = 360, priRecDur = 180;
  var priRecW = vo2bRoundW(cp * 0.6);
  var priCost = Math.round((priI - cp) * priDur);
  var priRecon = Math.round(wprime * 0.22);
  var netWp = Math.round(wprime - priCost + priRecon);
  var moI = vo2bRoundW(cp + burnRate * 0.78);
  var moOff = vo2bRoundW(cp * 0.7);
  var moBurn = moI - cp;
  var setCyc = gap < 50 ? 8 : 10;
  var setCost = Math.round(moBurn * 30 * 1.18 * setCyc * 0.85);
  var sets = netWp > setCost * 2.5 ? 3 : 2;
  var setDur = setCyc * 45;
  var btwnW = vo2bRoundW(cp * 0.6);
  var w2segs = [{w: priI, d: priDur}, {w: priRecW, d: priRecDur}];
  for (var si = 0; si < sets; si++) {
    for (var ci = 0; ci < setCyc; ci++) { w2segs.push({w: moI, d: 30}); w2segs.push({w: moOff, d: 15}); }
    if (si < sets - 1) w2segs.push({w: btwnW, d: 240});
  }
  var w2 = { name: 'Primer + Micro-Intervals', subtitle: 'Kinetics-Limited Protocol',
    goal: 'Pre-load VO2 with the primer so the athlete arrives at rep 1 already elevated. Micro-intervals sustain that state without large single W\u2019 draws.',
    structure: sets + ' sets x ' + vo2bFmtDur(setDur) + ' (30s @ ' + vo2bFmtW(moI, cp) + ' / 15s @ ' + vo2bFmtW(moOff, cp) + ')',
    tss: vo2bCalcTSS(w2segs, cp),
    primer: { steps: [vo2bFmtDur(priDur) + ' @ ' + vo2bFmtW(priI, cp) + ' \u2014 controlled W\u2019 draw to elevate VO2', vo2bFmtDur(priRecDur) + ' easy @ ' + vo2bFmtW(priRecW, cp) + ' \u2014 partial W\u2019 reconstitution', 'Begin main set'], cost: '~' + priCost.toLocaleString() + ' J gross / ~' + (priCost - priRecon).toLocaleString() + ' J net after recovery' },
    details: [['On Interval', '30s @ ' + vo2bFmtW(moI, cp)], ['Off Interval', '15s @ ' + vo2bFmtW(moOff, cp)], ['Set Duration', vo2bFmtDur(setDur) + ' (~' + setCyc + ' cycles)'], ['Between Sets', '4:00 easy @ ' + vo2bFmtW(btwnW, cp)], ['Total Sets', '' + sets], ['Set TSS', '~' + vo2bCalcTSS(w2segs, cp)]],
    progression: [sets === 2 ? '2 sets -> 3 sets' : '3 sets -> extend to 3 x 8:00', 'Shorten between-set recovery to 3:00', 'Extend set duration before raising intensity'],
    cues: ['Breathing stress arrives in first 2 min of set 1 \u2014 primer is working', '15s off should feel like almost not enough \u2014 breathing does not fully reset', 'HR should be pinned high from the first on-interval of set 2', 'Athlete reports aerobic maximal effort, not leg-destroying'],
    flags: ['Breathing stress never arrives => primer underdone, increase by 5W or extend by 1:00', 'Collapse mid-set 1 => primer overdone, reduce by 5W or shorten by 1:00', 'Legs-only sensation => on-interval intensity too high, reduce by 5W'] };

  return { burnRate: burnRate, timeToEx: timeToEx, maxRepDur: maxRepDur, gap: gap,
    profileType: profileType, profileLabel: profileLabel, profileDesc: profileDesc,
    wPrimeLabel: wPrimeLabel, wPrimeNote: wPrimeNote, w1: w1, w2: w2 };
}

function vo2bMakeEl(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}

function vo2bRenderWorkout(w, cp, isW2) {
  var card = vo2bMakeEl('div', 'vo2-workout-card');

  /* Header */
  var hdr = vo2bMakeEl('div', 'vo2-workout-header');
  hdr.appendChild(vo2bMakeEl('div', 'vo2-workout-protocol', w.subtitle));
  hdr.appendChild(vo2bMakeEl('div', 'vo2-workout-name', w.name));
  hdr.appendChild(vo2bMakeEl('div', 'vo2-workout-goal', w.goal));
  var badgeRow = vo2bMakeEl('div', 'vo2-badge-row');
  badgeRow.appendChild(vo2bMakeEl('span', 'vo2-structure-badge', w.structure));
  var tssBadge = vo2bMakeEl('span', 'vo2-tss-badge');
  tssBadge.appendChild(vo2bMakeEl('span', 'vo2-tss-value', '~' + w.tss));
  tssBadge.appendChild(vo2bMakeEl('span', 'vo2-tss-label', 'TSS'));
  badgeRow.appendChild(tssBadge);
  hdr.appendChild(badgeRow);
  card.appendChild(hdr);

  /* Body */
  var inner = vo2bMakeEl('div', 'vo2-body-inner');

  /* Left */
  var left = vo2bMakeEl('div', 'vo2-body-col');
  if (isW2 && w.primer) {
    var pb = vo2bMakeEl('div', 'vo2-primer-box');
    pb.appendChild(vo2bMakeEl('div', 'vo2-primer-label', 'Primer Protocol'));
    w.primer.steps.forEach(function(s) { pb.appendChild(vo2bMakeEl('div', 'vo2-primer-step', '\u2192 ' + s)); });
    pb.appendChild(vo2bMakeEl('div', 'vo2-primer-cost', 'Net W\u2019 cost: ' + w.primer.cost));
    left.appendChild(pb);
  }
  left.appendChild(vo2bMakeEl('div', 'vo2-section-label', 'Interval Details'));
  w.details.forEach(function(d) {
    var row = vo2bMakeEl('div', 'vo2-detail-row');
    row.appendChild(vo2bMakeEl('span', 'vo2-detail-key', d[0]));
    row.appendChild(vo2bMakeEl('span', 'vo2-detail-val', d[1]));
    left.appendChild(row);
  });
  left.appendChild(vo2bMakeEl('div', 'vo2-section-label', 'Progression'));
  w.progression.forEach(function(p) {
    var li = vo2bMakeEl('div', 'vo2-list-item');
    var dot = vo2bMakeEl('span', 'vo2-dot'); dot.style.background = '#2563eb';
    li.appendChild(dot); li.appendChild(document.createTextNode(p)); left.appendChild(li);
  });

  /* Right */
  var right = vo2bMakeEl('div', 'vo2-body-col');
  right.appendChild(vo2bMakeEl('div', 'vo2-section-label', 'Green Lights \u2014 Session Working'));
  w.cues.forEach(function(c) {
    var li = vo2bMakeEl('div', 'vo2-list-item');
    var dot = vo2bMakeEl('span', 'vo2-dot'); dot.style.background = '#16a34a';
    li.appendChild(dot); li.appendChild(document.createTextNode(c)); right.appendChild(li);
  });
  right.appendChild(vo2bMakeEl('div', 'vo2-section-label', 'Red Flags \u2014 Adjust If You See'));
  w.flags.forEach(function(f) {
    var li = vo2bMakeEl('div', 'vo2-flag-item');
    var dot = vo2bMakeEl('span', 'vo2-dot'); dot.style.background = '#dc2626'; dot.style.marginTop = '5px';
    li.appendChild(dot); li.appendChild(document.createTextNode(f)); right.appendChild(li);
  });

  inner.appendChild(left); inner.appendChild(right);
  card.appendChild(inner);
  return card;
}

function vo2bRenderResults(data) {
  // Store data globally for saving
  if (typeof calculatedResults !== 'undefined') {
    calculatedResults.vo2Bike = data;
  }
  
  var container = document.getElementById('vo2b-results');
  container.innerHTML = '';
  var gc = vo2bGapColor(data.gap);

  /* Stats */
  var statsGrid = document.createElement('div');
  statsGrid.className = 'qt2-result-grid';
  var statsData = [
    {label: 'Burn Rate', val: data.burnRate, unit: 'W above CP'},
    {label: 'Time to Exhaustion', val: data.timeToEx + 's', unit: 'at pVO2max'},
    {label: 'Max Rep Duration', val: vo2bFmtDur(data.maxRepDur), unit: '\u226435% W\u2019 spend'},
    {label: 'Ceiling \u2192 Roof Gap', val: data.gap + 'W', unit: data.wPrimeLabel, color: gc},
    {label: 'W\u2019 Budget / Rep', val: (Math.round(data.maxRepDur * data.burnRate * 0.35 / 100) * 100).toLocaleString() + ' J', unit: 'usable per rep'}
  ];
  statsData.forEach(function(s) {
    var card = document.createElement('div'); card.className = 'qt2-stat';
    var lbl = document.createElement('div'); lbl.className = 'qt2-stat-label'; lbl.textContent = s.label;
    var val = document.createElement('div'); val.className = 'vo2-stat-value'; val.textContent = s.val;
    if (s.color) val.style.color = s.color;
    var unit = document.createElement('div'); unit.className = 'qt2-stat-unit'; unit.textContent = s.unit || '';
    card.appendChild(lbl); card.appendChild(val); card.appendChild(unit);
    statsGrid.appendChild(card);
  });
  var statsBox = document.createElement('div'); statsBox.className = 'qt2-result-box';
  var statsTitle = document.createElement('h4'); statsTitle.textContent = 'Workout Parameters';
  statsBox.appendChild(statsTitle); statsBox.appendChild(statsGrid);
  container.appendChild(statsBox);

  /* Profile card */
  var pCard = document.createElement('div'); pCard.className = 'vo2-profile-card';
  pCard.style.background = data.profileType === 'compressed' ? 'rgba(220,38,38,0.06)' : data.profileType === 'moderate' ? 'rgba(217,119,6,0.06)' : 'rgba(22,163,74,0.06)';
  pCard.style.borderColor = gc;
  var b1 = document.createElement('span'); b1.className = 'vo2-badge';
  b1.style.background = gc + '22'; b1.style.color = gc; b1.textContent = data.profileLabel;
  var b2 = document.createElement('span'); b2.className = 'vo2-badge';
  b2.style.background = '#f1f5f9'; b2.style.color = '#64748b'; b2.textContent = data.wPrimeLabel;
  var pText = document.createElement('div'); pText.className = 'vo2-profile-text'; pText.textContent = data.profileDesc;
  var pNote = document.createElement('div'); pNote.className = 'vo2-profile-note'; pNote.textContent = data.wPrimeNote;
  pCard.appendChild(b1); pCard.appendChild(b2); pCard.appendChild(pText); pCard.appendChild(pNote);
  container.appendChild(pCard);

  /* Workout tabs */
  var tabRow = document.createElement('div'); tabRow.className = 'vo2-wkt-tabs';
  var wktArea = document.createElement('div');
  var tabBtns = ['Workout 1 \u2014 Ceiling', 'Workout 2 \u2014 Kinetics'].map(function(label, idx) {
    var btn = document.createElement('button'); btn.className = 'vo2-wkt-tab' + (idx === 0 ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b, i) { b.className = 'vo2-wkt-tab' + (i === idx ? ' active' : ''); });
      wktArea.innerHTML = '';
      wktArea.appendChild(vo2bRenderWorkout(idx === 0 ? data.w1 : data.w2, null, idx === 1));
    });
    tabRow.appendChild(btn); return btn;
  });
  container.appendChild(tabRow);
  wktArea.appendChild(vo2bRenderWorkout(data.w1, null, false));
  container.appendChild(wktArea);
  
  /* Save button */
  if (typeof athleteId !== 'undefined' && athleteId) {
    var saveBtn = document.createElement('button');
    saveBtn.className = 'qt2-calc-btn';
    saveBtn.style.background = '#16a34a';
    saveBtn.style.marginTop = '16px';
    saveBtn.textContent = '\u{1F4BE} Save to Profile';
    saveBtn.onclick = function() { if (typeof saveVO2BikeToProfile === 'function') saveVO2BikeToProfile(); };
    container.appendChild(saveBtn);
  }
  
  /* Export PDF button */
  var pdfBtn = document.createElement('button');
  pdfBtn.className = 'qt2-calc-btn';
  pdfBtn.style.background = '#2563eb';
  pdfBtn.style.marginTop = athleteId ? '8px' : '16px';
  pdfBtn.style.marginLeft = '0';
  pdfBtn.innerHTML = '&#8681; Export PDF';
  pdfBtn.onclick = function() { exportVO2BikePDF(data); };
  container.appendChild(pdfBtn);
}

function vo2bPrescribe() {
  var cp   = parseFloat(document.getElementById('vo2b-cp').value);
  var wp   = parseFloat(document.getElementById('vo2b-wp').value);
  var pvo2 = parseFloat(document.getElementById('vo2b-pvo2').value);
  var errEl = document.getElementById('vo2b-results');

  function showErr(msg) {
    errEl.innerHTML = '<div class="qt2-result-box" style="border-color:#ef4444;background:#fef2f2;"><h4 style="color:#b91c1c;">Input Error</h4><div style="font-size:14px;">' + msg + '</div></div>';
  }
  if (!cp || !wp || !pvo2 || isNaN(cp) || isNaN(wp) || isNaN(pvo2)) { showErr('All three values are required (CP, W\u2019, pVO2max).'); return; }
  if (pvo2 <= cp)  { showErr('pVO2max must be greater than CP.'); return; }
  if (wp < 1000)   { showErr('W\u2019 should be in joules (e.g. 15640, not 15.6).'); return; }
  var data = vo2bPrescribeData(cp, wp, pvo2);
  vo2bRenderResults(data);
}

/* Enter key support for Bike inputs */
['vo2b-cp','vo2b-wp','vo2b-pvo2'].forEach(function(id) {
  var node = document.getElementById(id);
  if (node) node.addEventListener('keydown', function(e) { if (e.key === 'Enter') vo2bPrescribe(); });
});


/* ============================================================
   RUN VO2 PRESCRIBER
   ============================================================ */

var vo2rDurability = 'standard';

function vo2rSetDur(val) {
  vo2rDurability = val;
  document.getElementById('vo2r-btn-std').className = 'vo2r-dur-btn' + (val === 'standard' ? ' active-std' : '');
  document.getElementById('vo2r-btn-dur').className = 'vo2r-dur-btn' + (val === 'durable'  ? ' active-dur' : '');
}

function vo2rParsePace(min, sec) { return parseFloat(min) + parseFloat(sec) / 60; }
function vo2rPaceToMs(pMin) { return 1609.34 / (pMin * 60); }
function vo2rMsToPace(ms) {
  var spm = 1609.34 / ms;
  var m = Math.floor(spm / 60), s = Math.round(spm % 60);
  if (s === 60) { m++; s = 0; }
  return m + ':' + (s < 10 ? '0' : '') + s + '/mi';
}
function vo2rRoundQ(s) { return Math.round(s / 15) * 15; }
function vo2rFmtDur(s) {
  if (s < 60) return s + 's';
  var m = Math.floor(s / 60), r = s % 60;
  return r === 0 ? m + ':00' : m + ':' + (r < 10 ? '0' : '') + r;
}
function vo2rSegRTSS(v, d, csMs) { var IF = v / csMs; return (d / 3600) * IF * IF * 100; }
function vo2rCalcRTSS(segs, csMs) {
  return Math.round(segs.reduce(function(a, s) { return a + vo2rSegRTSS(s.v, s.d, csMs); }, 0));
}
function vo2rGapColor(gapSec) {
  if (gapSec < 45) return '#dc2626'; if (gapSec <= 90) return '#d97706'; return '#16a34a';
}

function vo2rPrescribeData(csMs, dpMeters, vvo2Ms) {
  var burnRate = vvo2Ms - csMs;
  var timeToEx = Math.round(dpMeters / burnRate);
  var csSecMi  = 1609.34 / csMs;
  var vSecMi   = 1609.34 / vvo2Ms;
  var gapSecMile = Math.round(csSecMi - vSecMi);
  var maxRepStd = vo2rRoundQ(Math.floor((0.35 * dpMeters) / burnRate));
  var maxRepDur = vo2rRoundQ(Math.floor((0.45 * dpMeters) / burnRate));
  var HARD_STD = 18 * 60, HARD_DUR = 24 * 60;

  var profileType, profileLabel, profileDesc;
  if (gapSecMile < 45) {
    profileType = 'compressed'; profileLabel = 'Compressed Profile';
    profileDesc = 'Only ' + gapSecMile + ' sec/mile separates CS from vVO2max. VO2 and threshold running are nearly the same physiological session. Raising CS is the long-term priority.';
  } else if (gapSecMile <= 90) {
    profileType = 'moderate'; profileLabel = 'Moderate Profile';
    profileDesc = 'A ' + gapSecMile + ' sec/mile gap gives workable design flexibility. Both classic repeats and micro-interval structures are viable.';
  } else {
    profileType = 'wide'; profileLabel = 'Wide Profile';
    profileDesc = 'A ' + gapSecMile + ' sec/mile gap means strong speed above CS. Classic longer repeats are viable. Watch for early anaerobic reliance masking poor VO2 stimulus.';
  }
  var dpLabel = dpMeters < 150 ? 'Small D\u2019' : dpMeters < 300 ? 'Moderate D\u2019' : 'Large D\u2019';
  var dpNote  = dpMeters < 150
    ? 'Small D\u2019 means rep duration must be tightly controlled and recovery generous.'
    : dpMeters < 300
    ? 'Moderate D\u2019. Solid flexibility but early-rep pacing discipline is critical.'
    : 'Large D\u2019. Risk is masking VO2 stimulus with anaerobic contribution in early reps.';

  var w1SpeedMs = csMs + burnRate * 0.85;
  var w1Burn2 = w1SpeedMs - csMs;
  var w1Pace = vo2rMsToPace(w1SpeedMs);
  var recSpeedMs = csMs * 0.78, recPace = vo2rMsToPace(recSpeedMs);

  /* Std rep */
  var rdStdRaw = Math.min(maxRepStd, 300);
  var rdStd = vo2rRoundQ(rdStdRaw < 60 ? 60 : rdStdRaw);
  var dDStd = Math.round(w1Burn2 * rdStd);
  var dPStd = Math.round((dDStd / dpMeters) * 100);
  var rStdU  = rdStd >= 240 ? 4 : rdStd >= 180 ? 5 : 6;
  var rStd   = Math.min(rStdU, Math.floor(HARD_STD / rdStd));
  var rcStd  = rdStd;
  var segsS  = [];
  for (var i = 0; i < rStd; i++) { segsS.push({v: w1SpeedMs, d: rdStd}); segsS.push({v: recSpeedMs, d: rcStd}); }

  /* Durable rep */
  var rdDurRaw = Math.min(maxRepDur, 300);
  var rdDur    = vo2rRoundQ(rdDurRaw < 60 ? 60 : rdDurRaw);
  var dDDur    = Math.round(w1Burn2 * rdDur);
  var dPDur    = Math.round((dDDur / dpMeters) * 100);
  var rDurU    = rdDur >= 240 ? 5 : rdDur >= 180 ? 6 : 8;
  var rDur     = Math.min(rDurU, Math.floor(HARD_DUR / rdDur));
  var rcDur    = vo2rRoundQ(rdDur * 0.85);
  var segsD    = [];
  for (var j2 = 0; j2 < rDur; j2++) { segsD.push({v: w1SpeedMs, d: rdDur}); segsD.push({v: recSpeedMs, d: rcDur}); }

  var w1 = {
    name: 'Classic VO2 Repeats', subtitle: 'Ceiling-Limited Protocol',
    goal: 'Accumulate sustained time between CS and vVO2max. Controlled D\u2019 spend per rep keeps quality high.',
    std: { structure: rStd + ' x ' + vo2rFmtDur(rdStd) + ' @ ' + w1Pace, repDurFmt: vo2rFmtDur(rdStd), recDurFmt: vo2rFmtDur(rcStd), recPace: recPace, reps: rStd, tss: vo2rCalcRTSS(segsS, csMs), totalHard: rStd * rdStd, dPct: dPStd },
    dur: { structure: rDur + ' x ' + vo2rFmtDur(rdDur) + ' @ ' + w1Pace, repDurFmt: vo2rFmtDur(rdDur), recDurFmt: vo2rFmtDur(rcDur), recPace: recPace, reps: rDur, tss: vo2rCalcRTSS(segsD, csMs), totalHard: rDur * rdDur, dPct: dPDur },
    details: [['Target Pace', w1Pace], ['Recovery Pace', recPace + ' (easy jog)'], ['D\u2019 Spend / Rep (Std)', dDStd.toLocaleString() + ' m (' + dPStd + '% of D\u2019)'], ['D\u2019 Spend / Rep (Dur)', dDDur.toLocaleString() + ' m (' + dPDur + '% of D\u2019)']],
    progression: ['Add reps first \u2014 never extend rep duration before rep count is stable', 'Tighten recovery by 15s only after full set holds pace +/-3 sec/mi', 'Nudge intensity only when both rep count and recovery are dialed'],
    cues: ['HR ramps across reps 1-2, plateaus reps 3+', 'Breathing dominant over leg burn by rep 3', 'Pace holds within +/-3-5 sec/mile rep-to-rep', 'Form remains controlled in late reps', 'Does NOT require 2+ days to recover'],
    flags: ['Pace collapse after rep 2 => intensity too high, add 5 sec/mile', 'HR never climbs => recovery too long or intensity too low', 'Form breaks down before final rep => rep count too high', 'Legs-only sensation => likely anaerobic, not VO2 stimulus']
  };

  /* W2 */
  var priSpeedMs = csMs + burnRate * 0.35, priPace = vo2rMsToPace(priSpeedMs);
  var priDur = 300, priRecDur = 180;
  var priRecMs = csMs * 0.72, priRecPace = vo2rMsToPace(priRecMs);
  var priDCost = Math.round((priSpeedMs - csMs) * priDur);
  var priRecon = Math.round(dpMeters * 0.20);
  var netDp = dpMeters - priDCost + priRecon;
  var moOnMs = csMs + burnRate * 0.75, moOnPace = vo2rMsToPace(moOnMs);
  var moOnBurn = moOnMs - csMs;
  var moOffMs = csMs * 0.72, moOffPace = vo2rMsToPace(moOffMs);
  var setCyc2 = gapSecMile < 45 ? 8 : 10;
  var setDurSec = setCyc2 * 45;
  var btwnMs = csMs * 0.72;
  var setCostD = moOnBurn * 30 * setCyc2 * 0.9;
  var setsS2 = 2, setsD2 = netDp > setCostD * 2.5 ? 3 : 2;
  function buildW2Segs(numSets2) {
    var sv = [{v: priSpeedMs, d: priDur}, {v: priRecMs, d: priRecDur}];
    for (var sx = 0; sx < numSets2; sx++) {
      for (var cx = 0; cx < setCyc2; cx++) { sv.push({v: moOnMs, d: 30}); sv.push({v: moOffMs, d: 15}); }
      if (sx < numSets2 - 1) sv.push({v: btwnMs, d: 240});
    }
    return sv;
  }
  var w2 = {
    name: 'Primer + Micro-Intervals', subtitle: 'Kinetics-Limited Protocol',
    goal: 'Pre-load VO2 via the primer so the athlete arrives at rep 1 already elevated. Micro-intervals sustain that state with minimal individual D\u2019 draws.',
    primer: { steps: [vo2rFmtDur(priDur) + ' @ ' + priPace + ' \u2014 controlled D\u2019 draw to elevate VO2', vo2rFmtDur(priRecDur) + ' easy @ ' + priRecPace + ' \u2014 partial D\u2019 reconstitution', 'Begin main set'], cost: '~' + priDCost.toLocaleString() + ' m D\u2019 gross / ~' + (priDCost - priRecon).toLocaleString() + ' m net' },
    std: { structure: setsS2 + ' sets x ' + vo2rFmtDur(setDurSec) + ' (30s @ ' + moOnPace + ' / 15s easy)', repDurFmt: '30s', recDurFmt: '15s', recPace: moOffPace, betweenSetsFmt: vo2rFmtDur(240), sets: setsS2, tss: vo2rCalcRTSS(buildW2Segs(setsS2), csMs), totalHard: setsS2 * setCyc2 * 30 },
    dur: { structure: setsD2 + ' sets x ' + vo2rFmtDur(setDurSec) + ' (30s @ ' + moOnPace + ' / 15s easy)', repDurFmt: '30s', recDurFmt: '15s', recPace: moOffPace, betweenSetsFmt: vo2rFmtDur(240), sets: setsD2, tss: vo2rCalcRTSS(buildW2Segs(setsD2), csMs), totalHard: setsD2 * setCyc2 * 30 },
    details: [['On Pace', '30s @ ' + moOnPace], ['Off Pace', '15s @ ' + moOffPace + ' (float)'], ['Set Duration', vo2rFmtDur(setDurSec) + ' (~' + setCyc2 + ' cycles)'], ['Between Sets', vo2rFmtDur(240) + ' easy @ ' + vo2rMsToPace(btwnMs)]],
    progression: ['Add sets before extending set duration', 'Shorten between-set recovery to 3:00 before adding a set', 'Extend cycles per set (10 -> 12) only when all sets feel aerobically maximal'],
    cues: ['Breathing stress arrives by minute 2 of set 1 \u2014 primer is working', '15s float feels like almost not enough by set 2', 'HR pinned high from first effort of set 2', 'Athlete reports aerobic maximum, not leg-destroying'],
    flags: ['No breathing stress in set 1 => primer too easy, add 5 sec/mile or extend 1:00', 'Collapse mid-set 1 => primer too hard, back off 5 sec/mile or shorten 1:00', 'Pace drifts slow on micro-on => form fatigue, reduce set count not pace']
  };

  return { csMs: csMs, dpMeters: dpMeters, vvo2Ms: vvo2Ms, burnRate: burnRate, timeToEx: timeToEx,
    gapSecMile: gapSecMile, maxRepStd: maxRepStd, maxRepDur: maxRepDur,
    profileType: profileType, profileLabel: profileLabel, profileDesc: profileDesc,
    dpLabel: dpLabel, dpNote: dpNote, w1: w1, w2: w2,
    csPace: vo2rMsToPace(csMs), vvo2Pace: vo2rMsToPace(vvo2Ms) };
}

function vo2rMakeEl(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}

function vo2rRangeCard(type, label, presc, isW2) {
  var card = vo2rMakeEl('div', 'vo2-range-card ' + type);
  card.appendChild(vo2rMakeEl('div', 'vo2-range-label', label));
  card.appendChild(vo2rMakeEl('div', 'vo2-range-struct', presc.structure));
  var intLine = vo2rMakeEl('div', 'vo2-range-struct');
  intLine.style.fontSize = '12px'; intLine.style.color = '#64748b';
  intLine.textContent = 'Interval: ' + presc.repDurFmt + '  |  Recovery: ' + presc.recDurFmt + ' @ ' + presc.recPace;
  card.appendChild(intLine);
  if (isW2 && presc.betweenSetsFmt) {
    var btw = vo2rMakeEl('div', 'vo2-range-struct');
    btw.style.fontSize = '12px'; btw.style.color = '#64748b';
    btw.textContent = 'Between sets: ' + presc.betweenSetsFmt + ' easy';
    card.appendChild(btw);
  }
  var hardMin = Math.round(presc.totalHard / 60 * 10) / 10;
  var hl = vo2rMakeEl('div', 'vo2-range-struct');
  hl.style.fontSize = '12px'; hl.style.color = '#64748b';
  hl.textContent = 'Hard running: ' + (hardMin % 1 === 0 ? hardMin : hardMin.toFixed(1)) + ' min  |  ~' + presc.tss + ' rTSS';
  card.appendChild(hl);
  return card;
}

function vo2rRenderWorkout(w, isW2) {
  var card = vo2rMakeEl('div', 'vo2-workout-card');
  var hdr = vo2rMakeEl('div', 'vo2-workout-header');
  hdr.appendChild(vo2rMakeEl('div', 'vo2-workout-protocol', w.subtitle));
  hdr.appendChild(vo2rMakeEl('div', 'vo2-workout-name', w.name));
  hdr.appendChild(vo2rMakeEl('div', 'vo2-workout-goal', w.goal));
  /* Range cards */
  var rr = vo2rMakeEl('div', 'vo2-range-row');
  rr.appendChild(vo2rRangeCard('std', 'Standard (\u226418 min hard)', w.std, isW2));
  rr.appendChild(vo2rRangeCard('dur', 'Durable (\u226424 min hard)', w.dur, isW2));
  hdr.appendChild(rr);
  card.appendChild(hdr);

  var inner = vo2rMakeEl('div', 'vo2-body-inner');
  var left  = vo2rMakeEl('div', 'vo2-body-col');

  /* Run-specific warning */
  var warn = vo2rMakeEl('div', 'vo2-run-warn');
  warn.appendChild(vo2rMakeEl('div', 'vo2-run-warn-label', 'Eccentric Load \u2014 Running Specific'));
  warn.appendChild(document.createTextNode('Unlike cycling, running intervals accumulate musculoskeletal stress not captured by D\u2019 math. Rep count caps (18 / 24 min) are independent of D\u2019 budget. Form degradation in late reps is a harder stop signal than pace fade.'));
  left.appendChild(warn);

  if (isW2 && w.primer) {
    var pb = vo2rMakeEl('div', 'vo2-primer-box');
    pb.appendChild(vo2rMakeEl('div', 'vo2-primer-label', 'Primer Protocol'));
    w.primer.steps.forEach(function(s) { pb.appendChild(vo2rMakeEl('div', 'vo2-primer-step', '\u2192 ' + s)); });
    pb.appendChild(vo2rMakeEl('div', 'vo2-primer-cost', 'Net D\u2019 cost: ' + w.primer.cost));
    left.appendChild(pb);
  }

  left.appendChild(vo2rMakeEl('div', 'vo2-section-label', 'Interval Details'));
  w.details.forEach(function(d) {
    var row = vo2rMakeEl('div', 'vo2-detail-row');
    row.appendChild(vo2rMakeEl('span', 'vo2-detail-key', d[0]));
    row.appendChild(vo2rMakeEl('span', 'vo2-detail-val', d[1]));
    left.appendChild(row);
  });
  left.appendChild(vo2rMakeEl('div', 'vo2-section-label', 'Progression'));
  w.progression.forEach(function(p) {
    var li = vo2rMakeEl('div', 'vo2-list-item');
    var dot = vo2rMakeEl('span', 'vo2-dot'); dot.style.background = '#2563eb';
    li.appendChild(dot); li.appendChild(document.createTextNode(p)); left.appendChild(li);
  });

  var right = vo2rMakeEl('div', 'vo2-body-col');
  right.appendChild(vo2rMakeEl('div', 'vo2-section-label', 'Green Lights \u2014 Session Working'));
  w.cues.forEach(function(c) {
    var li = vo2rMakeEl('div', 'vo2-list-item');
    var dot = vo2rMakeEl('span', 'vo2-dot'); dot.style.background = '#16a34a';
    li.appendChild(dot); li.appendChild(document.createTextNode(c)); right.appendChild(li);
  });
  right.appendChild(vo2rMakeEl('div', 'vo2-section-label', 'Red Flags \u2014 Adjust If You See'));
  w.flags.forEach(function(f) {
    var li = vo2rMakeEl('div', 'vo2-flag-item');
    var dot = vo2rMakeEl('span', 'vo2-dot'); dot.style.background = '#dc2626'; dot.style.marginTop = '5px';
    li.appendChild(dot); li.appendChild(document.createTextNode(f)); right.appendChild(li);
  });

  inner.appendChild(left); inner.appendChild(right);
  card.appendChild(inner);
  return card;
}

function vo2rRenderResults(data) {
  // Store data globally for saving
  if (typeof calculatedResults !== 'undefined') {
    calculatedResults.vo2Run = data;
  }
  
  var container = document.getElementById('vo2r-results');
  container.innerHTML = '';
  var gc = vo2rGapColor(data.gapSecMile);

  /* Stats */
  var statsGrid = document.createElement('div'); statsGrid.className = 'qt2-result-grid';
  [
    {label: 'CS Pace', val: data.csPace, unit: 'critical speed'},
    {label: 'vVO2max Pace', val: data.vvo2Pace, unit: '800m anchor'},
    {label: 'Gap', val: data.gapSecMile + ' sec/mi', unit: 'ceiling to roof', color: gc},
    {label: 'Max Rep (Std)', val: vo2rFmtDur(data.maxRepStd), unit: '\u226435% D\u2019 spend'},
    {label: 'Max Rep (Durable)', val: vo2rFmtDur(data.maxRepDur), unit: '\u226445% D\u2019 spend'},
    {label: 'Time to D\u2019 Exhaustion', val: data.timeToEx + 's', unit: 'at vVO2max'}
  ].forEach(function(s) {
    var card = document.createElement('div'); card.className = 'qt2-stat';
    var lbl = document.createElement('div'); lbl.className = 'qt2-stat-label'; lbl.textContent = s.label;
    var val = document.createElement('div'); val.className = 'vo2-stat-value'; val.textContent = s.val;
    if (s.color) val.style.color = s.color;
    var unit = document.createElement('div'); unit.className = 'qt2-stat-unit'; unit.textContent = s.unit || '';
    card.appendChild(lbl); card.appendChild(val); card.appendChild(unit);
    statsGrid.appendChild(card);
  });
  var statsBox = document.createElement('div'); statsBox.className = 'qt2-result-box';
  var st = document.createElement('h4'); st.textContent = 'Workout Parameters'; statsBox.appendChild(st);
  statsBox.appendChild(statsGrid);
  container.appendChild(statsBox);

  /* Profile */
  var pCard = document.createElement('div'); pCard.className = 'vo2-profile-card';
  pCard.style.background = data.profileType === 'compressed' ? 'rgba(220,38,38,0.06)' : data.profileType === 'moderate' ? 'rgba(217,119,6,0.06)' : 'rgba(22,163,74,0.06)';
  pCard.style.borderColor = gc;
  var pb1 = document.createElement('span'); pb1.className = 'vo2-badge';
  pb1.style.background = gc + '22'; pb1.style.color = gc; pb1.textContent = data.profileLabel;
  var pb2 = document.createElement('span'); pb2.className = 'vo2-badge';
  pb2.style.background = '#f1f5f9'; pb2.style.color = '#64748b'; pb2.textContent = data.dpLabel;
  var pTxt = document.createElement('div'); pTxt.className = 'vo2-profile-text'; pTxt.textContent = data.profileDesc;
  var pNt  = document.createElement('div'); pNt.className  = 'vo2-profile-note'; pNt.textContent = data.dpNote;
  pCard.appendChild(pb1); pCard.appendChild(pb2); pCard.appendChild(pTxt); pCard.appendChild(pNt);
  container.appendChild(pCard);

  /* Durability notice */
  var isDur = vo2rDurability === 'durable';
  var durBox = document.createElement('div'); durBox.className = 'vo2-dur-notice ' + (isDur ? 'durable' : 'standard');
  durBox.textContent = isDur
    ? '\u25b2 Durable mode: prescriptions show the upper range (up to 24 min hard running). Use for high-mileage athletes with demonstrated resilience at intensity.'
    : '\u25e6 Standard mode: prescriptions show the conservative range (\u226418 min hard running). Appropriate for most trained athletes. Both ranges shown \u2014 coach selects based on athlete context.';
  container.appendChild(durBox);

  /* Workout tabs */
  var tabRow2 = document.createElement('div'); tabRow2.className = 'vo2-wkt-tabs';
  var wktArea2 = document.createElement('div');
  var tabBtns2 = ['Workout 1 \u2014 Classic Repeats', 'Workout 2 \u2014 Kinetics'].map(function(label, idx) {
    var btn2 = document.createElement('button'); btn2.className = 'vo2-wkt-tab' + (idx === 0 ? ' active' : '');
    btn2.textContent = label;
    btn2.addEventListener('click', function() {
      tabBtns2.forEach(function(b, i) { b.className = 'vo2-wkt-tab' + (i === idx ? ' active' : ''); });
      wktArea2.innerHTML = '';
      wktArea2.appendChild(vo2rRenderWorkout(idx === 0 ? data.w1 : data.w2, idx === 1));
    });
    tabRow2.appendChild(btn2); return btn2;
  });
  container.appendChild(tabRow2);
  wktArea2.appendChild(vo2rRenderWorkout(data.w1, false));
  container.appendChild(wktArea2);
  
  /* Save button */
  if (typeof athleteId !== 'undefined' && athleteId) {
    var saveBtn = document.createElement('button');
    saveBtn.className = 'qt2-calc-btn';
    saveBtn.style.background = '#16a34a';
    saveBtn.style.marginTop = '16px';
    saveBtn.textContent = '\u{1F4BE} Save to Profile';
    saveBtn.onclick = function() { if (typeof saveVO2RunToProfile === 'function') saveVO2RunToProfile(); };
    container.appendChild(saveBtn);
  }
  
  /* Export PDF button */
  var pdfBtn = document.createElement('button');
  pdfBtn.className = 'qt2-calc-btn';
  pdfBtn.style.background = '#2563eb';
  pdfBtn.style.marginTop = athleteId ? '8px' : '16px';
  pdfBtn.style.marginLeft = '0';
  pdfBtn.innerHTML = '&#8681; Export PDF';
  pdfBtn.onclick = function() { exportVO2RunPDF(data); };
  container.appendChild(pdfBtn);
}

function vo2rPrescribe() {
  var csMin  = document.getElementById('vo2r-cs-min').value;
  var csSec  = document.getElementById('vo2r-cs-sec').value;
  var v2Min  = document.getElementById('vo2r-vvo2-min').value;
  var v2Sec  = document.getElementById('vo2r-vvo2-sec').value;
  var dp     = parseFloat(document.getElementById('vo2r-dp').value);
  var errEl  = document.getElementById('vo2r-results');

  function showErr2(msg) {
    errEl.innerHTML = '<div class="qt2-result-box" style="border-color:#ef4444;background:#fef2f2;"><h4 style="color:#b91c1c;">Input Error</h4><div style="font-size:14px;">' + msg + '</div></div>';
  }
  if (!csMin || csSec === '' || !v2Min || v2Sec === '' || isNaN(dp)) { showErr2('All fields are required. Enter pace as min : sec per mile.'); return; }
  var csPaceMin  = vo2rParsePace(csMin, csSec);
  var vvo2PaceMin = vo2rParsePace(v2Min, v2Sec);
  if (vvo2PaceMin >= csPaceMin) { showErr2('vVO2max pace must be faster (lower number) than CS pace.'); return; }
  if (dp < 30 || dp > 1500)     { showErr2('D\u2019 should be in meters, typically 80-1000m for trained runners.'); return; }
  var csMs   = vo2rPaceToMs(csPaceMin);
  var vvo2Ms = vo2rPaceToMs(vvo2PaceMin);
  var data   = vo2rPrescribeData(csMs, dp, vvo2Ms);
  vo2rRenderResults(data);
}

/* Enter key support for Run inputs */
['vo2r-cs-min','vo2r-cs-sec','vo2r-vvo2-min','vo2r-vvo2-sec','vo2r-dp'].forEach(function(id) {
  var node = document.getElementById(id);
  if (node) node.addEventListener('keydown', function(e) { if (e.key === 'Enter') vo2rPrescribe(); });
});
/* Auto-advance minutes -> seconds */
['vo2r-cs-min','vo2r-vvo2-min'].forEach(function(id) {
  var node = document.getElementById(id);
  if (node) node.addEventListener('input', function() {
    if (this.value.length >= 2) {
      var nxt = id === 'vo2r-cs-min' ? 'vo2r-cs-sec' : 'vo2r-vvo2-sec';
      var nx = document.getElementById(nxt);
      if (nx) { nx.focus(); nx.select(); }
    }
  });
});

/* ============================================================
   PDF EXPORT FUNCTIONS WITH LOGO SUPPORT
   ============================================================ */

function exportVO2BikePDF(data) {
  // Check if jsPDF is loaded
  if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
    alert('PDF library not loaded. Please refresh the page and try again.');
    return;
  }
  
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  // Get selected logo
  const logoURL = typeof getSelectedLogoURL === 'function' ? getSelectedLogoURL() : '';
  const logoName = typeof getSelectedLogoName === 'function' ? getSelectedLogoName() : 'EchoDevo';
  
  // Add logo if available
  let yPosition = 20;
  if (logoURL) {
    try {
      // Note: Logo needs to be loaded as image - for now we'll add text
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(logoName, 15, yPosition);
      yPosition += 10;
    } catch (e) {
      console.error('Logo error:', e);
    }
  }
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(26, 58, 92);
  doc.text('VO2max Bike Workout Prescription', 15, yPosition);
  yPosition += 10;
  
  // Athlete info if available
  if (typeof athleteId !== 'undefined' && athleteId) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Athlete ID: ' + athleteId, 15, yPosition);
    yPosition += 8;
  }
  
  // Date
  doc.setFontSize(9);
  doc.text('Generated: ' + new Date().toLocaleDateString(), 15, yPosition);
  yPosition += 15;
  
  // Parameters
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Workout Parameters', 15, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  const cp = document.getElementById('vo2b-cp').value;
  const wp = document.getElementById('vo2b-wp').value;
  const pvo2 = document.getElementById('vo2b-pvo2').value;
  
  doc.text('Critical Power: ' + cp + 'W', 15, yPosition);
  yPosition += 6;
  doc.text('W\': ' + wp + 'J', 15, yPosition);
  yPosition += 6;
  doc.text('pVO2max: ' + pvo2 + 'W', 15, yPosition);
  yPosition += 6;
  doc.text('Burn Rate: ' + data.burnRate + 'W above CP', 15, yPosition);
  yPosition += 6;
  doc.text('Gap: ' + data.gap + 'W', 15, yPosition);
  yPosition += 10;
  
  // Profile
  doc.setFontSize(12);
  doc.text('Profile: ' + data.profileLabel, 15, yPosition);
  yPosition += 6;
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(data.profileDesc, 180);
  doc.text(descLines, 15, yPosition);
  yPosition += descLines.length * 5 + 10;
  
  // Workout 1
  doc.setFontSize(14);
  doc.text(data.w1.name, 15, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(data.w1.structure, 15, yPosition);
  yPosition += 6;
  doc.text('TSS: ~' + data.w1.tss, 15, yPosition);
  yPosition += 10;
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Powered by ' + logoName, 15, 285);
  
  // Save
  doc.save('VO2_Bike_Workout_' + new Date().getTime() + '.pdf');
  alert('✅ PDF exported successfully!');
}

function exportVO2RunPDF(data) {
  // Check if jsPDF is loaded
  if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
    alert('PDF library not loaded. Please refresh the page and try again.');
    return;
  }
  
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  // Get selected logo
  const logoURL = typeof getSelectedLogoURL === 'function' ? getSelectedLogoURL() : '';
  const logoName = typeof getSelectedLogoName === 'function' ? getSelectedLogoName() : 'EchoDevo';
  
  // Add logo if available
  let yPosition = 20;
  if (logoURL) {
    try {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(logoName, 15, yPosition);
      yPosition += 10;
    } catch (e) {
      console.error('Logo error:', e);
    }
  }
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(26, 58, 92);
  doc.text('VO2max Run Workout Prescription', 15, yPosition);
  yPosition += 10;
  
  // Athlete info if available
  if (typeof athleteId !== 'undefined' && athleteId) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Athlete ID: ' + athleteId, 15, yPosition);
    yPosition += 8;
  }
  
  // Date
  doc.setFontSize(9);
  doc.text('Generated: ' + new Date().toLocaleDateString(), 15, yPosition);
  yPosition += 15;
  
  // Parameters
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Workout Parameters', 15, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  const csMin = document.getElementById('vo2r-cs-min').value;
  const csSec = document.getElementById('vo2r-cs-sec').value;
  const vMin = document.getElementById('vo2r-vvo2-min').value;
  const vSec = document.getElementById('vo2r-vvo2-sec').value;
  const dp = document.getElementById('vo2r-dp').value;
  
  doc.text('Critical Speed: ' + csMin + ':' + csSec + '/mi', 15, yPosition);
  yPosition += 6;
  doc.text('vVO2max: ' + vMin + ':' + vSec + '/mi', 15, yPosition);
  yPosition += 6;
  doc.text('D\': ' + dp + ' meters', 15, yPosition);
  yPosition += 6;
  doc.text('Gap: ' + data.gapSecMile + ' sec/mile', 15, yPosition);
  yPosition += 10;
  
  // Profile
  doc.setFontSize(12);
  doc.text('Profile: ' + data.profileLabel, 15, yPosition);
  yPosition += 6;
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(data.profileDesc, 180);
  doc.text(descLines, 15, yPosition);
  yPosition += descLines.length * 5 + 10;
  
  // Workout 1
  doc.setFontSize(14);
  doc.text(data.w1.name, 15, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(data.w1.structure, 15, yPosition);
  yPosition += 6;
  doc.text('RTSS: ~' + data.w1.rtss, 15, yPosition);
  yPosition += 10;
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Powered by ' + logoName, 15, 285);
  
  // Save
  doc.save('VO2_Run_Workout_' + new Date().getTime() + '.pdf');
  alert('✅ PDF exported successfully!');
}
