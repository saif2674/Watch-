with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''<select id="sort-select">
      <option value="featured">Sort: Featured</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>'''

new_block = '''<div class="sort-wrap">
      <select id="sort-select">
        <option value="featured">Sort: Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>'''

if 'class="sort-wrap"' in content:
    print("Already wrapped, skipped")
elif old_block not in content:
    print("WARNING: old sort block not found!")
else:
    content = content.replace(old_block, new_block, 1)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Sort dropdown wrapped successfully")
