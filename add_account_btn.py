logo_line = '<img src="https://i.ibb.co/FT8KrZq/file-00000000039c82088e38b3467c1dfeb3.png" alt="WatchHub" class="site-logo" onclick="location.href=\'index.html\'">'

files = ["public/index.html", "public/product.html", "public/checkout.html"]

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'id="account-btn"' in content:
        print(path, "-> already has account-btn, skipped")
        continue

    if logo_line not in content:
        print(path, "-> logo line not found! skipped")
        continue

    new_block = logo_line + '\n    <button id="account-btn" class="account-btn">Login</button>'
    content = content.replace(logo_line, new_block, 1)

    script_tag = '  <script type="module" src="js/header-auth.js"></script>\n'
    if "header-auth.js" not in content:
        content = content.replace("</body>", script_tag + "</body>", 1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> updated")
