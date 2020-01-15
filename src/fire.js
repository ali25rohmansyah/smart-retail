import firebase from 'firebase'
// change lines below with your own Firebase snippets!
var config = {
  apiKey: "AIzaSyAvhh5CAlJkYGi1rYf_YxyYDdKEfCrLQiU",
  authDomain: "smart-retail-6d0a3.firebaseapp.com",
  databaseURL: "https://smart-retail-6d0a3.firebaseio.com",
  projectId: "smart-retail-6d0a3",
  storageBucket: "smart-retail-6d0a3.appspot.com",
  messagingSenderId: "693627086911",
  appId: "1:693627086911:web:84749e8c21631c2dfa708a",
  measurementId: "G-B5YWPXTQQN"
};
const fire = firebase.initializeApp(config);
export default fire;