/* ============================================================
   TH BIKE ANALYSIS — LT1 / OGC Threshold Report
   EchoDevo · adapted for the coaching calculators app
   All element IDs use the tha- prefix to avoid collisions.
   CSS classes use the existing qt2-* / tha-* system.
   ============================================================ */

(function () {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────────── */
  function $T(id)  { return document.getElementById(id); }
  function iV(id)  { var n=$T(id); return n ? parseInt(n.value,10)||0 : 0; }
  function fV(id)  { var n=$T(id); return n ? parseFloat(n.value)||0 : 0; }
  function sV(id)  { var n=$T(id); return n ? n.value.trim() : ''; }

  /* ── state ─────────────────────────────────────────────────────── */
  var _analysis    = null;
  var _pdfLight    = false;
  var _aiText      = '';
  var _aiDone      = false;
  var _blockHTML   = '';
  var _hrmaxIsEst  = false;

  /* ── HRmax estimation ─────────────────────────────────────────── */
  function thaGetHrmax() {
    var val = iV('tha-hrmax');
    if (val && val >= 120) return { val: val, estimated: false };
    var age = iV('tha-age');
    if (age && age >= 14) {
      return { val: Math.round(208 - 0.7 * age), estimated: true };
    }
    return { val: null, estimated: null };
  }

  window.thaOnAgeInput = function () {
    var age = iV('tha-age');
    var hrmaxInput = iV('tha-hrmax');
    var bar = $T('tha-hrmax-estimate-bar');
    if (!bar) return;
    if (age && age >= 14 && !hrmaxInput) {
      var tanaka = Math.round(208 - 0.7 * age);
      var fox = 220 - age;
      bar.style.display = 'flex';
      var tn = $T('tha-hrmax-tanaka'); if (tn) tn.textContent = tanaka + ' bpm';
      var fn2 = $T('tha-hrmax-fox');   if (fn2) fn2.textContent = fox + ' bpm';
      var hm = $T('tha-hrmax');        if (hm) hm.placeholder = tanaka + ' (Tanaka est.)';
      var src = $T('tha-hrmax-src');   if (src) src.textContent = '(est. from age)';
      _hrmaxIsEst = true;
    } else if (!age) {
      bar.style.display = 'none';
      var hm2 = $T('tha-hrmax'); if (hm2) hm2.placeholder = 'or enter age';
      var src2 = $T('tha-hrmax-src'); if (src2) src2.textContent = '';
      _hrmaxIsEst = false;
    }
  };

  window.thaOnHrmaxInput = function () {
    var val = iV('tha-hrmax');
    var src = $T('tha-hrmax-src');
    var bar = $T('tha-hrmax-estimate-bar');
    if (val && val >= 120) {
      if (src) src.textContent = '(measured)';
      if (bar) bar.style.display = 'none';
      _hrmaxIsEst = false;
    } else if (!val) {
      thaOnAgeInput();
    }
  };

  window.thaOnBwInput = function () {
    var lbs = fV('tha-bw-lbs');
    var bwHidden = $T('tha-bw');
    var label    = $T('tha-bw-kg-label');
    if (lbs && lbs > 0) {
      var kg = parseFloat((lbs * 0.453592).toFixed(1));
      if (bwHidden) bwHidden.value = kg;
      if (label) label.textContent = '= ' + kg + ' kg';
    } else {
      if (bwHidden) bwHidden.value = '';
      if (label) label.textContent = 'lbs';
    }
  };

  window.thaPdfToggleTheme = function () {
    _pdfLight = !_pdfLight;
    var t = $T('tha-theme-track'), l = $T('tha-theme-label');
    if (_pdfLight) { if (t) t.classList.add('on'); if (l) l.textContent = 'Light PDF'; }
    else           { if (t) t.classList.remove('on'); if (l) l.textContent = 'Dark PDF'; }
  };

  /* ── status / diag helpers ─────────────────────────────────────── */
  function thaSetStatus(msg) {
    var s = $T('tha-status-bar');
    if (s) { s.style.display = 'flex'; }
    var t = $T('tha-status-text'); if (t) t.textContent = msg;
  }
  function thaHideStatus() {
    var s = $T('tha-status-bar'); if (s) s.style.display = 'none';
  }
  function thaShowDiag(level, title, html) {
    var d = $T('tha-diag'); if (!d) return;
    d.style.display = 'block';
    var ic = $T('tha-diag-icon');
    if (ic) {
      ic.className = 'tha-diag-icon tha-di-' + level;
      ic.textContent = level === 'ok' ? '✓' : level === 'warn' ? '!' : '✕';
    }
    var dt = $T('tha-diag-title'); if (dt) { dt.className = 'tha-diag-title-txt'; dt.textContent = title; }
    var db = $T('tha-diag-body'); if (db) db.innerHTML = html;
  }
  function thaStatsHTML(w) {
    return '<div class="tha-diag-stats">' +
      '<div class="tha-ds"><div class="tha-ds-l">Duration</div><div class="tha-ds-v">' + Math.round(w.durMin || 0) + ' min</div></div>' +
      '<div class="tha-ds"><div class="tha-ds-l">Power range</div><div class="tha-ds-v">' + Math.round(w.minP || 0) + '–' + Math.round(w.maxP || 0) + 'W</div></div>' +
      '<div class="tha-ds"><div class="tha-ds-l">Stages</div><div class="tha-ds-v">' + (w.ups || 0) + '</div></div>' +
      '<div class="tha-ds"><div class="tha-ds-l">Recoveries</div><div class="tha-ds-v">' + (w.downs || 0) + '</div></div>' +
      '</div>';
  }

  /* ── FIT parser ─────────────────────────────────────────────────── */
  function thaParseF(buf) {
    var dv = new DataView(buf), b = new Uint8Array(buf);
    if (String.fromCharCode(b[8], b[9], b[10], b[11]) !== '.FIT') throw new Error('Not a valid .FIT file');
    var dataSize = dv.getUint32(4, true);
    var off = b[0], end = b[0] + dataSize, defs = {}, recs = [];
    while (off < end - 1 && off < b.length - 1) {
      var hdr = b[off++];
      var isDef = (hdr & 0x40) !== 0, isComp = (hdr & 0x80) !== 0, hasDev = (hdr & 0x20) !== 0;
      var ln = isComp ? (hdr & 0x60) >> 5 : (hdr & 0x0F);
      if (isComp) { var dComp = defs[ln]; if (dComp) off += dComp.sz; continue; }
      if (isDef) {
        off++;
        var le = b[off++] === 0;
        var gn = le ? dv.getUint16(off, true) : dv.getUint16(off, false); off += 2;
        var nf = b[off++], fields = [], sz = 0;
        for (var i = 0; i < nf; i++) { fields.push({ n: b[off], s: b[off + 1] }); sz += b[off + 1]; off += 3; }
        var dsz = 0;
        if (hasDev) { var nd = b[off++]; for (var j = 0; j < nd; j++) { dsz += b[off + 1]; off += 3; } }
        defs[ln] = { gn: gn, fields: fields, sz: sz + dsz, le: le };
      } else {
        var def = defs[ln]; if (!def) { off++; continue; }
        if (def.gn === 20) {
          var pos = off, rec = {};
          for (var k = 0; k < def.fields.length; k++) {
            var f = def.fields[k], v;
            if (f.s === 1) v = b[pos];
            else if (f.s === 2) v = def.le ? dv.getUint16(pos, true) : dv.getUint16(pos, false);
            else if (f.s === 4) v = def.le ? dv.getUint32(pos, true) : dv.getUint32(pos, false);
            rec[f.n] = v; pos += f.s;
          }
          var hr2 = rec[3] != null ? rec[3] : null;
          var pw  = rec[7] != null ? rec[7] : null;
          if (hr2 === 255 || hr2 === 0) hr2 = null;
          if (pw === 65535 || pw === 0) pw = null;
          recs.push({ ts: rec[253] != null ? rec[253] : null, hr: hr2, power: pw });
        }
        off += def.sz;
      }
    }
    return recs;
  }

  /* ── classifier ─────────────────────────────────────────────────── */
  function thaClassify(records, cp) {
    var pows = records.map(function(r) { return r.power; }).filter(function(v) { return v != null && v > 50; });
    var hrs  = records.map(function(r) { return r.hr; }).filter(function(v) { return v != null; });
    if (!pows.length || !hrs.length) return { type: 'no_data' };
    var durMin = records.length / 60;
    var minP = Math.min.apply(null, pows), maxP = Math.max.apply(null, pows);
    var allP = records.map(function(r) { return r.power; });
    var sp = allP.map(function(_, i) {
      var sl = allP.slice(Math.max(0, i - 15), Math.min(allP.length, i + 15)).filter(function(v) { return v != null; });
      return sl.length ? sl.reduce(function(a, b) { return a + b; }, 0) / sl.length : null;
    });
    var ups = 0, downs = 0, trans = 0, lastL = null, lastC = 0;
    for (var ii = 0; ii < sp.length; ii++) { if (sp[ii] != null) { lastL = sp[ii]; break; } }
    for (var i2 = 60; i2 < sp.length; i2++) {
      if (!sp[i2]) continue;
      if (Math.abs(sp[i2] - lastL) > 18 && i2 - lastC > 60) {
        if (sp[i2] > lastL) ups++; else downs++;
        trans++; lastL = sp[i2]; lastC = i2;
      }
    }
    var wSDs = [];
    for (var i3 = 0; i3 < pows.length - 300; i3 += 300) {
      var w2 = pows.slice(i3, i3 + 300), m2 = w2.reduce(function(a, b) { return a + b; }, 0) / w2.length;
      wSDs.push(Math.sqrt(w2.reduce(function(a, b) { return a + (b - m2) * (b - m2); }, 0) / w2.length));
    }
    var avgSD = wSDs.length ? wSDs.reduce(function(a, b) { return a + b; }, 0) / wSDs.length : 999;
    var recPow = pows.filter(function(p) { return p < cp * 0.52; });
    var hasValleys = recPow.length > 0 && downs >= 3 && downs <= ups * 1.3 && ups >= 3;
    var type, desc, rec;
    if (maxP - minP < 30) {
      type = 'steady'; desc = 'Steady-state workout — range only ' + Math.round(maxP - minP) + 'W.'; rec = 'Upload a recovery-valley threshold protocol file.';
    } else if (hasValleys && avgSD < 50) {
      type = 'protocol'; desc = 'Recovery-valley protocol confirmed — ' + ups + ' stages, ' + downs + ' recovery valleys, ' + Math.round(durMin) + ' min.'; rec = null;
    } else if (ups >= 3 && downs <= ups * 0.35 && avgSD < 28) {
      type = 'step'; desc = 'Ascending step test — ' + ups + ' power levels, ' + Math.round(durMin) + ' min.'; rec = null;
    } else if (downs > ups * 0.65 && trans > 4 && !hasValleys) {
      type = 'intervals'; desc = 'Interval workout detected — not a threshold protocol.'; rec = 'Upload a file from the LT1/OGC threshold protocol.';
    } else {
      type = 'unclear'; desc = 'Workout type unclear.'; rec = 'Could not confirm threshold protocol structure.';
    }
    return { type: type, desc: desc, rec: rec, durMin: durMin, minP: minP, maxP: maxP, ups: ups, downs: downs, avgSD: avgSD };
  }

  /* ── stage detection ────────────────────────────────────────────── */
  function thaDetectStages(records, cp) {
    var allP = records.map(function(r) { return r.power; });
    var sp = allP.map(function(_, i) {
      var sl = allP.slice(Math.max(0, i - 15), Math.min(allP.length, i + 15)).filter(function(v) { return v != null; });
      return sl.length ? sl.reduce(function(a, b) { return a + b; }, 0) / sl.length : null;
    });
    var blocks = [], ss = 0;
    for (var i = 30; i <= sp.length; i++) {
      var isLast = i === sp.length;
      if (!isLast && sp[i] != null) {
        var bef = sp.slice(Math.max(0, i - 20), i).filter(function(v) { return v != null; });
        var aft = sp.slice(i, Math.min(sp.length, i + 20)).filter(function(v) { return v != null; });
        if (!bef.length || !aft.length) continue;
        var bMean = bef.reduce(function(a, b) { return a + b; }, 0) / bef.length;
        var aMean = aft.reduce(function(a, b) { return a + b; }, 0) / aft.length;
        if (Math.abs(aMean - bMean) < 15 && !isLast) continue;
      }
      var seg = records.slice(ss, i);
      if (seg.length < 60) { if (!isLast) ss = i; continue; }
      var sp2 = seg.map(function(r) { return r.power; }).filter(function(v) { return v != null; });
      var sh  = seg.map(function(r) { return r.hr; }).filter(function(v) { return v != null; });
      if (!sp2.length || !sh.length) { if (!isLast) ss = i; continue; }
      var avgP = sp2.reduce(function(a, b) { return a + b; }, 0) / sp2.length;
      if (avgP > cp * 0.50) {
        var stIdx = Math.floor(seg.length * 0.60);
        var stHRs = seg.slice(stIdx).map(function(r) { return r.hr; }).filter(function(v) { return v != null; });
        var stableHR = stHRs.length ? Math.round(stHRs.reduce(function(a, b) { return a + b; }, 0) / stHRs.length) : Math.round(sh.reduce(function(a, b) { return a + b; }, 0) / sh.length);
        var chunk = Math.max(1, Math.floor(sh.length * 0.15));
        var eHR = sh.slice(0, chunk).reduce(function(a, b) { return a + b; }, 0) / chunk;
        var lHR = sh.slice(-chunk).reduce(function(a, b) { return a + b; }, 0) / chunk;
        blocks.push({ power: Math.round(avgP), pctCP: Math.round(avgP / cp * 100), stableHR: stableHR, drift: parseFloat((lHR - eHR).toFixed(1)), dur: seg.length });
      }
      ss = i;
    }
    var sorted = blocks.sort(function(a, b) { return a.power - b.power; });
    var deduped = [];
    for (var d = 0; d < sorted.length; d++) {
      if (!deduped.length || Math.abs(sorted[d].power - deduped[deduped.length - 1].power) >= 12) deduped.push(sorted[d]);
    }
    return deduped;
  }

  /* ── threshold analysis ─────────────────────────────────────────── */
  function thaAnalyze(stages, cp, hrRest, hrMax, hrmaxEstimated) {
    if (stages.length < 3) return null;
    var hrr = hrMax && hrRest ? (hrMax - hrRest) : 0;

    for (var i = 1; i < stages.length; i++) {
      var dHR = stages[i].stableHR - stages[i - 1].stableHR;
      var dW  = stages[i].power - stages[i - 1].power;
      stages[i].dpw = dW > 0 ? parseFloat((dHR / dW).toFixed(4)) : 0;
      stages[i].dhr = dHR;
    }
    stages[0].dpw = null; stages[0].dhr = null;

    var deltas = stages.slice(1).map(function(s) { return s.dpw; }).filter(function(v) { return v != null && v >= 0; });
    var mean   = deltas.reduce(function(a, b) { return a + b; }, 0) / deltas.length;
    stages.forEach(function(s) {
      s.mean   = mean;
      s.pctHRR = hrr > 0 ? Math.round((s.stableHR - hrRest) / hrr * 100) : 0;
    });

    /* D-max */
    var xs = stages.map(function(s) { return s.power; });
    var ys = stages.map(function(s) { return s.stableHR; });
    var startI = 1;
    var x1 = xs[startI], y1 = ys[startI], xe = xs[stages.length - 1], ye = ys[stages.length - 1];
    var dMaxLT1 = -1, dMaxScore = 0;
    for (var i2 = startI + 1; i2 < stages.length - 1; i2++) {
      var d = Math.abs((ye - y1) * xs[i2] - (xe - x1) * ys[i2] + xe * y1 - ye * x1) / Math.sqrt(Math.pow(ye - y1, 2) + Math.pow(xe - x1, 2));
      stages[i2]._dmaxDist = parseFloat(d.toFixed(3));
      if (d > dMaxScore) { dMaxScore = d; dMaxLT1 = i2; }
    }

    /* Conconi */
    var conconiLT1 = -1, minSlopeI = -1, minSlope = 9999;
    for (var i3 = 1; i3 < stages.length - 1; i3++) {
      if (stages[i3].dpw != null && stages[i3].dpw < minSlope) { minSlope = stages[i3].dpw; minSlopeI = i3; }
    }
    if (minSlopeI > 0 && minSlopeI < stages.length - 1) {
      var nextSlope = stages[minSlopeI + 1] ? stages[minSlopeI + 1].dpw || 0 : 0;
      conconiLT1 = nextSlope > minSlope * 2.0 ? minSlopeI + 1 : minSlopeI;
    }

    /* Slope inflection */
    var slopeInflection = -1;
    for (var i4 = 2; i4 < stages.length - 1; i4++) {
      if (stages[i4 - 1].dpw != null && stages[i4].dpw != null) {
        if (stages[i4 - 1].dpw < mean * 0.88 && stages[i4].dpw > mean * 1.10) { slopeInflection = i4; break; }
      }
    }

    /* Consensus */
    var votes = [dMaxLT1, conconiLT1, slopeInflection].filter(function(v) { return v > 0; });
    var lt1i;
    if (votes.length === 0) {
      lt1i = -1;
      for (var v2 = 0; v2 < stages.length; v2++) { if (stages[v2].pctCP >= 58 && stages[v2].pctCP <= 74) { lt1i = v2; break; } }
      if (lt1i < 0) lt1i = Math.floor(stages.length * 0.35);
    } else if (votes.length === 1) {
      lt1i = votes[0];
    } else {
      var sortedV = votes.slice().sort(function(a, b) { return a - b; });
      var span = sortedV[sortedV.length - 1] - sortedV[0];
      if (span <= 2) { lt1i = Math.round(votes.reduce(function(a, b) { return a + b; }, 0) / votes.length); }
      else           { lt1i = dMaxLT1 > 0 ? dMaxLT1 : votes[0]; }
    }
    lt1i = Math.max(1, Math.min(lt1i, stages.length - 2));

    /* OGC */
    var ogci = -1;
    for (var i5 = lt1i + 1; i5 < stages.length; i5++) {
      if (stages[i5].dpw != null && stages[i5].dpw > mean * 1.18) { ogci = i5; break; }
    }
    if (ogci < 0) {
      var maxSlope = -1;
      for (var i6 = lt1i + 1; i6 < stages.length; i6++) {
        if (stages[i6].dpw != null && stages[i6].dpw > maxSlope) { maxSlope = stages[i6].dpw; ogci = i6; }
      }
    }
    if (ogci < 0) ogci = Math.min(lt1i + 2, stages.length - 1);

    /* Confidence */
    var lt1MethodsAgree = votes.filter(function(v) { return Math.abs(v - lt1i) <= 1; }).length;
    var lt1SlopeContrast = stages[lt1i] && stages[lt1i].dpw != null ?
      (stages[Math.min(lt1i + 1, stages.length - 1)].dpw || 0) - (stages[Math.max(lt1i - 1, 0)].dpw || 0) : 0;
    var lt1c = 'moderate';
    if (lt1MethodsAgree >= 2 && Math.abs(lt1SlopeContrast) > 0.15) lt1c = 'high';
    else if (lt1MethodsAgree <= 1 && Math.abs(lt1SlopeContrast) < 0.08) lt1c = 'low';

    var ogcSlopeRatio = stages[ogci] && stages[ogci].dpw != null && mean > 0 ? stages[ogci].dpw / mean : 1;
    var ogcc = ogcSlopeRatio > 1.25 ? 'high' : ogcSlopeRatio > 1.05 ? 'moderate' : 'low';

    var lt1Score = lt1c === 'high' ? 85 : lt1c === 'moderate' ? 62 : 38;
    var ogcScore = ogcc === 'high' ? 85 : ogcc === 'moderate' ? 62 : 38;

    /* Flags */
    var flags = [];
    var hrAtFirst = stages[0] ? stages[0].stableHR : 0;
    var hrAtLast  = stages[stages.length - 1] ? stages[stages.length - 1].stableHR : 0;
    if (hrMax && hrAtFirst > hrMax * 0.78) flags.push({ type: 'warn', msg: 'Test may have started above LT1 — first stage HR already elevated. Lower starting wattage recommended.' });
    if (hrMax && hrAtLast > hrMax * 0.94) {
      if (hrmaxEstimated) flags.push({ type: 'warn', msg: 'Final stage HR approached estimated HRmax — confirm true HRmax or reduce max wattage on retest.' });
      else flags.push({ type: 'err', msg: 'HRmax approached — final stages not aerobically diagnostic. Reduce max wattage on retest.' });
    }
    var driftIssues = stages.filter(function(s) { return Math.abs(s.drift) > 8; });
    if (driftIssues.length > 0) flags.push({ type: 'warn', msg: 'HR drift >8 bpm in ' + driftIssues.length + ' stage(s) (' + driftIssues.map(function(s) { return s.power + 'W'; }).join(', ') + ') — possible incomplete recovery.' });
    if (stages.length < 5) flags.push({ type: 'warn', msg: 'Only ' + stages.length + ' stages detected — more stages improve threshold precision.' });

    var adi = stages[ogci].power - stages[lt1i].power;
    stages.forEach(function(s, i7) {
      if (i7 === lt1i) s.zone = 'lt1';
      else if (i7 === ogci) s.zone = 'ogc';
      else if (i7 > lt1i && i7 < ogci) s.zone = 'buffer';
      else if (i7 > ogci) s.zone = 'near';
      else s.zone = 'base';
    });

    return {
      lt1: stages[lt1i], ogc: stages[ogci], lt1i: lt1i, ogci: ogci,
      mean: mean, adi: adi, lt1c: lt1c, ogcc: ogcc,
      lt1Score: lt1Score, ogcScore: ogcScore, flags: flags, stages: stages,
      cp: cp, hrRest: hrRest, hrMax: hrMax, hrmaxEstimated: !!hrmaxEstimated,
      methods: { dMax: dMaxLT1, conconi: conconiLT1, inflection: slopeInflection }
    };
  }

  /* ── render summary ─────────────────────────────────────────────── */
  function thaRenderSummary(A) {
    var lt1 = A.lt1, ogc = A.ogc, adi = A.adi, cp = A.cp;
    var hrrKnown = A.hrMax && A.hrRest && A.hrMax > A.hrRest;
    function setT(id, val) { var n = $T(id); if (n) n.textContent = val; }
    setT('tha-r-lt1w',  lt1 ? lt1.power + 'W' : '—');
    setT('tha-r-lt1pct', lt1 ? lt1.pctCP + '% of CP' : '');
    setT('tha-r-lt1hr',  lt1 ? lt1.stableHR : '—');
    setT('tha-r-lt1hr-sub', lt1 && hrrKnown ? lt1.pctHRR + '% HRR' + (A.hrmaxEstimated ? ' (est.)' : '') : 'bpm');
    setT('tha-r-ogcw',  ogc ? ogc.power + 'W' : '—');
    setT('tha-r-ogcpct', ogc ? ogc.pctCP + '% of CP' : '');
    setT('tha-r-ogchr',  ogc ? ogc.stableHR : '—');
    setT('tha-r-ogchr-sub', ogc && hrrKnown ? ogc.pctHRR + '% HRR' + (A.hrmaxEstimated ? ' (est.)' : '') : 'bpm');
    setT('tha-r-window', lt1 && ogc ? adi + 'W' : '—');
    if (lt1 && ogc) {
      var adiPct = Math.round(adi / cp * 100);
      var rating = adiPct >= 25 ? 'wide' : adiPct >= 18 ? 'moderate' : 'narrow';
      setT('tha-r-windowsub', adiPct + '% CP · ' + rating);
    }
    var name = sV('tha-athlete-name');
    var date = sV('tha-test-date');
    var p12v = $T('tha-p12') ? parseInt($T('tha-p12').value) || null : null;
    var meta = [];
    if (name) meta.push(name);
    if (date) meta.push(new Date(date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    meta.push('CP: ' + cp + 'W');
    if (p12v && cp) meta.push('12min/CP: ' + (p12v / cp).toFixed(3));
    var ad = $T('tha-athlete-display'); if (ad) ad.textContent = meta.join(' · ');
    var cpLabel = $T('tha-zone-cp-label');
    if (cpLabel) cpLabel.textContent = 'CP: ' + cp + 'W  ·  HRR: ' + (A.hrMax && A.hrRest ? A.hrMax - A.hrRest : '—') + ' bpm';
  }

  /* ── render flags ───────────────────────────────────────────────── */
  function thaRenderFlags(A) {
    var fr = $T('tha-flags-row'); if (!fr) return;
    fr.innerHTML = '';
    if (!A.flags.length) {
      fr.innerHTML = '<span class="tha-flag tha-flag-ok">✓ Protocol quality: clean data</span>'; return;
    }
    A.flags.forEach(function(f) {
      var cl = f.type === 'err' ? 'tha-flag-err' : 'tha-flag-warn';
      var icon = f.type === 'err' ? '⚠' : '!';
      fr.innerHTML += '<span class="tha-flag ' + cl + '">' + icon + ' ' + f.msg + '</span>';
    });
  }

  /* ── render zones ───────────────────────────────────────────────── */
  function thaRenderZones(A) {
    var lt1 = A.lt1, ogc = A.ogc, cp = A.cp, hrRest = A.hrRest, hrMax = A.hrMax, stages = A.stages;
    var bw = fV('tha-bw') || null;
    var hrr = hrMax && hrRest ? hrMax - hrRest : 0;
    var cpPct65 = Math.round(cp * 0.65);

    function buildReg(fromIdx) {
      var pts = stages.slice(fromIdx).filter(function(s) { return s.power && s.stableHR; });
      if (pts.length < 2) return null;
      var n = pts.length;
      var sx = pts.reduce(function(a, s) { return a + s.power; }, 0);
      var sy = pts.reduce(function(a, s) { return a + s.stableHR; }, 0);
      var sxy = pts.reduce(function(a, s) { return a + s.power * s.stableHR; }, 0);
      var sxx = pts.reduce(function(a, s) { return a + s.power * s.power; }, 0);
      var slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
      var intercept = (sy - slope * sx) / n;
      return { slope: slope, intercept: intercept, extrapolate: function(w) { return Math.round(slope * w + intercept); } };
    }

    var reg = stages && stages.length > 2 ? buildReg(A.lt1i > 0 ? A.lt1i : 0) : null;
    var maxTestedW = stages && stages.length ? stages[stages.length - 1].power : 0;

    function hrAtW(w) {
      if (!w) return { hr: null, est: false };
      var closest = null;
      if (stages && stages.length) {
        closest = stages.reduce(function(a, s) { return Math.abs(s.power - w) < Math.abs(a.power - w) ? s : a; }, stages[0]);
      }
      if (closest && Math.abs(closest.power - w) <= 8) return { hr: closest.stableHR, est: false };
      if (reg && w > maxTestedW) {
        var projected = reg.extrapolate(w);
        var lastHR = stages[stages.length - 1].stableHR;
        var capped = hrMax ? Math.min(projected, hrMax) : projected;
        return { hr: Math.max(capped, lastHR), est: true };
      }
      if (reg) return { hr: reg.extrapolate(w), est: true };
      return { hr: null, est: false };
    }

    var pct = function(w) { return w ? Math.round(w / cp * 100) : null; };
    var z1HiHR  = lt1 ? { hr: lt1.stableHR, est: false } : hrAtW(Math.round(cp * 0.72));
    var z2LoHR  = lt1 ? { hr: lt1.stableHR, est: false } : hrAtW(Math.round(cp * 0.73));
    var z2HiHR  = ogc ? { hr: ogc.stableHR, est: false } : hrAtW(Math.round(cp * 0.86));
    var z3LoHR  = ogc ? { hr: ogc.stableHR, est: false } : hrAtW(Math.round(cp * 0.87));
    var z3HiHR  = hrAtW(cp - 1);
    var zcpLoHR = hrAtW(cp);
    var zcpHiHR = hrAtW(Math.round(cp * 1.04));

    function hrStr2(lo, hi) {
      if (!lo.hr && !(hi && hi.hr)) return { str: '—', est: false };
      var loS = lo.hr || '?', hiS = hi && hi.hr ? hi.hr : null;
      var est = lo.est || !!(hi && hi.est);
      var str = hiS ? (loS + '–' + hiS + ' bpm') : (loS + '+ bpm');
      return { str: est ? str + ' *' : str, est: est };
    }

    var zones = [
      { key: 'zr',  label: 'ZR',  name: 'Recovery',
        wLo: 0, wHi: cpPct65 - 1, pctLo: 0, pctHi: pct(cpPct65 - 1),
        hr: hrStr2({ hr: hrRest, est: false }, { hr: lt1 ? lt1.stableHR - 10 : null, est: false }),
        desc: 'Active recovery. No aerobic adaptation stimulus.' },
      { key: 'z1',  label: 'Z1',  name: 'Aerobic Base',
        wLo: cpPct65, wHi: lt1 ? lt1.power - 1 : Math.round(cp * 0.72),
        pctLo: pct(cpPct65), pctHi: lt1 ? pct(lt1.power - 1) : 72,
        hr: hrStr2({ hr: lt1 ? lt1.stableHR - 12 : null, est: false }, z1HiHR),
        desc: 'Primary aerobic development. Fat-oxidation dominant.' },
      { key: 'z2',  label: 'Z2',  name: 'Threshold Band',
        wLo: lt1 ? lt1.power : Math.round(cp * 0.73), wHi: ogc ? ogc.power - 1 : Math.round(cp * 0.86),
        pctLo: lt1 ? pct(lt1.power) : 73, pctHi: ogc ? pct(ogc.power - 1) : 86,
        hr: hrStr2(z2LoHR, z2HiHR),
        desc: 'LT1 → OGC. Mixed substrate. Threshold training zone.' },
      { key: 'z3',  label: 'Z3',  name: 'Glycolytic',
        wLo: ogc ? ogc.power : Math.round(cp * 0.87), wHi: cp - 1,
        pctLo: ogc ? pct(ogc.power) : 87, pctHi: pct(cp - 1),
        hr: hrStr2(z3LoHR, z3HiHR),
        desc: 'OGC to CP. CHO dominant. High stimulus, high fatigue.' },
      { key: 'zcp', label: 'CP+', name: 'Critical Power',
        wLo: cp, wHi: null, pctLo: 100, pctHi: null,
        hr: hrStr2(zcpLoHR, zcpHiHR),
        desc: 'At or above Critical Power. Anaerobic contribution significant.' }
    ];

    var rows = $T('tha-zone-rows');
    if (!rows) return;
    rows.innerHTML = '';
    var anyEst = false;
    zones.forEach(function(z) {
      var wStr  = z.wHi ? z.wLo + '–' + z.wHi + 'W' : z.wLo + 'W+';
      var pctStr = z.pctHi ? (z.pctLo + '–' + z.pctHi + '% CP') : (z.pctLo + '%+ CP');
      var hrStr  = z.hr ? z.hr.str : '—';
      if (z.hr && z.hr.est) anyEst = true;
      var wkg = bw && z.wLo ? ((z.wLo / bw).toFixed(2) + '–' + (z.wHi ? (z.wHi / bw).toFixed(2) : (z.wLo / bw).toFixed(2)) + ' W/kg') : '';
      rows.innerHTML += '<div class="tha-zr tha-zr-' + z.key + '">' +
        '<div class="tha-zr-bar"></div>' +
        '<div class="tha-zr-name">' + z.label + ' · ' + z.name + '</div>' +
        '<div class="tha-zr-range">' + wStr + '</div>' +
        '<div class="tha-zr-pct">' + pctStr + '</div>' +
        '<div class="tha-zr-hr">' + hrStr + (wkg ? ' · ' + wkg : '') + '</div>' +
        '<div class="tha-zr-desc">' + z.desc + '</div>' +
        '</div>';
    });

    var fn2 = $T('tha-zone-footnote');
    if (fn2) fn2.style.display = anyEst ? 'block' : 'none';

    if (_analysis) _analysis._hrAtW = hrAtW;

    /* Build block prescription table */
    var bt_subLT1lo = Math.round(cp * 0.55);
    var bt_subLT1hi = lt1 ? lt1.power : Math.round(cp * 0.72);
    var bt_z1Lo = cpPct65;
    var bt_z1Hi = lt1 ? lt1.power : Math.round(cp * 0.72);
    var bt_z1Span = bt_z1Hi - bt_z1Lo;
    var bt_lowZ1hi  = Math.round(bt_z1Lo + bt_z1Span / 3);
    var bt_midZ1hi  = Math.round(bt_z1Lo + bt_z1Span * 2 / 3);
    var bt_z2Lo = lt1 ? lt1.power : Math.round(cp * 0.72);
    var bt_z2Hi = ogc ? ogc.power : Math.round(cp * 0.87);
    var bt_z2Span = bt_z2Hi - bt_z2Lo;
    var bt_lowZ2hi  = Math.round(bt_z2Lo + bt_z2Span / 3);
    var bt_midZ2hi  = Math.round(bt_z2Lo + bt_z2Span * 2 / 3);
    var bt_z3Lo = ogc ? ogc.power : Math.round(cp * 0.87);
    var bt_z3Span = cp - bt_z3Lo;
    var bt_lowZ3hi  = Math.round(bt_z3Lo + bt_z3Span / 3);
    var bt_midZ3hi  = Math.round(bt_z3Lo + bt_z3Span * 2 / 3);
    var bt_ssLo = Math.round(cp * ((ogc ? ogc.pctCP / 100 : 0.87) - 0.02));
    var bt_ssHi = Math.round(cp * ((ogc ? ogc.pctCP / 100 : 0.87) + 0.02));
    var bt_cpPlusLo = Math.round(cp * 1.04);
    var bt_cpPlusHi = Math.round(cp * 1.06);
    var bt_wpct = function(w) { return Math.round(w / cp * 100); };

    _blockHTML = buildBlockTable(cp, bt_subLT1lo, bt_subLT1hi, bt_z1Lo, bt_z1Hi, bt_lowZ1hi, bt_midZ1hi,
      bt_z2Lo, bt_z2Hi, bt_lowZ2hi, bt_midZ2hi, bt_z3Lo, bt_lowZ3hi, bt_midZ3hi,
      bt_ssLo, bt_ssHi, bt_cpPlusLo, bt_cpPlusHi, bt_wpct);
  }

  function buildBlockTable(cp, subLT1lo, subLT1hi, z1Lo, z1Hi, lowZ1hi, midZ1hi,
      z2Lo, z2Hi, lowZ2hi, midZ2hi, z3Lo, lowZ3hi, midZ3hi,
      ssLo, ssHi, cpPlusLo, cpPlusHi, wpct) {
    var rows = [
      ['Base / Durability', 'Aerobic dev.', '90–95% sub-LT1', '5–10% intensity',
       '<span class="tha-zp tha-zp-z1">High-Z1: ' + midZ1hi + '–' + (z1Hi - 1) + 'W / ' + wpct(midZ1hi) + '–' + wpct(z1Hi - 1) + '% CP</span> <span class="tha-zp tha-zp-z2">Low-Z2: ' + z2Lo + '–' + (lowZ2hi - 1) + 'W / ' + wpct(z2Lo) + '–' + wpct(lowZ2hi - 1) + '% CP</span>', 'LT1'],
      ['Build / TH', 'Threshold dev.', '75–80% sub-LT1', '20–25% intensity',
       '<span class="tha-zp tha-zp-ss">Sweet Spot: ' + ssLo + '–' + ssHi + 'W / ' + wpct(ssLo) + '–' + wpct(ssHi) + '% CP</span> <span class="tha-zp tha-zp-cp">CP+: ' + cpPlusLo + '–' + cpPlusHi + 'W / 104–106% CP</span>', 'OGC + CP'],
      ['Build / TH (TTE)', 'Time to exhaustion', '75–80% sub-LT1', '20–25% intensity',
       '<span class="tha-zp tha-zp-ss">Sweet Spot: ' + ssLo + '–' + ssHi + 'W / ' + wpct(ssLo) + '–' + wpct(ssHi) + '% CP</span><br><span style="font-size:12px;color:var(--qt2-muted);">Progressive duration + reduced recovery</span>', 'TTE at sub-CP'],
      ['Aerobic Expansion', 'OGC development', '75–80% sub-LT1', '20–25% intensity',
       '<span class="tha-zp tha-zp-z2">Full Z2: ' + z2Lo + '–' + (z2Hi - 1) + 'W / ' + wpct(z2Lo) + '–' + wpct(z2Hi - 1) + '% CP</span> <span class="tha-zp tha-zp-ss">Sweet Spot: ' + ssLo + '–' + ssHi + 'W / ' + wpct(ssLo) + '–' + wpct(ssHi) + '% CP</span>', 'OGC ↑'],
      ['VO2 Max', 'Engine size', '75–80% sub-LT1', '20–25% intensity',
       '<span class="tha-zp tha-zp-vo2">pVO2 Max intervals</span>', 'pVO2 Max'],
      ['Specificity', 'Race expression', '75–80% sub-LT1', '20–25% intensity',
       'IM (High-Z1/Low-Z2): ' + midZ1hi + '–' + (lowZ2hi - 1) + 'W / ' + wpct(midZ1hi) + '–' + wpct(lowZ2hi - 1) + '% CP<br>70.3 (Mid/High-Z2): ' + lowZ2hi + '–' + z2Hi + 'W / ' + wpct(lowZ2hi) + '–' + wpct(z2Hi) + '% CP<br>Olympic (Mid/High-Z3): ' + lowZ3hi + '–' + cp + 'W / ' + wpct(lowZ3hi) + '–100% CP', 'Race-specific'],
      ['Rebuild / Reset', 'Recovery block', '100% sub-LT1', 'No intensity',
       '<span style="font-size:12px;color:var(--qt2-muted);">Low-Z1 and below (' + subLT1lo + '–' + (lowZ1hi - 1) + 'W / 55–' + wpct(lowZ1hi - 1) + '% CP). Mid-Z1 (' + lowZ1hi + '–' + (midZ1hi - 1) + 'W / ' + wpct(lowZ1hi) + '–' + wpct(midZ1hi - 1) + '% CP) sparingly at block end only.</span>', 'Recovery']
    ];
    var out = '<div class="tha-block-table"><table><thead><tr><th>Block</th><th>TSS split</th><th>Sub-LT1 base</th><th>Intensity focus</th><th>Target</th></tr></thead><tbody>';
    var subBase = subLT1lo + '–' + (subLT1hi - 1) + 'W<br><span>' + '55–' + wpct(subLT1hi - 1) + '% CP</span>';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      out += '<tr><td><strong>' + r[0] + '</strong><br><span>' + r[1] + '</span></td>';
      out += '<td>' + r[2] + '<br><span>' + r[3] + '</span></td>';
      out += '<td><span class="tha-zp tha-zp-z1">' + subLT1lo + '–' + (subLT1hi - 1) + 'W</span><br><span>55–' + wpct(subLT1hi - 1) + '% CP</span></td>';
      out += '<td>' + r[4] + '</td>';
      out += '<td><strong>' + r[5] + '</strong></td></tr>';
    }
    out += '</tbody></table></div>';
    return out;
  }

  /* ── render confidence ──────────────────────────────────────────── */
  function thaGetConfGuidance(score) {
    if (score >= 75) return { label: 'Reliable',           text: 'Use as-is for zone prescription and training block planning.' };
    if (score >= 50) return { label: 'Usable — verify',    text: 'Proceed with caution. Validate with a follow-up test or lactate sample at this wattage before committing to a full training block.' };
    if (score >= 30) return { label: 'Preliminary only',   text: 'Treat as an estimate. The HR curve did not show a clean inflection. Retest with 8–10 min stage durations, and confirm the athlete started below LT1.' };
    return { label: 'Unreliable — retest', text: 'Do not use for zone prescription. Check protocol: verify stage duration was sufficient, starting wattage was sub-LT1, and HR reached steady state each stage.' };
  }

  function thaRenderConf(A) {
    var cr = $T('tha-conf-row'); if (!cr) return;
    var lt1Score = A.lt1Score, ogcScore = A.ogcScore, lt1c = A.lt1c, ogcc = A.ogcc;
    var mStr = 'D-max: Stage ' + (A.methods.dMax > 0 ? A.methods.dMax : '—') +
      ' · Conconi: Stage ' + (A.methods.conconi > 0 ? A.methods.conconi : '—') +
      ' · Inflection: Stage ' + (A.methods.inflection > 0 ? A.methods.inflection : '—');
    var lt1Color = lt1c === 'high' ? '#16a34a' : lt1c === 'moderate' ? '#d97706' : '#dc2626';
    var ogcColor = ogcc === 'high' ? '#16a34a' : ogcc === 'moderate' ? '#d97706' : '#dc2626';
    var lt1g = thaGetConfGuidance(lt1Score), ogcg = thaGetConfGuidance(ogcScore);
    var slopeRatio = A.stages[A.ogci] && A.stages[A.ogci].dpw != null && A.mean > 0 ? (A.stages[A.ogci].dpw / A.mean).toFixed(2) : '—';
    var lt1Lvl = lt1Score >= 75 ? 'high' : lt1Score >= 50 ? 'moderate' : lt1Score >= 30 ? 'low' : 'vlow';
    var ogcLvl = ogcScore >= 75 ? 'high' : ogcScore >= 50 ? 'moderate' : ogcScore >= 30 ? 'low' : 'vlow';
    cr.innerHTML =
      '<div class="tha-conf-card">' +
        '<div class="tha-conf-label">LT1 detection confidence</div>' +
        '<div class="tha-conf-bar-track"><div class="tha-conf-bar-fill" style="width:' + lt1Score + '%;background:' + lt1Color + '"></div></div>' +
        '<div class="tha-conf-detail">' + lt1Score + '% · ' + lt1c + ' · Stage ' + (A.lt1i + 1) + ' · ' + mStr + '</div>' +
        '<div class="tha-conf-guidance tha-conf-' + lt1Lvl + '"><strong>' + lt1g.label + ':</strong> ' + lt1g.text + '</div>' +
      '</div>' +
      '<div class="tha-conf-card">' +
        '<div class="tha-conf-label">OGC detection confidence</div>' +
        '<div class="tha-conf-bar-track"><div class="tha-conf-bar-fill" style="width:' + ogcScore + '%;background:' + ogcColor + '"></div></div>' +
        '<div class="tha-conf-detail">' + ogcScore + '% · ' + ogcc + ' · Stage ' + (A.ogci + 1) + ' · slope ' + slopeRatio + '× mean</div>' +
        '<div class="tha-conf-guidance tha-conf-' + ogcLvl + '"><strong>' + ogcg.label + ':</strong> ' + ogcg.text + '</div>' +
      '</div>';
  }

  /* ── render charts ──────────────────────────────────────────────── */
  var _charts = {};
  function thaDestroyCharts() {
    Object.keys(_charts).forEach(function(k) { try { _charts[k].destroy(); } catch (e) {} });
    _charts = {};
  }

  function thaRenderCharts(A) {
    thaDestroyCharts();
    if (typeof Chart === 'undefined') return;
    var stages = A.stages, mean = A.mean;
    var zoneColor = function(z) {
      return z === 'lt1'    ? '#1D9E75' :
             z === 'ogc'    ? '#C17D22' :
             z === 'buffer' ? 'rgba(29,158,117,.5)' :
             z === 'base'   ? '#2a477f' : '#6a6865';
    };
    var ptC = stages.map(function(s) { return zoneColor(s.zone); });

    var grid = 'rgba(0,0,0,0.04)', tick = '#94a3b8';
    var tf = { family: 'system-ui', size: 10 };
    var tt = {
      backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1,
      titleColor: '#1e293b', bodyColor: '#64748b',
      titleFont: { family: 'system-ui', size: 11 }, bodyFont: { family: 'system-ui', size: 10 }, padding: 8
    };
    var base = {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tt },
      scales: {
        x: { grid: { color: grid }, ticks: { color: tick, font: tf } },
        y: { grid: { color: grid }, ticks: { color: tick, font: tf } }
      }
    };

    var hrCtx = $T('tha-c-hr');
    if (hrCtx) {
      _charts.hr = new Chart(hrCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: stages.map(function(s) { return s.power + 'W'; }),
          datasets: [{
            data: stages.map(function(s) { return s.stableHR; }),
            borderColor: 'rgba(37,99,235,0.55)', backgroundColor: 'rgba(37,99,235,0.06)',
            fill: true, borderWidth: 2, tension: 0.35,
            pointBackgroundColor: ptC, pointBorderColor: 'rgba(255,255,255,0.8)',
            pointRadius: 7, pointHoverRadius: 9, pointBorderWidth: 1.5
          }]
        },
        options: Object.assign({}, base, {
          scales: Object.assign({}, base.scales, {
            y: Object.assign({}, base.scales.y, { ticks: Object.assign({}, base.scales.y.ticks, { callback: function(v) { return v + ' bpm'; } }) })
          })
        })
      });
    }

    var dCtx = $T('tha-c-delta');
    if (dCtx) {
      var dpws = stages.map(function(s) { return s.dpw != null ? parseFloat(s.dpw.toFixed(4)) : 0; });
      _charts.delta = new Chart(dCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: stages.map(function(s) { return s.power + 'W'; }),
          datasets: [
            { data: dpws, backgroundColor: ptC, borderWidth: 0, borderRadius: 2 },
            { data: stages.map(function() { return parseFloat(mean.toFixed(4)); }), type: 'line', borderColor: 'rgba(120,120,120,.4)', borderDash: [4, 3], borderWidth: 1.5, pointRadius: 0, backgroundColor: 'transparent' }
          ]
        },
        options: Object.assign({}, base, {
          scales: Object.assign({}, base.scales, {
            y: Object.assign({}, base.scales.y, { min: 0, ticks: Object.assign({}, base.scales.y.ticks, { callback: function(v) { return v.toFixed(3); } }) })
          })
        })
      });
    }
  }

  /* ── render table ───────────────────────────────────────────────── */
  function thaRenderTable(A) {
    var stages = A.stages, mean = A.mean;
    var hrrKnown = A.hrMax && A.hrRest && A.hrMax > A.hrRest;
    var thHrr = $T('tha-th-hrr');
    if (thHrr) {
      thHrr.textContent = !hrrKnown ? 'HR' : A.hrmaxEstimated ? '% HRR (est.)' : '% HRR';
    }
    var bw = fV('tha-bw') || null;
    var tags = {
      lt1:    '<span class="tha-badge tha-b-lt1">LT1</span>',
      ogc:    '<span class="tha-badge tha-b-ogc">OGC</span>',
      near:   '<span class="tha-badge tha-b-near">Z3</span>',
      buffer: '<span class="tha-badge tha-b-buf">Z2</span>',
      base:   '<span class="tha-badge tha-b-base">Z1</span>'
    };
    var tbody = $T('tha-tbl-body'); if (!tbody) return;
    tbody.innerHTML = '';
    stages.forEach(function(s, i) {
      var rc = s.zone === 'lt1' ? 'tha-tbl-lt1' : s.zone === 'ogc' ? 'tha-tbl-ogc' : '';
      var dhr = s.dhr != null ? (s.dhr >= 0 ? '+' : '') + s.dhr : '—';
      var dpwStr = s.dpw != null ? s.dpw.toFixed(4) : '—';
      var vm = s.dpw == null ? '<span style="color:var(--qt2-muted);">—</span>' :
               s.dpw < mean * 0.85 ? '<span style="color:#2563eb;">↓ flat</span>' :
               s.dpw > mean * 1.15 ? '<span style="color:#dc2626;">↑ steep</span>' :
               '<span style="color:var(--qt2-muted);">— avg</span>';
      var dc = Math.abs(s.drift) > 8 ? 'color:#dc2626;font-weight:700;' : '';
      var wkg = bw ? (s.power / bw).toFixed(2) : '—';
      var hrrCell = hrrKnown ? (s.pctHRR + '%' + (A.hrmaxEstimated ? '*' : '')) : '—';
      tbody.innerHTML += '<tr class="' + rc + '"><td>' + (i + 1) + '</td><td>' + s.power + 'W</td><td>' + s.pctCP + '%</td><td>' + wkg + '</td><td>' + s.stableHR + ' bpm</td><td>' + hrrCell + '</td><td>' + dhr + '</td><td>' + dpwStr + '</td><td>' + vm + '</td><td style="' + dc + '">' + (s.drift > 0 ? '+' : '') + s.drift + (Math.abs(s.drift) > 8 ? ' ⚠' : '') + '</td><td>' + (tags[s.zone] || '') + '</td></tr>';
    });
  }

  /* ── AI analysis ────────────────────────────────────────────────── */
  async function thaGetAI(A) {
    var aiLoad = $T('tha-ai-loading'), aiBody = $T('tha-ai-body'), aiErr = $T('tha-ai-error');
    var pdfBtn = $T('tha-pdf-btn');
    if (aiLoad) aiLoad.style.display = 'flex';
    if (aiBody) aiBody.style.display = 'none';
    if (aiErr)  aiErr.style.display  = 'none';
    if (pdfBtn) { pdfBtn.style.opacity = '0.4'; pdfBtn.title = 'Wait for AI analysis'; }
    _aiDone = false; _aiText = '';

    var lt1 = A.lt1, ogc = A.ogc, stages = A.stages, mean = A.mean, adi = A.adi;
    var lt1c = A.lt1c, ogcc = A.ogcc, cp = A.cp, hrRest = A.hrRest, hrMax = A.hrMax;
    var hrmaxEstimated = A.hrmaxEstimated, flags = A.flags, methods = A.methods;
    var hrrKnownAI = hrMax && hrRest && hrMax > hrRest;
    var hrmaxNote = !hrMax ? 'HRmax unknown — omit all HRR% references' :
      hrmaxEstimated ? 'HRmax is ESTIMATED at ' + hrMax + ' bpm using Tanaka formula (208 − 0.7×age) — label all HRR% as approximate' :
      'HRmax is MEASURED at ' + hrMax + ' bpm';
    var adiPct = lt1 && ogc ? Math.round(adi / cp * 100) : 0;
    var driftIssues = stages.filter(function(s) { return Math.abs(s.drift) > 8; });
    var athleteName = sV('tha-athlete-name') || 'the athlete';
    var p12v = $T('tha-p12') ? parseInt($T('tha-p12').value) || null : null;
    var bw = fV('tha-bw') || null;
    var testDate = sV('tha-test-date');
    var cpPct65 = Math.round(cp * 0.65);
    var subLT1lo = Math.round(cp * 0.55);
    var subLT1hi = lt1 ? lt1.power : Math.round(cp * 0.72);
    var z1Lo = cpPct65, z1Hi = lt1 ? lt1.power : Math.round(cp * 0.72);
    var z1Span = z1Hi - z1Lo;
    var lowZ1hi = Math.round(z1Lo + z1Span / 3), midZ1hi = Math.round(z1Lo + z1Span * 2 / 3);
    var z2Lo = lt1 ? lt1.power : Math.round(cp * 0.72), z2Hi = ogc ? ogc.power : Math.round(cp * 0.87);
    var z2Span = z2Hi - z2Lo;
    var lowZ2hi = Math.round(z2Lo + z2Span / 3), midZ2hi = Math.round(z2Lo + z2Span * 2 / 3);
    var z3Lo = ogc ? ogc.power : Math.round(cp * 0.87), z3Span = cp - z3Lo;
    var lowZ3hi = Math.round(z3Lo + z3Span / 3), midZ3hi = Math.round(z3Lo + z3Span * 2 / 3);
    var ssLo = Math.round(cp * ((ogc ? ogc.pctCP / 100 : 0.85) - 0.02));
    var ssHi = Math.round(cp * ((ogc ? ogc.pctCP / 100 : 0.85) + 0.02));
    var cpPlusLo = Math.round(cp * 1.04), cpPlusHi = Math.round(cp * 1.06);
    var wpct = function(w) { return Math.round(w / cp * 100); };
    var zoneRanges = lt1 && ogc ?
      'ZR: <' + cpPct65 + 'W | Z1: ' + cpPct65 + '–' + (lt1.power - 1) + 'W | Z2: ' + lt1.power + '–' + (ogc.power - 1) + 'W | Z3: ' + ogc.power + '–' + (cp - 1) + 'W | ≥CP: ' + cp + 'W+' : 'Zones: not calculated';
    var stageLines = stages.map(function(s, i) {
      var hrrStr = hrrKnownAI ? ' (' + s.pctHRR + '% HRR' + (hrmaxEstimated ? ' est.' : '') + ')' : '';
      return 'Stage ' + (i + 1) + ': ' + s.power + 'W (' + s.pctCP + '% CP)' + (bw ? ' / ' + (s.power / bw).toFixed(2) + 'W/kg' : '') +
        ', HR ' + s.stableHR + ' bpm' + hrrStr + ', drift ' + (s.drift > 0 ? '+' : '') + s.drift + ' bpm, zone: ' + s.zone +
        (s.dpw != null ? ', Δ/W: ' + s.dpw.toFixed(4) + ' (' + (s.dpw < mean * 0.85 ? 'FLAT' : s.dpw > mean * 1.15 ? 'STEEP' : 'avg') + ')' : '') +
        (s._dmaxDist ? ' D-max:' + s._dmaxDist : '');
    }).join('\n');
    var flagLines = flags.length ? flags.map(function(f) { return f.msg; }).join('\n') : 'None';
    var methodLines = 'D-max → Stage ' + (methods.dMax > 0 ? methods.dMax : '—') +
      ' | Conconi → Stage ' + (methods.conconi > 0 ? methods.conconi : '—') +
      ' | Slope inflection → Stage ' + (methods.inflection > 0 ? methods.inflection : '—');

    var prompt = 'You are an expert endurance performance coach. Analyze this threshold test and produce a structured coaching report in exactly 4 paragraphs. No bullet points. No headers. Reference the athlete by first name only throughout. Every sentence must contain specific numbers from this athlete\'s data.\n\n' +
      'TERMINOLOGY — use these exactly:\n' +
      'LT1 = Lactate Threshold 1 (aerobic threshold): intensity where lactate first rises above baseline.\n' +
      'OGC = Oxidative-Glycolytic Crossover: where carbohydrate becomes primary fuel. Always write "OGC" — never "LT2", "FTP", or "threshold".\n' +
      'Critical Power (CP): highest power sustainable without progressive fatigue.\n\n' +
      'ZONE FRAMEWORK:\n' +
      'ZR (Recovery): below ' + cpPct65 + 'W (below 65% CP)\n' +
      'Z1 (Aerobic Base): ' + cpPct65 + '–' + (z1Hi - 1) + 'W (65% CP → LT1)\n' +
      '  Low-Z1: ' + z1Lo + '–' + (lowZ1hi - 1) + 'W (' + wpct(z1Lo) + '–' + wpct(lowZ1hi - 1) + '% CP)\n' +
      '  Mid-Z1: ' + lowZ1hi + '–' + (midZ1hi - 1) + 'W (' + wpct(lowZ1hi) + '–' + wpct(midZ1hi - 1) + '% CP)\n' +
      '  High-Z1: ' + midZ1hi + '–' + (z1Hi - 1) + 'W (' + wpct(midZ1hi) + '–' + wpct(z1Hi - 1) + '% CP)\n' +
      'Z2 (Tempo): ' + z2Lo + '–' + (z2Hi - 1) + 'W (LT1 → OGC)\n' +
      'Z3 (Threshold): ' + z3Lo + '–' + (cp - 1) + 'W (OGC → CP)\n' +
      'Sweet Spot: ' + ssLo + '–' + ssHi + 'W (' + wpct(ssLo) + '–' + wpct(ssHi) + '% CP)\n' +
      'CP+ Intervals: ' + cpPlusLo + '–' + cpPlusHi + 'W (104–106% CP)\n\n' +
      'ATHLETE DATA:\n' +
      'ATHLETE: ' + athleteName + '\nDATE: ' + (testDate || 'not specified') + '\n' +
      'CP: ' + cp + 'W | Rest HR: ' + hrRest + ' | ' + (hrrKnownAI ? 'Max HR: ' + hrMax + (hrmaxEstimated ? ' (est.)' : ' (measured)') + ' | HRR: ' + (hrMax - hrRest) + ' bpm' : 'Max HR: not provided') + (bw ? ' | BW: ' + bw + 'kg | CP/kg: ' + (cp / bw).toFixed(2) + 'W/kg' : '') + '\n' +
      (p12v ? '12-min power: ' + p12v + 'W (12min/CP: ' + (p12v / cp).toFixed(3) + ')\n' : '') +
      'LT1: ' + (lt1 ? lt1.power + 'W (' + lt1.pctCP + '% CP), HR ' + lt1.stableHR + ' bpm, confidence: ' + lt1c : 'not identified') + '\n' +
      'OGC: ' + (ogc ? ogc.power + 'W (' + ogc.pctCP + '% CP), HR ' + ogc.stableHR + ' bpm, confidence: ' + ogcc : 'not identified') + '\n' +
      'Aerobic window (LT1→OGC): ' + (lt1 && ogc ? adi + 'W (' + adiPct + '% CP)' : 'unknown') + '\n' +
      'Mean Δ/W: ' + mean.toFixed(4) + ' bpm/W\n' +
      'Detection methods: ' + methodLines + '\n\n' +
      'STAGES:\n' + stageLines + '\n\n' +
      'FLAGS: ' + flagLines + '\n' +
      'HRMAX NOTE: ' + hrmaxNote + '\n\n' +
      'PARAGRAPH 1 — LT1 SIGNAL: Describe what LT1 detection showed. Stage, power, HR, slope pattern, physiological meaning.\n' +
      'PARAGRAPH 2 — OGC SIGNAL: Describe OGC detection. Stage, power, HR, slope acceleration, aerobic window width and implications.\n' +
      'PARAGRAPH 3 — BLOCK PRESCRIPTION INTRO (one sentence only): Connect aerobic window width (' + adi + 'W / ' + adiPct + '% CP) to training context and note the block prescription table below outlines specific watt targets. One sentence only.\n' +
      'PARAGRAPH 4 — DATA QUALITY: Assess test quality, flags, confidence, and give one specific recommendation for improving the next protocol.\n' +
      'CRITICAL: No markdown formatting. When referencing any intensity, always state both watt range AND % CP.';

    try {
      var PROXY = 'https://6h6t7ripacjmoxgy6ncp4uvmpu0cjkqm.lambda-url.us-east-1.on.aws/';
      var timeout = new Promise(function(_, rej) { setTimeout(function() { rej(new Error('Timed out after 90s')); }, 90000); });
      var fetchP = fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2500, messages: [{ role: 'user', content: prompt }] })
      });
      var resp = await Promise.race([fetchP, timeout]);
      var data = await resp.json();
      if (!resp.ok) throw new Error((data.error && data.error.message) || 'API error ' + resp.status);
      var txt = (data.content && data.content.find(function(b) { return b.type === 'text'; })) || { text: '' };
      var resultText = txt.text || '';
      _aiText = resultText; _aiDone = true;
      if (aiLoad) aiLoad.style.display = 'none';
      if (aiBody) aiBody.style.display = 'block';
      var cleanText = resultText
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/•\s*/g, '\n• ');
      var aiHtml = cleanText.split('\n\n').filter(function(p) { return p.trim(); }).map(function(block, idx) {
        var t = block.trim();
        var tableInject = (idx === 2 && _blockHTML) ? '<div style="margin-top:14px;">' + _blockHTML + '</div>' : '';
        if (t.startsWith('<div') || t.startsWith('<table')) return t;
        var lines = t.split('\n').filter(function(l) { return l.trim(); });
        var hasBullets = lines.some(function(l) { return l.trim().startsWith('•') || (l.trim().startsWith('-') && l.trim().length > 2); });
        if (hasBullets) {
          var out = '', inList = false;
          lines.forEach(function(line) {
            var isBullet = line.trim().startsWith('•') || (line.trim().startsWith('-') && line.trim().length > 2);
            if (isBullet) { if (!inList) { out += '<ul style="margin:8px 0 8px 18px;line-height:1.7;">'; inList = true; } out += '<li>' + line.trim().replace(/^[•\-]\s*/, '') + '</li>'; }
            else { if (inList) { out += '</ul>'; inList = false; } if (line.trim()) out += '<p style="margin:0 0 12px;">' + line.trim() + '</p>'; }
          });
          if (inList) out += '</ul>';
          return out + tableInject;
        }
        return '<p style="margin:0 0 12px;">' + t + '</p>' + tableInject;
      }).join('');
      if (aiBody) aiBody.innerHTML = '<div style="line-height:1.85;">' + aiHtml + '</div>';
    } catch (err) {
      if (aiLoad) aiLoad.style.display = 'none';
      if (aiErr)  { aiErr.style.display = 'block'; aiErr.textContent = err.message.includes('Timed out') ? 'Analysis timed out. Try again.' : 'Analysis failed: ' + err.message; }
    } finally {
      if (pdfBtn) { pdfBtn.style.opacity = '1'; pdfBtn.title = ''; }
    }
  }

  /* ── file handler ───────────────────────────────────────────────── */
  function thaHandleFile(file) {
    if (!file) return;
    if (!file.name.match(/\.fit$/i)) {
      thaShowDiag('err', 'Unsupported file', '<p>Expected a <strong>.fit</strong> file. Got: <strong>' + (file.name.split('.').pop() || '?') + '</strong></p>');
      return;
    }
    var diag = $T('tha-diag'), res = $T('tha-results');
    if (diag) diag.style.display = 'none';
    if (res)  res.style.display  = 'none';
    thaSetStatus('Reading FIT file…');

    var cp       = iV('tha-cp') || 263;
    var hrRest   = iV('tha-hrrest') || 48;
    var hrmaxRes = thaGetHrmax();
    var hrMax    = hrmaxRes.val || 178;
    var hrmaxEst = hrmaxRes.estimated;

    var reader = new FileReader();
    reader.onload = async function(e) {
      try {
        thaSetStatus('Parsing FIT binary…');
        var records = thaParseF(e.target.result);
        if (!records.length) { thaHideStatus(); thaShowDiag('err', 'No data', '<p>No HR/power records found in file.</p>'); return; }
        thaSetStatus('Classifying workout type…');
        var wk = thaClassify(records, cp);
        if (wk.type === 'no_data') { thaHideStatus(); thaShowDiag('err', 'No usable data', '<p>No power or HR data found.</p>'); return; }
        if (wk.type !== 'protocol' && wk.type !== 'step') {
          thaHideStatus();
          thaShowDiag('warn', 'Wrong workout type', '<p>' + wk.desc + '</p>' + (wk.rec ? '<p>' + wk.rec + '</p>' : '') + thaStatsHTML(wk));
          return;
        }
        thaSetStatus('Detecting stages…');
        var stages = thaDetectStages(records, cp);
        if (stages.length < 3) {
          thaHideStatus();
          thaShowDiag('warn', 'Too few stages', '<p>Only <strong>' + stages.length + ' stage(s)</strong> isolated.</p>' + thaStatsHTML(wk));
          return;
        }
        thaSetStatus('Analyzing thresholds…');
        var A = thaAnalyze(stages, cp, hrRest, hrMax, hrmaxEst);
        if (!A) { thaHideStatus(); thaShowDiag('err', 'Analysis failed', '<p>Insufficient stage data for threshold detection.</p>'); return; }
        _analysis = A;
        thaHideStatus();
        var diagTitle = (wk.type === 'protocol' ? 'Recovery-valley protocol' : 'Step test') + ' confirmed — ' + stages.length + ' stages';
        thaShowDiag('ok', diagTitle, '<p>' + wk.desc + '</p>' + thaStatsHTML(wk));
        if (res) res.style.display = 'block';
        thaRenderSummary(A);
        thaRenderFlags(A);
        thaRenderZones(A);
        thaRenderConf(A);
        thaRenderCharts(A);
        thaRenderTable(A);
        await thaGetAI(A);
      } catch (err) {
        thaHideStatus();
        thaShowDiag('err', 'Parse error', '<p><strong>' + err.message + '</strong></p>');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ── PDF export ─────────────────────────────────────────────────── */
  window.thaExportPDF = function () {
    var btn = $T('tha-pdf-btn');
    if (btn) { btn.textContent = 'Generating…'; btn.disabled = true; }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      if (btn) { btn.textContent = '↡ Export PDF'; btn.disabled = false; }
      alert('PDF library not loaded. Please check internet connection and reload.');
      return;
    }
    try {
      var jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      var W = 210, M = 16, cW = W - M * 2; var y = M;
      var light = _pdfLight;

      var BG     = light ? [255,255,255] : [248,250,252];
      var BG2    = light ? [248,248,246] : [241,245,249];
      var BG3    = light ? [240,242,244] : [226,232,240];
      var BG_HDR = [26,58,92];   /* qt2-primary — deep navy */
      var BG_ACC = [37,99,235];  /* qt2-accent  — blue */
      var TEXT   = [30,41,59];
      var MUTED  = [100,116,139];
      var LT1    = [22,163,74];
      var OGC    = [217,119,6];
      var ACCENT = [37,99,235];
      var DANGER = [220,38,38];
      var WARN   = [202,138,4];
      var THEAD  = [26,58,92];
      var THEAD_T = [255,255,255];

      doc.setFillColor.apply(doc, BG); doc.rect(0, 0, 210, 297, 'F');

      /* Header band */
      var hdrH = 32;
      doc.setFillColor.apply(doc, BG_HDR); doc.rect(0, 0, 210, hdrH, 'F');
      doc.setFillColor.apply(doc, BG_ACC); doc.rect(0, hdrH, 210, 1.5, 'F');
      var titleText = 'EchoDevo · LT1 / Oxidative-Glycolytic Threshold Analysis Report';
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
      doc.text(titleText, M, hdrH / 2 + 3);
      y = hdrH + 5;

      /* Athlete bar */
      var name = sV('tha-athlete-name') || '--';
      var dateVal = sV('tha-test-date');
      var dateStr = dateVal ? new Date(dateVal + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '--';
      var cp2 = iV('tha-cp') || 263;
      var p12v2 = $T('tha-p12') ? parseInt($T('tha-p12').value) || null : null;
      var bw2 = fV('tha-bw') || null;

      doc.setFillColor.apply(doc, BG_ACC); doc.rect(M, y, cW, 13, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
      doc.text(name, M + 3, y + 5.5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 220, 245);
      doc.text('Test: ' + dateStr, M + 3, y + 10);
      var hrmaxPDF = _analysis ? _analysis.hrMax : iV('tha-hrmax') || null;
      var hrmaxEstPDF = _analysis ? _analysis.hrmaxEstimated : _hrmaxIsEst;
      var hrMaxStr = hrmaxPDF ? (hrmaxEstPDF ? hrmaxPDF + ' (est.)' : String(hrmaxPDF)) : '--';
      doc.setTextColor(255, 255, 255);
      doc.text('CP: ' + cp2 + 'W' + (p12v2 ? ' | 12min/CP: ' + (p12v2 / cp2).toFixed(3) : '') + (bw2 ? ' | ' + bw2 + 'kg' : ''), W - M - 3, y + 5.5, { align: 'right' });
      doc.setTextColor(200, 220, 245);
      doc.text('Resting HR: ' + (iV('tha-hrrest') || '--') + ' bpm  |  Max HR: ' + hrMaxStr + ' bpm', W - M - 3, y + 10, { align: 'right' });
      y += 17;

      if (_analysis) {
        var A2 = _analysis;
        /* Summary cards */
        doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, MUTED);
        doc.text('SUMMARY', M, y + 3); y += 5;
        var cards = [
          { l: 'LT1 POWER',     v: A2.lt1 ? A2.lt1.power + 'W' : '--',      s: A2.lt1 ? A2.lt1.pctCP + '% CP' : '',  c: LT1    },
          { l: 'LT1 HR',        v: A2.lt1 ? A2.lt1.stableHR + ' bpm' : '--', s: A2.lt1 ? A2.lt1.pctHRR + '% HRR' : '', c: LT1   },
          { l: 'OGC POWER',     v: A2.ogc ? A2.ogc.power + 'W' : '--',      s: A2.ogc ? A2.ogc.pctCP + '% CP' : '',  c: OGC    },
          { l: 'OGC HR',        v: A2.ogc ? A2.ogc.stableHR + ' bpm' : '--', s: A2.ogc ? A2.ogc.pctHRR + '% HRR' : '', c: OGC  },
          { l: 'AEROBIC WINDOW',v: A2.lt1 && A2.ogc ? A2.adi + 'W' : '--',  s: A2.lt1 && A2.ogc ? Math.round(A2.adi / cp2 * 100) + '% CP' : '', c: ACCENT }
        ];
        var cw5 = (cW - 4 * 3) / 5;
        cards.forEach(function(c, ci) {
          var cx = M + ci * (cw5 + 3);
          doc.setFillColor.apply(doc, BG2); doc.rect(cx, y, cw5, 17, 'F');
          doc.setFontSize(5.5); doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, MUTED); doc.text(c.l, cx + 2, y + 4.5);
          doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, c.c); doc.text(c.v, cx + 2, y + 11.5);
          doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, MUTED); doc.text(c.s, cx + 2, y + 15.5);
        });
        y += 21;

        /* Zone table in PDF */
        doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, MUTED);
        doc.text('TRAINING ZONE PRESCRIPTION', M, y + 3); y += 5;
        var cpPct65p = Math.round(cp2 * 0.65);
        var lt1p = A2.lt1, ogcp = A2.ogc;
        var zData = [
          { l: 'ZR', n: 'Recovery',   w: '<' + cpPct65p + 'W', pct: '<65% CP', h: '--', c: [80,100,130] },
          { l: 'Z1', n: 'Aerobic Base', w: cpPct65p + '–' + (lt1p ? lt1p.power - 1 : Math.round(cp2 * 0.72)) + 'W', pct: cpPct65p + '–' + (lt1p ? lt1p.pctCP - 1 : 72) + '% CP', h: lt1p ? lt1p.stableHR - 12 + '–' + lt1p.stableHR + ' bpm' : '--', c: ACCENT },
          { l: 'Z2', n: 'Threshold Band', w: (lt1p ? lt1p.power : Math.round(cp2 * 0.73)) + '–' + (ogcp ? ogcp.power - 1 : Math.round(cp2 * 0.86)) + 'W', pct: (lt1p ? lt1p.pctCP : 73) + '–' + (ogcp ? ogcp.pctCP - 1 : 86) + '% CP', h: lt1p && ogcp ? lt1p.stableHR + '–' + ogcp.stableHR + ' bpm' : '--', c: LT1 },
          { l: 'Z3', n: 'Glycolytic',  w: (ogcp ? ogcp.power : Math.round(cp2 * 0.87)) + '–' + (cp2 - 1) + 'W', pct: (ogcp ? ogcp.pctCP : 87) + '–' + Math.round((cp2 - 1) / cp2 * 100) + '% CP', h: ogcp ? ogcp.stableHR + '+ bpm' : '--', c: OGC },
          { l: 'CP+', n: 'Crit. Power', w: cp2 + 'W+', pct: '100%+ CP', h: '--', c: DANGER }
        ];
        var zw = (cW - 4 * 3) / 5;
        zData.forEach(function(z, zi) {
          var zx = M + zi * (zw + 3), zh = 24;
          doc.setFillColor.apply(doc, BG2); doc.rect(zx, y, zw, zh, 'F');
          doc.setFillColor.apply(doc, z.c); doc.rect(zx, y, zw, 2.5, 'F');
          doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, z.c);
          doc.text(z.l + ' ' + z.n, zx + 2, y + 7);
          doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, TEXT);
          doc.text(z.w, zx + 2, y + 13);
          doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, ACCENT);
          doc.text(z.pct, zx + 2, y + 17);
          doc.setFontSize(6); doc.setTextColor.apply(doc, MUTED);
          doc.text(z.h, zx + 2, y + 21);
        });
        y += 28;

        /* Charts */
        doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ACCENT);
        doc.text('HR RESPONSE & SLOPE ANALYSIS', M, y + 3); y += 5;
        var chartH = 44;
        var hrC = $T('tha-c-hr'), dC2 = $T('tha-c-delta');
        if (hrC) { try { doc.setFillColor.apply(doc, BG2); doc.rect(M, y, cW * 0.58, chartH, 'F'); doc.addImage(hrC.toDataURL('image/png', 1.0), 'PNG', M + 1, y + 1, cW * 0.58 - 2, chartH - 2); } catch (e) {} }
        if (dC2) { try { doc.setFillColor.apply(doc, BG2); doc.rect(M + cW * 0.58 + 2, y, cW * 0.42 - 2, chartH, 'F'); doc.addImage(dC2.toDataURL('image/png', 1.0), 'PNG', M + cW * 0.58 + 3, y + 1, cW * 0.42 - 4, chartH - 2); } catch (e) {} }
        y += chartH + 5;

        /* Stage table */
        doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ACCENT);
        doc.text('STAGE BREAKDOWN', M, y + 3); y += 5;
        var cols = [{ h: '#', w: 6 }, { h: 'Power', w: 14 }, { h: '%CP', w: 11 }, { h: 'Stable HR', w: 18 }, { h: '%HRR', w: 12 }, { h: 'HR Δ', w: 12 }, { h: 'Δ/W', w: 15 }, { h: 'vs mean', w: 15 }, { h: 'Drift', w: 12 }, { h: 'Zone', w: 22 }];
        var totW = cols.reduce(function(a, c) { return a + c.w; }, 0), sc = cW / totW;
        var scols = cols.map(function(c) { return { h: c.h, w: c.w * sc }; });
        doc.setFillColor.apply(doc, THEAD); doc.rect(M, y, cW, 5.5, 'F');
        var cx2 = M;
        scols.forEach(function(c) { doc.setFontSize(5); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, THEAD_T); doc.text(c.h, cx2 + 1.5, y + 4); cx2 += c.w; });
        y += 5.5;
        A2.stages.forEach(function(s, si) {
          var isL = s.zone === 'lt1', isO = s.zone === 'ogc';
          var rowBg = isL ? [220, 252, 231] : isO ? [254, 243, 199] : BG2;
          doc.setFillColor.apply(doc, rowBg); doc.rect(M, y, cW, 5.5, 'F');
          var dhr2 = s.dhr != null ? (s.dhr >= 0 ? '+' : '') + s.dhr : '--';
          var vm2 = s.dpw == null ? '--' : s.dpw < A2.mean * 0.85 ? 'flat' : s.dpw > A2.mean * 1.15 ? 'steep' : 'avg';
          var vals = [String(si + 1), s.power + 'W', s.pctCP + '%', s.stableHR + ' bpm', s.pctHRR + '%', dhr2, s.dpw != null ? s.dpw.toFixed(3) : '--', vm2, (s.drift > 0 ? '+' : '') + s.drift + (Math.abs(s.drift) > 8 ? ' !' : ''), s.zone.toUpperCase()];
          cx2 = M;
          vals.forEach(function(v, vi) {
            var col2 = isL ? LT1 : isO ? OGC : TEXT;
            doc.setFontSize(5.5); doc.setFont('helvetica', isL || isO ? 'bold' : 'normal'); doc.setTextColor.apply(doc, col2);
            doc.text(v, cx2 + 1.5, y + 4); cx2 += scols[vi].w;
          });
          y += 5.5;
        });
        y += 5;

        /* Confidence */
        if (y > 230) { doc.addPage(); doc.setFillColor.apply(doc, BG); doc.rect(0, 0, 210, 297, 'F'); y = M; }
        doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ACCENT);
        doc.text('DETECTION CONFIDENCE', M, y + 3); y += 6;
        var cHalf = (cW - 4) / 2;
        var confItems = [
          { label: 'LT1 Detection Confidence', score: A2.lt1Score, level: A2.lt1c, stage: A2.lt1i + 1, col: A2.lt1Score >= 75 ? LT1 : A2.lt1Score >= 50 ? WARN : DANGER },
          { label: 'OGC Detection Confidence', score: A2.ogcScore, level: A2.ogcc, stage: A2.ogci + 1, col: A2.ogcScore >= 75 ? LT1 : A2.ogcScore >= 50 ? WARN : DANGER }
        ];
        confItems.forEach(function(ci, idx) {
          var cxc = M + idx * (cHalf + 4), cardH = 28;
          doc.setFillColor.apply(doc, BG2); doc.rect(cxc, y, cHalf, cardH, 'F');
          doc.setFillColor.apply(doc, ci.col); doc.rect(cxc, y, 2.5, cardH, 'F');
          doc.setFontSize(5.5); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ci.col);
          doc.text(ci.label, cxc + 5, y + 5);
          doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ci.col);
          doc.text(ci.score + '%', cxc + 5, y + 12.5);
          var scoreW = doc.getTextWidth(ci.score + '%');
          doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, MUTED);
          doc.text(' | ' + ci.level + ' | Stage ' + ci.stage, cxc + 5 + scoreW + 1, y + 12);
          doc.setFillColor.apply(doc, BG3); doc.rect(cxc + 5, y + 14, cHalf - 10, 3, 'F');
          doc.setFillColor.apply(doc, ci.col); doc.rect(cxc + 5, y + 14, (cHalf - 10) * (ci.score / 100), 3, 'F');
          var guidance = ci.score >= 75 ? 'Reliable — use for zone prescription and training planning.' :
            ci.score >= 50 ? 'Usable with caution. Validate with follow-up test at this wattage.' :
            ci.score >= 30 ? 'Preliminary only. Retest with 8-10 min stages; confirm sub-LT1 start.' :
            'Do not use for zone prescription. Review protocol and retest.';
          doc.setFontSize(6); doc.setFont('helvetica', 'italic'); doc.setTextColor.apply(doc, MUTED);
          var glines = doc.splitTextToSize(guidance, cHalf - 12);
          glines.slice(0, 2).forEach(function(l, li) { doc.text(l, cxc + 5, y + 20 + li * 3.8); });
        });
        y += 34;

        /* AI text */
        var aiBodyEl = $T('tha-ai-body');
        var aiText2 = _aiText || (aiBodyEl && aiBodyEl.style.display !== 'none' ? aiBodyEl.innerText.trim() : '');
        if (aiText2) {
          if (y > 200) { doc.addPage(); doc.setFillColor.apply(doc, BG); doc.rect(0, 0, 210, 297, 'F'); y = M; }
          doc.setFontSize(6); doc.setFont('helvetica', 'bold'); doc.setTextColor.apply(doc, ACCENT);
          doc.text('AI COACHING INTERPRETATION', M, y + 3); y += 7;
          var cleanForPDF = function(t) {
            return String(t)
              .replace(/[\u2018\u2019\u201a]/g, "'")
              .replace(/[\u201c\u201d\u201e]/g, '"')
              .replace(/[\u2013\u2014\u2215]/g, '-')
              .replace(/\u2026/g, '...')
              .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '');
          };
          var strippedAI = aiText2.replace(/<[^>]+>/g, '');
          var paras = strippedAI.split('\n').filter(function(p) { return p.trim(); }).map(cleanForPDF);
          var ty = y + 3;
          doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor.apply(doc, TEXT);
          paras.forEach(function(para) {
            var safePara = para.trim().replace(/[^\x20-\x7e\n]/g, '');
            var plines = doc.splitTextToSize(safePara, cW - 6);
            var bh = plines.length * 4.2 + 3;
            if (ty + bh > 285) { doc.addPage(); doc.setFillColor.apply(doc, BG); doc.rect(0, 0, 210, 297, 'F'); ty = M + 3; }
            plines.forEach(function(line) { doc.text(line, M + 3, ty); ty += 4.2; });
            ty += 2.5;
          });
          y = ty + 2;
        }
      }

      /* Footer on every page */
      var pages = doc.internal.getNumberOfPages();
      for (var pi = 1; pi <= pages; pi++) {
        doc.setPage(pi);
        doc.setFillColor.apply(doc, BG_ACC); doc.rect(0, 283, 210, 1, 'F');
        doc.setFillColor.apply(doc, BG_HDR); doc.rect(0, 284, 210, 13, 'F');
        doc.setFontSize(6); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 190, 225);
        doc.text('EchoDevo  |  LT1/OGC Threshold Analysis Report', M, 290.5);
        doc.text('Page ' + pi + ' of ' + pages, W - M, 290.5, { align: 'right' });
      }

      var safeName = (sV('tha-athlete-name') || 'athlete').replace(/\s+/g, '_');
      var safeDate = (sV('tha-test-date') || new Date().toISOString().split('T')[0]).replace(/-/g, '');
      doc.save('EchoDevo_Threshold_' + safeName + '_' + safeDate + '.pdf');
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      if (btn) { btn.textContent = '↡ Export PDF'; btn.disabled = false; }
    }
  };

  /* ── wire up drop zone ──────────────────────────────────────────── */
  function thaInitDropZone() {
    var dz = $T('tha-drop-zone'), fi = $T('tha-fit-file');
    if (fi) {
      fi.addEventListener('change', function(e) { if (e.target.files[0]) thaHandleFile(e.target.files[0]); });
    }
    if (dz) {
      dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('drag'); });
      dz.addEventListener('dragleave', function() { dz.classList.remove('drag'); });
      dz.addEventListener('drop', function(e) {
        e.preventDefault(); dz.classList.remove('drag');
        if (e.dataTransfer.files[0]) thaHandleFile(e.dataTransfer.files[0]);
      });
    }
  }

  /* ── init test date ─────────────────────────────────────────────── */
  function thaInitDate() {
    var td = $T('tha-test-date');
    if (td && !td.value) td.value = new Date().toISOString().split('T')[0];
  }

  /* ── boot ───────────────────────────────────────────────────────── */
  function thaInit() {
    thaInitDropZone();
    thaInitDate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', thaInit);
  } else {
    thaInit();
  }

})();
