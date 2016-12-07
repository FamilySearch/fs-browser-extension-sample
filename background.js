// Open the index.html page when a user clicks the icon
chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.create({
    url: chrome.extension.getURL('index.html')
  });
});
