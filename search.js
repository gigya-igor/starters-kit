// This example uses the Express Framework for routing
var express = require('express');
var router = express.Router();

// Including the Gigya NodeJS Package
var Gigya = require('gigya').Gigya;

// Configuring the Gigya Package with required parameters
// 
var apiKey = '[YOUR API KEY HERE]';
var apiDC = '[YOUR DATA CENTER HERE]';
var apiSecret = '[YOUR SECRET KEY HERE';
// Initiate the Gigya package with above parameters
var gigya = new Gigya(apiKey, apiDC, apiSecret);

router.post('/search', function (req, res, next) {
	// Assuming someone is sending us an email address
	// We set the email address to the 'email' variable
	var email = req.body.email;
	// Gigya Search API call
	gigya.accounts.search({
		// accounts.search API call requires a 'query' parameter which uses a SQL-like format
		// Here we are searching through our accounts for an account with the email that was passed in
		query: 'select * from accounts where email = "' + email + '"'
	})
		.then(function (searchRes) {
			// After the accounts.search API call responds we respond to the call with the results
			// NOTE: the response from Gigya is in JSON, we parse it into text before sending it back to our client-side application
			res.send(JSON.stringify(searchRes));
		});
});

module.exports = router;
