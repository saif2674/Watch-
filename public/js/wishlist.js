import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getWishlistItems, removeFromWishlist } from "./wishlist-utils.js";

const container = document.getElementById("wishlist-container");

async function render() {
  const items = await getWishlistItems();

  if (items.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  container.innerHTML = "";
  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer;">
      <div class="card-body">
        <h3 onclick="location.href='product.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <p class="price">Rs ${p.price}</p>
        <button data-id="${p.id}" class="remove-wishlist-btn">Remove</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".remove-wishlist-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await removeFromWishlist(Number(btn.dataset.id));
      render();
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    container.innerHTML = "<p>Please <a href='account.html'>login</a> to view your wishlist.</p>";
    return;
  }
  render();
});
