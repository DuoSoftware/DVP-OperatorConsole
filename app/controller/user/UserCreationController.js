/**
 * Created by Pawan on 6/5/2018.
 */
opConsoleApp.controller('usercreationController', function ($scope, ngNotify, userProfileServices) {



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

    $scope.collapsedButton = 'New User';
    $scope.userObj={};
    $scope.userObj.role="reportadmin";
    $scope.saveReportUser = function () {

        $scope.userObj.isReportAdmin=true;

        userProfileServices.addReportUser($scope.userObj).then(function (data) {
            if (data.IsSuccess) {
                // $scope.notify('User Saved Successfully', 'success');


                var editedMenus = [];
                editedMenus = [{
                    "menuItem": "AGENTPRODUCTIVITY",//"navigationName": "ARDS_CONFIGURATION",
                    "menuAction": [
                        {
                            delete:	false,
                            read:	true,
                            scope:	"productivity",
                            write:	false
                        },

                        {
                            delete:	false,
                            read:	true,
                            scope:	"ardsresource",
                            write:	false
                        },
                        {
                            scope : "myNavigation",
                            read : true,
                            write : true,
                            delete : true
                        },
                        {
                            scope : "notification",
                            read : true
                        },
                        {
                            scope : "myUserProfile",
                            read : true
                        },
                        {
                            scope : "consolidatedreports",
                            read : true
                        }
                    ]
                },



                    {
                        "menuItem" : "AGENTSUMMERY",
                        "menuAction" : [
                            {
                                "scope" : "cdr",
                                "read" : true
                            }
                        ]
                    },
                    {
                        "menuItem" : "USERDETAIL",
                        "menuAction" : [
                            {
                                "scope" : "consolidatedreports",
                                "read" : true
                            }
                        ]
                    }

                ];

                userProfileServices.AddSelectedNavigationToUser($scope.userObj.mail,"OPERATOR_CONSOLE", editedMenus).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.showAlert("Info", "Info", "AGENT_PRODUCTIVITY" + " Successfully Updated.")
                    }
                    else {
                        if (response.CustomMessage) {
                            $scope.showAlert("Error","error", response.CustomMessage);
                        }
                        else {
                            $scope.showAlert("Error","error", "AGENT_PRODUCTIVITY" + " Failed To Update.");
                        }

                    }

                }, function (error) {
                    $scope.showAlert("Error","error", "Failed to Add Permissions AGENT_PRODUCTIVITY");
                });



            }
            else
            {
                $scope.showAlert("Error","error", "Failed to Create Report User");
            }
        });
    }



});