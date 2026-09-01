with open('public/checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = '<input type="text" id="cust-name" placeholder="Your Name">'
new = '<select id="saved-address-select" style="display:none; width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ccc; box-sizing:border-box;"></select>\n      ' + old

if 'saved-address-select' in content:
    print("Already added, skipped")
elif old not in content:
    print("WARNING: name input not found")
else:
    content = content.replace(old, new, 1)
    with open('public/checkout.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved address dropdown added")
