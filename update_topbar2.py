files = ["public/index.html", "public/product.html", "public/checkout.html"]

old_topbar = '''  <div class="top-bar">
    <button id="login-btn" class="account-btn login-variant shine-btn" onclick="location.href='account.html?tab=login'">Login</button>
    <button id="signup-btn" class="account-btn signup-variant shine-btn" onclick="location.href='account.html?tab=signup'">Signup</button>
    <button id="account-btn" class="account-btn" style="display:none;"></button>
  </div>'''

new_topbar = '''  <div class="top-bar">
    <div class="top-bar-left">
      <button id="login-btn" class="account-btn login-variant shine-btn" onclick="location.href='account.html?tab=login'">Login</button>
      <button id="signup-btn" class="account-btn signup-variant shine-btn" onclick="location.href='account.html?tab=signup'">Signup</button>
      <button id="account-btn" class="account-btn" style="display:none;"></button>
    </div>
    <button id="logout-icon-btn" class="logout-icon-btn" style="display:none;" title="Logout">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
    </button>
  </div>'''

cart_line = '<button id="cart-btn" onclick="toggleCart()">'
favorite_btn = '''    <button id="favorite-btn" class="favorite-btn" style="display:none;">
      <span class="heart-icon">❤</span> Favorite
    </button>
    '''

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    if old_topbar in content:
        content = content.replace(old_topbar, new_topbar, 1)
        changed = True
    elif 'id="logout-icon-btn"' in content:
        print(path, "-> topbar already updated")
    else:
        print(path, "-> WARNING: old topbar block not matched, please check manually")

    if cart_line in content and 'id="favorite-btn"' not in content:
        content = content.replace(cart_line, favorite_btn + cart_line, 1)
        changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(path, "-> updated")
    else:
        print(path, "-> no changes made")
