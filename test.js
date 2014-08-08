var  yahooFinance = require('yahoo-finance');

// yahooFinance.snapshot({
//   symbols: [
//     'AAPL',
//     'GOOG'
//   ],
//   from: 2014-08-07,
//   to: 2014-08-07
// }, function (err, results) {
// 	console.log(results);
// 	});

yahooFinance.snapshot({
  symbols: [
    'AAPL',
    'GOOG'
  ],
  fields: ['d1', 'l1']
}, function (err, data, url, fields) {

		console.log(data);
	});