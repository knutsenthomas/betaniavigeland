import os
import re

search_path = "/Users/thomasknutsen/Documents/Betania Vigeland/src"
pattern = re.compile(r"\bAlle\b", re.IGNORECASE)

for root, dirs, files in os.walk(search_path):
    for file in files:
        if file.endswith(".jsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                # Find occurrences of 'Alle' or list filter maps
                if "Alle" in content:
                    print(f"File {file} has 'Alle'")
                    # print lines around it
                    lines = content.splitlines()
                    for idx, line in enumerate(lines):
                        if "Alle" in line or ".length" in line and ("filter" in line or "active" in line):
                            print(f"  Line {idx+1}: {line.strip()[:100]}")
