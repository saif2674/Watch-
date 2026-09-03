files = [
    "public/index.html", "public/product.html", "public/checkout.html",
    "public/contact.html", "public/wishlist.html", "public/myaccount.html",
    "public/privacy.html", "public/terms.html", "public/returns.html",
    "public/account.html"
]

script_tag = '  <script src="js/whatsapp-float.js"></script>\n'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "whatsapp-float.js" in content:
        print(path, "-> already added, skipped")
        continue

    if "</body>" not in content:
        print(path, "-> WARNING: no </body> found")
        continue

    content = content.replace("</body>", script_tag + "</body>", 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> whatsapp float button added")
