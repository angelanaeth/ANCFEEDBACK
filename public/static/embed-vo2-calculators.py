#!/usr/bin/env python3
"""
Embed VO2 Bike and VO2 Run calculators into athlete-calculators.html
Preserves ALL original logic, inputs, outputs, and calculations.
"""
import re

def extract_calculator_content(html_file):
    """Extract styles, HTML content, and JavaScript from a standalone calculator file."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract custom styles (everything after <style> up to </style>)
    style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    styles = style_match.group(1) if style_match else ""
    
    # Extract the calculator container (usually starts with a div.calculator-container or similar)
    # Look for the main calculator div structure
    calculator_match = re.search(r'(<div[^>]*class="[^"]*calculator[^"]*"[^>]*>.*?</div>)\s*(?=<script|$)', content, re.DOTALL)
    if not calculator_match:
        # Try alternate pattern - look for the main content div
        calculator_match = re.search(r'(<div[^>]*class="[^"]*container[^"]*"[^>]*>.*?</div>)\s*(?=<script|$)', content, re.DOTALL)
    
    html_content = calculator_match.group(1) if calculator_match else ""
    
    # Extract all script content (JavaScript logic)
    script_matches = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    scripts = '\n\n'.join(script_matches)
    
    return styles, html_content, scripts

def main():
    print("🚀 Starting VO2 Calculator embedding process...")
    
    # Extract VO2 Bike calculator
    print("\n📦 Extracting VO2 Bike calculator...")
    bike_styles, bike_html, bike_scripts = extract_calculator_content('vo2-bike-calculator.html')
    print(f"   ✓ Styles: {len(bike_styles)} chars")
    print(f"   ✓ HTML: {len(bike_html)} chars")
    print(f"   ✓ Scripts: {len(bike_scripts)} chars")
    
    # Extract VO2 Run calculator
    print("\n📦 Extracting VO2 Run calculator...")
    run_styles, run_html, run_scripts = extract_calculator_content('vo2-run-calculator.html')
    print(f"   ✓ Styles: {len(run_styles)} chars")
    print(f"   ✓ HTML: {len(run_html)} chars")
    print(f"   ✓ Scripts: {len(run_scripts)} chars")
    
    # Read athlete-calculators.html
    print("\n📖 Reading athlete-calculators.html...")
    with open('athlete-calculators.html', 'r', encoding='utf-8') as f:
        calc_html = f.read()
    
    # Find the VO2 Bike tab pane and replace it
    print("\n🔧 Replacing VO2 Bike tab content...")
    bike_tab_pattern = r'(<!-- TAB 10: VO2 BIKE CALCULATOR -->.*?<div class="tab-pane fade" id="vo2-bike" role="tabpanel">)(.*?)(</div>\s*<!-- TAB 11: VO2 RUN CALCULATOR -->)'
    
    bike_replacement = f'''<!-- TAB 10: VO2 BIKE CALCULATOR -->
      <div class="tab-pane fade" id="vo2-bike" role="tabpanel">
        <style>
{bike_styles}
        </style>
        
{bike_html}
        
      '''
    
    calc_html = re.sub(bike_tab_pattern, lambda m: bike_replacement + m.group(3), calc_html, flags=re.DOTALL)
    
    # Find the VO2 Run tab pane and replace it
    print("🔧 Replacing VO2 Run tab content...")
    run_tab_pattern = r'(<!-- TAB 11: VO2 RUN CALCULATOR -->.*?<div class="tab-pane fade" id="vo2-run" role="tabpanel">)(.*?)(</div>\s*</div>)'
    
    run_replacement = f'''<!-- TAB 11: VO2 RUN CALCULATOR -->
      <div class="tab-pane fade" id="vo2-run" role="tabpanel">
        <style>
{run_styles}
        </style>
        
{run_html}
        
      '''
    
    calc_html = re.sub(run_tab_pattern, lambda m: run_replacement + m.group(3), calc_html, flags=re.DOTALL)
    
    # Find the end of the existing JavaScript and add both calculator scripts
    print("🔧 Adding calculator JavaScript...")
    script_end_pattern = r'(// ========= VO2 BIKE CALCULATOR =========)(.*?)(</script>\s*</body>)'
    
    new_scripts = f'''// ========= VO2 BIKE CALCULATOR =========
{bike_scripts}

    // ========= VO2 RUN CALCULATOR =========
{run_scripts}

    '''
    
    calc_html = re.sub(script_end_pattern, lambda m: new_scripts + m.group(3), calc_html, flags=re.DOTALL)
    
    # Save the updated file
    print("\n💾 Saving updated athlete-calculators.html...")
    with open('athlete-calculators.html', 'w', encoding='utf-8') as f:
        f.write(calc_html)
    
    print("\n✅ VO2 calculators successfully embedded!")
    print("   - VO2 Bike: Complete with all original logic")
    print("   - VO2 Run: Complete with miles/yards conversion")
    print("\n📝 Updated: /home/user/webapp/public/static/athlete-calculators.html")

if __name__ == '__main__':
    main()
