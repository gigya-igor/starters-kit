// The sample code below walks through two server-side routes that should be invoked by your client-side application
// One route leverages Gigya's API Only (without the use of Gigya's screen sets
// The second route creates a user in Gigya first, then presents Gigya's Registration Completion screen in your client-side
// application

// This assumes your client-side application is leveraging Gigya's JS SDK
// This is the server-side code for a NodeJS application using Express and the NodeJS Gigya package

router.get('/notifyLogin', function (req, res, next) { // API ONLY
  // accounts.notifyLogin parameters
  var params = {
    siteUID: '<UNIQUE UID>', // email or # that uniquely identifies the user
    skipValidation: true // need to skip validation when not using Identity management
    // we need to make sure the user is created and we skip validating any mandatory fields
  };
  gigya.accounts.notifyLogin(params) // invoke accounts.notifyLogin API endpoint
  // accounts.notifyLogin will automatically ensure the user exists or creates the user if 
  // the user doesn't exist
    .then(function (loginRes) {
      // DO ERROR HANDLING HERE
      // check the loginRes.errorCode and make sure it is 0
      // accounts.setAccountInfo parameters
      var acctInfoParams = {
        uid: '<UNIQUE UID>', // use the same one as above to make sure that you are updating
        // the same user
        preferences: { terms: { test: { isConsentGranted: true }}} // setting your consent objects
        // You can pass this information in from your client-side based on what the
        // user consented to
        // in addition you should pass all mandatory fields in this call.
        // If you do not include all mandatory fields and pass the cookie back to your client-side app
        // your client-side app will present the "Registration Completion" screen automatically.
        // < the "preferences" paremeter was hardcoded for this example >
      };
      gigya.accounts.setAccountInfo(acctInfoParams) // invoke accounts.setAccountInfo API endpoint
        .then(function (acctInfoRes) {
          // DO ERROR HANDLING HERE
          // check the acctInfoRes.errorCode and make sure it is 0

          // The notifyLogin response contained a cookie 
          // if this is a registered user that will have access to data subject rights then send the
          // cookie to your client side application
          res.cookie(loginRes.sessionInfo.cookieName, loginRes.sessionInfo.cookieValue);
          res.redirect('/'); // redirect the user (optional.. Redirect where they need to go)
        });
    });
});

router.get('/notifyLogin', function (req, res, next) { // USING REGISTRATION COMPLETION SCREEN
  // accounts.notifyLogin parameters
  var params = {
    siteUID: '<UNIQUE UID>', // email or # that uniquely identifies the user
    skipValidation: true // need to skip validation when not using Identity management
    // we need to make sure the user is created and we skip validating any mandatory fields
  };
  gigya.accounts.notifyLogin(params) // invoke accounts.notifyLogin API endpoint
  // accounts.notifyLogin will automatically ensure the user exists or creates the user if 
  // the user doesn't exist
    .then(function (loginRes) {
      // DO ERROR HANDLING HERE
      // check the loginRes.errorCode and make sure it is 0

      // The notifyLogin response contained a cookie 
      // if you plan on using Gigya's "REGISTRATION COMPLETION" screen which contains all of the consent objects
      // you will need to send the  cookie to your client side application
      res.cookie(loginRes.sessionInfo.cookieName, loginRes.sessionInfo.cookieValue);
      res.redirect('/'); // redirect the user (optional.. Redirect where they need to go)
    });
});
