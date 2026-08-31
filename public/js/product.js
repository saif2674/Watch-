import { db, auth } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { toggleWishlist, isInWishlist } from "./wishlist-utils.js";
import { getReviews, getMyReview, submitReview, starsHtml } from "./reviews.js";

let cart = [];
let currentProduct = null;

const cartCountEl = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const detailContainer = document.getElementById("product-detail");

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderDetailLoader() {
  detailContainer.innerHTML = `
    <div class="watch-loader-wrap">
      <div class="watch-loader"></div>
      <p class="watch-loader-text">Fetching your timepiece...</p>
    </div>
  `;
}

function changeMainImage(url) {
  const mainImg = document.getElementById("main-product-img");
  if (mainImg) mainImg.src = url;
  document.querySelectorAll(".thumb-img").forEach(t => t.classList.remove("active-thumb"));
  const clicked = document.querySelector(`.thumb-img[data-url="${url}"]`);
  if (clicked) clicked.classList.add("active-thumb");
}

async function renderProductDetail() {
  const id = getProductIdFromURL();
  renderDetailLoader();

  const snap = await getDoc(doc(db, "products", String(id)));
  if (!snap.exists()) {
    detailContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  currentProduct = snap.data();
  const inStock = currentProduct.inStock !== false;
  const isFav = auth.currentUser ? await isInWishlist(currentProduct.id) : false;
  const allImages = [currentProduct.image, ...(currentProduct.gallery || [])].filter(Boolean);

  const thumbsHtml = allImages.length > 1
    ? `<div class="thumb-row">
        ${allImages.map((url, i) => `
          <img src="${url}" class="thumb-img ${i === 0 ? 'active-thumb' : ''}" data-url="${url}" loading="lazy" onclick="changeMainImage('${url}')">
        `).join("")}
      </div>`
    : "";

  const specsHtml = currentProduct.specifications && Object.keys(currentProduct.specifications).length > 0
    ? `<table class="specs-table">
        <tr><th colspan="2">Specifications</th></tr>
        ${Object.entries(currentProduct.specifications).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
      </table>`
    : "";

  const ratingHtml = currentProduct.reviewCount
    ? `${starsHtml(currentProduct.avgRating)} <span class="rating-num">${currentProduct.avgRating} (${currentProduct.reviewCount} review${currentProduct.reviewCount > 1 ? "s" : ""})</span>`
    : `<span class="no-reviews">No reviews yet</span>`;

  detailContainer.innerHTML = `
    <div class="detail-card">
      <div style="position:relative;">
        <img id="main-product-img" src="${currentProduct.image}" alt="${currentProduct.name}" style="${inStock ? "" : "opacity:0.5;"}">
        ${inStock ? "" : '<span class="stock-badge">Out of Stock</span>'}
        <button id="wishlist-detail-btn" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:18px;">${isFav ? "❤" : "🤍"}</button>
      </div>
      ${thumbsHtml}
      <div class="detail-info">
        <h2>${currentProduct.name}</h2>
        <div class="rating-line">${ratingHtml}</div>
        <p>${currentProduct.description}</p>
        <p class="price">Rs ${currentProduct.price}</p>
        ${specsHtml}
        <button onclick="addToCart(${currentProduct.id})" ${inStock ? "" : "disabled"}>${inStock ? "Add to Cart" : "Out of Stock"}</button>
      </div>
    </div>
    <div id="reviews-section" class="reviews-section"></div>
  `;

  document.getElementById("wishlist-detail-btn").addEventListener("click", async () => {
    if (!auth.currentUser) {
      alert("Please login to save favorites.");
      return;
    }
    const nowFav = await toggleWishlist(currentProduct);
    document.getElementById("wishlist-detail-btn").textContent = nowFav ? "❤" : " 🤍";
  });

  renderReviewsSection(currentProduct.id);
}

async function renderReviewsSection(productId) {
  const section = document.getElementById("reviews-section");
  section.innerHTML = "<p style='padding:10px 0;color:#999;'>Loading reviews...</p>";

  const reviews = await getReviews(productId);
  reviews.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const reviewsHtml = reviews.length > 0
    ? reviews.map(r => `
        <div class="review-item">
          <div class="review-top">
            <span class="review-name">${r.customerName}</span>
            <span class="review-stars">${starsHtml(r.rating)}</span>
          </div>
          ${r.comment ? `<p class="review-comment">${r.comment}</p>` : ""}
        </div>
      `).join("")
    : "<p class='no-reviews-text'>No reviews yet. Be the first to review!</p>";

  const myReview = auth.currentUser ? await getMyReview(productId) : null;

  const formHtml = auth.currentUser
    ? `
      <div class="review-form">
        <h4>${myReview ? "Update Your Review" : "Write a Review"}</h4>
        <div class="star-picker" id="star-picker">
          ${[1, 2, 3, 4, 5].map(n => `<span class="star-pick" data-value="${n}">${(myReview && n <= myReview.rating) ? "★" : "☆"}</span>`).join("")}
        </div>
        <textarea id="review-comment" placeholder="Share your thoughts (optional)" rows="3">${myReview ? (myReview.comment || "") : ""}</textarea>
        <button id="submit-review-btn">${myReview ? "Update Review" : "Submit Review"}</button>
      </div>
    `
    : `<p class="login-to-review"><a href="account.html?tab=login">Login</a> to leave a review.</p>`;

  section.innerHTML = `
    <h3 class="reviews-heading">Customer Reviews</h3>
    <div class="reviews-list">${reviewsHtml}</div>
    ${formHtml}
  `;

  if (auth.currentUser) {
    let selectedRating = myReview ? myReview.rating : 0;
    const stars = document.querySelectorAll(".star-pick");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        selectedRating = Number(star.dataset.value);
        stars.forEach(s => {
          s.textContent = Number(s.dataset.value) <= selectedRating ? "★" : "☆";
        });
      });
    });

    document.getElementById("submit-review-btn").addEventListener("click", async () => {
      if (selectedRating === 0) {
        alert("Please select a star rating.");
        return;
      }
      const comment = document.getElementById("review-comment").value.trim();
      const btn = document.getElementById("submit-review-btn");
      btn.disabled = true;
      btn.textContent = "Saving...";
      await submitReview(productId, selectedRating, comment);
      renderProductDetail();
    });
  }
}

function addToCart(id) {
  const product = currentProduct;
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
window.changeMainImage = changeMainImage;

loadCart();
renderProductDetail();
