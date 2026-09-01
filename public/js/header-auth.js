import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const accountBtn = document.getElementById("account-btn");
const logoutIconBtn = document.getElementById("logout-icon-btn");
const favoriteBtn = document.getElementById("favorite-btn");

if (logoutIconBtn) {
  logoutIconBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

if (favoriteBtn) {
  favoriteBtn.addEventListener("click", () => {
    window.location.href = "wishlist.html";
  });
}

if (accountBtn) {
  accountBtn.addEventListener("click", () => {
    window.location.href = "myaccount.html";
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (logoutIconBtn) logoutIconBtn.style.display = "inline-flex";
    if (favoriteBtn) favoriteBtn.style.display = "inline-flex";

    const label = user.displayName ? user.displayName.split(" ")[0] : "My Account";
    accountBtn.style.display = "inline-flex";
    accountBtn.innerHTML = `<span class="account-menu-icon">&#9776;</span> ${label}`;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (logoutIconBtn) logoutIconBtn.style.display = "none";
    if (favoriteBtn) favoriteBtn.style.display = "none";
    accountBtn.style.display = "none";
  }
});
