/* firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxdxVvFEgDxewAsSTus27jAk1duszUHRc",
  authDomain: "hackathon-1-5443f.firebaseapp.com",
  projectId: "hackathon-1-5443f",
  storageBucket: "hackathon-1-5443f.appspot.com",
  messagingSenderId: "907540767356",
  appId: "1:907540767356:web:52b2fc13cf19015df576d5",
  measurementId: "G-CTCPWT6H45"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('📦 Background message received: ', payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: '/logo.png',
  });
});
