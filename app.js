var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  yahooFinance = require('yahoo-finance'),
  numeral = require('numeral'),
  app = express();

// Helper function

// takes all ledgers of a user id (stored as array)
// returns an object of arrays storing current value of portfoilo 
// valued at the latest closing date

var getCurPortfolio = function (ledgers, arr, callback) {
  var obj = {ticker: [], quantity: [], price: [], cost: []}, arr = [];

  ledgers.forEach(function(ledger) {
    if (obj.ticker.indexOf(ledger.dataValues.ticker) === -1) {
      obj.ticker.push(ledger.dataValues.ticker);
      obj.quantity.push(ledger.dataValues.quantity);
      obj.cost.push(ledger.dataValues.quantity*ledger.dataValues.price);
    } else {
      obj.quantity[obj.ticker.indexOf(ledger.dataValues.ticker)] += ledger.dataValues.quantity;   
      obj.cost[obj.ticker.indexOf(ledger.dataValues.ticker)] += ledger.dataValues.quantity*ledger.dataValues.price;
    };
  });

  // for (var i = 0; i < obj.ticker.length; i+=1) {
  //   getClosingPrice (obj.ticker[i], function(err, quotes, url, symbol) {
  //     if (!err) {
  //       obj.price.push(quotes[0].close); 
  //       console.log("MYPRICE", obj, i);
  //     } else {
  //       console.log("API call error");
  //     };
  //   });    
  // };

  yahooFinance.snapshot({
      symbols: obj.ticker,
      fields: ['d1', 'l1']
    }, function (err, data, url, fields) {
  
        for (var i = 0; i < obj.ticker.length; i+=1) {
  
          obj.price.push(data[obj.ticker[i]].lastTradePriceOnly);
        }  
        console.log("WOW", arr);
        callback(obj);
    });
   
  

  // console.log("PORTFOLIO OBJECT created", obj, arr);

  // return obj;
};

  // getClosingPrice (obj.ticker, function(err, results) {
  //    console.log("OBJECT FINAL", results);

  //   if (!err) {
  //     for (var i = 0; i < obj.ticker.length; i+=1) {
  //       obj.price.push(results[i].quotes[0].close);
  //     };
  //     console.log("OBJECT FINAL", obj);
  //     return obj;
  //   } else {
  //     console.log("API call error");
  //   };
  // });     


var getClosingPrice = function (ticker, callback) {

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var closeDate;

  if (today.getHours() < 18) {
    dd -= 1;  // before market closing (18:00 cut off assumption) use prev closing date
  };

  if(dd<10) {
      dd='0'+dd;
  }; 

  if(mm<10) {
      mm='0'+mm;
  };

  closeDate = yyyy + '-' + mm + '-' + dd;

  yahooFinance.historical({
    symbol: ticker,
    from: '2014-08-08',
    to: '2014-08-08',
    period: 'd'
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly)
  }, callback);

// API FORMAT
// yahooFinance.historical({
//   symbol: 'AAPL',
//   from: '2012-01-01',
//   to: '2012-12-31',
//   // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly)
// }, function (err, quotes, url, symbol) {
//   //...
// });

};


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
  maxage: 360000 * 1000
  // need to reset to 360000
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


app.get('/summary', function(req,res){
  db.user.find(req.user.id)
  .success(function(data){

    var obj, arr;

    db.ledger.findAll({where: {userId: req.user.id}})
    .success(function(ledgers){
      getCurPortfolio(ledgers, arr, function (result) {
        console.log("INSIDE PASSING OBJECT", obj, arr);

        res.render("summary", {
          //runs a function to see if the user is authenticated - returns true or false
          isAuthenticated: req.isAuthenticated(),
          //this is our data from the DB which we get from deserializing
          user: req.user,
          data: data,
          obj: result,
          arr: arr
        });
      });
    });
  });
});


app.get('/ledger', function(req,res){
  db.ledger.findAll({where:
    {userId: req.user.id}
  }).success(function(data){
    // res.send(data);
    res.render("ledger", {
    //runs a function to see if the user is authenticated - returns true or false
    isAuthenticated: req.isAuthenticated(),
    //this is our data from the DB which we get from deserializing
    user: req.user,
    data: data
    });
  });
});

app.get('/buysell', function(req,res){
  res.render("buysell", {
  //runs a function to see if the user is authenticated - returns true or false
  isAuthenticated: req.isAuthenticated(),
  //this is our data from the DB which we get from deserializing
  user: req.user,
  price: "?",
  ticker: ""
  });
});

app.post('/buysell', function(req,res){  

  var toggle;

  if (req.body.radios === "Buy") {
    toggle = 1;
  } else {
    toggle = -1;
  };

  db.ledger.create({
    ticker: req.body.ticker2,
    quantity: (req.body.quantity * toggle),
    price: req.body.price2,
    userId: req.user.id
  }, ['ticker', 'quantity', 'price', 'userId'])
  .success(function(ledger) {
    console.log(ledger);
  });

  // db.user.cash = req.user.cash - (req.body.quantity * req.body.price2 * toggle);
  // db.user.save().surcess(function(){});
  // db.user.updateAttributes
  // db.save()
  // .success(function(user) {
  //   console.log(user);
  // });

  res.redirect('/summary');

});

app.post('/lookup', function(req,res){  

  getClosingPrice(req.body.ticker, function (err, quotes, url, symbol) {
    if(!err) {    

      res.render('buysell', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        price: quotes[0].close,
        ticker: quotes[0].symbol
      });

    } else {
      console.log("API call error");
    }
  });

});

app.get('/about', function(req,res){
  res.render("about", {
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
