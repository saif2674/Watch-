files = ["public/index.html", "public/product.html", "public/checkout.html"]

old_button_line = '\n    <button id="account-btn" class="account-btn">Login</button>'
header_tag = '  <header>'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'class="top-bar"' in content:
        print(path, "-> top-bar already exists, skipped")
        continue

    if old_button_line not in content:
        print(path, "-> account-btn not found inside header! skipped")
        continue

    content = content.replace(old_button_line, "", 1)

    top_bar_block = '  <div class="top-bar">\n    <button id="account-btn" class="account-btn">Login</button>\n  </div>\n' + header_tag
    content = content.replace(header_tag, top_bar_block, 1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> moved account-btn to top-bar")
