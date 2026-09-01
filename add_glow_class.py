with open('public/js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

old = '<div style="position:relative;">'
new = '<div class="card-img-wrap">'

if 'card-img-wrap' in content:
    print("Already updated, skipped")
elif old not in content:
    print("WARNING: wrapper div not found")
else:
    content = content.replace(old, new, 1)
    with open('public/js/app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Wrapper class updated")
