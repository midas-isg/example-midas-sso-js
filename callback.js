window.addEventListener('load', function() {
    var auth0 = newAuth0();
    handleCallbackFromAuth0(toAuthResultFromLocationHash());
    setTimeout(function() {
        document.querySelector('.container').style.display = "inline-block";
    }, 1000);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper function section
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function handleCallbackFromAuth0(authResult) {
        if (authResult.idToken){
            new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN).getProfile(authResult.idToken, onUserProfile);
        }

        function onUserProfile(error, profile) {
            if (! error) {
                localStorage.setItem(KEY_LOCAL_STORAGE_USER_TOKEN, authResult.idToken);
                localStorage.setItem(KEY_LOCAL_STORAGE_PROFILE, JSON.stringify(profile));
                showThePage(authResult.state);
            }
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

    function showThePage(targetUrl) {
        targetUrl = targetUrl || CONTEXT;
        redirectTo(targetUrl);
    }


    function toAuthResultFromLocationHash() {
        return {
            idToken: getParameterByName('id_token'),
            state: getParameterByName('state')
        };
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
