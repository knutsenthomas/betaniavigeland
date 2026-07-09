import urllib.request

url = "https://rss.app/feeds/1t2MgxCaSa6Vcrtc.xml"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Mozilla/5.0"}
)

try:
    print("Fetching live Facebook feed XML...")
    with urllib.request.urlopen(req, timeout=10) as response:
        xml_data = response.read().decode("utf-8")
        
    # Find the first item tag and print its full XML
    start_idx = xml_data.find("<item>")
    end_idx = xml_data.find("</item>")
    
    if start_idx != -1 and end_idx != -1:
        print("First item XML:")
        print(xml_data[start_idx:end_idx + 7])
    else:
        print("No item tag found")
            
except Exception as e:
    print("Error:", e)
