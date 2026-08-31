import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<div id="page-loader">.*?</div>\s*(?=<div class="top-bar">)', re.DOTALL)

content, n = pattern.subn('', content, count=1)
print("Removed page-loader blocks:", n)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
