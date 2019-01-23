/**
 * Created by Waruna on 1/16/2018.
 */


opConsoleApp.controller("agentProductivityController", function ($scope, $anchorScroll, $filter, $q, ngNotify, uiGridConstants, resourceProductivityService) {
    $anchorScroll();

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });
    };

    $scope.today = function () {
        $scope.endDate = new Date();
        $scope.startDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.startDate = null;
    };

    $scope.dateOptionsStartDate = {
        formatYear: 'yy',
        maxDate: new Date(),
        startingDay: 1
    };

    $scope.openStartDate = function () {
        $scope.popupStartDate.opened = true;
        $scope.dateOptionsEndDate.minDate = $scope.startDate;
    };

    $scope.popupStartDate = {
        opened: false
    };


    $scope.dateOptionsEndDate = {
        formatYear: 'yy',
        maxDate: new Date(),
        minDate: $scope.startDate,
        startingDay: 1
    };

    $scope.openEndDate = function () {
        $scope.popupEndDate.opened = true;
        $scope.dateOptionsEndDate.minDate = $scope.startDate;
    };

    $scope.popupEndDate = {
        opened: false
    };


    var TimeFromatter = function (seconds) {

        var timeStr = '00:00:00';
        if (seconds > 0) {
            var durationObj = moment.duration(seconds * 1000);

            if (durationObj) {
                var tempDays = 0;
                if (durationObj._data.years > 0) {
                    tempDays = tempDays + durationObj._data.years * 365;
                }
                if (durationObj._data.months > 0) {
                    tempDays = tempDays + durationObj._data.months * 30;
                }
                if (durationObj._data.days > 0) {
                    tempDays = tempDays + durationObj._data.days;
                }

                if (tempDays > 0) {

                    timeStr = tempDays + 'd ' + ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                } else {

                    timeStr = ("00" + durationObj._data.hours).slice(-2) + ':' + ("00" + durationObj._data.minutes).slice(-2) + ':' + ("00" + durationObj._data.seconds).slice(-2);
                    //(durationObj._data.hours<=9)?('0'+durationObj._data.hours):durationObj._data.hours + ':' + (durationObj._data.minutes<=9)?('0'+durationObj._data.minutes):durationObj._data.minutes  + ':' + (durationObj._data.seconds<=9)?('0'+durationObj._data.seconds):durationObj._data.seconds;
                }
            }
        }
        return timeStr;
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
    $scope.agentFilter = {};
    $scope.isTableLoading = true;
    $scope.getAgentSummary = function () {
        $scope.gridQOptions.data = [];
        $scope.isTableLoading = true;
        var resId = null;
        if ($scope.agentFilter && $scope.agentFilter.value && $scope.agentFilter.value.ResourceId != "-999") {
            resId = $scope.uniqAgentNameWithResourceIds[$scope.agentFilter.value.ResourceName].ResourceIds;
        }
        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var queryStartDate = $filter('date')($scope.startDate, "yyyy-MM-dd") + ' 00:00:00' + momentTz;
        var queryEndDate = $filter('date')($scope.endDate, "yyyy-MM-dd") + ' 23:59:59' + momentTz;
        resourceProductivityService.ConsolidatedDailySummary(queryStartDate, queryEndDate, resId).then(function (response) {
            if (response) {
                response.map(function (item) {
                    if (item && item.Summary) {
                        item.Summary.map(function (data) {

                            var ids = $filter('filter')($scope.comapnyWiseAgents, {ResourceId: data.Agent}, true);
                            if (ids.length > 0) {
                                data.AgentName = ids[0].ResourceName;
                            }
                            $scope.gridQOptions.data.push(data);
                        })
                    }
                });

            }
            $scope.isTableLoading = false;
        }, function (error) {
            $scope.isTableLoading = false;
        });
    };

    $scope.Agents = [];
    $scope.comapnyWiseAgents = [];
    $scope.uniqAgentNameWithResourceIds = {};
    var getConsolidateAgentDetails = function () {
        $scope.isTableLoading = true;
        resourceProductivityService.GetConsolidateAgentDetails().then(function (response) {
            if (response) {

                $scope.uniqAgentNameWithResourceIds = {};
                $scope.comapnyWiseAgents = response.map(function (item) {
                    if ($scope.uniqAgentNameWithResourceIds[item.ResourceName]) {
                        $scope.uniqAgentNameWithResourceIds[item.ResourceName].ResourceIds.push(item.ResourceId.toString())
                    }
                    else {
                        $scope.uniqAgentNameWithResourceIds[item.ResourceName] = {
                            ResourceIds: [item.ResourceId.toString()],
                            ResourceName: item.ResourceName
                        };
                        $scope.Agents.push({
                            ResourceId: item.ResourceId.toString(),
                            ResourceName: item.ResourceName
                        })
                    }
                    return {
                        ResourceId: item.ResourceId.toString(),
                        ResourceName: item.ResourceName
                    };
                });
                /*
                                $scope.Agents = response.map(function (item) {
                                    return {
                                        ResourceId: item.ResourceId.toString(),
                                        ResourceName: item.ResourceName
                                    }
                                });*/
                $scope.Agents.splice(0, 0, {
                    ResourceId: "-999",
                    ResourceName: "Select"
                });

            }
            $scope.isTableLoading = false;
        }, function (error) {
            $scope.isTableLoading = false;
            $scope.showAlert("Productivity", "error", "Fail to Get Agent List");
        })
    };
    getConsolidateAgentDetails();

    $scope.querySearch = function (query) {
        var emptyArr = [];
        if (query === "*" || query === "") {
            if ($scope.Agents) {
                return $scope.Agents;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.Agents) {
                return $scope.Agents.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.ResourceName) {
                        return item.ResourceName.match(regEx);
                    }
                    else {
                        return false;
                    }

                });
            }
            else {
                return emptyArr;
            }
        }

    };

    $scope.disableDownload = false;

    $scope.getAgentSummaryCSV = function () {
        $scope.disableDownload = true;
        $scope.isTableLoading = true;
        $scope.DownloadFileName = 'AGENT_PRODUCTIVITY_SUMMARY_' + $filter('date')($scope.startDate, "yyyy-MM-dd") + '_' + $filter('date')($scope.endDate, "yyyy-MM-dd");
        var deferred = $q.defer();
        var agentSummaryList = [];

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var queryStartDate = $filter('date')($scope.startDate, "yyyy-MM-dd") + ' 00:00:00' + momentTz;
        var queryEndDate = $filter('date')($scope.endDate, "yyyy-MM-dd") + ' 23:59:59' + momentTz;


        var resId = null;
        if ($scope.agentFilter && $scope.agentFilter.value && $scope.agentFilter.value.ResourceId != "-999") {
            resId = $scope.uniqAgentNameWithResourceIds[$scope.agentFilter.value.ResourceName].ResourceIds;
        }

        resourceProductivityService.ConsolidatedDailySummary(queryStartDate, queryEndDate, resId).then(function (response) {


            if (!response) {
                console.log("Queue Summary loading failed ");
                deferred.reject(agentSummaryList);
            }
            else {

                var summaryData = response;

                var totalStaffTime = 0;
                var totalInboundTime = 0;
                var totalOutboundTime = 0;
                var totalInboundIdleTime = 0;
                var totalOutboundIdleTime = 0;
                var totalOfflineIdleTime = 0;
                var totalInboundAfterWorkTime = 0;
                var totalOutboundAfterWorkTime = 0;
                var totalInboundAverageHandlingTime = 0;
                var totalOutboundAverageHandlingTime = 0;
                var totalInboundAverageTalkTime = 0;
                var totalOutboundAverageTalkTime = 0;
                var totalInboundTalkTime = 0;
                var totalOutboundTalkTime = 0;
                var totalInboundHoldTime = 0;
                var totalOutboundHoldTime = 0;
                var totalBreakTime = 0;
                var totalAnswered = 0;
                var totalCallsInb = 0;
                var totalCallsOut = 0;
                var totalInboundHold = 0;
                var totalOutboundHold = 0;
                var totalInboundAvgHoldTime = 0;
                var totalOutboundAvgHoldTime = 0;
                var totalOutboundAnswered = 0;

                var count = 0;

                for (var i = 0; i < summaryData.length; i++) {
                    // main objects

                    for (var j = 0; j < summaryData[i].Summary.length; j++) {
                        totalStaffTime = totalStaffTime + summaryData[i].Summary[j].StaffTime;
                        totalInboundTime = totalInboundTime + summaryData[i].Summary[j].InboundTime;
                        totalOutboundTime = totalOutboundTime + summaryData[i].Summary[j].OutboundTime;
                        totalInboundIdleTime = totalInboundIdleTime + summaryData[i].Summary[j].IdleTimeInbound;
                        totalOutboundIdleTime = totalOutboundIdleTime + summaryData[i].Summary[j].IdleTimeOutbound;
                        totalOfflineIdleTime = totalOfflineIdleTime + summaryData[i].Summary[j].IdleTimeOffline;
                        totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeInbound;
                        totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeOutbound;
                        totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeInbound;
                        totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeOutbound;
                        totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeInbound;
                        totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeOutbound;
                        totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j].TalkTimeInbound;
                        totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j].TalkTimeOutbound;
                        totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeInbound;
                        totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeOutbound;
                        totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;
                        totalAnswered = totalAnswered + summaryData[i].Summary[j].TotalAnswered;
                        totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                        totalCallsInb = totalCallsInb + summaryData[i].Summary[j].TotalCallsInbound;
                        totalCallsOut = totalCallsOut + summaryData[i].Summary[j].TotalCallsOutbound;
                        totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                        totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                        totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                        totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

                        count++;

                        summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        summaryData[i].Summary[j].LoginTime = moment(summaryData[i].Summary[j].LoginTime).format("YYYY-MM-DD HH:mm:ss");
                        summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");


                        agentSummaryList.push(summaryData[i].Summary[j]);
                    }
                }

                for (var k = 0; k < agentSummaryList.length; k++) {
                    for (var l = 0; l < $scope.comapnyWiseAgents.length; l++) {
                        if ($scope.comapnyWiseAgents[l].ResourceId == agentSummaryList[k].Agent) {
                            agentSummaryList[k].AgentName = $scope.comapnyWiseAgents[l].ResourceName;

                        }
                    }
                }

                var total =
                    {
                        AgentName: 'Total',
                        Date: 'N/A',
                        LoginTime: 'N/A',
                        StaffTime: TimeFromatter(totalStaffTime, "HH:mm:ss"),
                        InboundTime: TimeFromatter(totalInboundTime, "HH:mm:ss"),
                        OutboundTime: TimeFromatter(totalOutboundTime, "HH:mm:ss"),
                        IdleTimeInbound: TimeFromatter(totalInboundIdleTime, "HH:mm:ss"),
                        IdleTimeOutbound: TimeFromatter(totalOutboundIdleTime, "HH:mm:ss"),
                        IdleTimeOffline: TimeFromatter(totalOfflineIdleTime, "HH:mm:ss"),
                        AfterWorkTimeInbound: TimeFromatter(totalInboundAfterWorkTime, "HH:mm:ss"),
                        AfterWorkTimeOutbound: TimeFromatter(totalOutboundAfterWorkTime, "HH:mm:ss"),
                        AverageHandlingTimeInbound: '00:00:00',
                        AverageHandlingTimeOutbound: '00:00:00',
                        AvgTalkTimeInbound: '00:00:00',
                        AvgTalkTimeOutbound: '00:00:00',
                        TalkTimeInbound: TimeFromatter(totalInboundTalkTime, "HH:mm:ss"),
                        TalkTimeOutbound: TimeFromatter(totalOutboundTalkTime, "HH:mm:ss"),
                        TotalHoldTimeInbound: TimeFromatter(totalInboundHoldTime, "HH:mm:ss"),
                        TotalHoldTimeOutbound: TimeFromatter(totalOutboundHoldTime, "HH:mm:ss"),
                        BreakTime: TimeFromatter(totalBreakTime, "HH:mm:ss"),
                        TotalAnswered: totalAnswered,
                        TotalCallsInbound: totalCallsInb,
                        TotalCallsOutbound: totalCallsOut,
                        TotalAnsweredOutbound: totalOutboundAnswered,
                        TotalHoldInbound: totalInboundHold,
                        TotalHoldOutbound: totalOutboundHold,
                        AvgHoldTimeInbound: '00:00:00',
                        AvgHoldTimeOutbound: '00:00:00'
                    };

                if (count > 0) {
                    total.AverageHandlingTimeInbound = TimeFromatter(Math.round(totalInboundAverageHandlingTime / count), "HH:mm:ss");
                    total.AverageHandlingTimeOutbound = TimeFromatter(Math.round(totalOutboundAverageHandlingTime / count), "HH:mm:ss");
                    total.AvgTalkTimeInbound = TimeFromatter(Math.round(totalInboundAverageTalkTime / count), "HH:mm:ss");
                    total.AvgTalkTimeOutbound = TimeFromatter(Math.round(totalOutboundAverageTalkTime / count), "HH:mm:ss");
                    total.AvgHoldTimeInbound = TimeFromatter(Math.round(totalInboundAvgHoldTime / count), "HH:mm:ss");
                    total.AvgHoldTimeOutbound = TimeFromatter(Math.round(totalOutboundAvgHoldTime / count), "HH:mm:ss");
                }
                else {
                    total.AverageHandlingTimeInbound = TimeFromatter(totalInboundAverageHandlingTime, "HH:mm:ss");
                    total.AverageHandlingTimeOutbound = TimeFromatter(totalOutboundAverageHandlingTime, "HH:mm:ss");
                    total.AvgTalkTimeInbound = TimeFromatter(totalInboundAverageTalkTime, "HH:mm:ss");
                    total.AvgTalkTimeOutbound = TimeFromatter(totalOutboundAverageTalkTime, "HH:mm:ss");
                    total.AvgHoldTimeInbound = TimeFromatter(totalInboundAvgHoldTime, "HH:mm:ss");
                    total.AvgHoldTimeOutbound = TimeFromatter(totalOutboundAvgHoldTime, "HH:mm:ss");
                }

                agentSummaryList.push(total);
                //$scope.AgentDetailsAssignToSummery();
                deferred.resolve(agentSummaryList);
            }

            $scope.disableDownload = false;
            $scope.isTableLoading = false;


        }, function (error) {
            $scope.disableDownload = false;
            $scope.isTableLoading = false;
            console.log("Error in Queue Summary loading ", error);
            deferred.reject(agentSummaryList);
        });

        return deferred.promise;
    };
});