/**
 * Created by Veery Team on 6/17/2016.
 */
(function () {
    'use strict';
    opConsoleApp.factory('loginService', Service);

    function Service($http, $auth, localStorageService, jwtHelper, baseUrls) {
        var service = {};
        service.mynavigations = mynavigations;
        service.Login = Login;
        service.clearCookie = clearCookie;
        service.getToken = getToken;
        service.getTokenDecode = getTokenDecode;
        service.Logoff = Logoff;
        service.VerifyPwd = VerifyPwd;
        service.UpdateMyPwd = UpdateMyPwd;
        service.forgetPassword = forgetPassword;
        service.resetPassword = resetPassword;
        service.getUserNavigation = getUserNavigation;
        service.getNavigationAccess = getNavigationAccess;

        return service;
        var mynavigations = {};

        //set cookie
        function setCookie(key, val) {
            localStorageService.set(key, val);
        }

        //get token
        function getToken(appname) {
            //var data = localStorageService.get("@agentConsoleLoginToken");
            //if (data && data.access_token) {
            //    if (!jwtHelper.isTokenExpired(data.access_token)) {
            //        return data.access_token;
            //    }
            //}
            //return undefined;

            var token = $auth.getToken();
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    return token;
                }
            }
            return undefined;
        };

        //check is owner
        function isOwner(appname) {
            var data = localStorageService.get("@agentConsoleLoginToken");
            if (data && data.access_token) {
                if (!jwtHelper.isTokenExpired(data.access_token)) {
                    return data.user_meta.role;
                }
            }
            return undefined;
        };

        //get token decode
        function getTokenDecode() {
            //var data = localStorageService.get("@agentConsoleLoginToken");
            //if (data && data.access_token) {
            //    if (!jwtHelper.isTokenExpired(data.access_token)) {
            //        return jwtHelper.decodeToken(data.access_token);
            //    }
            //}
            //return undefined;

            var token = $auth.getToken();
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    return jwtHelper.decodeToken(token);
                }
            }
            return undefined;
        }

        //remove cookie
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function clearCookie(key) {
            //localStorageService.remove(key);
            $auth.removeToken();
        }

        //logoff
        function Logoff(callback) {
            var decodeToken = getTokenDecode();
            $http.delete(baseUrls.authUrl + '/oauth/token/revoke/' + decodeToken.jti, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            }).success(function (data, status, headers, config) {
                $auth.removeToken();
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }

        // user login
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function Login(parm, callback) {
            $http.post(baseUrls.authUrl + '/oauth/token', {
                grant_type: "password",
                username: parm.userName,
                password: parm.password,
                scope: "all_all profile_veeryaccount write_ardsresource write_notification read_myUserProfile read_productivity profile_veeryaccount resourceid"
            }, {
                headers: {
                    Authorization: 'Basic ' + parm.clientID
                }
            }).success(function (data, status, headers, config) {
                localStorageService.remove("@navigations");
                clearCookie('@agentConsoleLoginToken');
                setCookie('@agentConsoleLoginToken', data);
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }


        function VerifyPwd(pram, callback) {
            $http.post(baseUrls.pwdVerifyUrl, {
                userName: pram.userName,
                password: pram.password,
            }).success(function (data, status, headers, config) {
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }

        function UpdateMyPwd(param, callback) {
            $http.put(baseUrls.userServiceBaseUrl + 'Myprofile/Password', param)
                .success(function (data, status, headers, config) {
                    callback(true, data);
                }).error(function (data, status, headers, config) {
                //login error
                callback(false, data);
            });
        }

        //forget password
        function forgetPassword(email, callback) {
            $http.post(baseUrls.authUrl + "/auth/forget/token", {email: email}).success(function (data, status, headers, config) {
                callback(data.IsSuccess);

            }).error(function (data, status, headers, config) {
                callback(data.IsSuccess);
            });
        };


        function resetPassword(token, password, callback) {
            $http.post(baseUrls.authUrl + "/auth/reset/" + token, {password: password}).success(function (data, status, headers, config) {
                callback(data.IsSuccess);

            }).error(function (data, status, headers, config) {
                callback(data.IsSuccess);
            });
        };

        function getUserNavigation(callback) {
            $http.get(baseUrls.userServiceBaseUrl + "MyAppScopes/MyAppScopes/OPERATOR_CONSOLE").success(function (data, status, headers, config) {
                console.log(data);
                if (data.IsSuccess && data.Result && data.Result.length > 0) {
                    //navigations = data.Result[0];

                    localStorageService.set("@navigations", data.Result[0]);
                    callback(true);
                } else {
                    callback(false);
                }

            }).error(function (data, status, headers, config) {
                callback(false);
            });
        }

        //check my navigation
        //is can access
        function getNavigationAccess(callback) {
            mynavigations = {};
            $http.get(baseUrls.userServiceBaseUrl + "MyAppScopes/MyAppScopes/OPERATOR_CONSOLE").success(function (data, status, headers, config) {
                if (data.IsSuccess && data.Result && data.Result.length > 0) {
                    data.Result[0].menus.forEach(function (item) {
                        mynavigations[item.menuItem] = true;
                    });
                }
                callback(mynavigations);
            }).error(function (data, status, headers, config) {
                callback(mynavigations);
            });
        };


    }
})();


