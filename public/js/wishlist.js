import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getWishlistItems, removeFromWishlist } from "./wishlist-utils.js";
import { showToast } from "./toast.js";

const container = document.getElementById("wishlist-container");

function renderSkeletons(count = 4) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    sk.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    `;
    container.appendChild(sk);
  }
}

function showEmptyState(message, showLoginLink = false) {
  container.innerHTML = `
    <div class="wishlist-empty">
      <div class="wishlist-empty-icon">🤍</div>
      <p class="wishlist-empty-text">${message}</p>
      ${showLoginLink ? '<a href="account.html" class="wishlist-empty-btn">Login</a>' : '<a href="index.html" class="wishlist-empty-btn">Browse Watches</a>'}
    </div>
  `;
}

async function render() {
  renderSkeletons();
  const items = await getWishlistItems();

  if (items.length === 0) {
    showEmptyState("Your wishlist is empty. Start adding watches you love.");
    return;
  }

  container.innerHTML = "";
  items.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card in-view wishlist-card";
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div style="position:relative;">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
        <button class="remove-wishlist-btn" data-id="${p.id}" title="Remove from wishlist">✕</button>
      </div>
      <div class="card-body">
        <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <p class="price">Rs ${Number(p.price || 0).toLocaleString("en-US")}</p>
        <button class="wishlist-add-cart-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".wishlist-add-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = items.find(p => p.id === Number(btn.dataset.id));
      if (!product) return;
      let savedCart = [];
      try { savedCart = JSON.parse(localStorage.getItem("watchCart")) || []; } catch (e) { savedCart = []; }
      const existing = savedCart.find(i => i.id === product.id);
      if (existing) existing.qty += 1;
      else savedCart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
      localStorage.setItem("watchCart", JSON.stringify(savedCart));
      btn.textContent = "Added ✓";
      showToast("Added to cart.");
      setTimeout(() => { btn.textContent = "Add to Cart"; }, 1500);
    });
  });

  document.querySelectorAll(".remove-wishlist-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const card = btn.closest(".wishlist-card");
      card.classList.add("wishlist-card-removing");
      await removeFromWishlist(Number(btn.dataset.id));
      setTimeout(() => render(), 300);
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showEmptyState("Please login to view your saved favorites.", true);
    return;
  }
  render();
});
