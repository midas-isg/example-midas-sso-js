window.addEventListener('load', function() {
    var auth0 = newAuth0();
    var targetUrl = getParameterByName('targetUrl') || toAbsoluteUrl("/");

    if (doesUserLogInLocally()) {
        redirectTo(targetUrl);
    } else {
        auth0.getSSOData(onSsoDataHandlingAuthentication);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper function section
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onSsoDataHandlingAuthentication(err, data) {
        var hasSsoSession = !err && data && data.sso;
        if (hasSsoSession)
            redirectToAuth0ForSso();
        else
            redirectTo(toMidasAccountsUrl('/sso'));

        function redirectToAuth0ForSso() {
            auth0.signin({
                connection: data.lastUsedConnection.name,
                state: targetUrl,
                scope: 'openid name picture roles'
            });
        }
    }

    function newAuth0() {
        return new Auth0({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            callbackURL: toAbsoluteUrl(AUTH0_CALLBACK),
            callbackOnLocationHash: true
        });
    }

    function toAbsoluteUrl(path) {
        path = path || "";
        return window.location.href.split(CONTEXT)[0] + CONTEXT + path;
    }

    function doesUserLogInLocally() {
        return !! (localStorage.getItem(KEY_LOCAL_STORAGE_USER_TOKEN));
    }

    function toMidasAccountsUrl(endpoint, message, title) {
        title = title || "JS Example";
        message = message || "Please login to use the services";
        return MIDAS_ACCOUNTS_URL + endpoint + '?returnToUrl='
            + encodeURIComponent(window.location) + '&title=' + title + '&message=' + message;
    }

    function redirectTo(href) {
        window.location.href = href;
    }

    function getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        url = url || window.location.href;
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});
