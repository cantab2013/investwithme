var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  flash = require("connect-flash"),
  app = express(),
  db = require("./models/index");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}) ); 

app.use(cookieSession({
  secret: 'thisismysecretkey',
  name: 'cookie created by Elie',
  //maxage is in milliseconds
  maxage: 360000
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialze functions
passport.serializeUser(function(user,done){
  console.log("SERIALIZED JUST RAN");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN");
  db.user.find({
    where: {
      id: id
    }
  }).done(function(error, user){
    done(error, user);
  });
});


app.get('/', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("index");
  }
  else {
    res.redirect('/home');
  }
});

app.get('/signup', function(req,res){
  if(!req.user) {
    res.render("signup");  
  }
  else{
    res.redirect('/home');
  }
});

app.get('/login', function(req,res){
  if(!req.user) {
    res.render("login");  
  }
  else {
    res.redirect('/home')
  }
});

app.get('/home', function(req,res){
  res.render("home", {
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

// on submit, create a new users using form values
app.post('/create', function(req,res){	
   
  db.user.createNewUser(req.body.username, req.body.password, 
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});

// authenticate users when logging in
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function(){
  console.log("get this party started on port 3000");  
});


