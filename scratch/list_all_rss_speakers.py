import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter

url = "https://feed.podbean.com/betania-vigeland/feed.xml"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Mozilla/5.0"}
)

try:
    with urllib.request.urlopen(req) as response:
        xml_data = response.read()
    
    root = ET.fromstring(xml_data)
    speakers = []
    
    for item in root.findall(".//item"):
        title = item.find("title").text
        if title and " - " in title:
            speaker = title.split(" - ")[0].strip()
            speakers.append(speaker)
        else:
            speakers.append("Unknown")
            
    counter = Counter(speakers)
    print("Unique speakers found in RSS feed and their sermon counts:")
    for speaker, count in counter.most_common():
        print(f"  {speaker}: {count}")
        
except Exception as e:
    print("Error:", e)
