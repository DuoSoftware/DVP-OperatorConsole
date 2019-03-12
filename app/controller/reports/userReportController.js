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


    var data = [];
    var paginationOptions = {
        pageNumber: 1,
        pageSize: 100,
        sort: null
    };
    $scope.isTableLoading = false;

    $scope.getUserDetails = function (isSearch){
    if(isSearch){
        data =[];
        paginationOptions.pageNumber = 1;
        paginationOptions.pageSize = 100;
    }
    $scope.isTableLoading = true;
        businessUnitInfoServices.getConsolidatedUsersForBU('all', paginationOptions.pageNumber, paginationOptions.pageSize).then(function (response) {
            $scope.isCurrPageEmpty = response.Result.length === 0;
            if (response.Result) {
                var promises = response.Result.map(function (user) {

                if (user.user_meta !== undefined) {  //ignore wrong data

                    var companyName = '';
                    $scope.companyFilterData.some(function (el) {
                        if (el.companyId === user.company) {
                            companyName = el.companyName;
                            return true;
                        }
                    });

                    if ($scope.companyFilter !== undefined && $scope.companyFilter.length > 0) {

                        var companyValid = $scope.companyFilter.some(function (el) {
                            if (el.companyId === user.company) {
                                companyName = el.companyName;
                                return true;
                            }
                        });

                        if (!companyValid) {
                            return;
                        }
                    }

                    var sipAccount = '-';
                    if (user.veeryaccount != null) {
                        sipAccount = user.veeryaccount.contact;
                    }

                    var groupName = '-';
                    var buName = '-';

                    if (user.group !== undefined){
                        groupName = user.group.name;
                        buName = user.group.businessUnit;
                    }

                    var userobj = {
                        company: companyName,
                        buName: buName,
                        groupName: groupName,
                        username: user.username,
                        createdDate: user.created_at,
                        updatedDate: user.updated_at,
                        role: user.user_meta.role,
                        sipAccount: sipAccount,
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

                $q.all(promises).then(
                    function (res) {
                        if(res) {

                            if(data.length < paginationOptions.pageSize && !$scope.isCurrPageEmpty){
                                paginationOptions.pageNumber ++;
                                $scope.getUserDetails();
                            }
                            else {
                                $scope.gridQOptions.data = data;
                                $scope.isTableLoading = false;
                            }
                        }
                    }
                );
            }

        });

    };

    $scope.userList = [];

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


    $scope.getTableHeight = function() {
        var rowHeight = 30;
        var headerHeight = 50; // your header height
        var height = 300 + headerHeight;
        // if ($scope.grid1Api.core.getVisibleRows().length * rowHeight > 200){
        //     height = $scope.grid1Api.core.getVisibleRows().length * rowHeight + headerHeight;
        // }
        return "height:" + height + "px !important;"
    };

    $scope.gridQOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableExpandable: true,
        //useCustomPagination: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false, enableHorizontalScrollbar: true,
        // paginationPageSizes: [100, 200, 300, 400],
        //paginationPageSize: 100,
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
            $scope.isCurrPageEmpty = false;
            // gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) { // total number of records can be found this can be used
            //     data = [];
            //     //paginationOptions.pageNumber = pageNumber;
            //     paginationOptions.pageSize = pageSize;
            //     // $scope.grid1Api = gridApi;
            //     getPage();
            // });
            gridApi.core.on.scrollEnd($scope, function (row) {
                if (row.y.percentage > 0.95 && !$scope.isCurrPageEmpty) { // if vertical scroll bar reaches 80% this triggers
                    paginationOptions.pageNumber++;
                    $scope.getUserDetails(false);
                }
            });
        }
    };

});