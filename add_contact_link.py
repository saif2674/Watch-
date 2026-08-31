files = ["public/index.html", "public/product.html", "public/checkout.html"]

old_line = '<p>Crafted with precision, delivered with care.</p>'
new_block = old_line + '\n    <p><a href="contact.html" class="footer-link">Contact Us</a></p>'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'href="contact.html"' in content:
        print(path, "-> already has contact link, skipped")
        continue

    if old_line not in content:
        print(path, "-> WARNING: footer line not found")
        continue

    content = content.replace(old_line, new_block, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> contact link added")
