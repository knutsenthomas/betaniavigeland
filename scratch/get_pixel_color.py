import os
from PIL import Image

artifacts_dir = "/Users/thomasknutsen/.gemini/antigravity/brain/6c68bf36-f1ae-4b15-be24-33e1e588e257"
files = sorted([f for f in os.listdir(artifacts_dir) if f.startswith("media__") and f.endswith(".png")], reverse=True)

# Also check jpg files
files_jpg = sorted([f for f in os.listdir(artifacts_dir) if f.startswith("media__") and f.endswith(".jpg")], reverse=True)
files.extend(files_jpg)

print("Found files:", files[:5])

for fname in files[:5]:
    fpath = os.path.join(artifacts_dir, fname)
    try:
        img = Image.open(fpath).convert("RGB")
        colors = img.getcolors(maxcolors=256*256)
        if colors is None:
            # Too many colors, sample a grid
            pixels = list(img.getdata())
            # Find reddish-orange colors
            reddish = []
            for r, g, b in pixels[::10]: # sample every 10th pixel
                # reddish-orange condition: R is high, G is moderate, B is low, and R > G + 30
                if r > 120 and r > g + 40 and g > 20 and b < 80:
                    reddish.append((r, g, b))
            if reddish:
                # Get the most common reddish color
                from collections import Counter
                most_common = Counter(reddish).most_common(5)
                print(f"File {fname} reddish colors:")
                for color, count in most_common:
                    hex_color = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
                    print(f"  {hex_color} : {count}")
        else:
            # Small image
            reddish = []
            for count, (r, g, b) in colors:
                if r > 120 and r > g + 40 and g > 20 and b < 80:
                    reddish.append((count, (r, g, b)))
            if reddish:
                reddish.sort(reverse=True)
                print(f"File {fname} reddish colors:")
                for count, color in reddish[:5]:
                    hex_color = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
                    print(f"  {hex_color} : {count}")
    except Exception as e:
        print(f"Error reading {fname}: {e}")
