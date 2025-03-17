// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEJCNPUN2OKSUNxXSFofwqFJ1jxJXmRws",
  authDomain: "project-tableegh.firebaseapp.com",
  projectId: "project-tableegh",
  storageBucket: "project-tableegh.firebasestorage.app",
  messagingSenderId: "679343328871",
  appId: "1:679343328871:web:d43b469e370e56d5078ec2",
  measurementId: "G-6BDHMEEWZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
