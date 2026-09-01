import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { collection, getDocs, query, where, orderBy, doc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { showToast } from "./toast.js";

let currentUser = null;

const tabProfileBtn = document.getElementById("tab-profile-btn");
const tabOrdersBtn = document.getElementById("tab-orders-btn");
const tabAddressesBtn = document.getElementById("tab-addresses-btn");
const sectionProfile = document.getElementById("section-profile");
const sectionOrders = document.getElementById("section-orders");
const sectionAddresses = document.getElementById("section-addresses");

function switchTab(tab) {
  [tabProfileBtn, tabOrdersBtn, tabAddressesBtn].forEach(b => b.classList.remove("active"));
  [sectionProfile, sectionOrders, sectionAddresses].forEach(s => s.classList.remove("active"));

  if (tab === "profile") { tabProfileBtn.classList.add("active"); sectionProfile.classList.add("active"); }
  if (tab === "orders") { tabOrdersBtn.classList.add("active"); sectionOrders.classList.add("active"); loadOrders(); }
  if (tab === "addresses") { tabAddressesBtn.classList.add("active"); sectionAddresses.classList.add("active"); loadAddresses(); }
}

tabProfileBtn.addEventListener("click", () => switchTab("profile"));
tabOrdersBtn.addEventListener("click", () => switchTab("orders"));
tabAddressesBtn.addEventListener("click", () => switchTab("addresses"));

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "account.html?tab=login";
    return;
  }
  currentUser = user;
  renderProfile();
});

function renderProfile() {
  document.getElementById("profile-info").innerHTML = `
    <div class="info-row"><span>Name</span><span>${currentUser.displayName || "-"}</span></div>
    <div class="info-row"><span>Email</span><span>${currentUser.email || "-"}</span></div>
  `;
}

document.getElementById("change-password-btn").addEventListener("click", async () => {
  const oldPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (!oldPass) {
    showToast("Please enter your current password.", "error");
    return;
  }
  if (!newPass || newPass.length < 6) {
    showToast("Password should be at least 6 characters.", "error");
    return;
  }
  if (newPass !== confirmPass) {
    showToast("Passwords do not match.", "error");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(currentUser.email, oldPass);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPass);
    showToast("Password updated successfully.");
    document.getElementById("old-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
  } catch (err) {
    if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      showToast("Current password is incorrect.", "error");
    } else if (err.code === "auth/requires-recent-login") {
      showToast("Please logout and login again, then retry.", "error");
    } else if (err.code === "auth/too-many-requests") {
      showToast("Too many attempts. Please try again later.", "error");
    } else {
      showToast("Could not update password. Please try again.", "error");
    }
  }
});

const STATUS_LABELS = {
  New: "New",
  Confirmed: "Confirmed",
  Delivered: "Delivered",
  Cancelled: "Cancelled"
};

async function loadOrders() {
  const listEl = document.getElementById("orders-list");
  listEl.innerHTML = "<p style='padding:20px;text-align:center;color:#999;'>Loading your orders...</p>";

  let orders = [];
  try {
    const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    orders = snapshot.docs.map(d => d.data());
  } catch (err) {
    const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
    const snapshot = await getDocs(q);
    orders = snapshot.docs.map(d => d.data());
  }

  if (orders.length === 0) {
    listEl.innerHTML = "<p class='empty-msg'>You haven't placed any orders yet.</p>";
    return;
  }

  listEl.innerHTML = orders.map(o => {
    const dateStr = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate().toLocaleDateString() : "";
    const itemsText = (o.items || []).map(it => `${it.name} x${it.qty}`).join(", ");
    return `
      <div class="order-mini-card">
        <div class="order-mini-top">
          <span>${dateStr}</span>
          <span class="order-mini-status">${STATUS_LABELS[o.status] || o.status}</span>
        </div>
        <div>${itemsText}</div>
        <div style="margin-top:6px;font-weight:700;">Total: Rs ${o.total}</div>
      </div>
    `;
  }).join("");
}

async function loadAddresses() {
  const listEl = document.getElementById("addresses-list");
  listEl.innerHTML = "<p style='padding:20px;text-align:center;color:#999;'>Loading addresses...</p>";

  const snapshot = await getDocs(collection(db, "users", currentUser.uid, "addresses"));
  const addresses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  if (addresses.length === 0) {
    listEl.innerHTML = "<p class='empty-msg'>No saved addresses yet.</p>";
  } else {
    listEl.innerHTML = addresses.map(a => `
      <div class="address-card">
        <div>
          <strong>${a.label}</strong><br>
          <span style="font-size:13px;color:#666;">${a.phone}</span><br>
          <span style="font-size:13px;color:#666;">${a.address}</span>
        </div>
        <button class="delete-address-btn" data-id="${a.id}" style="background:#e77;color:#fff;border:none;padding:6px 10px;border-radius:6px;">Delete</button>
      </div>
    `).join("");

    listEl.querySelectorAll(".delete-address-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "users", currentUser.uid, "addresses", btn.dataset.id));
        loadAddresses();
      });
    });
  }
}

document.getElementById("save-address-btn").addEventListener("click", async () => {
  const label = document.getElementById("addr-label").value.trim();
  const phone = document.getElementById("addr-phone").value.trim();
  const address = document.getElementById("addr-text").value.trim();

  if (!label || !phone || !address) {
    showToast("Please fill in all address fields.", "error");
    return;
  }

  await addDoc(collection(db, "users", currentUser.uid, "addresses"), {
    label, phone, address
  });

  document.getElementById("addr-label").value = "";
  document.getElementById("addr-phone").value = "";
  document.getElementById("addr-text").value = "";
  showToast("Address saved.");
  loadAddresses();
});
