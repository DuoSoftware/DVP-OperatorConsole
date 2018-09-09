'use strict';
opConsoleApp.controller('ipPhoneController', function ($scope, $uibModal, $filter, $q, authService, sipUserService, companyInfoServices, ngNotify) {


    $scope.phoneDetails = [];


    $scope.notify = function (message, type) {
        ngNotify.set(message, {
            position: 'top',
            sticky: false,
            duration: 3000,
            type: type
        });
    };

    $scope.addNew = function () {
        $scope.isCheckList = false;
        $scope.phoneDetails.push({
            'mac': "",
            'manufacturer': "",
            'model': "",
            'selected': false,
            'CompanyId': $scope.clientCompany.companyId
        });
    };
    $scope.remove = function () {
        angular.forEach($scope.phoneDetails, function (data, index) {
            if (data.selected) {
                $scope.phoneDetails.splice(index);
            }

        });
        if ($scope.phoneDetails.length < 1) {
            $scope.phoneDetails.push({
                'mac': "",
                'manufacturer': "",
                'model': "",
                'selected': false
            });
        }
    };

    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
            $scope.isCheckList = true;
        } else {
            $scope.selectedAll = false;
            $scope.isCheckList = false;
        }
        angular.forEach($scope.phoneDetails, function (phoneDetail) {
            phoneDetail.selected = $scope.selectedAll;
        });
    };
    $scope.selected = function () {
        console.log($scope.phoneDetails);
        $scope.phoneDetails.forEach(function (t, number) {
            if (t.selected) {
                $scope.isCheckList = true;
                return true;
            }
            $scope.isCheckList = false;
        })
    };

    $scope.submit = function () {
        $scope.isLoadingCompany = true;
        var obj = new Object();
        obj.company = $scope.clientCompany.companyId;
        obj.phonedetails = $scope.phoneDetails.map(function (value) {
            value.CompanyId = obj.company;
            return value;
        });
        var jsonString = JSON.stringify(obj);
        sipUserService.postCompanyPhoneList(jsonString).then(function (res) {
            if (res.IsSuccess) {
                $scope.notify('Successfully Saved', 'success');

            } else {
                $scope.notify('Fail To Save IP Phone Config', 'error');
            }
            $scope.isLoadingCompany = false;
        }, function (err) {
            console.error(err);
            $scope.notify('Fail To Save IP Phone Config', 'error');
            $scope.isLoadingCompany = false;
        });

    };
    $scope.submitbulk = function (ip_phone) {
        if(!(ip_phone&&ip_phone.model&&ip_phone.mac&&ip_phone.manufacturer)){
            $scope.notify('Please Select Required Field', 'error');
            return;
        }
        $scope.isLoadingCompany = true;
        var obj = new Object();
        obj.company = $scope.clientCompany.companyId;
        obj.phonedetails = $scope.data.reduce(function (result, item) {
            if (item[ip_phone.mac]) {
                var conf = {
                    'mac': item[ip_phone.mac],
                    'manufacturer': ip_phone.manufacturer,
                    'model': ip_phone.model,
                    'selected': false,
                    'CompanyId': $scope.clientCompany.companyId
                };
                result.push(conf);
            }
            return result;
        }, []);

        var jsonString = JSON.stringify(obj);

        sipUserService.postCompanyPhoneList(jsonString).then(function (res) {
            if (res.IsSuccess) {
                $scope.notify('Success', 'success');

            } else {
                $scope.notify('error', 'error');
            }
            $scope.isLoadingCompany = false;
        }, function (err) {
            console.error(err);
            $scope.notify('Fail To Save IP Phone Config', 'error');
            $scope.isLoadingCompany = false;
        });

    };
    var mySpecialLookupFunction = function (value, index) {
        var headerType = typeof value;
        if (headerType.toLowerCase() !== 'string') {
            return {name: 'Undefined Column ' + index};
        } else {
            return {name: value};
        }
    };
    $scope.headerData = [];
    $scope.gridOptions = {
        enableGridMenu: false,
        enableSorting: true,
        data: 'data',
        importerDataAddCallback: function (grid, newObjects) {
            $scope.data = newObjects;
        },
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        importerProcessHeaders: function (hData, headerArray) {
            var myHeaderColumns = [];
            var thisCol;

            headerArray.forEach(function (value, index) {

                thisCol = mySpecialLookupFunction(value, index);
                if (myHeaderColumns.indexOf(thisCol.name) === -1) {
                    myHeaderColumns.push(thisCol.name);
                    $scope.headerData.push({name: thisCol.name, index: index});
                } else {
                    // $scope.showAlert('Campaign Number Upload', errMsg, 'error');
                }
            });
            return myHeaderColumns;
        }
    };
    var fileChooser;
    var handleFileSelect = function (event) {
        $scope.headerData = [];
        var target = event.srcElement || event.target;
        $scope.target = target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
            $scope.gridApi.importer.importFile(fileObject);
            //target.form.reset();
        }
    };

    $scope.bulk = function () {
        fileChooser = document.querySelectorAll('.file-chooser');
        if (fileChooser.length !== 1) {
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        } else {
            fileChooser[0].addEventListener('change', handleFileSelect, false);
        }
    };


    $scope.getTableHeight = function () {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridOptions.data.length + 2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.companyData = {};
    $scope.companyFilteredList = [];
    $scope.isLoadingCompany = false;
    $scope.models = {};
    $scope.manufacturers = [];
    $scope.clientCompany = null;
    $scope.companyList = [];
    var onLoadCompany = function () {
        return companyInfoServices.getAllCompanyDetails().then(function (compListResp) {
            return compListResp;
        }, function (err) {
            console.error(err);
            $scope.notify('Fail To Load Company List.', 'error');
            return null;
        });
    };

    var getPhoneTemplates = function () {
        return sipUserService.getPhoneTemplates().then(function (res) {
            return res;
        }, function (err) {
            console.error(err);
            $scope.notify('Fail To Load Phone Templates.', 'error');
            return null;
        });
    };
    $scope.phonesearchByCompanyName = function () {
        $scope.isLoadingCompany = true;
        $scope.companyFilteredList = [];
        sipUserService.getAllPhoneList(authService.GetCompanyInfo().tenant, $scope.clientCompany.companyId).then(function (data) {
            $scope.companyFilteredList = data.Result;
            $scope.isLoadingCompany = false;
        }, function (err) {
            $scope.notify('error', 'error');
            $scope.isLoadingCompany = false;
        });
    };
    $scope.loadData = function () {
        $scope.isLoadingCompany = true;
        $q.all([
            onLoadCompany(),
            getPhoneTemplates()
        ]).then(function (value) {
            var compListResp = value[0];
            var res = value[1];

            if (res) {
                angular.forEach(res, function (item) {
                    var ids = $filter('filter')($scope.manufacturers, {make: item.make}, true);
                    if (ids.length === 0) {
                        $scope.manufacturers.push({make: item.make});
                    }

                    if ($scope.models[item.make] === undefined)
                        $scope.models[item.make] = [];
                    $scope.models[item.make].push(item.model);
                });
            }
            if (compListResp) {
                if (compListResp.IsSuccess) {
                    if (compListResp.Result) {
                        $scope.companyList = compListResp.Result;
                        if ($scope.companyList.length > 0) {


                            var ids = $filter('filter')($scope.companyList, {companyId: authService.GetCompanyInfo().company}, true);
                            if (ids.length > 0) {
                                $scope.clientCompany = ids[0];
                            }


                            $scope.phonesearchByCompanyName();
                            $scope.phoneDetails.push({
                                'mac': '',
                                'manufacturer': '',
                                'model': '',
                                'selected': false,
                                'CompanyId': $scope.clientCompany.companyId
                            });
                        }
                    }
                }
                else {
                    console.error(compListResp.CustomMessage);
                    $scope.notify('Fail To Load Company List.', 'error');
                }

            }
        }, function (err) {
            console.log(err);
        });
    };
    $scope.loadData();

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.resetUploader = function () {
        $scope.safeApply(function () {
            $scope.data = [];
            $scope.agentNumberList = {};


            $scope.headerData = [];
            $scope.gridOptions.data = "data";
            $scope.gridOptions.columnDefs = [];

            $scope.target.form.reset();
            $scope.agentDial.validateNo = false;
            /*form.$setPristine();
            form.$setUntouched();*/

        });
        $scope.agentDial = {StartDate: $filter('date')(new Date(), "yyyy-MM-dd")};
    };

}).directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
            element.on('$destroy', function () {
                element.unbind('change');
            });

        }
    };
});
