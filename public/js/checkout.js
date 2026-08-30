const WHATSAPP_NUMBER = "923267484989";

const checkoutItemsEl = document.getElementById("checkout-items");
const checkoutTotalEl = document.getElementById("checkout-total");
const whatsappBtn = document.getElementById("whatsapp-order-btn");

let cart = JSON.parse(localStorage.getItem("watchCart")) || [];

function renderCheckout() {
  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    whatsappBtn.disabled = true;
    return;
  }

  checkoutItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>Rs ${item.price * item.qty}</span>
    `;
    checkoutItemsEl.appendChild(row);
  });

  checkoutTotalEl.textContent = total;
}

whatsappBtn.addEventListener("click", async () => {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in your name, phone, and address.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  whatsappBtn.disabled = true;
  whatsappBtn.textContent = "Placing order...";

  let result = null;

  try {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(item => ({ id: item.id, qty: item.qty })),
        customerName: name,
        customerPhone: phone,
        customerAddress: address
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Order failed. Please try again.");
      whatsappBtn.disabled = false;
      whatsappBtn.textContent = "Order via WhatsApp";
      return;
    }

    result = data;
  } catch (err) {
    console.error("Order request failed:", err);
    alert("Sorry, we couldn't place your order right now. Please check your internet connection and try again.");
    whatsappBtn.disabled = false;
    whatsappBtn.textContent = "Order via WhatsApp";
    return;
  }

  let message = `Hello WatchHub! I'd like to place an order:\n\n`;
  result.items.forEach(item => {
    message += `${item.name} x${item.qty} - Rs ${item.price * item.qty}\n`;
  });
  message += `\nTotal: Rs ${result.total}\n\n`;
  message += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  localStorage.removeItem("watchCart");
  whatsappBtn.disabled = false;
  whatsappBtn.textContent = "Order via WhatsApp";
});

renderCheckout();
