/**
 * Created by Marlon on 3/2/2019.
 */


opConsoleApp.controller("userReportController", function ($scope, $anchorScroll, $filter, $q, $uibModal, ngNotify, uiGridConstants, userProfileServices, companyInfoServices, businessUnitInfoServices) {
    $anchorScroll();

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });
    };


    companyInfoServices.getAllCompanyDetails().then(function (response) {
        if (response.Result) {
            $scope.companyFilterData = response.Result.map(function (item) {
                return {
                    companyId: item.companyId,
                    companyName: item.companyName
                };
            });
        }
    });

    userProfileServices.getConsolidatedUserGroups().then(function (response) {
        if (response.Result) {
            $scope.userGroupData = response.Result.map(function (item) {
                return {
                    groupId: item._id,
                    groupName: item.name
                };
            });
        }
    });

    var data = [];
    var process =  function(item) {
        var deferred = $q.defer();
        businessUnitInfoServices.getConsolidatedUsersForBU(item.unitName).then(function (response) {
            if (response.Result) {

                response.Result.map(function (user) {
                    if (user.user_meta !== undefined) {  //ignore wrong data

                        var companyName = '';
                        $scope.companyFilterData.some(function (el) {
                            if (el.companyId === item.company) {
                                companyName = el.companyName;
                                return true;
                            }
                        });

                        var groupName = '-';
                        $scope.userGroupData.some(function (el) {
                            if (el.groupId === user.group) {
                                groupName = el.groupName;
                                return true;
                            }
                        });

                        if($scope.companyFilter !== undefined && $scope.companyFilter.length > 0){

                            var companyValid = $scope.companyFilter.some(function (el) {
                                return el.companyId === user.company;
                            });

                            if(!companyValid){
                                return false;
                            }
                        }

                        if (user.veeryaccount === undefined){
                            user.veeryaccount = {};
                            user.veeryaccount.contact = '-';
                        }

                        var userobj = {
                                        company: companyName,
                                        buName: item.unitName,
                                        groupName: groupName,
                                        username: user.username,
                                        createdDate: user.created_at,
                                        updatedDate: user.updated_at,
                                        role: user.user_meta.role,
                                        sipAccount: user.veeryaccount.contact,
                                        userScopes: user.user_scopes
                                    };
                        if ($scope.roleFilter !== undefined && $scope.roleFilter.length > 0) {
                            $scope.roleFilter.some(function (el) {
                                if (el.role === user.user_meta.role) {
                                    data.push(userobj);
                                }
                            });

                        }
                        else {
                            data.push(userobj);
                        }
                }
                });
                deferred.resolve(true);
            }
            else{
                deferred.resolve(false);
            }

        });
        return deferred.promise;
    };

    $scope.isTableLoading = false;

    $scope.getUserDetails = function (){
    $scope.isTableLoading = true;
        data = [];
        businessUnitInfoServices.getConsolidatedBusinessUnits().then(function (response) {
            if (response.Result) {

                var promises = response.Result.map(function (item) {
                    if($scope.companyFilter === undefined || $scope.companyFilter.length === 0){
                        return process(item);
                    }
                    else{
                        var companyMatched = $scope.companyFilter.some(function (el) {
                            return el.companyId === item.company;
                        });

                        if(companyMatched){
                            return process(item);
                        }
                    }
                    });

                $q.all(promises).then(
                    function (res) {
                        if(res) {
                            $scope.gridQOptions.data = data;
                            $scope.isTableLoading = false;
                        }
                    }
                );

            }});

    };

    $scope.userList = [];

    // userProfileServices.getUserCount().then(function (rowCount) {
    //     var pageSize = 20;
    //     var pagecount = Math.ceil(rowCount / pageSize);
    //
    //     var methodList = [];
    //
    //     for (var i = 1; i <= pagecount; i++) {
    //         methodList.push(userProfileServices.getUsersWithPaging(i,pageSize));
    //     }
    //
    //
    //     $q.all(methodList).then(function (resolveData) {
    //         if (resolveData) {
    //             resolveData.map(function (response) {
    //
    //                 response.map(function (item) {
    //
    //                     $scope.userList.push(item);
    //
    //                 });
    //
    //
    //             });
    //
    //         }
    //
    //
    //     }).catch(function (err) {
    //         loginService.isCheckResponse(err);
    //         var errMsg = "Error occurred while getting user list";
    //         if (err.statusText) {
    //             errMsg = err.statusText;
    //         }
    //         $scope.showAlert('Error', 'error', errMsg);
    //
    //
    //     });
    //
    //
    //
    // }, function (err) {
    //     loginService.isCheckResponse(err);
    //     var errMsg = "Error occurred while getting user list";
    //     if (err.statusText) {
    //         errMsg = err.statusText;
    //     }
    //     $scope.showAlert('Error', 'error', errMsg);
    //
    //
    //
    // });

    $scope.querySearchUsers = function (query) {
        if (query === "*" || query === "") {
            if ($scope.userList) {
                return $scope.userList;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.userList) {
                var filteredArr = $scope.userList.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.username) {
                        return item.username.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.querySearchCompanies = function (query) {
        if (query === "*" || query === "") {
            if ($scope.companyFilterData) {
                return $scope.companyFilterData;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.companyFilterData) {
                var filteredArr = $scope.companyFilterData.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.companyName) {
                        return item.companyName.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };
    $scope.roleFilterData = [{'role':'admin'},{'role':'agent'},{'role':'supervisor'}];

    $scope.querySearchRoles = function (query) {
        if (query === "*" || query === "") {
            if ($scope.roleFilterData) {
                return $scope.roleFilterData;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.roleFilterData) {
                var filteredArr = $scope.roleFilterData.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.role) {
                        return item.role.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.querySearchBUs = function (query) {
        if (query === "*" || query === "") {
            if ($scope.buFilterData) {
                return $scope.buFilterData;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.buFilterData) {
                var filteredArr = $scope.buFilterData.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.b) {
                        return item.buName.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };

    $scope.showMessage= function (scopes) {
        $scope.userScopesArr = scopes.sort(function(a, b) {
            if (a.scope.toUpperCase() < b.scope.toUpperCase()) {
                return -1;
            }
            if (a.scope.toUpperCase() > b.scope.toUpperCase()) {
                return 1;
            }

            // if names are equal
            return 0;
        });
        //modal show
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: "app/views/reports/partials/scopeTemplate.html",
            size: 'md',
            scope: $scope
        });
    };

    $scope.getTableHeight = function () {
        var rowHeight = 30; // row height
        var headerHeight = 50; // header height
        return {
            height: (($scope.gridQOptions.data.length + 2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.gridQOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableExpandable: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false, enableHorizontalScrollbar: true,
        columnDefs: [
            {
                enableFiltering: true,
                width: '120',
                name: 'Company Name',
                field: 'company',
                grouping: { groupPriority: 1 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0
                },
                headerTooltip: 'Company Name'
            },
            {
                enableFiltering: true,
                width: '120',
                name: 'Business Unit',
                field: 'buName',
                grouping: { groupPriority: 2 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 1
                },
                headerTooltip: 'Business Unit'
            },
            {
                enableFiltering: false,
                width: '70',
                name: 'Role ',
                field: 'role',
                grouping: { groupPriority: 3 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 2
                },
                headerTooltip: 'Role'
            },
            {
                enableFiltering: false,
                width: '100',
                name: 'User Group ',
                field: 'groupName',
                headerTooltip: 'User Group',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 3
                },
            },
             {
                enableFiltering: true,
                width: '120',
                name: 'User',
                field: 'username',
                headerTooltip: 'User',
                sort: {
                     direction: uiGridConstants.ASC,
                     priority: 4
                 },
            },
            {
                enableFiltering: true,
                width: '120',
                name: 'SIP Account',
                field: 'sipAccount',
                headerTooltip: 'SIP Account'
            },
            {
                enableFiltering: false,
                width: '100',
                name: 'Created Date',
                field: 'createdDate',
                headerTooltip: 'Created Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.createdDate| date:'MM/dd/yyyy'}}</div>"
            }, {
                enableFiltering: false,
                width: '100',
                name: 'Updated Date',
                field: 'updatedDate',
                headerTooltip: 'Updated Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.updatedDate| date:'MM/dd/yyyy'}}</div>"
            }, {
                enableFiltering: false,
                width: '120',
                name: 'User Scopes',
                field: 'userScopes',
                headerTooltip: 'User Scopes',
                cellTemplate : '<div style="text-align:center;"><button ng-click="grid.appScope.showMessage(row.entity.userScopes)">View</button></div>'
            }

        ],
        data: [],
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };

});