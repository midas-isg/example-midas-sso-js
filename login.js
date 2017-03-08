window.addEventListener('load', function() {
    var auth0 = aid.auth0.instance;
    var targetUrl = aid.toParameterByName('targetUrl') || aid.toAbsoluteUrl("/");

    if (aid.doesUserLogInLocally()) {
        aid.redirectTo(targetUrl);
    } else {
        auth0.getSSOData(onSsoDataHandlingAuthentication);
    }
    setTimeout(function() {
        document.querySelector('.container').style.display = "inline-block";
    }, 3000);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper function section
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onSsoDataHandlingAuthentication(err, data) {
        var hasSsoSession = !err && data && data.sso;
        if (hasSsoSession)
            redirectToAuth0ForSso();
        else
            aid.redirectTo(aid.toMidasAccountsUrl('/sso'));

        function redirectToAuth0ForSso() {
            auth0.signin({
                connection: data.lastUsedConnection.name,
                state: targetUrl,
                scope: 'openid name picture roles'
            });
        }
    }
});
