with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = '<p class="cart-total-row">Total: Rs <span id="checkout-total">0</span></p>'
new = '''<p class="cart-total-row">Subtotal: Rs <span id="checkout-subtotal">0</span></p>
    <p class="cart-total-row">Delivery Charges: Rs 250</p>
    <p class="cart-total-row grand-total">Total: Rs <span id="checkout-total">0</span></p>'''

if 'checkout-subtotal' in content:
    print("Already updated, skipped")
elif old not in content:
    print("WARNING: total row not found")
else:
    content = content.replace(old, new, 1)
    with open('public/checkout.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Delivery charges row added")
