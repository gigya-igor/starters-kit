/* 
	Invite additional users using server-side API calls to the Gigya platforms
	This example assumes that a client-side form has sent a POST request with user information of the user we wish to create / invite.
	At a high level:
	 1. Parse the client-side submitted form data for the user to be invited
	 2. Call Gigya's 'accounts.initRegistration' endpoint to retrieve a registration token (regToken)
	 3. Call Gigya's 'accounts.register' endpoint along with the user data of the user to be invited, as well as the regToken from above
	 4. Call Gigya's 'accounts.resetPassword' endpoint along with the invited user's email address to have Gigya send a reset password email along with a token which
	    enables the user to reset / create a password

	NOTE: This example does not perform error handling to ensure we handle HTTP errors or Gigya response errors.

	Igor Krougovoi
	May 1, 2018
*/

router.post('/invite', function (req, res, next) {
	// Parsing the POSTED user data and storing it in a variable.
	var regParams = {
		email: req.body.email, // Assuming the client-side form posted an email address of the user to be invited
		password: "Secure!@" + Date.now(), // Creating a temporary / dummy password
		profile: {
			firstName: req.body.fname, // Assuming the client-side form posted a first name of the user to be invited
			lastName: req.body.lname, // Assuming the client-side form posted a last name of the user to be invited
			work: {
				company: req.body.organization // Assuming the client-side form posted the company of the user to be invited
			}
		}
	};
	// Creating the URL for the HTTP request to Gigya's 'initRegistration' API endpoint. Note: you must include the Gigya API key and Gigya Secret key when making server-side API calls
	// the 'initRegistration' endpoint responds with a Registration Token which must be used whenever registering a user.
	var initRegUrl = "https://accounts.us1.gigya.com/accounts.initRegistration?apiKey=" + encodeURIComponent([YOUR API KEY]) + "&secret=" + encodeURIComponent([YOUR SECRET KEY]);
	// GET request to Gigya's 'initRegistration' endpoint
	https.get(initRegUrl, function (initRes) {
		var initData = "";
		// parsing response data as Gigya responds
		initRes.on('data', function (chunk) {
			initData += chunk;
		});
		// Gigya's response finishes
		initRes.on('end', function () {
			// MISSING ERROR HANDLING
			// parse the 'initRegistration' JSON response
			initData = JSON.parse(initData);
			// Creating the URL for the HTTP request to Gigya's 'register' API endpoint. Note: you must include the Gigya API key and Gigya Secret key when making server-side API calls
			// We are also including the invited user's profile data from the variable created on line 3
			// We are also stating that this call should NOT 'finalizeRegistration' (i.e. passing in "FALSE")
			// as we need to give the invited user the opportunity to consent to any documents after they reset their password and login for the first time
			// In addition to user data we are also passing in the 'regToken' returned from the 'initRegistration' API endpoint
			var regUrl = "https://accounts.us1.gigya.com/accounts.register?apiKey=" + encodeURIComponent([YOUR API KEY]) + "&secret=" + encodeURIComponent([YOUR SECRET KEY]) +
			"&email=" + encodeURIComponent(regParams.email) + "&password=" + encodeURIComponent(regParams.password) +
			"&profile=" + encodeURIComponent(JSON.stringify(regParams.profile)) + "&regToken=" + encodeURIComponent(initData.regToken) +
			"&finalizeRegistration=" + encodeURIComponent("false");
			// GET request to Gigya's 'register' endpoint
			https.get(regUrl, function (regRes) {
				var regData = "";
				// parsing response data as Gigya responds
				regRes.on('data', function (chunk) {
					regData += chunk;
				});
				// Gigya's response finishes
				regRes.on('end', function () {
					// MISSING ERROR HANDLING
					// parse the 'register' JSON response:
					regData = JSON.parse(regData);
					// Creating the URL for the HTTP request to Gigya's 'resetPassword' API endpoint. Note: you must include the Gigya API key and Gigya Secret key when making server-side API calls
					// After creating the invited User within Gigya's repository, we are now sending the user a 'forgot password' email in order to give them the opportunity to create a password
					// include the invited user's email address so Gigya knows which user to send the forgot password email to.
					var resetUrl = "https://accounts.us1.gigya.com/accounts.resetPassword?apiKey=" + encodeURIComponent([YOUR API KEY]) + "&secret=" + encodeURIComponent([YOUR SECRET KEY]) +
					"&loginID=" + encodeURIComponent(regParams.email) + "&email=" + encodeURIComponent(regParams.email);
					// GET request to Gigya's 'resetPassword' endpoint
					https.get(resetUrl, function (resetRes) {
						var resetData = "";
						// parsing response data as Gigya responds
						resetRes.on('data', function (chunk) {
							resetData += chunk;
						});
						// Gigya's response finishes
						resetRes.on('end', function () {
							// MISSING ERROR HANDLING
							// parse the 'resetPassword' JSON response:
							resetData = JSON.parse(resetData);
							// Redirec the user's browser back to where they posted the invite form
							// Alternatively, respond with a JSON message if this was performed via an AJAX call or from a single-page application (SPA)
							res.redirect('/');
						});
					});
				});
			});
		});
	});
});
