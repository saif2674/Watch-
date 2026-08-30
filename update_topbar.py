files = ["public/index.html", "public/product.html", "public/checkout.html"]

old_topbar = '  <div class="top-bar">\n    <button id="account-btn" class="account-btn">Login</button>\n  </div>\n'

new_topbar = '''  <div class="top-bar">
    <button id="login-btn" class="account-btn login-variant shine-btn" onclick="location.href='account.html?tab=login'">Login</button>
    <button id="signup-btn" class="account-btn signup-variant shine-btn" onclick="location.href='account.html?tab=signup'">Signup</button>
    <button id="account-btn" class="account-btn" style="display:none;"></button>
  </div>
'''

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    if 'id="login-btn"' in content:
        print(path, "-> already updated, skipped")
        continue

    if old_topbar not in content:
        print(path, "-> old top-bar block not found! skipped")
        continue

    content = content.replace(old_topbar, new_topbar, 1)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(path, "-> topbar updated with Login + Signup buttons")
