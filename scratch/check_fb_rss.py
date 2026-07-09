import urllib.request
import xml.etree.ElementTree as ET

url = "https://rss.app/feeds/1t2MgxCaSa6Vcrtc.xml"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Mozilla/5.0"}
)

try:
    print("Fetching live Facebook feed...")
    with urllib.request.urlopen(req, timeout=10) as response:
        xml_data = response.read()
        
    root = ET.fromstring(xml_data)
    items = root.findall(".//item")
    print(f"Parsed {len(items)} items from Facebook feed.")
    
    for idx, item in enumerate(items):
        title = item.find("title").text if item.find("title") is not None else ""
        pubDate = item.find("pubDate").text if item.find("pubDate") is not None else ""
        description = item.find("description").text if item.find("description") is not None else ""
        print(f"  {idx+1}: Title: {title[:60]}... | pubDate: {pubDate}")
        if "-06" in pubDate or "-06" in title:
            print("    -> FOUND MATCH in title or pubDate!")
        if "-06" in description:
            print("    -> FOUND MATCH in description!")
            
except Exception as e:
    print("Error:", e)
