window.addEventListener('load', function() {
    var idToken = aid.toParameterByName('id_token'),
        state = aid.toParameterByName('state');

    if (idToken) {
        new Auth0Lock(aid.auth0.clientId, aid.auth0.domain).getProfile(idToken, onUserProfile);
    }
    setTimeout(function() {
        document.querySelector('.container').style.display = "inline-block";
    }, 3000);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper function section
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function onUserProfile(error, profile) {
        if (!error) {
            localStorage.setItem(aid.html.localStorage.userToken, idToken);
            localStorage.setItem(aid.html.localStorage.profile, JSON.stringify(profile));
            showThePage(state);
        }
    }

    function showThePage(targetUrl) {
        targetUrl = targetUrl || aid.html.context;
        aid.redirectTo(targetUrl);
    }
});
