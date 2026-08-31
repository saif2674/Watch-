files = [
    "public/index.html",
    "public/product.html",
    "public/checkout.html",
    "public/contact.html",
    "public/wishlist.html",
    "public/account.html"
]

ga_script = '''<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-51C438KKNY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-51C438KKNY');
</script>
'''

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if "googletagmanager" in content:
        print(path, "-> already has GA, skipped")
        continue

    if "<head>" not in content:
        print(path, "-> WARNING: <head> tag not found")
        continue

    content = content.replace("<head>", ga_script, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> GA added")
