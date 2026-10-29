// WatchHub app-style bottom navigation (v3)
// Dark glass bar like a mobile app: Home · Shop · Cart (+) · Saved · Account
(function () {
  if (document.querySelector(".bottom-nav")) return;

  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var onHome = page === "" || page === "index.html";

  function item(href, icon, label, key) {
    var active = false;
    if (key === "home") active = onHome;
    if (key === "shop") active = page === "product.html";
    if (key === "saved") active = page === "wishlist.html";
    if (key === "account") active = page === "account.html" || page === "myaccount.html";
    return (
      '<a class="bn-item' + (active ? " active" : "") + '" href="' + href + '">' +
      '<span class="bn-icon">' + icon + "</span>" +
      '<span class="bn-label">' + label + "</span></a>"
    );
  }

  var nav = document.createElement("nav");
  nav.className = "bottom-nav";
  nav.setAttribute("aria-label", "Main");
  nav.innerHTML =
    item("index.html", "🏠", "Home", "home") +
    item(onHome ? "#products" : "index.html#products", "⌚", "Shop", "shop") +
    '<button class="bn-center" id="bn-cart-btn" aria-label="Open cart" type="button">' +
    '<span class="bn-plus">+</span><span class="bn-badge" id="bn-cart-count">0</span></button>' +
    item("wishlist.html", "❤️", "Saved", "saved") +
    item("myaccount.html", "👤", "Account", "account");

  document.body.appendChild(nav);

  // Center (+) button: opens the cart sheet where one exists (home/product),
  // otherwise takes the visitor to the shop.
  document.getElementById("bn-cart-btn").addEventListener("click", function () {
    if (typeof window.toggleCart === "function") {
      window.toggleCart();
    } else {
      location.href = "index.html#products";
    }
  });

  // Live cart badge synced with the header cart count.
  function syncBadge() {
    var badge = document.getElementById("bn-cart-count");
    var headerCount = document.getElementById("cart-count");
    var n = 0;
    if (headerCount) {
      n = parseInt(headerCount.textContent, 10) || 0;
    } else {
      try {
        var saved = JSON.parse(localStorage.getItem("watchCart")) || [];
        n = saved.reduce(function (s, i) { return s + (i.qty || 0); }, 0);
      } catch (e) { n = 0; }
    }
    if (badge) {
      badge.textContent = n;
      badge.style.display = n > 0 ? "flex" : "none";
    }
  }
  syncBadge();
  setInterval(syncBadge, 1200);
})();
