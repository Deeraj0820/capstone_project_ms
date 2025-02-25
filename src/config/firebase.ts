// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId:process.env.REACT_APP_MEASUREMENTID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Get Firebase services
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const FDB = getDatabase(app); // Realtime Database
// export const storage = getStorage(app);

// export default app;



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBXD_bNZSrtsfmRHouZ5zOWa1Ekr-3WrlU",
  authDomain: "library-management-syste-6bd90.firebaseapp.com",
  databaseURL: "https://library-management-syste-6bd90-default-rtdb.firebaseio.com",
  projectId: "library-management-syste-6bd90",
  storageBucket: "library-management-syste-6bd90.firebasestorage.app",
  messagingSenderId: "120611373921",
  appId: "1:120611373921:web:14b0a1712bbe51f3a67b20",
  measurementId: "G-M1V7YVZLR7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const FDB = getDatabase(app); // Realtime Database
export const storage = getStorage(app);

export default app;
