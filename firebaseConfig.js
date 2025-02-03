import { getApp, initializeApp } from '@react-native-firebase/app';
import { getAnalytics } from '@react-native-firebase/analytics';
import { getAuth } from "@react-native-firebase/auth";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBRNXoJmW0SxDEP7vKpyZTIyBNuLqLPeMI",
    authDomain: "presentor-d0eb1.firebaseapp.com",
    projectId: "presentor-d0eb1",
    storageBucket: "presentor-d0eb1.firebasestorage.app",
    messagingSenderId: "573205509133",
    appId: "1:573205509133:web:f9d29e541297b46f349144",
    measurementId: "G-25ZX82MVLP"
};

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);