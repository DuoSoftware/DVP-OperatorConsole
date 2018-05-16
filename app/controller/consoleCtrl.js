/**
 * Created by damith on 3/31/17.
 */

'use strict';
opConsoleApp.controller('consoleCtrl', function ($scope, $filter, $state, ngNotify,
                                                 userProfileServices,
                                                 loginService,
                                                 subscribeServices, billingservice) {

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });

        /* new PNotify({
         title: title,
         text: content,
         type: type,
         styling: 'bootstrap3',
         animate: {
         animate: true,
         in_class: "bounceIn",
         out_class: "bounceOut"
         }
         });*/
    };

    //get current login user
    //02.get current profile data
    $scope.CurrentProfile = {};
    var loadCurrentProfile = function (username) {
        userProfileServices.getMyProfile().then(function (data) {
            if (data.IsSuccess) {
                $scope.CurrentProfile = data.Result;
                console.log($scope.CurrentProfile);
            }
            else {
                console.log(data);
            }

        }, function (err) {
            console.log(err);
        });
    };
    loadCurrentProfile();

    //go to navigation
    $scope.goToNavigation = function (nav) {
        switch (nav) {
            case 'agentProductivity':
                $state.go('op-console.agent-productivity');
                break;
            case 'agentSummery':
                $state.go('op-console.agent-summery');
                break;
            case 'serverPerformance':
                $state.go('op-console.monitor-server-performance');
                break;
            case 'codecManagement':
                $state.go('op-console.codec-management');
                break;
            case 'trunkConfiguration':
                $state.go('op-console.trunk-configuration');
                break;
            case 'voxboneNumberConfiguration':
                $state.go('op-console.voxbone-number-configuration');
                break;
            case 'companyInfo':
                $state.go('op-console.all-company-information');
                break;
            case 'package':
                $state.go('op-console.package');
                break;
            case 'unit':
                $state.go('op-console.unit');
                break;
            case 'createCompany':
                $state.go('op-console.create-company');
                break;
        }
    };

    //logout
    $scope.isLogingOut = false;
    $scope.logOut = function () {
        $scope.isLogingOut = true;
        loginService.Logoff(function () {
            $scope.isLogingOut = false;
            $state.go('sign-in');
        });
    };

    //-------------------- Notifications ------------------------ \\
    $scope.unredNotifications = 0;
    $scope.notifications = [];
    $scope.OnMessage = function (data) {

        if (data.From) {
            data.avatar = "assets/img/profileAvatar.png";
            if ($scope.users && $scope.users.length) {
                var sender = $filter('filter')($scope.users, {username: data.From})[0];
                console.log("Sender ", sender);

                if (sender.avatar) {
                    data.avatar = sender.avatar;
                }
            }

            data.resv_time = new Date();
            data.read = false;


            $scope.$apply(function () {
                $scope.notifications.push(data);
                $scope.unredNotifications = $scope.notifications.length;
            });

            var audio = new Audio("assets/sounds/notification-1.mp3");
            audio.play();
        }
    };

    subscribeServices.SubscribeEvents(function (event, data) {
        switch (event) {

            /*case 'agent_connected':

             $scope.agentConnected(data);

             break;

             case 'agent_disconnected':

             $scope.agentDisconnected(data);

             break;

             case 'agent_found':

             $scope.agentFound(data);

             break;

             case 'agent_rejected':
             $scope.agentRejected(data);
             break;

             case 'todo_reminder':

             $scope.todoRemind(data);

             break;

             case 'notice':

             $scope.OnMessage(data);

             break;
             */
            case 'notice_message':

                $scope.OnMessage(data);

                break;
        }
    });

    $scope.MakeNotificationObject = function (data) {
        var callbackObj = JSON.parse(data.Callback);

        callbackObj.From = data.From;
        callbackObj.TopicKey = callbackObj.Topic;
        callbackObj.messageType = callbackObj.MessageType;
        callbackObj.isPersistMessage = true;
        callbackObj.PersistMessageID = data.id;
        return callbackObj;

    };

    $scope.isSocketRegistered = false;
    var isPersistanceLoaded = false;
    $scope.veeryNotification = function () {

        subscribeServices.connectSubscribeServer(function (isConnected) {

            if (isConnected) {
                $scope.isSocketRegistered = true;
                /*$('#regNotificationLoading').addClass('display-none').removeClass('display-block');
                 $('#regNotification').addClass('display-block').removeClass('display-none');*/

                // load notification message
                if (!isPersistanceLoaded) {
                    subscribeServices.GetPersistenceMessages().then(function (response) {

                        if (response.data.IsSuccess) {
                            isPersistanceLoaded = true;

                            angular.forEach(response.data.Result, function (value) {

                                var valObj = JSON.parse(value.Callback);

                                if (valObj.eventName == "todo_reminder") {
                                    //$scope.todoRemind($scope.MakeNotificationObject(value));
                                }
                                else {
                                    $scope.OnMessage($scope.MakeNotificationObject(value));
                                }


                            });

                        }


                    }, function (err) {

                    });
                }

            } else {
                $scope.isSocketRegistered = false;
                $scope.showAlert("Registration failed", "error", "Disconnected from notifications, Please re-register");
            }
        });
    };

    $scope.veeryNotification();

    $scope.checkAndRegister = function () {

        if (!$scope.isSocketRegistered) {
            $('#regNotification').addClass('display-none').removeClass('display-block');
            $('#regNotificationLoading').addClass('display-block').removeClass('display-none');
            $scope.isLoadingNotifiReg = true;
            $scope.veeryNotification();
        }
    };
    //-------------------- Notifications End------------------------ \\

    $scope.vToken = "";
    $scope.validateToken = function (token) {
        billingservice.ValidateToken(token).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.showAlert("Validate Token", "success", response.CustomMessage);
                $scope.vToken = "";
            } else {
                $scope.showAlert("Validate Token", "error", response.CustomMessage);
                console.log(response);
            }
        }, function (err) {
            console.log(err);
            $scope.showAlert("Validate Token", "error", "Fail To Validate Token or Communication Error.");
        });
    };


    loginService.getNavigationAccess(function (result) {

        /*// Kasun_Wijeratne_14_JAN_2018
        if (Object.keys(result).length > 5) {
            $rootScope.allUsers = true;
            // $state.go('console.dashboard');
        } else {
            if (Object.keys(result).length != 0) {
                $rootScope.freshUser = true;
                $rootScope.allUsers = false;
            }
        }*/
        // Kasun_Wijeratne_14_JAN_2018 - END

        $scope.accessNavigation = result;
        //if($scope.accessNavigation.BASIC INFO)
    });
});



opConsoleApp.directive('datepicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});