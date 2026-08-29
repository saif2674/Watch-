let cart = [];

const container = document.getElementById("products");
const cartCountEl = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function renderProducts() {
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p class="price">₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
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

renderProducts();
