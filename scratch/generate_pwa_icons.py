import os
from PIL import Image

logo_path = "/Users/thomasknutsen/Documents/Betania Vigeland/public/logo-icon.png"
public_dir = "/Users/thomasknutsen/Documents/Betania Vigeland/public"

if not os.path.exists(logo_path):
    print("Logo not found at", logo_path)
else:
    print("Generating PWA icons from", logo_path)
    with Image.open(logo_path) as img:
        # PWA Icon 192x192
        icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
        icon_192.save(os.path.join(public_dir, "icon-192.png"), "PNG")
        print("Generated icon-192.png")
        
        # PWA Icon 512x512
        icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
        icon_512.save(os.path.join(public_dir, "icon-512.png"), "PNG")
        print("Generated icon-512.png")
        
        # Apple Touch Icon 180x180
        apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
        apple_icon.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
        print("Generated apple-touch-icon.png")
