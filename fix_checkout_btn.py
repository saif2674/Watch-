files = ["public/index.html", "public/product.html"]

old = '<button onclick="location.href=\'checkout.html\'" class="checkout-btn">Proceed to Checkout</button>'
new = '<button onclick="proceedToCheckout()" class="checkout-btn">Proceed to Checkout</button>'

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'proceedToCheckout()' in content:
        print(path, "-> already updated, skipped")
        continue

    if old not in content:
        print(path, "-> WARNING: button not found")
        continue

    content = content.replace(old, new, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> updated")
