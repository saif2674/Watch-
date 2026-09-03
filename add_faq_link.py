import re

files = [
    "public/index.html", "public/product.html", "public/checkout.html",
    "public/contact.html", "public/wishlist.html", "public/myaccount.html",
    "public/privacy.html", "public/terms.html", "public/returns.html"
]

pattern = re.compile(r'(Return Policy</a>)(\s*)(</p>)')
replacement = r'\1 &middot; <a href="faq.html" class="footer-link">FAQ</a>\2\3'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'href="faq.html"' in content:
        print(path, "-> already has FAQ link, skipped")
        continue

    new_content, n = pattern.subn(replacement, content, count=1)
    if n == 0:
        print(path, "-> WARNING: Return Policy link not found")
        continue

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(path, "-> FAQ link added")
