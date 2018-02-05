string apiKey = "<YOUR API KEY>";
string secret = "<YOUR SECERT>";

string notifyLoginMethod = "accounts.notifyLogin";

GSRequest notifyLoginRequest = new GSRequest(apiKey, secret, notifyLoginMethod, true);

notifyLoginRequest.setParam("UID", "<USER UID / EMAIL>");
notifyLoginRequest.setParam("skipValidation", "true");

GSResponse notifyLoginResponse = notifyLoginRequest.Send();

if (notifyLoginResponse.GetErrorCode() == 0) {
	string setAcctInfoMethod = "accounts.setAccountInfo";

	GSRequest setAcctInfoRequest = new GSRequest(apiKey, secret, setAcctInfoMethod, true);
	setAcctInfoRequest.setParam("UID", "<USER UID / EMAIL>");
	// "preferences", "{/ policy: {/ isConsentGranted: true }/ }/";
	setAcctInfoRequest.setParam("preferences", "<CONSENT DATA>");

	GSResponse setAcctInfoResponse = setAcctInfoRequest.Send();

	if (setAcctInfoResponse.GetErrorCode() == 0) {
		Console.WriteLine("Creatd User and Set Consent Data.");
	} else {
		Console.WriteLine("Got error on setStatus: {0}", setAcctInfoResponse.GetLog());
	}

} else {
	Console.WriteLine("Got error on setStatus: {0}", notifyLoginResponse.GetLog());
}
