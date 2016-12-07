# fs-browser-extension-sample

Example of using the [FamilySearch JS lite sdk](https://github.com/FamilySearch/fs-js-lite)
in a browser extension. This focuses on showing how you can authenticate with
the FamilySearch API via OAuth 2 within an extension.

## Install

1. [Download the ZIP file from GitHub](http://stackoverflow.com/a/18583977).
2. Unzip the package.
3. Load the contents as an [unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked).
4. Click the extension icon to the right of the address bar and copy the URL of the page that is opened.
5. [Register your app](https://familysearch.org/developers/docs/guides/gs1-register-app) in the FamilySearch developer's center using the URL from step 4 as the redirect URI.
6. Update `index.js` with your new app key.

## Explanation

[Authenticating with the FamilySearch API](https://familysearch.org/developers/docs/guides/authentication)
is done via OAuth 2 which typically requires registering a redirect URI. That
redirect URI must be a page that is under your control. In the case of a Chrome
extension our redirect URI will be a URL of the format
`chrome-extension://{EXTENSION_ID}/{path-to-page}` that points to an HTML page
bundled with the browser.

The page is loaded by clicking on the extensions icon that is displayed to the
right of the URL bar. When that icon is clicked, `background.js` is loaded and
run. That script says that the `index.html` page should be opened in a new tab
when the icons clicked, and thus the page is opened.

When `index.html` loads the first time the user isn't authenticated so we ask
them to sign in. Clicking the "Sign In" button initiates the OAuth process by
sending the user to the FamilySearch.org sign in screen.

When the user finished signing in with FamilySearch they will be sent back to
the page specified by the redirect URI. In this case it's the same page the user
started at: `index.html`. The URL will include a `code` query parameter that is
required for finishing the OAuth process. We extract the code from the URL and
exchange for an access token which completes the OAuth process.

The user is now authenticated so we fetch and display their profile.

### manifest.json

```js
{
  "manifest_version": 2,

  "name": "FamilySearch Browser Extension Sample",
  "description": "An example of using the FamilySearch API in a browser extension.",
  "version": "1.0",

  // This sets up background.js as an event page. That's where we specify what
  // happens when the extension icon is clicked.
  // https://developer.chrome.com/extensions/event_pages
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },

  // We didn't change the default title just for kicks. We did that because the
  // browser_action block is required for us to set it's click behavior in
  // background.js. Without it we would get an undefined error when trying to
  // access chrome.browserAction. Alternatively you could specify default_icon.
  // It was easier for us to specify a default_title than it was to generate an
  // icon for a sample app.
  "browser_action": {
    "default_title": "FamilySearch"
  },

  // This line allows our index page to be loaded by external resources. In our
  // case it allows it to be loaded by a redirect from the FamilySearch.org
  // login screen. Without it the redirect would silently fail, leaving the user
  // with no clue about what happened. The only indication of a failure would be
  // an error message in the developer console.
  "web_accessible_resources": [
    "index.html"
  ]
}
```

Read more about the [manifest file format](https://developer.chrome.com/extensions/manifest).
