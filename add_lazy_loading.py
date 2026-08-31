replacements = {
    "public/js/app.js": [
        (
            '<img src="${p.image}" alt="${p.name}" onclick="location.href=\'product.html?id=${p.id}\'" style="cursor:pointer; ${inStock ? "" : "opacity:0.5;"}">',
            '<img src="${p.image}" alt="${p.name}" loading="lazy" onclick="location.href=\'product.html?id=${p.id}\'" style="cursor:pointer; ${inStock ? "" : "opacity:0.5;"}">'
        )
    ],
    "public/js/product.js": [
        (
            '<img src="${url}" class="thumb-img ${i === 0 ? \'active-thumb\' : \'\'}" data-url="${url}" onclick="changeMainImage(\'${url}\')">',
            '<img src="${url}" class="thumb-img ${i === 0 ? \'active-thumb\' : \'\'}" data-url="${url}" loading="lazy" onclick="changeMainImage(\'${url}\')">'
        )
    ],
    "public/js/wishlist.js": [
        (
            '<img src="${p.image}" alt="${p.name}" onclick="location.href=\'product.html?id=${p.id}\'" style="cursor:pointer;">',
            '<img src="${p.image}" alt="${p.name}" loading="lazy" onclick="location.href=\'product.html?id=${p.id}\'" style="cursor:pointer;">'
        )
    ]
}

for path, pairs in replacements.items():
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False
    for old, new in pairs:
        if 'loading="lazy"' in content and old.replace('${p.image}', '') in content and new in content:
            continue
        if old in content:
            content = content.replace(old, new, 1)
            changed = True
        elif new in content:
            print(path, "-> already has lazy loading, skipped")
        else:
            print(path, "-> WARNING: pattern not found, please check manually")

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(path, "-> lazy loading added")
