import { db, auth } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { toggleWishlist, isInWishlist } from "./wishlist-utils.js";
import { starsHtml } from "./reviews.js";

let products = [];
let cart = [];
let currentCategory = "All";
let currentSearch = "";
const container = document.getElementById("products");
const cartCountEl = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const searchBox = document.getElementById("search-box");
const filterButtons = document.getElementById("filter-buttons");

function renderSkeletons(count = 6) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    sk.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
    `;
    container.appendChild(sk);
  }
}

async function fetchProducts() {
  renderSkeletons();
  const snapshot = await getDocs(collection(db, "products"));
  products = snapshot.docs.map(doc => doc.data());
  renderCategoryFilters();
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.add("loader-hidden");
  renderProducts();
}

function renderCategoryFilters() {
  const categories = [...new Set(products.map(p => p.category))].sort();

  filterButtons.querySelectorAll(".filter-btn:not([data-category='All'])").forEach(btn => btn.remove());

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = cat;
    btn.textContent = cat;
    filterButtons.appendChild(btn);
  });
}

async function renderProducts() {
  container.innerHTML = "";

  const filtered = products.filter(p => {
    const matchesCategory = currentCategory === "All" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p style='padding:20px;text-align:center;grid-column:1/-1;'>No watches found.</p>";
    return;
  }

  for (const p of filtered) {
    const inStock = p.inStock !== false;
    const isFav = auth.currentUser ? await isInWishlist(p.id) : false;
    const ratingHtml = p.reviewCount
      ? `${starsHtml(p.avgRating)} <span class="rating-num">${p.avgRating} (${p.reviewCount})</span>`
      : `<span class="no-reviews">No reviews yet</span>`;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div style="position:relative;">
        <img src="${p.image}" alt="${p.name}" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer; ${inStock ? "" : "opacity:0.5;"}">
        ${inStock ? "" : '<span class="stock-badge">Out of Stock</span>'}
        <button class="wishlist-icon-btn" data-id="${p.id}" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:16px;">${isFav ? "❤" : "🤍"}</button>
      </div>
      <div class="card-body">
        <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <div class="rating-line">${ratingHtml}</div>
        <p>${p.description}</p>
        <p class="price">Rs ${p.price}</p>
        <button onclick="addToCart(${p.id})" ${inStock ? "" : "disabled"}>${inStock ? "Add to Cart" : "Out of Stock"}</button>
        <button class="view-more-btn" onclick="location.href='product.html?id=${p.id}'">View More</button>
      </div>
    `;
    container.appendChild(card);
  }

  document.querySelectorAll(".wishlist-icon-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!auth.currentUser) {
        alert("Please login to save favorites.");
        return;
      }
      const id = Number(btn.dataset.id);
      const product = products.find(p => p.id === id);
      const nowFav = await toggleWishlist(product);
      btn.textContent = nowFav ? "❤" : " 🤍";
    });
  });
  observeCards();
}

function observeCards() {
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

searchBox.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

filterButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentCategory = e.target.dataset.category;
    renderProducts();
  }
});

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.inStock === false) return;
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  saveCart();
  cartPanel.classList.add("open");
  document.getElementById("cart-btn").classList.add("cart-pulse");
  setTimeout(() => {
    document.getElementById("cart-btn").classList.remove("cart-pulse");
  }, 400);
}

function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  renderCart();
  saveCart();
}

function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  renderCart();
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;

  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p style='padding:10px 0;color:#888;'>Your cart is empty.</p>";
  }

  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">Rs ${item.price * item.qty}</span>
      </div>
      <div class="qty-controls">
        <button onclick="decreaseQty(${item.id})">-</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${item.id})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = total;
}

function toggleCart() {
  cartPanel.classList.toggle("open");
}

function saveCart() {
  localStorage.setItem("watchCart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("watchCart");
  if (saved) {
    cart = JSON.parse(saved);
    renderCart();
  }
}

window.addToCart = addToCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;

loadCart();
fetchProducts();
