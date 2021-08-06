import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const FBConfig = {
    apiKey: "AIzaSyAQY24JU_UT8LUHMLPibiMNjI0aifVD5y0",
    authDomain: "supply-sargent.firebaseapp.com",
    projectId: "supply-sargent",
    storageBucket: "supply-sargent.appspot.com",
    messagingSenderId: "446339961148",
    appId: "1:446339961148:web:3f69440600f36588ef0e39",
    measurementId: "G-G6906P1RDQ"
};

firebase.initializeApp(FBConfig);

export default firebase;