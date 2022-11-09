var firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyAV_kPUzTbMwJExeNY6HkTVkj5b10R-lG0",
    authDomain: "fir-rtc-12286.firebaseapp.com",
    databaseURL: "https://fir-rtc-12286-default-rtdb.firebaseio.com",
    projectId: "fir-rtc-12286",
    storageBucket: "fir-rtc-12286.appspot.com",
    messagingSenderId: "657156147520",
    appId: "1:657156147520:web:c983ac4b91b69bd24212a5"
  }

  firebase.initializeApp(firebaseConfig);

  let database = firebase.database()