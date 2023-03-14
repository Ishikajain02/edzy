const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const firebase = require('firebase');
const firebaseConfig = require('./firebaseConfig.json');
var _ = require('lodash');
const app = express();
// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// Middleware to parse JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static('public'));
app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
})
// Register a new user with email and password
app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.pass;
    const passConf = req.body.passConf;

    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, passConf);
    const user = userCredential.user;

    res.json({ success: true, data: { uid: user.uid } });
    res.redirect("home");
  } catch (error) {
    res.status(400).json({ success: false, error: error.message, code: error.code });
  }
});

// Login with email and password
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    }); 

    res.json({ success: true, data: { uid: user.uid } });
    res.send("<h2>Success</h2>")
  } catch (error) {
    res.status(400).json({ success: false, error: error.message, code: error.code });
  }
});

// Login with Google
app.get('/google', async (req, res) => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();

    const userCredential = await firebase.auth().signInWithPopup(provider);
    const user = userCredential.user;

    res.json({ success: true, data: { uid: user.uid } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Start the server

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });