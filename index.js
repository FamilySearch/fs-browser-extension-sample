var fs = new FamilySearch({
  appKey: 'a02j000000MZshWAAT',
  redirectUri: chrome.extension.getURL('index.html'),
  saveAccessToken: true
});

fs.oauthResponse(function(error, response){
  if(!error){
    window.location.href = window.location.pathname;
  }
});

if(fs.getAccessToken()){
  signedIn();
}

document.getElementById('signin').addEventListener('click', function(){
  fs.oauthRedirect();
});

document.getElementById('signout').addEventListener('click', function(){
  fs.deleteAccessToken();
  document.body.classList.add('no-auth');
  document.body.classList.remove('auth');
});

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
