#!/bin/bash

# 1. Change title
sed -i 's/<title>.*<\/title>/<title>EchoDevo Threshold Analysis<\/title>/' lt1-ogc-standalone.html

# 2. Change font-family from IBM Plex to Segoe UI throughout CSS
sed -i "s/font-family:['\"']IBM Plex[^'\"]*['\"]/font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif/g" lt1-ogc-standalone.html
sed -i "s/font-family: IBM Plex[^;]*/font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif/g" lt1-ogc-standalone.html

# 3. Change color variables to EchoDevo theme
sed -i 's/--bg1: #fff/--bg1: #f4f6f9/' lt1-ogc-standalone.html
sed -i 's/--bg2: #fafafa/--bg2: #ffffff/' lt1-ogc-standalone.html
sed -i 's/--bg3: #f5f5f5/--bg3: #e8ebf1/' lt1-ogc-standalone.html
sed -i 's/--text1: #111/--text1: #1a1a1a/' lt1-ogc-standalone.html
sed -i 's/--text2: #333/--text2: #4a5568/' lt1-ogc-standalone.html
sed -i 's/--text3: #666/--text3: #718096/' lt1-ogc-standalone.html
sed -i 's/--border1: #ddd/--border1: #cbd5e0/' lt1-ogc-standalone.html
sed -i 's/--border2: #e0e0e0/--border2: #e2e8f0/' lt1-ogc-standalone.html
sed -i 's/--accent: #0066cc/--accent: #2563eb/' lt1-ogc-standalone.html
sed -i 's/--primary: #003366/--primary: #1a3a5c/' lt1-ogc-standalone.html

# 4. Change border-radius values
sed -i 's/border-radius: 4px/border-radius: 8px/g' lt1-ogc-standalone.html
sed -i 's/border-radius:4px/border-radius:8px/g' lt1-ogc-standalone.html
sed -i 's/border-radius: 8px/border-radius: 10px/g' lt1-ogc-standalone.html
sed -i 's/border-radius:8px/border-radius:10px/g' lt1-ogc-standalone.html

# 5. Change max-width
sed -i 's/max-width: 1280px/max-width: 1100px/' lt1-ogc-standalone.html

echo "✅ EchoDevo theme applied"
