#!/usr/bin/env python3
import re

with open('lt1-ogc-standalone.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the header section (remove logo, add logo selector and PDF button)
header_pattern = r'<header>.*?</header>'
new_header = '''<header>
  <div class="hdr-left">
    <div class="hdr-title">
      <h1>Threshold Analysis Report</h1>
      <p>LT1 & Oxidative-Glycolytic Crossover Analysis</p>
    </div>
  </div>
  <div class="hdr-right" style="display:flex;gap:12px;align-items:center;">
    <!-- LOGO SELECTOR -->
    <select id="pdf-logo-lt1" style="padding:8px 12px;border:1px solid var(--border1);border-radius:6px;background:var(--bg1);color:var(--text1);font:inherit;cursor:pointer;">
      <option value="echodevo">EchoDevo</option>
      <option value="anc">Angela Naeth Coaching</option>
      <option value="qt2">QT2 Systems</option>
      <option value="ea">Endurance Alliance</option>
    </select>
    <!-- PDF EXPORT BUTTON -->
    <button id="pdf-btn" class="pdf-btn" style="display:flex;align-items:center;gap:8px;padding:8px 16px;background:var(--accent);color:white;border:none;border-radius:6px;cursor:pointer;font:inherit;font-weight:500;">
      <span>📄</span>
      <span>Export PDF</span>
    </button>
  </div>
</header>'''

content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)

with open('lt1-ogc-standalone.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Header replaced successfully")
