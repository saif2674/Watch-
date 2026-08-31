with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_line = '<h2>Checkout</h2>'

new_block = '''<h2>Checkout</h2>

    <div class="trust-badges">
      <div class="trust-badge">
        <span class="tb-icon">&#128274;</span>
        <span>Secure Checkout</span>
      </div>
      <div class="trust-badge">
        <span class="tb-icon">&#128666;</span>
        <span>Fast Delivery</span>
      </div>
      <div class="trust-badge">
        <span class="tb-icon">&#8617;&#65039;</span>
        <span>Easy Returns</span>
      </div>
      <div class="trust-badge">
        <span class="tb-icon">&#10003;</span>
        <span>Quality Guaranteed</span>
      </div>
    </div>'''

if 'trust-badges' in content:
    print("Already added, skipped")
elif old_line not in content:
    print("WARNING: Checkout heading not found!")
else:
    content = content.replace(old_line, new_block, 1)
    with open('public/checkout.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Trust badges added successfully")
