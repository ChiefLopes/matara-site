import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "theconcavelabs",
  appId: "1:262293943050:web:b944e3cfa3c860fc9580f3",
  storageBucket: "theconcavelabs.firebasestorage.app",
  apiKey: "AIzaSyAG2vgZ4Jk_zuL7P3Ih0hkgak0U6Ga0irs",
  authDomain: "theconcavelabs.firebaseapp.com",
  messagingSenderId: "262293943050",
  measurementId: "G-9LZNCVZY0Y"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Save Marty AI Chat Session Message
export async function logMartyChatMessage(role: "user" | "assistant", content: string, userWallet?: string) {
  try {
    await addDoc(collection(db, "marty_chat_logs"), {
      role,
      content,
      userWallet: userWallet || "anonymous",
      timestamp: Date.now()
    });
  } catch (err) {
    console.warn("Marty Firestore logging:", err);
  }
}

// Save Newsletter or Waitlist Subscriber
export async function saveNewsletterSubscriber(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    await setDoc(doc(db, "newsletter_subscribers", cleanEmail), {
      email: cleanEmail,
      subscribedAt: Date.now(),
      source: "mataratoken.com"
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Newsletter Firestore error:", err);
    return false;
  }
}
