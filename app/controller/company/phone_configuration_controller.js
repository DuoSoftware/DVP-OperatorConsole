/**
 * Created by Rajinda on 06-08-2018.
 */

'use strict';

(function () {
    opConsoleApp.controller('phone_configuration_controller', function ($scope, ngNotify, $anchorScroll, $filter, $q, uiGridConstants, companyInfoServices, sipUserService) {

        $anchorScroll();

        $scope.notify = function (message, type) {
            ngNotify.set(message, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: type
            });
        };

        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 50; // your header height
            return {
                height: (($scope.grid_phone_config_options.data.length + 2) * rowHeight + headerHeight) + "px"
            };
        };

        $scope.grid1Api = {};
        $scope.grid_phone_config_options = {
            enableFiltering: true,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            multiSelect: true,
            modifierKeysToMultiSelect: false,
            noUnselect: false, enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {
                    enableFiltering: true,
                    //width: '60',
                    name: 'Id',
                    field: 'Id',
                    headerTooltip: 'Id',
                    cellClass: 'table-number'
                },
                {
                    enableFiltering: true,
                    //width: '150',
                    name: 'model',
                    field: 'model',
                    headerTooltip: 'model'
                },
                {
                    enableFiltering: true,
                    //width: '150',
                    name: 'mac',
                    field: 'mac',
                    headerTooltip: 'mac',
                    sort: {
                        direction: uiGridConstants.ASC
                    }
                }
                ,
                {
                    enableFiltering: true,
                    //width: '150',
                    name: 'User Name', field: 'configdata.username', headerTooltip: 'User Name', sort: {
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    enableFiltering: true,
                    //width: '150',
                    name: 'domain',
                    field: 'configdata.domain',
                    headerTooltip: 'domain',
                    sort: {
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    enableFiltering: false,
                    //width: '150',
                    name: 'updatedAt',
                    field: 'updatedAt',
                    headerTooltip: 'updatedAt',
                    cellClass: 'table-time',
                    cellTemplate: "<div>{{row.entity.updatedAt| date:'MM/dd/yyyy @ h:mma'}}</div>"
                }
            ],
            data: [],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    if (row.isSelected) {
                        if ($scope.selected_company.value === undefined || $scope.selected_company.value.companyId === "-999") {
                            $scope.notify('Please Select Company To Assign Phone', 'error');
                            row.isSelected = false;
                            return;
                        }

                        sipUserService.reassignIpPhoneToCompany(row.entity.mac,$scope.selected_company.value.companyId).then(function (response) {
                            if(response){
                                $scope.notify('Successfully Assign Phone To Company.', 'success');
                                setTimeout(function() {
                                    var index = $scope.grid_phone_config_options.data.indexOf(row.entity);
                                    $scope.grid_phone_config_options.data.splice(index, 1);
                                }, 1000);
                            }else {
                                $scope.notify('Fail To Assign Phone '+row.entity.mac+' To Company '+$scope.selected_company.value.companyName+'.', 'error');
                                row.isSelected = false;
                            }
                        },function (error) {
                            $scope.notify('Fail To Assign Phone To Company.', 'error');
                            row.isSelected = false;
                        })
                    }
                });
            }
        };


        var getPhoneConfigs = function () {
            return sipUserService.getPhoneConfigs().then(function (response) {
                return response;
            }, function (error) {
                console.error(error);
                $scope.notify('Fail To Get Phone List.', 'error');
                $scope.isTableLoading = false;
                return null;
            })
        };


        var getAllCompanyInfo = function () {
            return companyInfoServices.getAllCompanyDetails().then(function (data) {
                return data;
            }, function (err) {
                console.log(err);
                return null;
            });
        };
        $scope.isTableLoading = false;
        $scope.selected_company = {};
        $scope.company_list = [];
        $scope.loadData = function () {
            $scope.isTableLoading = true;
            $scope.company_list = [];
            $scope.company_list.splice(0, 0, {
                companyId: "-999",
                companyName: "Select"
            });
            $q.all([
                getPhoneConfigs(),
                getAllCompanyInfo()
            ]).then(function (value) {
                if (value && value.length === 2) {
                    $scope.grid_phone_config_options.data = value[0];

                    value[1].Result.map(function (item) {
                        $scope.company_list.push({
                            companyId: item.companyId.toString(),
                            companyName: item.companyName
                        });
                    });


                }
                $scope.isTableLoading = false;
            }, function (err) {
                console.log(err);
                $scope.isTableLoading = false;
            });
        };
        $scope.loadData();

        // backend not support to bulk update
        /*$scope.reassign_phone_to_company = function () {
            var selected_rows = $scope.grid1Api.selection.getSelectedRows();
            if (selected_rows.length == 0 || $scope.selected_company.value === undefined || $scope.selected_company.value.companyId === "-999") {
                $scope.notify('Please Select Company And Phone To Assign', 'error');
                return;
            }
        }*/


    });

}());