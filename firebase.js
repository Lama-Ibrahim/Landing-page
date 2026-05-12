// ============================================================
// FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyAY03nMGyJn2jZM8hbmNjMWFXzI5j6BBS0",
    authDomain: "jana-algurashi.firebaseapp.com",
    projectId: "jana-algurashi",
    storageBucket: "jana-algurashi.appspot.com",
    messagingSenderId: "176206536841",
    appId: "1:176206536841:web:bd10179a8f1ad03000e658"
};

console.log("[zaina] firebase.js: starting load…");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("[zaina] firebase.js: SDK imported");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("[zaina] firebase.js: Firestore ready");

const form = document.getElementById("joinForm");
const successBox = document.getElementById("joinSuccess");
const submitBtn = document.getElementById("submitJoin");
const errorBox = document.getElementById("formError");

if (!form) {
    console.warn("[zaina] firebase.js: #joinForm not found in DOM");
}

// Mark form as wired up so script.js fallback doesn't intercept
form?.setAttribute("data-firebase-ready", "1");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[zaina] form submitted");
    errorBox.hidden = true;
    errorBox.textContent = "";

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!firstName || !lastName || !phone) {
        errorBox.textContent = "يرجى تعبئة جميع الحقول المطلوبة.";
        errorBox.hidden = false;
        return;
    }

    const digitCount = (phone.match(/\d/g) || []).length;
    if (digitCount < 7) {
        errorBox.textContent = "يرجى إدخال رقم جوال صحيح.";
        errorBox.hidden = false;
        return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    try {
        console.log("[zaina] writing to Firestore…");
        const docRef = await addDoc(collection(db, "earlyAccessSignups"), {
            firstName,
            lastName,
            phone,
            message: message || null,
            createdAt: serverTimestamp(),
            source: "landing-page"
        });
        console.log("[zaina] Firestore write OK, docId:", docRef.id);

        form.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
        console.error("[zaina] Firestore write FAILED:", err);
        errorBox.textContent = "حدث خطأ أثناء الإرسال: " + (err?.code || err?.message || "خطأ غير معروف");
        errorBox.hidden = false;
    } finally {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
    }
});
