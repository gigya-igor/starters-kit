// This example uses the Express Framework for routing
var express = require('express');
var router = express.Router();

// Including the JWS library that will use Gigya's public key to verify a user's JWT.
// Find more information here: https://www.npmjs.com/package/jws-jwk
var jws = require('jws-jwk');

// Including the Gigya NodeJS Package
var Gigya = require('gigya').Gigya;

// Configuring the Gigya Package with required parameters
// 
var apiKey = '[YOUR API KEY HERE]';
var apiDC = '[YOUR DATA CENTER HERE]';
var apiSecret = '[YOUR SECRET KEY HERE';
// Initiate the Gigya package with above parameters
var gigya = new Gigya(apiKey, apiDC, apiSecret);

router.post('/verifyJWT', function (req, res, next) {
	// Assuming the client-side application sent us a user's JWT
	var jwt = req.body.jwt;
	// Gigya getJWTPublicKey API Call
	gigya.accounts.getJWTPublicKey({
		apiKey: '[YOUR API KEY HERE]'
	})
		.then(function (publicKeyRes) {
			// the response for the getJWTPublicKey API call will contain the following (in JSON):
			/*
				kty: key type
				alg: algorithm to be used with this key
				use: describes how to use the key (to encrypt data, or verify a signature)
				kid: key ID
				n: the modulus
				e: the exponent
			*/
			// we use the getJWTPublicKey response to verify the JWT that was passed in by the user.
			if (jws.verify(jwt, publicKeyRes)) {
				// if the JWS library is able to verify the token then we send a positive response
				// Prior to responding we would do any logic required here after verifying the user's JWT
				res.send('VALID JWT');
			} else {
				// If the JWS library is unable to verify the token then we send a negative response
				res.send('INVALID JWT');
			};
		});
});

module.exports = router;
