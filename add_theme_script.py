files = ["public/index.html", "public/product.html", "public/checkout.html", "public/contact.html", "public/wishlist.html"]

head_script = '<script>if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark-mode");}</script>\n'
body_script = '  <script src="js/theme.js"></script>\n'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    if "theme.js" not in content and "</head>" in content:
        content = content.replace("</head>", head_script + "</head>", 1)
        changed = True

    if "theme.js" not in content and "</body>" in content:
        content = content.replace("</body>", body_script + "</body>", 1)
        changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(path, "-> theme script added")
    else:
        print(path, "-> already has theme script or missing head/body tags, skipped")
