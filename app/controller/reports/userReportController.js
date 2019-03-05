/**
 * Created by Marlon on 3/2/2019.
 */


opConsoleApp.controller("userReportController", function ($scope, $anchorScroll, $filter, $q, ngNotify, uiGridConstants, userProfileServices, companyInfoServices, businessUnitInfoServices) {
    $anchorScroll();

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });
    };




    $scope.clear = function () {
        $scope.startDate = null;
    };

    companyInfoServices.getAllCompanyDetails().then(function(response){
        if(response.Result) {
            $scope.companyFilterData = response.Result.map(function(item){
                return {
                    companyID: item.companyId,
                    companyName: item.companyName
                };
            });
        }
        console.log($scope.companyFilterData);
    });

    businessUnitInfoServices.getAllBUDetails().then(function (response){
        if(response.Result){
            $scope.buFilterData = response.Result.map(function (item){
                return{
                    buId: item.buId,
                    buName: item.buName
                };

            });
        }

    });


    $scope.userList = [];

    userProfileServices.getUserCount().then(function (rowCount) {
        var pageSize = 20;
        var pagecount = Math.ceil(rowCount / pageSize);

        var methodList = [];

        for (var i = 1; i <= pagecount; i++) {
            methodList.push(userProfileServices.getUsersWithPaging(i,pageSize));
        }


        $q.all(methodList).then(function (resolveData) {
            if (resolveData) {
                resolveData.map(function (response) {

                    response.map(function (item) {

                        $scope.userList.push(item);

                    });


                });

            }


        }).catch(function (err) {
            loginService.isCheckResponse(err);
            var errMsg = "Error occurred while getting user list";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);


        });



    }, function (err) {
        loginService.isCheckResponse(err);
        var errMsg = "Error occurred while getting user list";
        if (err.statusText) {
            errMsg = err.statusText;
        }
        $scope.showAlert('Error', 'error', errMsg);



    });

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
                return emptyArr;
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
                return emptyArr;
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
                return emptyArr;
            }
        }

    };



    $scope.getTableHeight = function () {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridQOptions.data.length + 2) * rowHeight + headerHeight) + "px"
        };
    };


    $scope.gridQOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [
             {
                enableFiltering: true,
                width: '60',
                name: 'Company',
                field: 'Company',
                headerTooltip: 'Company',
                cellClass: 'table-number'
            },
            {
                enableFiltering: true,
                width: '150',
                name: 'CompanyName',
                field: 'CompanyName',
                headerTooltip: 'Company Name'
            },
            {
                enableFiltering: false,
                width: '60',
                name: 'AgentId',
                field: 'Agent',
                headerTooltip: 'Agent ID',
                cellClass: 'table-number'
            },
            {
                enableFiltering: true,
                width: '150', name: 'AgentName', field: 'AgentName', headerTooltip: 'Agent Name', sort: {
                    direction: uiGridConstants.ASC
                }
            },
            {
                enableFiltering: false,
                width: '150',
                name: 'Date',
                field: 'Date',
                headerTooltip: 'Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.Date| date:'MM/dd/yyyy'}}</div>"
            }, {
                enableFiltering: false,
                width: '150',
                name: 'LoginTime',
                field: 'LoginTime',
                headerTooltip: 'LoginTime',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.LoginTime| date:'MM/dd/yyyy @ h:mma'}}</div>"
            },
            {
                enableFiltering: false,
                width: '60',
                name: 'TotalCallsInbound',
                field: 'TotalCallsInbound',
                headerTooltip: 'TotalCallsInbound',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '60',
                name: 'TotalCallsOutbound',
                field: 'TotalCallsOutbound',
                headerTooltip: 'TotalCallsOutbound',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '60',
                name: 'TotalAnswered',
                field: 'TotalAnswered',
                headerTooltip: 'TotalAnswered',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '60',
                name: 'TotalAnsweredOutbound',
                field: 'TotalAnsweredOutbound',
                headerTooltip: 'TotalAnsweredOutbound',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '60',
                name: 'TotalHoldInbound',
                field: 'TotalHoldInbound',
                headerTooltip: 'TotalHoldInbound',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '60',
                name: 'TotalHoldOutbound',
                field: 'TotalHoldOutbound',
                headerTooltip: 'TotalHoldOutbound',
                cellClass: 'table-number'
            },
            {
                enableFiltering: false, width: '80',
                name: 'StaffTime',
                field: 'StaffTime',
                headerTooltip: 'StaffTime',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.StaffTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'InboundTime',
                field: 'InboundTime',
                headerTooltip: 'InboundTime',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.InboundTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'OutboundTime',
                field: 'OutboundTime',
                headerTooltip: 'OutboundTime',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.OutboundTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'IdleTimeInbound',
                field: 'IdleTimeInbound',
                headerTooltip: 'IdleTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.IdleTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'IdleTimeOutbound',
                field: 'IdleTimeOutbound',
                headerTooltip: 'IdleTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.IdleTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'IdleTimeOffline',
                field: 'IdleTimeOffline',
                headerTooltip: 'IdleTimeOffline',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.IdleTimeOffline|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'TalkTimeInbound',
                field: 'TalkTimeInbound',
                headerTooltip: 'TalkTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.TalkTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'TalkTimeOutbound',
                field: 'TalkTimeOutbound',
                headerTooltip: 'TalkTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.TalkTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'TotalHoldTimeInbound',
                field: 'TotalHoldTimeInbound',
                headerTooltip: 'TotalHoldTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.TotalHoldTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'TotalHoldTimeOutbound',
                field: 'TotalHoldTimeOutbound',
                headerTooltip: 'TotalHoldTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.TotalHoldTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AfterWorkTimeInbound',
                field: 'AfterWorkTimeInbound',
                headerTooltip: 'AfterWorkTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AfterWorkTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AfterWorkTimeOutbound',
                field: 'AfterWorkTimeOutbound',
                headerTooltip: 'AfterWorkTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AfterWorkTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'BreakTime',
                field: 'BreakTime',
                headerTooltip: 'BreakTime',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.BreakTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AverageHandlingTimeInbound',
                field: 'AverageHandlingTimeInbound',
                headerTooltip: 'AverageHandlingTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AverageHandlingTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AverageHandlingTimeOutbound',
                field: 'AverageHandlingTimeOutbound',
                headerTooltip: 'AverageHandlingTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AverageHandlingTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AvgTalkTimeInbound',
                field: 'AvgTalkTimeInbound',
                headerTooltip: 'AvgTalkTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AvgTalkTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AvgTalkTimeOutbound',
                field: 'AvgTalkTimeOutbound',
                headerTooltip: 'AvgTalkTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AvgTalkTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AvgHoldTimeInbound',
                field: 'AvgHoldTimeInbound',
                headerTooltip: 'AvgHoldTimeInbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AvgHoldTimeInbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                enableFiltering: false, width: '80',
                name: 'AvgHoldTimeOutbound',
                field: 'AvgHoldTimeOutbound',
                headerTooltip: 'AvgHoldTimeOutbound',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AvgHoldTimeOutbound|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            }
        ],
        data: [],
        onRegisterApi: function (gridApi) {
            //$scope.grid1Api = gridApi;
        }
    };
    $scope.companyFilter = {};
    $scope.isTableLoading = true;


    // $scope.Agents = [];
    // $scope.comapnyWiseAgents = [];




});