var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  app = express();

// Middleware for ejs, grabbing HTML and including static files
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));


// we are going to create a cookie that will store our session data
// ideally we want this secret to be a string of random numbers 
// we use the secret to parse the data from the cookie
// This is cookie-based session middleware so technically this creates a session
// This session can expire and doesn't live on our server

// The session middleware implements generic session functionality with in-memory storage by default. It allows you to specify other storage formats, though.
// The cookieSession middleware, on the other hand, implements cookie-backed storage (that is, the entire session is serialized to the cookie, rather than just a session key. It should really only be used when session data is going to stay relatively small.
// And, as I understand, it (cookie-session) should only be used when session data isn't sensitive. It is assumed that a user could inspect the contents of the session, but the middleware will detect when the data has been modified.
app.use(cookieSession( {
  secret: 'thisismysecretkey',
  name: 'session with cookie data',
  // this is in milliseconds
  maxage: 3600000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .complete(function(error,user){ 
      done(error, user);
    });
});
app.get('/', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("index");
  }
  else{
    res.redirect('/home');
  }
});

app.get('/signup', function(req,res){
  if(!req.user) {
    res.render("signup", { username: ""});
  }
  else{
    res.redirect('/home');
  }
});

app.get('/login', function(req,res){
  // check if the user is logged in
  if(!req.user) {
    res.render("login", {message: req.flash('loginMessage'), username: ""});
  }
  else{
    res.redirect('/home');
  }
});

app.get('/home', function(req,res){
  res.render("home", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

// on submit, create a new users using form values
app.post('/submit', function(req,res){  
  
  db.user.createNewUser(req.body.username, req.body.password, 
  function(err){
    res.render("signup", {message: err.message, username: req.body.username});
  }, 
  function(success){
    res.render("index", {message: success.message});
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home', 
  failureRedirect: '/login', 
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

app.get('/adminSummary', function(req,res){
  res.render("adminSummary", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

app.get('/adminDetails', function(req,res){
  res.render("adminDetails", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

app.get('/adminInput', function(req,res){
  res.render("adminInput", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

app.get('/adminOutput', function(req,res){
  res.render("adminOutput", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});


app.get('/dashboard', function(req,res){
  db.user.find({
    where:
    {
      id: req.user.id
    }
  }).success(function(data){
    console.log("THIS IS OUR LEDGER DATA!")
    console.log(data)
    res.render("userDashboard", {
    //runs a function to see if the user is authenticated - returns true or false
    isAuthenticated: req.isAuthenticated(),
    //this is our data from the DB which we get from deserializing
    user: req.user,
    data: data
    });
  });
});


app.get('/ledger', function(req,res){
  db.ledger.find({where:
    {userID: req.user.id}
  }).success(function(data){
    res.render("userLedger", {
    //runs a function to see if the user is authenticated - returns true or false
    isAuthenticated: req.isAuthenticated(),
    //this is our data from the DB which we get from deserializing
    user: req.user,
    data: data
    });
  });
});

app.get('/add', function(req,res){
  res.render("add", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

app.post('/add', function(req,res){  

  db.ledger.findOrCreate(
    {userID: req.user.id}, 
    {bodBalance: 0},
    {dailyRate: req.user.dailyRate})
  .success(function (ledger, created){
    if(created) {
      // if this user never had any ledger
      ledger.dailyLedger = [req.body.amount];
      db.user.find(req.user.id).success(function(user){
        user.updateAttributes({ curBalance: req.body.amount})
        .success(function() {});
      });      
    }
    else {
      // if has ledger, need to match date of today's date 
      // then do the following push:
      // ledger.dailyLedger.push(req.body.amount);      
       
    };
  });

  res.redirect('/dashboard');

});


app.get('/subtract', function(req,res){
  res.render("subtract", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user
  });
});

// catch-all for 404 errors 
app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});


app.listen(process.env.PORT || 3000, function(){
  console.log('starting server');
})
