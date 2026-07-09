import urllib.request
import re
import os

css_url = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0"
req = urllib.request.Request(
    css_url,
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
)

public_dir = "/Users/thomasknutsen/Documents/Betania Vigeland/public"
woff2_path = os.path.join(public_dir, "material-symbols.woff2")

try:
    print("Fetching Google Fonts CSS...")
    with urllib.request.urlopen(req) as response:
        css_content = response.read().decode("utf-8")
    
    # Extract woff2 url
    match = re.search(r"url\((https://[^\)]+\.woff2)\)", css_content)
    if match:
        woff2_url = match.group(1)
        print("Found font URL:", woff2_url)
        print("Downloading font file...")
        with urllib.request.urlopen(woff2_url) as font_response:
            font_data = font_response.read()
        
        with open(woff2_path, "wb") as f:
            f.write(font_data)
        print("Downloaded and saved font to:", woff2_path)
    else:
        print("Could not find WOFF2 URL in Google Fonts CSS.")
        
except Exception as e:
    print("Error:", e)
