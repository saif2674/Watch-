import re

with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

if 'shipping-info' in content:
    print("Already added, skipped")
else:
    pattern = re.compile(r'(<div class="delivery-note">.*?</div>)\s*(?=<div class="checkout-form">)', re.DOTALL)

    shipping_block = '''\\1
    <div class="shipping-info">
      <h4>Shipping &amp; Returns</h4>
      <ul>
        <li><span class="si-icon">&#128666;</span> Delivery within 3-5 business days</li>
        <li><span class="si-icon">&#128176;</span> Cash on Delivery available</li>
        <li><span class="si-icon">&#8617;&#65039;</span> Easy returns within 7 days</li>
        <li><span class="si-icon">&#128737;&#65039;</span> 1 year warranty on all watches</li>
      </ul>
    </div>
    '''

    content, n = pattern.subn(shipping_block, content, count=1)
    print("Replacements made:", n)

    with open('public/checkout.html', 'w', encoding='utf-8') as f:
        f.write(content)
