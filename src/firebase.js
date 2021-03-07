import firebase from "firebase";
const firebaseApp = firebase.initializeApp({apiKey: "AIzaSyBJ0GyrP28kwA88yTDUETwkm3r-w0sut3M",
authDomain: "instagram-clone-72a32.firebaseapp.com",
projectId: "instagram-clone-72a32",
storageBucket: "instagram-clone-72a32.appspot.com",
messagingSenderId: "361033151109",
appId: "1:361033151109:web:cad1021b855ee944b6efec",
measurementId: "G-KG8RLLPML4"
})

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }