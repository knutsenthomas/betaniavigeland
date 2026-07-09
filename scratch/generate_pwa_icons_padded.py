import os
from PIL import Image

logo_path = "/Users/thomasknutsen/Documents/Betania Vigeland/public/logo-icon.png"
public_dir = "/Users/thomasknutsen/Documents/Betania Vigeland/public"

if not os.path.exists(logo_path):
    print("Logo not found at", logo_path)
else:
    print("Generating PWA icons with solid white background...")
    with Image.open(logo_path) as img:
        def make_solid_icon(size):
            # Create a solid white background canvas (RGB with Alpha = 255)
            canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
            
            # Scale the original logo down to 70% of the canvas size
            target_logo_size = int(size * 0.70)
            
            # Maintain aspect ratio of original logo
            img_ratio = img.width / img.height
            if img_ratio > 1:
                logo_w = target_logo_size
                logo_h = int(target_logo_size / img_ratio)
            else:
                logo_h = target_logo_size
                logo_w = int(target_logo_size * img_ratio)
                
            resized_logo = img.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            
            # Center the logo on the canvas and paste using its own transparency mask
            offset_x = (size - logo_w) // 2
            offset_y = (size - logo_h) // 2
            canvas.paste(resized_logo, (offset_x, offset_y), resized_logo)
            
            return canvas

        # Generate and save solid icons
        make_solid_icon(192).save(os.path.join(public_dir, "icon-192.png"), "PNG")
        print("Generated solid icon-192.png")
        
        make_solid_icon(512).save(os.path.join(public_dir, "icon-512.png"), "PNG")
        print("Generated solid icon-512.png")
        
        make_solid_icon(180).save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
        print("Generated solid apple-touch-icon.png")
