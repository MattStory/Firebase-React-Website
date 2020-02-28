import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyDHxQtPVGZMWlhUm5jW6j2ix4YbrbmC420",
    authDomain: "college-capital-ed06f.firebaseapp.com",
    databaseURL: "https://college-capital-ed06f.firebaseio.com",
    projectId: "college-capital-ed06f",
    storageBucket: "college-capital-ed06f.appspot.com",
    messagingSenderId: "244905517245",
    appId: "1:244905517245:web:70109dddc6f307b99697d4",
    measurementId: "G-Z51D5JH30Y"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;