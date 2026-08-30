import { db, auth } from "./firebase-config.js";
import {
  doc, setDoc, deleteDoc, getDoc, getDocs, collection
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

function wishlistRef(productId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  return doc(db, "users", uid, "wishlist", String(productId));
}

export async function isInWishlist(productId) {
  const ref = wishlistRef(productId);
  if (!ref) return false;
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function addToWishlist(product) {
  const ref = wishlistRef(product.id);
  if (!ref) {
    alert("Please login to save favorites.");
    return false;
  }
  await setDoc(ref, {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  });
  return true;
}

export async function removeFromWishlist(productId) {
  const ref = wishlistRef(productId);
  if (!ref) return false;
  await deleteDoc(ref);
  return true;
}

export async function toggleWishlist(product) {
  const already = await isInWishlist(product.id);
  if (already) {
    await removeFromWishlist(product.id);
    return false;
  } else {
    await addToWishlist(product);
    return true;
  }
}

export async function getWishlistItems() {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const snap = await getDocs(collection(db, "users", uid, "wishlist"));
  return snap.docs.map(d => d.data());
}
