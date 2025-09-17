// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnsOjZtUBh51hHKK_yAUn_yrZQ0lmCSq8",
  authDomain: "go-to-go-expense.firebaseapp.com",
  projectId: "go-to-go-expense",
  storageBucket: "go-to-go-expense.firebasestorage.app",
  messagingSenderId: "1007458575667",
  appId: "1:1007458575667:web:afb4c70f2bca7e4a2aca46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//db
export const firestore = getFirestore(app);
