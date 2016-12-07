// See all available options in the SDK docs
// https://github.com/FamilySearch/fs-js-lite#init-options
var fs = new FamilySearch({

  // You'll need to change this to your own app key.
  appKey: 'a02j000000MZshWAAT',

  // Chrome generates a unique extension ID which is included in the URL so
  // we ask chrome what the proper URL for this page.
  redirectUri: chrome.extension.getURL('index.html'),

  // Saves the access token in a cookie
  saveAccessToken: true
});

// Try to get the code from the query parameter to finish OAuth. We purposefully
// call this on every page load. The SDK checks for the existence of the code in
// the query parameters and only finishes the OAuth process if a code is found.
// Thus our response callback is only fired if a code is present in the URL which
// only occurs when a user is redirected here after starting the OAuth process.
//
// You may want to read more about OAuth from the FamilySearch Authentication Guide.
// https://familysearch.org/developers/docs/guides/authentication
fs.oauthResponse(function(error, response){
  if(!error){
    // When OAuth succeeds we reload the page to get rid of the code in the
    // query params. If it remains and a user reloads the page manually then
    // the app will attempt to finish OAuth again which leads to an error.
    window.location.href = window.location.pathname;
  }
});

// If an access token is already present when the page loads then toggle the
// signed in status.
if(fs.getAccessToken()){
  signedIn();
}

// Begin OAuth when the Sign In button is pressed.
document.getElementById('signin').addEventListener('click', function(){
  fs.oauthRedirect();
});

// Toggle back to the signed out status when the Sign Out button is pressed.
document.getElementById('signout').addEventListener('click', function(){
  fs.deleteAccessToken();
  document.body.classList.add('no-auth');
  document.body.classList.remove('auth');
});

/**
 * Toggles the signed in status and fetches the current user profile for display.
 */
function signedIn(){
  document.body.classList.add('auth');
  document.body.classList.remove('no-auth');
  fs.get('/platform/users/current', function(error, response){
    if(error){
      output(error.message);
    } else {
      output(JSON.stringify(response.data, null, 2));
    }
  });
}

function output(text){
  document.getElementById('output').textContent = text;
}
