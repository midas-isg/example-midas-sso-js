window.addEventListener('load', function() {
    if (aid.doesUserLogInLocally()) {
        showThePage();
    } else {
        aid.redirectTo(aid.toAbsoluteUrl('/login.html?targetUrl=' + window.location.href));
    }

    setInterval(aid.logoutIfLoggedOutGloballyByAnotherApp, 5000);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper function section
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function showThePage() {
        var locationPath = window.location.pathname;
        document.body.style.display = 'inline';
        routeByUserRole(locationPath.replace(aid.html.context, ''));

        function routeByUserRole(route) {
            var profile = JSON.parse(localStorage.getItem(aid.html.localStorage.profile));
            switch (route) {
                case "":
                case "/":
                    showLandingPageComponents();
                    break;
                case aid.html.route.user:
                    secureRoute(aid.midas.role.isgUser);
                    break;
                case aid.html.route.admin:
                    secureRoute(aid.midas.role.isgAdmin);
                    break;
            }

            function showLandingPageComponents() {
                var baseUrl = aid.toAbsoluteUrl();
                hide(document.getElementById('btn-login'));
                showCommonComponentsInAllPages();
                showProfile(profile);
                if (aid.hasRole(profile, aid.midas.role.isgAdmin)) {
                    rewireAndShowButtonById('btn-go-admin', baseUrl + aid.html.route.admin);
                }
                if (aid.hasRole(profile, aid.midas.role.isgUser)) {
                    rewireAndShowButtonById('btn-go-user', baseUrl + aid.html.route.user);
                }
            }

            function secureRoute(requiredRole) {
                if (!aid.hasRole(profile, requiredRole)) {
                    aid.redirectTo('unauthorized.html');
                } else{
                    showCommonComponentsInAllPages();
                }
            }

            function showCommonComponentsInAllPages() {
                var buttonLogout = document.getElementById('btn-logout');
                show(buttonLogout);
                addClickListener(buttonLogout, aid.logout);
                show(document.querySelector('.container'));
                document.getElementById('nickname').textContent = profile.nickname;
            }

            function rewireAndShowButtonById(id, route) {
                var button = document.getElementById(id);
                button.href = route;
                show(button);
            }
        }
    }

    function showProfile(profile) {
        var htmlNode,
            i;

        document.getElementById('profile-name').innerHTML = profile.name;
        document.getElementById('profile-picture').src = profile.picture;

        for(i = 0; i < profile.roles.length; i++) {
            htmlNode = document.createElement("li");
            htmlNode.innerHTML = profile.roles[i];
            document.getElementById('profile-roles').appendChild(htmlNode);
        }
        show(document.getElementById("profile"));
    }

    function hide(element) {
        element.style.display = "none";
    }

    function show(element) {
        element.style.display = "inline-block";
    }

    function addClickListener(button, callback) {
        if (button) {
            button.addEventListener('click', callback);
        }
    }
});
