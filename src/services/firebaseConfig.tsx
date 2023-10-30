import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDwPBdrGbMJQsjh7ySfK3dVcPxLbNX7W8c",

    authDomain: "tem-que-funcionar.firebaseapp.com",
  
    projectId: "tem-que-funcionar",
  
    storageBucket: "tem-que-funcionar.appspot.com",
  
    messagingSenderId: "186437249319",
  
    appId: "1:186437249319:web:52e2cc9e7874947eb3a102"  
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Exportando minha variavel de autenticacao
export const auth = getAuth(app);