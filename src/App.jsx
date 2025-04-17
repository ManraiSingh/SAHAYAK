import React, { useEffect } from "react";
import { messaging, getToken, onMessage } from "./firebase";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./dashboard";

const App = () => {
  useEffect(() => {
    if (
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      messaging
    ) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);

          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              getToken(messaging, {
                vapidKey:
                  "BPodK1dGb8sVBfQ0unevrRJl1vfMVaHwnT2dCkj4GegL0U78RoXQet2UmRp1B66RMGTOGQoZIF4ikmbIgy1M8Ho",
                serviceWorkerRegistration: registration,
              })
                .then((currentToken) => {
                  if (currentToken) {
                    console.log("📲 FCM Token:", currentToken);
                    localStorage.setItem("fcm_token", currentToken);
                  } else {
                    console.warn("⚠️ No token retrieved");
                  }
                })
                .catch((err) => {
                  console.error("❌ getToken error:", err);
                });

              onMessage(messaging, (payload) => {
                console.log("🔔 Foreground Message:", payload);
                alert(`${payload.notification.title}: ${payload.notification.body}`);
              });
            } else {
              console.warn("🔕 Notification permission not granted");
            }
          });
        })
        .catch((err) => {
          console.error("❌ Service Worker registration failed:", err);
        });
    } else {
      console.warn("⚠️ Notifications not supported in this browser.");
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
