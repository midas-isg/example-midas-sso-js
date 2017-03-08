var aid = (function() {
    var AUTH0_DOMAIN='midas-dev-sso.auth0.com';
    var AUTH0_CLIENT_ID='9SdYbDLnKMXKQi6Dt13Mi3eu07iQitFx';
    var AUTH0_CALLBACK='/callback.html';

    var MIDAS_ACCOUNTS_URL = 'https://betaweb.rods.pitt.edu/hub-alpha';

    var HTML_CONTEXT = '/example-midas-sso-js';
    var HTML_LOCAL_STORAGE_PROFILE = 'profile';
    var HTML_LOCAL_STORAGE_USER_TOKEN = 'userToken';

    var auth0 = newAuth0();

    return {
        auth0: {
            domain: AUTH0_DOMAIN,
            clientId: AUTH0_CLIENT_ID,
            instance: auth0
        },
        doesUserLogInLocally: doesUserLogInLocally,
        hasRole: hasRole,
        html: {
            context: HTML_CONTEXT,
            localStorage:{
                userToken: HTML_LOCAL_STORAGE_USER_TOKEN,
                profile: HTML_LOCAL_STORAGE_PROFILE
            },
            route: {
                admin: "/admin.html",
                user: "/user.html"
            }
        },
        logout: logout,
        logoutIfLoggedOutGloballyByAnotherApp: logoutIfLoggedOutGloballyByAnotherApp,
        midas: {
            role: {
                isgAdmin: 'ISG_ADMIN',
                isgUser: 'ISG_USER'
            }
        },
        redirectTo: redirectTo,
        toAbsoluteUrl: toAbsoluteUrl,
        toMidasAccountsUrl: toMidasAccountsUrl,
        toParameterByName: toParameterByName
    };

    function doesUserLogInLocally() {
        return !!(localStorage.getItem(HTML_LOCAL_STORAGE_USER_TOKEN));
    }

    function logout() {
        localStorage.removeItem(HTML_LOCAL_STORAGE_USER_TOKEN);
        localStorage.removeItem(HTML_LOCAL_STORAGE_PROFILE);
        redirectTo(toMidasAccountsUrl('/signoff', 'Logged off successfully'));
    }

    function logoutIfLoggedOutGloballyByAnotherApp() {
        if (! doesUserLogInLocally()) return;
        auth0.getSSOData(onSsoDataHandlingLogoutIfNoSsoSession);

        function onSsoDataHandlingLogoutIfNoSsoSession(err, data) {
            var hasSsoSession = !err && data && data.sso;
            if (!hasSsoSession)
                logout();
        }
    }

    function redirectTo(href) {
        window.location.href = href;
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
        return window.location.href.split(HTML_CONTEXT)[0] + HTML_CONTEXT + path;
    }

    function toMidasAccountsUrl(endpoint, message, title) {
        title = title || "JS Example";
        message = message || "Please login to use the services";
        return MIDAS_ACCOUNTS_URL + endpoint + '?returnToUrl='
            + encodeURIComponent(window.location) + '&title=' + title + '&message=' + message;
    }

    function hasRole(profile, role) {
        return !!(profile &&
        profile.app_metadata &&
        profile.app_metadata.roles &&
        profile.app_metadata.roles.indexOf(role) > -1);
    }

    function toParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        url = url || window.location.href;
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
})();