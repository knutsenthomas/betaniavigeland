import os
import re

dist_dir = "/Users/thomasknutsen/Documents/Betania Vigeland/dist/assets"
css_files = [f for f in os.listdir(dist_dir) if f.endswith(".css")]

if not css_files:
    print("No CSS files found in dist/assets")
else:
    css_path = os.path.join(dist_dir, css_files[0])
    print(f"Reading CSS file: {css_path}")
    with open(css_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Search for secondary color hex in CSS
    # Let's search for bg-secondary or the hex #eb6a33
    secondary_matches = re.findall(r"\.bg-secondary\{[^\}]*\}", content)
    for match in secondary_matches:
        print("Found class:", match)
        
    hex_matches = re.findall(r"#eb6a33", content)
    print(f"Occurrences of #eb6a33 (orange): {len(hex_matches)}")
    
    hex_red = re.findall(r"#b[0-9a-fA-F]{5}", content)
    print(f"Other colors starting with #b...: {set(hex_red[:10])}")
