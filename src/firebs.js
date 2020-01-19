import firebase from 'firebase'
// change lines below with your own Firebase snippets!
var config = {
    apiKey: "AIzaSyB420EdjFz5tQB1O0o-HeXa-NVaKnO3KU0",
    authDomain: "smart-cart-13d99.firebaseapp.com",
    databaseURL: "https://smart-cart-13d99.firebaseio.com",
    projectId: "smart-cart-13d99",
    storageBucket: "smart-cart-13d99.appspot.com",
    messagingSenderId: "671543951350",
    appId: "1:671543951350:web:172a17b036a8a87c4351d7",
    measurementId: "G-1PSYSDYHB5"
};
const fire = firebase.initializeApp(config);
export default fire;