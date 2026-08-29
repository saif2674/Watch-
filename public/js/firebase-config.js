// Firebase SDK (CDN se, static site ke liye)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyALLLoFcdDqVgY6EkVS-C_6zXK2-a39ilE",
  authDomain: "watch-store-7b195.firebaseapp.com",
  projectId: "watch-store-7b195",
  storageBucket: "watch-store-7b195.firebasestorage.app",
  messagingSenderId: "466931914508",
  appId: "1:466931914508:web:adde96da95e333aae11b29"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
