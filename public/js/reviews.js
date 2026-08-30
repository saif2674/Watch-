import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, getDocs, collection, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

export function starsHtml(rating) {
  const rounded = Math.round(rating || 0);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rounded ? "★" : "☆";
  }
  return html;
}

export async function getReviews(productId) {
  const snap = await getDocs(collection(db, "products", String(productId), "reviews"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function getMyReview(productId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  const snap = await getDoc(doc(db, "products", String(productId), "reviews", uid));
  return snap.exists() ? snap.data() : null;
}

export async function submitReview(productId, rating, comment) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login to leave a review.");
    return false;
  }
  const ref = doc(db, "products", String(productId), "reviews", user.uid);
  await setDoc(ref, {
    rating: rating,
    comment: comment,
    customerName: user.displayName || "Anonymous",
    createdAt: serverTimestamp()
  });

  await recalculateRating(productId);
  return true;
}

async function recalculateRating(productId) {
  const reviews = await getReviews(productId);
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  await updateDoc(doc(db, "products", String(productId)), {
    avgRating: Math.round(avg * 10) / 10,
    reviewCount: count
  });
}
