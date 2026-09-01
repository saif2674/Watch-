with open('public/myaccount.html', 'r', encoding='utf-8') as f:
    content = f.read()

old = '<input type="password" id="new-password" placeholder="New Password (min 6 characters)">'
new = '<input type="password" id="old-password" placeholder="Current Password">\n        ' + old

if 'old-password' in content:
    print("Already added, skipped")
elif old not in content:
    print("WARNING: new-password field not found")
else:
    content = content.replace(old, new, 1)
    with open('public/myaccount.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Old password field added")
