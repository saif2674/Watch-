import { db, auth } from "./firebase-config.js";
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { showToast } from "./toast.js";

const WHATSAPP_NUMBER = "923267484989";
const DELIVERY_CHARGE = 250;

const checkoutItemsEl = document.getElementById("checkout-items");
const checkoutSubtotalEl = document.getElementById("checkout-subtotal");
const checkoutTotalEl = document.getElementById("checkout-total");
const whatsappBtn = document.getElementById("whatsapp-order-btn");
const savedAddressSelect = document.getElementById("saved-address-select");

let cart = JSON.parse(localStorage.getItem("watchCart")) || [];

function renderCheckout() {
  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    whatsappBtn.disabled = true;
    checkoutSubtotalEl.textContent = "0";
    checkoutTotalEl.textContent = "0";
    return;
  }
  checkoutItemsEl.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>Rs ${item.price * item.qty}</span>
    `;
    checkoutItemsEl.appendChild(row);
  });

  checkoutSubtotalEl.textContent = subtotal;
  checkoutTotalEl.textContent = subtotal + DELIVERY_CHARGE;
}

async function loadSavedAddresses(user) {
  if (!savedAddressSelect || !user) return;

  const snapshot = await getDocs(collection(db, "users", user.uid, "addresses"));
  const addresses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  if (addresses.length === 0) return;

  savedAddressSelect.style.display = "block";
  savedAddressSelect.innerHTML = `<option value="">-- Use a saved address --</option>` +
    addresses.map(a => `<option value="${a.id}">${a.label}</option>`).join("");

  savedAddressSelect.addEventListener("change", () => {
    const selected = addresses.find(a => a.id === savedAddressSelect.value);
    if (selected) {
      document.getElementById("cust-phone").value = selected.phone;
      document.getElementById("cust-address").value = selected.address;
    }
  });
}

onAuthStateChanged(auth, (user) => {
  loadSavedAddresses(user);
});

whatsappBtn.addEventListener("click", async () => {
  const name = document.getElementById("cust-name").value.trim();
  const phone = document.getElementById("cust-phone").value.trim();
  const address = document.getElementById("cust-address").value.trim();

  if (cart.length === 0) {
    showToast("Please select at least one item to checkout.", "error");
    return;
  }

  if (!name || !phone || !address) {
    showToast("Please fill in your name, phone, and address.", "error");
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + DELIVERY_CHARGE;

  whatsappBtn.disabled = true;
  whatsappBtn.textContent = "Placing order...";

  try {
    const orderData = {
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),
      subtotal: subtotal,
      deliveryCharge: DELIVERY_CHARGE,
      total: total,
      status: "New",
      createdAt: serverTimestamp()
    };

    if (auth.currentUser) {
      orderData.userId = auth.currentUser.uid;
    }

    await addDoc(collection(db, "orders"), orderData);
  } catch (err) {
    console.error("Order save failed:", err);
  }

  let message = `Hello WatchHub, I would like to place an order:\n\n`;
  cart.forEach(item => {
    message += `${item.name} x${item.qty} - Rs ${item.price * item.qty}\n`;
  });
  message += `\nSubtotal: Rs ${subtotal}`;
  message += `\nDelivery Charges: Rs ${DELIVERY_CHARGE}`;
  message += `\nTotal: Rs ${total}`;
  message += `\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

  localStorage.removeItem("watchCart");
  whatsappBtn.disabled = false;
  whatsappBtn.textContent = "Order via WhatsApp";
});

renderCheckout();
