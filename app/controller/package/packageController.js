/**
 * Created by Heshan.i on 4/6/2017.
 */

(function () {

    opConsoleApp.controller('packageController', function ($scope, ngNotify, $anchorScroll, userService) {
        $anchorScroll();

        $scope.isCollapsed = true;
        $scope.isSubCollapsed = true;
        $scope.collapsedButton = 'New Package';
        $scope.subCollapsButton = '+';
        $scope.tempSpaceLimit = {};
        $scope.packageDetails = [];
        $scope.systemTask = [];
        $scope.searchCriteria = "";
        $scope.packageTitle = 'Create New';

        $scope.packageObj = {
            spaceLimit: [],
            consoleAccessLimit: [
                {
                    accessType: "admin",
                    accessLimit: 0
                },
                {
                    accessType: "supervisor",
                    accessLimit: 0
                },
                {
                    accessType: "agent",
                    accessLimit: 0
                }
            ],
            resources: [
                {
                    resourceName: "DVP-ARDSLiteService",
                    scopes: [
                        {
                            scopeName: "ardsresource",
                            feature: "agent access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "ardsrequest",
                            feature: "request access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "requestmeta",
                            feature: "requestmeta access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "queue",
                            feature: "queue access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "requestserver",
                            feature: "requestserver access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        }
                    ]
                },
                {
                    resourceName: "DVP-ResourceService",
                    scopes: [
                        {
                            scopeName: "attribute",
                            feature: "attribute access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "group",
                            feature: "group access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "ardsresource",
                            feature: "ardsresource access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "resourcetaskattribute",
                            feature: "resourcetaskattribute access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "task",
                            feature: "task access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "productivity",
                            feature: "productivity access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "Shared",
                            feature: "Shared access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        },
                        {
                            scopeName: "taskinfo",
                            feature: "taskinfo access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: -1
                        }
                    ]
                },
                {
                    resourceName: "DVP-SIPUserEndpointService",
                    scopes: [
                        {
                            scopeName: "sipuser",
                            feature: "sipuser access",
                            actions: [
                                "read",
                                "write",
                                "delete"
                            ],
                            limit: 0
                        }
                    ]
                }
            ]
        };


        $scope.notify = function (message, type) {
            ngNotify.set(message, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: type
            });
        };


        //-----------------Internal methods------------------------
        $scope.onClickCollapsed = function (type) {
            if (type && type === 'Update') {
                $scope.packageTitle = 'Update';
            } else {
                $scope.packageTitle = 'Create New';
            }
            $scope.isCollapsed = !$scope.isCollapsed;
            $scope.collapsedButton = $scope.isCollapsed ? 'New Package' : 'Back';
        };

        $scope.onClickSubCollapsed = function () {
            $scope.isSubCollapsed = !$scope.isSubCollapsed;
            $scope.subCollapsButton = $scope.isSubCollapsed ? '+' : '-';
        };

        $scope.addSpaceLimit = function () {
            if ($scope.tempSpaceLimit && $scope.tempSpaceLimit.spaceType) {
                var isSpaceLimitExist = $scope.packageObj.spaceLimit.filter(function (sLimit) {
                    if (sLimit.spaceType === $scope.tempSpaceLimit.spaceType) {
                        return sLimit;
                    }
                });
                if (isSpaceLimitExist && isSpaceLimitExist.length > 0) {
                    $scope.notify('Space Limit Already Added', 'warn');
                } else {
                    $scope.packageObj.spaceLimit.push($scope.tempSpaceLimit);
                    $scope.tempSpaceLimit = {};
                }
            }
        };

        $scope.removeSpaceLimit = function (index) {
            $scope.packageObj.spaceLimit.splice(index, 1);
        };

        $scope.resetForm = function () {
            $scope.packageObj = {
                spaceLimit: [],
                consoleAccessLimit: [
                    {
                        accessType: "admin",
                        accessLimit: 0
                    },
                    {
                        accessType: "supervisor",
                        accessLimit: 0
                    },
                    {
                        accessType: "agent",
                        accessLimit: 0
                    }
                ],
                resources: [
                    {
                        resourceName: "DVP-ARDSLiteService",
                        scopes: [
                            {
                                scopeName: "ardsresource",
                                feature: "agent access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "ardsrequest",
                                feature: "request access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "requestmeta",
                                feature: "requestmeta access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "queue",
                                feature: "queue access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "requestserver",
                                feature: "requestserver access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            }
                        ]
                    },
                    {
                        resourceName: "DVP-ResourceService",
                        scopes: [
                            {
                                scopeName: "attribute",
                                feature: "attribute access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "group",
                                feature: "group access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "ardsresource",
                                feature: "ardsresource access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "resourcetaskattribute",
                                feature: "resourcetaskattribute access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "task",
                                feature: "task access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "productivity",
                                feature: "productivity access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "Shared",
                                feature: "Shared access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            },
                            {
                                scopeName: "taskinfo",
                                feature: "taskinfo access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: -1
                            }
                        ]
                    },
                    {
                        resourceName: "DVP-SIPUserEndpointService",
                        scopes: [
                            {
                                scopeName: "sipuser",
                                feature: "sipuser access",
                                actions: [
                                    "read",
                                    "write",
                                    "delete"
                                ],
                                limit: 0
                            }
                        ]
                    }
                ]
            };
        };

        $scope.cancelForm = function () {
            $scope.resetForm();
            $scope.onClickCollapsed();
        };

        $scope.editPackageData = function (packageData) {
            $scope.packageObj = packageData;
            $scope.onClickCollapsed('Update');
        };


        //-----------------External methods------------------------
        $scope.loadPackageDetails = function () {
            try {
                userService.GetAllPackages().then(function (response) {
                    if (response && response.IsSuccess) {
                        $scope.packageDetails = response.Result;
                    } else {
                        $scope.notify('Load Package Details Failed', 'error');
                    }
                });
            } catch (ex) {
                $scope.notify('Load Package Details Failed', 'error');
            }
        };

         $scope.loadTaskDetails = function () {
             try{
                 userService.GetAllSystemTask().then(function (response) {
                     if(response && response.IsSuccess){
                         $scope.systemTask = response.Result;
                     }else{
                         $scope.notify('Load Task Details Failed', 'error');
                     }
                 });
             }catch(ex){
                 $scope.notify('Load Task Details Failed', 'error');
             }
         };

        $scope.loadPackageDetails();
        $scope.loadTaskDetails();

        $scope.savePackage = function () {
            try {
                var adminAccess = $scope.packageObj.consoleAccessLimit[0].accessLimit? $scope.packageObj.consoleAccessLimit[0].accessLimit : 0;
                var supervisorAccess = $scope.packageObj.consoleAccessLimit[1].accessLimit? $scope.packageObj.consoleAccessLimit[1].accessLimit : 0;
                var agentAccess = $scope.packageObj.consoleAccessLimit[2].accessLimit? $scope.packageObj.consoleAccessLimit[2].accessLimit : 0;

                $scope.packageObj.resources[2].scopes[0].limit = adminAccess + supervisorAccess + agentAccess;

                if ($scope.packageTitle === 'Update') {
                    userService.UpdatePackage($scope.packageObj).then(function (response) {
                        if (response && response.IsSuccess) {
                            $scope.loadPackageDetails();
                            $scope.notify('Update Package Success', 'success');
                            $scope.cancelForm();
                        } else {
                            $scope.notify('Update Package Failed', 'error');
                        }
                    });
                } else {
                    userService.CreateNewPackage($scope.packageObj).then(function (response) {
                        if (response && response.IsSuccess) {
                            $scope.packageDetails.push(response.Result);
                            $scope.notify('Create New Package Success', 'success');
                            $scope.cancelForm();
                        } else {
                            $scope.notify('Create New Package Failed', 'error');
                        }
                    });
                }
            } catch (ex) {
                $scope.notify('Save Package Failed', 'error');
            }
        };

        $scope.removePackage = function (packageData) {
            try {
                userService.RemovePackage(packageData.packageName).then(function (response) {
                    if (response && response.IsSuccess) {
                        $scope.packageDetails.splice($scope.packageDetails.indexOf(packageData), 1);
                        $scope.notify('Remove Package Details Success', 'success');
                    } else {
                        $scope.notify('Remove Package Details Failed', 'error');
                    }
                });
            } catch (ex) {
                $scope.notify('Remove Package Details Failed', 'error');
            }
        };



    });

}());