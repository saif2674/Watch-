files = [
    "public/index.html", "public/product.html", "public/checkout.html",
    "public/contact.html", "public/wishlist.html", "public/myaccount.html"
]

anchor = '<p>Crafted with precision, delivered with care.</p>'
legal_block = '''
    <p class="footer-legal-links">
      <a href="privacy.html" class="footer-link">Privacy Policy</a> &middot;
      <a href="terms.html" class="footer-link">Terms &amp; Conditions</a> &middot;
      <a href="returns.html" class="footer-link">Return Policy</a>
    </p>'''

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "footer-legal-links" in content:
        print(path, "-> already has legal links, skipped")
        continue

    if anchor not in content:
        print(path, "-> WARNING: footer anchor not found")
        continue

    content = content.replace(anchor, anchor + legal_block, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> legal links added")
