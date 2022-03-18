// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {getStorage} from 'firebase/storage';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa2dkpgd24ASlDHj_qu2Mm2y1mI1oZ1yU",
  authDomain: "teche-commerce-a2c6a.firebaseapp.com",
  projectId: "teche-commerce-a2c6a",
  storageBucket: "teche-commerce-a2c6a.appspot.com",
  messagingSenderId: "506492176887",
  appId: "1:506492176887:web:b977de263ff929916246f2",
  measurementId: "G-D5QTE9S5R9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage};