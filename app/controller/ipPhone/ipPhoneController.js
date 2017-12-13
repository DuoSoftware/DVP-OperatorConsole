'use strict';
opConsoleApp.controller('ipPhoneController', function ($scope, $uibModal, ipPhoneServices, sipUserService,companyInfoServices,ngNotify ) {
    $scope.phoneDetails = [
        {
            'mac': '',
            'manufacturer': '',
            'model': '',
            'selected': false

        }];

    $scope.notify = function (message, type) {
        ngNotify.set(message, {
            position: 'top',
            sticky: false,
            duration: 3000,
            type: type
        });
    };

    $scope.open = function (size) {
        $uibModal.open({
            templateUrl: 'app/views/ipPhone/temp/create-new-phone.html',
            size: 'lg',
            scope: $scope
        });
    };
    $scope.addNew = function (phoneDetail) {
        $scope.isCheckList = false;
        $scope.phoneDetails.push({
            'mac': "",
            'manufacturer': "",
            'model': "",
            'selected': false
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
        //  angular.forEach($scope.phoneDetail.selected,function(key,value){
        //      console.log(key,value);
        //  });
        //  var newDataList=[];
        //  $scope.selectedAll = false;
        // // if($scope.selectAll){
        //      angular.forEach($scope.phoneDetails, function(selected){
        //          if(!selected.selected){
        //              newDataList.push(selected);
        //          }
        //      });
        //      $scope.phoneDetails = newDataList;
        //      $scope.phoneDetails.push({
        //          'mac': "",
        //          'manufacturer': "",
        //          'model': "",
        //          'selected':false
        //
        //      });
        // }

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
    }
    $scope.submit = function () {
        var e = document.getElementById("company");
        //console.log(e.options[e.selectedIndex].text);
        if ($scope.phoneDetails.length <= 1 && $scope.phoneDetails[0].mac == "") {
            $scope.notify('add Data ', 'error');
        } else if (e.options[e.selectedIndex].text == "") {
            $scope.notify('select company', 'error');
        } else {
            var obj = new Object();
            obj.company = e.options[e.selectedIndex].text;
            obj.phonedetails = $scope.phoneDetails;
            var jsonString = JSON.stringify(obj);
            ipPhoneServices.postCompanyPhoneList(jsonString).then(function (res) {
                if(res.IsSuccess){
                    $scope.notify('Success', 'success');

                }else{
                    $scope.notify('error', 'error');
                }
            });
        }
    };
    $scope.submitbulk = function () {
        var e = document.getElementById("company");
       //console.log($scope.data);
            if(!$scope.data) {
                $scope.notify('add Data ', 'error');
            }else if(e.options[e.selectedIndex].text == "") {
                $scope.notify('select company', 'error');
            }else if(!$scope.data[0].mac){
                $scope.notify('csv must need colunm named mac', 'error');
            }else {
                var obj = new Object();
                obj.company = e.options[e.selectedIndex].text;
                obj.phonedetails = $scope.data;
                var jsonString = JSON.stringify(obj);
                ipPhoneServices.postCompanyPhoneList(jsonString).then(function (res) {
                    console.log(res);
                    if(res.IsSuccess){
                        $scope.notify('Success', 'success');

                    }else{
                        $scope.notify('error', 'error');
                    }
                });
            }
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
    $scope.bulk = function () {
        fileChooser = document.querySelectorAll('.file-chooser');
        if (fileChooser.length !== 1) {
            console.log('Found > 1 or < 1 file choosers within the menu item, error, cannot continue');
        } else {
            fileChooser[0].addEventListener('change', handleFileSelect, false);
        }
    };
    $scope.clientCompany = null;
    $scope.companyList = [];
    var onLoadCompany = function () {
        companyInfoServices.getAllCompanyDetails().then(function (compListResp) {
            if (compListResp.IsSuccess) {
                if (compListResp.Result) {
                    $scope.companyList = compListResp.Result;
                }
            }
            else {
                var errMsg = compListResp.CustomMessage;
                if (compListResp.Exception) {
                    errMsg = compListResp.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }
        });
    };
    onLoadCompany();
    var handleFileSelect = function (event) {
        var target = event.srcElement || event.target;
        $scope.target = target;

        if (target && target.files && target.files.length === 1) {
            var fileObject = target.files[0];
            $scope.gridApi.importer.importFile(fileObject);
            //target.form.reset();
        }
    };
    $scope.companyData = {}
    $scope.companyObj = null;
    $scope.companyFilteredList = [];
    $scope.isLoadingCompany = false;
    var getAllPhoneList = function () {
        $scope.isLoadingCompany = true;
        ipPhoneServices.getAllPhoneList("").then(function (data) {
            $scope.isLoadingCompany = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                $scope.companyFilteredList = angular.copy($scope.companyObj);
            }
        }, function (err) {
            $scope.notify('error', 'error');
        });
    };
    $scope.phonesearchByCompanyName=function () {
        phonesearchByCompanyName();
    };
    var phonesearchByCompanyName=function () {
        $scope.isLoadingCompany = true;
        var e = document.getElementById("company");
        ipPhoneServices.getAllPhoneList(e.options[e.selectedIndex].text).then(function (data) {
            $scope.isLoadingCompany = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                $scope.companyFilteredList = angular.copy($scope.companyObj);
            }
        }, function (err) {
            $scope.notify('error', 'error');
        });
    };
    getAllPhoneList();
    $scope.refreshPage = function () {
        getAllPhoneList();
        // var e = document.getElementById("company");
        // //console.log();
        // var a=e.options[e.selectedIndex].text;
        // if(a){
        //     phonesearchByCompanyName();
        // }else{
        //     getAllPhoneList();
        // }

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
