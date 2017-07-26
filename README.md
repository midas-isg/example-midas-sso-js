# MIDAS SSO example using only JavaScript 

An example of website serving static files using only JavaScript on Node.js with serve, midas-sso and Auth0. 
For live demo, visit https://midas-isg.github.io/example-midas-sso-js/.

## Hook up to midass-sso

This example shows how to hook up to midass-sso and perform an authorization check for the logged in user. 
After user signs up to midas-sso via MIDAS Accounts, the user will automatically get `ISG_USER` role so that the user can access `user.html`. This example checks for a role of `ISG_ADMIN` which user usually won't get and, if the user tries to access the `admin.html` route, redirects the user to the `unauthorized.html`.

## Running the Example on your machine

Install the dependencies.

```bash
npm install -g serve
```

To serve static files, run the below command on the directory example-midas-sso-js.
```bash
serve ..
```

Then open http://localhost:3000/example-midas-sso-js/ in a browser. The behavior should be the same as the [live demo](https://midas-isg.github.io/example-midas-sso-js/).
