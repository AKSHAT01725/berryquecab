import { initializeApp }        from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics }         from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ── Firebase Config ────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyB5sKr8j3xqWWE8-SgT8TxrgjLtzhcGYjw",
  authDomain:        "berry-que-lab.firebaseapp.com",
  projectId:         "berry-que-lab",
  storageBucket:     "berry-que-lab.firebasestorage.app",
  messagingSenderId: "50592225783",
  appId:             "1:50592225783:web:1959f693805e7f343236f2",
  measurementId:     "G-TBQS6JLWJ0"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth      = getAuth(app);
const db        = getFirestore(app);

// ── Auth helpers ───────────────────────────────────────────────────────────────
export { auth };

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Firestore helpers ──────────────────────────────────────────────────────────

/**
 * Save a document to a collection.
 * Automatically adds a `received` server timestamp.
 */
export async function saveDocument(collectionName, data) {
  const ref = collection(db, collectionName);
  return addDoc(ref, { ...data, received: serverTimestamp() });
}

/**
 * Fetch all documents from a collection.
 * By default, orders by `received` descending (newest first).
 * Pass orderField=null to skip ordering, or a different field/direction as needed.
 * Returns an array of objects including the Firestore `id`.
 */
export async function fetchCollection(collectionName, orderField = "received", direction = "desc") {
  try {
    const ref  = collection(db, collectionName);
    const q    = orderField ? query(ref, orderBy(orderField, direction)) : query(ref);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // If the collection doesn't exist yet, return empty array
    console.warn(`fetchCollection(${collectionName}):`, e.message);
    return [];
  }
}

/**
 * Delete a single document by ID.
 */
export function deleteDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

/**
 * Update fields on an existing document by ID.
 */
export function updateDocument(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), data);
}
