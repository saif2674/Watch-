import re

with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'\s*<li>.*?Easy returns.*?</li>\s*\n?', re.IGNORECASE)

new_lines = '''
        <li><span class="si-icon">&#127775;</span> 100% Genuine Products</li>
        <li><span class="si-icon">&#128222;</span> Dedicated Customer Support</li>
'''

content, n = pattern.subn(new_lines, content, count=1)
print("Replacements made:", n)

with open('public/checkout.html', 'w', encoding='utf-8') as f:
    f.write(content)
