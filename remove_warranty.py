with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_line = '        <li><span class="si-icon">&#128737;&#65039;</span> 1 year warranty on all watches</li>\n'

if old_line in content:
    content = content.replace(old_line, '', 1)
    with open('public/checkout.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Warranty line removed successfully")
else:
    print("WARNING: warranty line not found exactly, trying flexible match")
    import re
    pattern = re.compile(r'\s*<li>.*?warranty.*?</li>\s*\n?', re.IGNORECASE)
    new_content, n = pattern.subn('\n', content, count=1)
    if n > 0:
        with open('public/checkout.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Removed via flexible match, replacements:", n)
    else:
        print("Could not find warranty line at all")
