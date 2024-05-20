// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe6UScs17uFJQZwHobFMg8FM49IgzHFwQ",
  authDomain: "algo231-ee50a.firebaseapp.com",
  databaseURL: "https://algo231-ee50a-default-rtdb.firebaseio.com",
  projectId: "algo231-ee50a",
  storageBucket: "algo231-ee50a.appspot.com",
  messagingSenderId: "298084271187",
  appId: "1:298084271187:web:85496d73eb76469ce0f2a6",
  measurementId: "G-QR0FNN2H4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage();
const analytics = getAnalytics(app);