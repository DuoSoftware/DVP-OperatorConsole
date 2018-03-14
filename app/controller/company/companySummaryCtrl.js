/**
 * Created by damith on 4/7/17.
 */

opConsoleApp.controller('companySummaryCtrl', function ($scope, $location, $anchorScroll, $q,
                                                        companyInfoServices, clusterConfigurationService,
                                                        phnNumTrunkService, ngNotify, userService, $state, $ngConfirm) {

    $anchorScroll();

    var param = {};
    $scope.isDataNotFound = false;
    $scope.isLoadingAll = false;
    $scope.companyObj = null;
    $scope.cloudEndUser = {};
    $scope.numberLimit = {
        Inbound: {},
        Outbound: {},
        Both: {}
    };

    $scope.disableSaveLimit = false;

    //update package save obj
    var _updatePackage = {};

    // get current company details
    var getCompanySummary = function (param) {
        $scope.isLoadingAll = true;
        $scope.isUpdatePackage = false;
        companyInfoServices.getCurrentCompanyById(param).then(function (data) {
            $scope.isLoadingAll = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                //check company package
                $scope.currentPage = 'companyProfile';

                // if ($scope.companyObj) {
                //     if ($scope.companyObj.packageDetails) {
                //         if ($scope.companyObj.packageDetails.length == 0) {
                //             $scope.currentPage = 'companyPackage';
                //             onLoadCompanyPackage($scope.companyObj);
                //             $scope.isUpdatePackage = true;
                //         }
                //     }
                // }
                onLoadCompanyInfo($scope.companyObj);
            }
        }, function (err) {
            console.log(err);
        });
    };

    //query string value
    param.companyId = $location.search()['id'];
    if (param.companyId) {
        getCompanySummary(param);

    } else {
        //TODO
        //invalid company ID
    }

    $scope.consoleAccessTabs = [];
    var onLoadConsoleAccess = function (companyObj) {
        $scope.consoleAccessTabs = companyObj.consoleAccessLimits.map(function (item) {
            var _consoleTab = {};
            _consoleTab.item = item;
            return _consoleTab;
        });
    };

    $scope.widgetScopeNotFound = false;
    var onLoadCompanyInfo = function (companyObj) {
        $scope.widgetScopeNotFound = false;
        if (companyObj && companyObj.ownerRef) {
            $scope.ownerRef = companyObj.ownerRef;
            $scope.ownerRef.user_scopes = $scope.ownerRef.user_scopes.map(function (item) {
                var _scope = {
                    read: (item.read) ? true : false,
                    write: (item.write) ? true : false,
                    delete: (item.delete) ? true : false,
                    scope: item.scope
                };
                return _scope;
            });
        } else {
            $scope.widgetScopeNotFound = true;
        }
    };

    //on load company details
    var nowDate = new Date();
    nowDate = moment.utc(nowDate).format();
    var onLoadCompanyPackage = function (companyObj) {

        $scope.packageData.companyId = companyObj.id;
        $scope.packageDetails = companyObj.packageDetails.map(function (item) {
            var buyDate = moment(item.buyDate);
            var currentDate = moment(nowDate);
            item.renewdate = buyDate.diff(currentDate, 'days');
            return item;
        });
    };


    var loadInbLimits = function () {
        var deferred = $q.defer();
        phnNumTrunkService.getLimitsByCategory('COMPANY_NUMBER_LIMIT', 'INBOUND', $scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.isNewInboundLimit = false;
                    $scope.numberLimit.Inbound = response.Result[0];
                }
                else {
                    $scope.isNewInboundLimit = true;
                }
                deferred.resolve();
            }
            else {
                $scope.isNewInboundLimit = null;
                var errMsg = "";
                if (response.Exception && response.Exception.Message) {
                    errMsg = response.Exception.Message;
                }

                if (response.CustomMessage) {
                    errMsg = response.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

                deferred.reject();
            }


        }).catch(function (ex) {
            $scope.isNewInboundLimit = true;

            var errMsg = "Error loading company inbound limit";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            deferred.reject();

        });

        return deferred.promise;
    };

    var loadOutbLimits = function () {
        var deferred = $q.defer();
        phnNumTrunkService.getLimitsByCategory('COMPANY_NUMBER_LIMIT', 'OUTBOUND', $scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.isNewOutboundLimit = false;
                    $scope.numberLimit.Outbound = response.Result[0];
                }
                else {
                    $scope.isNewOutboundLimit = true;
                }
                deferred.resolve();
            }
            else {
                $scope.isNewOutboundLimit = null;
                var errMsg = "";
                if (response.Exception && response.Exception.Message) {
                    errMsg = response.Exception.Message;
                }

                if (response.CustomMessage) {
                    errMsg = response.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

                deferred.reject();
            }


        }).catch(function (ex) {
            $scope.isNewOutboundLimit = true;

            var errMsg = "Error loading company inbound limit";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            deferred.reject();

        });

        return deferred.promise;


    }

    var loadBothLimits = function () {
        var deferred = $q.defer();

        phnNumTrunkService.getLimitsByCategory('COMPANY_NUMBER_LIMIT', 'BOTH', $scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.isNewBothLimit = false;
                    $scope.numberLimit.Both = response.Result[0];
                }
                else {
                    $scope.isNewBothLimit = true;
                }

                deferred.resolve();
            }
            else {
                $scope.isNewBothLimit = null;
                var errMsg = "";
                if (response.Exception && response.Exception.Message) {
                    errMsg = response.Exception.Message;
                }

                if (response.CustomMessage) {
                    errMsg = response.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

                deferred.reject();
            }


        }).catch(function (ex) {
            $scope.isNewBothLimit = true;

            var errMsg = "Error loading company inbound limit";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            deferred.reject();

        });

        return deferred.promise;
    }

    var loadNumberLimits = function () {
        $scope.disableSaveLimit = true;

        var arr = [];

        arr.push(loadInbLimits());

        arr.push(loadOutbLimits());

        arr.push(loadBothLimits());

        $q.all(arr).then(function (resolveData) {
            //form complete
            $scope.disableSaveLimit = false;

        }).catch(function (err) {
            ngNotify.set('Error occurred while loading company number limits', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            $scope.disableSaveLimit = false;
        });


    };

    var loadEndUser = function () {
        clusterConfigurationService.getCloudEndUser($scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.isNewEndUser = false;
                    $scope.cloudEndUser = response.Result[0];

                    $scope.cloudEndUser.SIPConnectivityProvision = $scope.cloudEndUser.SIPConnectivityProvision.toString();
                }
                else {
                    $scope.isNewEndUser = true;
                }
            }
            else {
                var errMsg = "";
                if (response.Exception && response.Exception.Message) {
                    errMsg = response.Exception.Message;
                }

                if (response.CustomMessage) {
                    errMsg = response.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }


        }).catch(function (ex) {
            $scope.isNewEndUser = null;

            var errMsg = "Error loading provision data";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        });
    };

    //go to summary inside page
    $scope.uploadAvatar = false;
    $scope.goToCompanySummaryPage = function (page) {
        $scope.currentPage = page;
        switch (page) {
            case 'consoleAccess':
                onLoadConsoleAccess($scope.companyObj);
                break;
            case 'companyProvision':
                loadEndUser();
                loadNumberLimits();
                break;
            case 'companyProfile':
                onLoadCompanyInfo($scope.companyObj);
                break;
            case 'companyPackage':
                onLoadCompanyPackage($scope.companyObj);
            case 'uploadAvatar':
                $scope.uploadAvatar = true;
                break;

        }
    };

    var getCluster = function () {
        $scope.cluster = null;
        clusterConfigurationService.getClusters().then(function (response) {
            if (response.IsSuccess) {
                if (response.Result.length > 0) {
                    $scope.cluster = response.Result[0];
                }

            }

        });
    };


    getCluster();

    $scope.saveEndUser = function () {

        if ($scope.isNewEndUser) {
            if ($scope.cluster) {
                $scope.cloudEndUser.ClusterID = $scope.cluster.id;
                $scope.cloudEndUser.ClientCompany = $scope.companyObj.id;

                clusterConfigurationService.saveNewEndUser($scope.cloudEndUser).then(function (response) {
                    if (response.IsSuccess) {
                        ngNotify.set('End user provisioning saved successfully', {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'success'
                        });

                        $scope.isNewEndUser = false;
                    }
                    else {
                        var errMsg = "";
                        if (response.Exception && response.Exception.Message) {
                            errMsg = response.Exception.Message;
                        }

                        if (response.CustomMessage) {
                            errMsg = response.CustomMessage;
                        }
                        ngNotify.set(errMsg, {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'error'
                        });

                    }
                }).catch(function (ex) {
                    var errMsg = "Error adding company provision data";
                    if (ex.statusText) {
                        errMsg = ex.statusText;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                });
            }
            else {
                ngNotify.set('Cluster not found', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }

        }
        else {
            $scope.cloudEndUser.ClientCompany = $scope.companyObj.id;
            clusterConfigurationService.updateEndUser($scope.cloudEndUser).then(function (response) {
                if (response.IsSuccess) {
                    ngNotify.set('End user provisioning updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else {
                    var errMsg = "";
                    if (response.Exception && response.Exception.Message) {
                        errMsg = response.Exception.Message;
                    }

                    if (response.CustomMessage) {
                        errMsg = response.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                }
            }).catch(function (ex) {
                var errMsg = "Error adding company provision data";
                if (ex.statusText) {
                    errMsg = ex.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }


    };

    var saveInboundLimit = function () {
        var deferred = $q.defer();

        if ($scope.isNewInboundLimit === null) {
            deferred.reject(new Error('Unable to find inbound limit save state please refresh and try again'))
        }
        else {
            if ($scope.isNewInboundLimit) {
                var inbLim = {
                    LimitDescription: 'Company ' + $scope.companyObj.id + ' Inbound Limit',
                    ObjClass: 'CALL',
                    ObjType: 'COMPANY_NUMBER_LIMIT',
                    ObjCategory: 'INBOUND',
                    MaxCount: $scope.numberLimit.Inbound.MaxCount,
                    Enable: true
                };

                phnNumTrunkService.addLimitByTenant(inbLim, $scope.companyObj.id).then(function (response) {
                    if (response.IsSuccess) {
                        deferred.resolve(true);
                    }
                    else {
                        deferred.reject(null);
                    }
                }).catch(function (ex) {
                    deferred.reject(null);
                });

            }
            else {
                if ($scope.numberLimit.Inbound && $scope.numberLimit.Inbound.LimitId) {
                    phnNumTrunkService.updateMaxLimit($scope.numberLimit.Inbound.LimitId, $scope.numberLimit.Inbound.MaxCount, $scope.companyObj.id).then(function (response) {
                        if (response.IsSuccess) {
                            deferred.resolve(true);
                        }
                        else {
                            deferred.reject(null);
                        }
                    }).catch(function (ex) {
                        deferred.reject(null);
                    });
                }
                else {
                    deferred.reject(null);
                }

            }
        }

        return deferred.promise;
    };

    var saveOutboundLimit = function () {
        var deferred = $q.defer();

        if ($scope.isNewOutboundLimit === null) {
            deferred.reject(new Error('Unable to find inbound limit save state please refresh and try again'))
        }
        else {
            if ($scope.isNewOutboundLimit) {
                var outbLim = {
                    LimitDescription: 'Company ' + $scope.companyObj.id + ' Outbound Limit',
                    ObjClass: 'CALL',
                    ObjType: 'COMPANY_NUMBER_LIMIT',
                    ObjCategory: 'OUTBOUND',
                    MaxCount: $scope.numberLimit.Outbound.MaxCount,
                    Enable: true
                };

                phnNumTrunkService.addLimitByTenant(outbLim, $scope.companyObj.id).then(function (response) {
                    if (response.IsSuccess) {
                        deferred.resolve(true);
                    }
                    else {
                        deferred.reject(null);
                    }
                }).catch(function (ex) {
                    deferred.reject(null);
                });

            }
            else {
                if ($scope.numberLimit.Outbound && $scope.numberLimit.Outbound.LimitId) {
                    phnNumTrunkService.updateMaxLimit($scope.numberLimit.Outbound.LimitId, $scope.numberLimit.Outbound.MaxCount, $scope.companyObj.id).then(function (response) {
                        if (response.IsSuccess) {
                            deferred.resolve(true);
                        }
                        else {
                            deferred.reject(null);
                        }
                    }).catch(function (ex) {
                        deferred.reject(null);
                    });
                }
                else {
                    deferred.reject(null);
                }

            }
        }


        return deferred.promise;
    };

    var saveBothLimit = function () {
        var deferred = $q.defer();

        if ($scope.isNewOutboundLimit === null) {
            deferred.reject(new Error('Unable to find inbound limit save state please refresh and try again'))
        }
        else {
            if ($scope.isNewBothLimit) {
                var bothLim = {
                    LimitDescription: 'Company ' + $scope.companyObj.id + ' Both Limit',
                    ObjClass: 'CALL',
                    ObjType: 'COMPANY_NUMBER_LIMIT',
                    ObjCategory: 'BOTH',
                    MaxCount: $scope.numberLimit.Both.MaxCount,
                    Enable: true
                };

                phnNumTrunkService.addLimitByTenant(bothLim, $scope.companyObj.id).then(function (response) {
                    if (response.IsSuccess) {
                        deferred.resolve(true);
                    }
                    else {
                        deferred.reject(null);
                    }
                }).catch(function (ex) {
                    deferred.reject(null);
                });

            }
            else {
                if ($scope.numberLimit.Both && $scope.numberLimit.Both.LimitId) {
                    phnNumTrunkService.updateMaxLimit($scope.numberLimit.Both.LimitId, $scope.numberLimit.Both.MaxCount, $scope.companyObj.id).then(function (response) {
                        if (response.IsSuccess) {
                            deferred.resolve(true);
                        }
                        else {
                            deferred.reject(null);
                        }
                    }).catch(function (ex) {
                        deferred.reject(null);
                    });
                }
                else {
                    deferred.reject(null);
                }

            }
        }


        return deferred.promise;
    };

    var deleteLimit = function (limitId) {
        var deferred = $q.defer();

        phnNumTrunkService.deleteLimit(limitId, $scope.companyObj.id).then(function (response) {
            if (response.IsSuccess) {
                deferred.resolve(true);
            }
            else {
                deferred.reject(null);
            }
        }).catch(function (ex) {
            deferred.reject(null);
        });


        return deferred.promise;
    };


    $scope.saveCompanyLimits = function () {
        $scope.disableSaveLimit = true;
        if ($scope.isNewInboundLimit === null || $scope.isNewOutboundLimit === null || $scope.isNewBothLimit === null) {
            ngNotify.set('Cannot save limits - please reload page and try again', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            $scope.disableSaveLimit = false;
        }
        else {
            var arr = [];
            if ($scope.isNewInboundLimit === false && $scope.numberLimit.Inbound.MaxCount === '') {
                arr.push(deleteLimit($scope.numberLimit.Inbound.LimitId));
            }

            if ($scope.isNewOutboundLimit === false && $scope.numberLimit.Outbound.MaxCount === '') {
                arr.push(deleteLimit($scope.numberLimit.Outbound.LimitId));
            }

            if ($scope.isNewBothLimit === false && $scope.numberLimit.Both.MaxCount === '') {
                arr.push(deleteLimit($scope.numberLimit.Both.LimitId));
            }

            if ($scope.numberLimit.Inbound.MaxCount) {
                arr.push(saveInboundLimit())
            }
            if ($scope.numberLimit.Outbound.MaxCount) {
                arr.push(saveOutboundLimit())
            }
            if ($scope.numberLimit.Both.MaxCount) {
                arr.push(saveBothLimit())
            }

            $q.all(arr).then(function (resolveData) {
                //form complete
                loadNumberLimits();
                ngNotify.set('Company number limits updated successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

            }).catch(function (err) {
                ngNotify.set('Error occurred while setting company number limits', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }


    };


    //change company activation

    var confirmation = function (title, contentData, okText, okFunc, closeFunc) {
        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {
                // long hand button definition
                ok: {
                    text: okText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function (scope) {
                        okFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    //closeFunc();
                }
            }
        });
    };

    $scope.isChangeCompanySatate = false;
    $scope.changeCompanyActivation = function (state) {

        var confirmBoxObj = {
            title: state ? 'Activate Company' : ' Deactivate Company',
            contentData: state ? 'Are You Sure  Activate Company.' : 'Are You Sure Deactivate Company.',
            okText: state ? 'Activate' : 'Deactivate'
        };

        confirmation(confirmBoxObj.title, confirmBoxObj.contentData, confirmBoxObj.okText, function () {
            var param = {
                state: state,
                companyId: $scope.companyObj.id
            };
            $scope.isChangeCompanySatate = true;
            companyInfoServices.changeCompanyActivation(param).then(function (data) {
                $scope.isChangeCompanySatate = false;
                if (data.IsSuccess) {
                    $scope.companyObj.companyEnabled = state;
                    ngNotify.set('Company state update successfully...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'success'
                    });
                }

            }, function (err) {
                console.log(err);
            });
        });
    };

    //update company current package
    $scope.packageData = {};

    $scope.isUpdateNewPackage = false;
    $scope.showAddMyPackage = function () {
        $scope.isUpdateNewPackage = !$scope.isUpdateNewPackage;
    };

    //-----------------External methods------------------------
    $scope.loadPackageDetails = function () {
        try {
            userService.GetAllPackages().then(function (response) {
                if (response && response.IsSuccess) {
                    $scope.packageObj = response.Result;
                } else {
                    $scope.notify('Load Package Details Failed', 'error');
                }
            });
        } catch (ex) {
            //$scope.notify('Load Package Details Failed', 'error');
        }
    };

    $scope.loadUnitDetails = function () {
        try {
            userService.GetAllUnits().then(function (response) {
                if (response && response.IsSuccess) {
                    $scope.unitDetails = response.Result;
                } else {
                    $scope.notify('Load Unit Details Failed', 'error');
                }
            });
        } catch (ex) {
            //$scope.notify('Load Unit Details Failed', 'error');
        }
    };

    $scope.getCompanyDetail = function (companyId) {
        $scope.searchStatus = undefined;
        try {
            userService.GetCompanyData(companyId).then(function (response) {
                if (response && response.IsSuccess && response.Result) {
                    $scope.companyDetail = response.Result;
                    $scope.searchStatus = 'true';
                    $scope.searchBoxStaus = $scope.companyDetail;
                } else {
                    $scope.searchStatus = 'false';
                }
            });
        } catch (ex) {
            $scope.searchStatus = 'false';
        }
    };

    var assignPackage = function (param) {
        $scope.isupdatePackage = true;
        try {
            userService.AssignPackage(param).then(function (response) {
                $scope.isupdatePackage = false;
                if (response && response.IsSuccess) {
                    ngNotify.set('Package Update Successfully...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'success'
                    });
                    onLoadCompanyPackage($scope.companyObj);
                } else {
                    ngNotify.set(response.CustomMessage, {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
            });
        } catch (ex) {
            $scope.isupdatePackage = false;
            console.error((ex));
        }
    };

    var assignUnit = function (_updatePackage) {
        $scope.isupdatePackage = true;
        try {
            _updatePackage.topUpCount = $scope.packageData.topUpCount ? $scope.packageData.topUpCount : 1;
            userService.AssignUnit(_updatePackage).then(function (response) {
                $scope.isupdatePackage = false;
                if (response && response.IsSuccess) {
                    //$scope.notify('Load Package Success', 'success');
                    ngNotify.set('Package Update Successfully...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'success'
                    });
                    onLoadCompanyPackage($scope.companyObj);

                } else {
                    // $scope.notify('Assign Package Failed', 'error');
                    ngNotify.set('Package Update Error...', {
                        position: 'top',
                        sticky: true,
                        duration: 3000,
                        type: 'error'
                    });
                }
            });
        } catch (ex) {
            $scope.isupdatePackage = false;
            console.error((ex));
        }
    };

    $scope.updatePackage = function () {
        if ($scope.packageData.assignType && $scope.packageData.assignType === 'unit') {
            assignUnit();
        } else {
            assignPackage();
        }
    };

    $scope.loadPackageDetails();
    $scope.loadUnitDetails();

    //
    $scope.packageData.assignType = 'package';
    $scope.changePackageType = function (type) {
        $scope.packageData.assignType = type;
    };

    $scope.unitChange = function (unit) {
        _updatePackage = {};
        _updatePackage.unit = $scope.unitDetails[$scope.packageData.unitIndex];

        $scope.selectedUnitType = _updatePackage.unit.unitType;
    };


    //choose package
    $scope.choosePackage = function (package, type, $index) {

        $('.new-package-wrp').removeClass('none selected');
        if (type == 'package') {
            $('#package' + $index).addClass('selected');
            _updatePackage.packageName = package.packageName;
        } else if (type == 'unit') {
            $('#unit' + $index).addClass('selected');
            _updatePackage.packageName = package;

        }
    };


    //update company package
    $scope.updatePackage = function () {

        _updatePackage.companyId = $scope.companyObj.id;

        if ($scope.packageData.assignType && $scope.packageData.assignType === 'unit') {
            assignUnit(_updatePackage);
        } else {
            assignPackage(_updatePackage);
        }


    };


    $scope.backToPage = function () {
        $state.go('op-console.all-company-information');
    };


    //update company profile
    $scope.showUpdatePanel = function () {
        var $edit_widget = $('#profileEditWidget');
        if ($edit_widget) {
            $edit_widget.removeClass('hidden-widget');
        }
    };

    $scope.hiddenEditPanel = function () {
        var $edit_widget = $('#profileEditWidget');
        if ($edit_widget) {
            $('#profileEditWidget').animate()
        }
    };
});