import os
from PIL import Image
from collections import Counter

img_path = '/Users/thomasknutsen/Documents/Betania Vigeland/public/logo-icon.png'

if os.path.exists(img_path):
    with Image.open(img_path) as img:
        img = img.convert('RGBA')
        pixels = list(img.getdata())
        
        # Filter pixels with alpha > 100
        colors = []
        for r, g, b, a in pixels:
            if a > 100:
                # Filter out white/near-white backgrounds
                if not (r > 240 and g > 240 and b > 240):
                    colors.append((r, g, b))
                    
        # Group similar colors using a threshold or print the top colors by bucket
        # Let's count them
        counter = Counter(colors)
        print("Total solid colored pixels:", len(colors))
        print("Top 20 exact colors in the logo:")
        for color, count in counter.most_common(20):
            hex_val = '#{:02x}{:02x}{:02x}'.format(*color)
            print(f"  {hex_val} (RGB: {color}) : {count} pixels")
            
else:
    print(f"File not found: {img_path}")
