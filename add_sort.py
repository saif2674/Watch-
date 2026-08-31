with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_line = '<input type="text" id="search-box" placeholder="Search watches...">'

new_block = old_line + '''
    <select id="sort-select">
      <option value="featured">Sort: Featured</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>'''

if 'id="sort-select"' in content:
    print("Already has sort-select, skipped")
elif old_line not in content:
    print("WARNING: search-box line not found!")
else:
    content = content.replace(old_line, new_block, 1)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Sort dropdown added successfully")
