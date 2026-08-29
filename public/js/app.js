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

function renderProducts() {
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

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <div class="card-body">
        <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <p>${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
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
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
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

  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
      <button onclick="removeFromCart(${item.id})">✕</button>
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

loadCart();
renderProducts();
