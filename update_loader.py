import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<div id="page-loader">.*?</div>\s*(?=<div class="top-bar">)', re.DOTALL)

new_loader = '''<div id="page-loader">
    <div class="wh-loader">
      <svg class="wh-ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(212,175,134,0.15)" stroke-width="3"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#d4af86" stroke-width="3" stroke-linecap="round" class="wh-ring-progress"/>
      </svg>
      <div class="wh-diamond"></div>
    </div>
    <p class="wh-loader-text">WATCHHUB</p>
  </div>
  '''

content, n = pattern.subn(new_loader, content, count=1)
print("Replacements made:", n)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
