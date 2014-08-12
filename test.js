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

var getClosingPrice = function (ticker, callback) {

  yahooFinance.historical({
    symbol: ticker,
    from: '2014-08-07',
    to: '2014-08-07',
    period: 'd'
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly)
  }, callback);

};


getClosingPrice('YHOO', function (err, quotes, url, symbol) {
  console.log('quotes', quotes);
});

//   yahooFinance.historical({
//     symbol: 'YHOO',
//     from: '2014-08-07',
//     to: '2014-08-07',
//     period: 'd'
//     // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly)
//   }, function (err, quotes, url, symbol) {
//   console.log('quotes', quotes);
// });