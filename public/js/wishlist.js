import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getWishlistItems, removeFromWishlist } from "./wishlist-utils.js";

const container = document.getElementById("wishlist-container");

function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.add("loader-hidden");
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
  const items = await getWishlistItems();
  hideLoader();

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
        <img src="${p.image}" alt="${p.name}" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
        <button class="remove-wishlist-btn" data-id="${p.id}" title="Remove from wishlist">✕</button>
      </div>
      <div class="card-body">
        <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <p class="price">Rs ${p.price}</p>
      </div>
    `;
    container.appendChild(card);
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
  hideLoader();
  if (!user) {
    showEmptyState("Please login to view your saved favorites.", true);
    return;
  }
  render();
});
