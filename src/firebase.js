import { initializeApp } from "firebase/app";
    import { getDatabase } from "firebase/database";

    const firebaseConfig = {
      apiKey: "AIzaSyBRpEFwkR7tnoqsD7aq69_pSMku3uaNvc8",
      authDomain: "appliperso-749ca.firebaseapp.com",
      projectId: "appliperso-749ca",
      storageBucket: "appliperso-749ca.firebasestorage.app",
      messagingSenderId: "978280798104",
      appId: "1:978280798104:web:69c8ff59c572b1d98cbded",
      databaseURL: "https://appliperso-749ca-default-rtdb.europe-west1.firebasedatabase.app/"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    export { db };
    export default app;
