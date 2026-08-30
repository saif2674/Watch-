import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<section class="hero">.*?</section>', re.DOTALL)

new_hero = '''<section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Timeless Elegance</h1>
      <p class="hero-subtitle">Premium watches designed for those who value every second.</p>
      <button class="hero-cta shine-btn" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">Shop Collection &rarr;</button>
    </div>
  </section>'''

content, n = pattern.subn(new_hero, content, count=1)
print("Replacements made:", n)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
