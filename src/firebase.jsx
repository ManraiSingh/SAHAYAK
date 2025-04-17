import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBxdxVvFEgDxewAsSTus27jAk1duszUHRc",
//   authDomain: "remindify-5b0c4.firebaseapp.com",
//   projectId: "remindify-5b0c4",
//   storageBucket: "remindify-5b0c4.appspot.com",
//   messagingSenderId: "262042173286",
//   appId: "1:262042173286:web:33613409e6bb2c591493a2",
//   measurementId: "G-F6CKSE9LBK",
// };
const firebaseConfig = {
  apiKey: "AIzaSyBxdxVvFEgDxewAsSTus27jAk1duszUHRc",
  authDomain: "hackathon-1-5443f.firebaseapp.com",
  projectId: "hackathon-1-5443f",
  storageBucket: "hackathon-1-5443f.firebasestorage.app",
  messagingSenderId: "907540767356",
  appId: "1:907540767356:web:a94cb59c2c38c41a9cdff9",
  measurementId: "G-F6CKSE9LBK"
};
const app = initializeApp(firebaseConfig);

// ✅ Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Messaging
let messaging = null;
try {
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  ) {
    messaging = getMessaging(app);

    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered");

        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            getToken(messaging, {
              vapidKey:
                "BPodK1dGb8sVBfQ0unevrRJl1vfMVaHwnT2dCkj4GegL0U78RoXQet2UmRp1B66RMGTOGQoZIF4ikmbIgy1M8Ho",
              serviceWorkerRegistration: registration,
            })
              .then((currentToken) => {
                if (currentToken) {
                  console.log("✅ FCM Token:", currentToken);
                  localStorage.setItem("fcm_token", currentToken);
                } else {
                  console.warn("⚠️ No token retrieved.");
                }
              })
              .catch((err) => {
                console.error("❌ Token error:", err);
              });
          }
        });
      });
  }
} catch (err) {
  console.warn("⚠️ Messaging setup skipped (non-browser env):", err);
}

export { auth, provider, messaging, getToken, onMessage };
