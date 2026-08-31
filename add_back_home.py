files_with_header = ["public/product.html", "public/checkout.html", "public/contact.html"]

link_html = '\n  <a href="index.html" class="back-to-shop-link">&larr; Back to Home</a>'

for path in files_with_header:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "Back to Home" in content:
        print(path, "-> already has link, skipped")
        continue

    if "</header>" not in content:
        print(path, "-> WARNING: no </header> found")
        continue

    content = content.replace("</header>", "</header>" + link_html, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> link added")

# account.html - no <header> tag, insert before account-box
with open("public/account.html", "r", encoding="utf-8") as f:
    content = f.read()

if "Back to Home" in content:
    print("account.html -> already has link, skipped")
else:
    old = '<div class="account-wrap">'
    new = old + '\n    <a href="index.html" class="back-to-shop-link" style="margin-bottom:10px;">&larr; Back to Home</a>'
    if old in content:
        content = content.replace(old, new, 1)
        with open("public/account.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("account.html -> link added")
    else:
        print("account.html -> WARNING: account-wrap div not found")

# wishlist.html - rename existing "Back to Shop" to "Back to Home"
with open("public/wishlist.html", "r", encoding="utf-8") as f:
    content = f.read()

if "Back to Shop" in content:
    content = content.replace("Back to Shop", "Back to Home")
    with open("public/wishlist.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("wishlist.html -> renamed to Back to Home")
else:
    print("wishlist.html -> no 'Back to Shop' text found, skipped")
