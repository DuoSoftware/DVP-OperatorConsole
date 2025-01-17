/**
 * Created by dinusha on 4/24/2017.
 */

opConsoleApp.controller('trunkConfigurationCtrl', function ($scope, $timeout, ngNotify, sipUserService, monitorRestApi, ruleService, clusterConfigurationService, phnNumTrunkService, companyInfoServices, userProfileServices) {

    $scope.currentTrunk = {
        IpAddressList: []
    };

    $scope.ipRangeData = {};

    $scope.phoneNumberList = [];

    $scope.companyList = [];

    $scope.cloudList = [];
    $scope.profileList = [];

    $scope.terminationInfo= {
        TerminationType: 'CLOUD'
    };

    $scope.availableCodecs = ['PCMU', 'PCMA', 'OPUS', 'Speex', 'G729'];
    $scope.currentCodecs = [];

    $scope.phnNum = {};

    $scope.appState = 'TRUNKLIST';

    $scope.status = 'Save';


    $scope.trunkList = [];
    $scope.trunkMonitoringList = [];

    $scope.collapsedButton = 'Create Trunk';
    $scope.dynamicCss = 'trunk-app-button-dynamic-execute';

    $scope.resetForm = function()
    {
        $scope.currentTrunk = {
            IpAddressList: []
        };
    };

    $scope.resetPhoneForm = function()
    {
        $scope.phnNum = {};
    };

    $scope.onClickCollapsed = function ()
    {
        if($scope.appState === 'TRUNKLIST')
        {
            $scope.appState = 'TRUNKSAVE';
            $scope.resetForm();
            $scope.collapsedButton = 'Back To Trunk List';
            $scope.dynamicCss = 'trunk-app-button-dynamic-back';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'TRUNKSAVE' || $scope.appState === 'TRUNKUPDATE')
        {
            $scope.appState = 'TRUNKLIST';
            $scope.collapsedButton = 'Create Trunk';
            $scope.dynamicCss = 'trunk-app-button-dynamic-execute';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'PHONESAVE' || $scope.appState === 'PHONEUPDATE')
        {
            $scope.appState = 'PHONELIST';
            $scope.collapsedButton = 'Back To Phone Number List';
            $scope.dynamicCss = 'trunk-app-button-dynamic-back';
            $scope.status = 'Save';
        }
        else if($scope.appState === 'PHONELIST')
        {
            $scope.appState = 'TRUNKLIST';
            $scope.collapsedButton = 'Create Trunk';
            $scope.dynamicCss = 'trunk-app-button-dynamic-execute';
            $scope.status = 'Save';
        }
    };


    $scope.ipAddressDelete = function (trunkIpObj) {
        phnNumTrunkService.removeTrunkIpAddress($scope.currentTrunk.id, trunkIpObj.id).then(function (data) {
            if (data.IsSuccess) {
                ngNotify.set('Ip address removed successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                loadIpAddresses($scope.currentTrunk);

                $scope.ipRangeData = {};
            }
            else {
                var errMsg = "";
                if (data.Exception && data.Exception.Message) {
                    errMsg = data.Exception.Message;
                }

                if (data.CustomMessage) {
                    errMsg = data.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
                loadIpAddresses($scope.currentTrunk);
            }

        }, function (err) {
            var errMsg = "Error adding ip address";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
            loadIpAddresses($scope.currentTrunk);
        });

        return false;
    };

    $scope.tagAdding = function (tag) {
        return false;
    };

    var loadTranslations = function () {
        ruleService.getTranslations().then(function (data) {
            if (data.IsSuccess)
            {
                $scope.transList = data.Result;
            }
            else
            {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading translations";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.addNewTrunk = function ()
    {
        $scope.currentTrunk.Codecs = $scope.currentCodecs;

        if($scope.status === 'Update')
        {
            if(!$scope.currentTrunk.TranslationId)
            {
                $scope.currentTrunk.TranslationId = null;
            }
            phnNumTrunkService.updateTrunk($scope.currentTrunk.id, $scope.currentTrunk).then(function (data)
            {
                if (data.IsSuccess) {
                    ngNotify.set('Trunk configuration updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });

                    $scope.resetForm();

                    loadTrunks();

                    $scope.appState = 'TRUNKLIST';
                    $scope.collapsedButton = 'Create Trunk';
                    $scope.dynamicCss = 'trunk-app-button-dynamic-execute';
                    $scope.status = 'Save';
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err) {
                var errMsg = "Error updating trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }
        else
        {
            phnNumTrunkService.addNewTrunk($scope.currentTrunk).then(function (data)
            {
                if (data.IsSuccess) {
                    ngNotify.set('Trunk configuration saved successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });

                    $scope.resetForm();

                    $scope.appState = 'TRUNKLIST';
                    $scope.collapsedButton = 'Create Trunk';
                    $scope.dynamicCss = 'trunk-app-button-dynamic-execute';
                    $scope.status = 'Save';

                    loadTrunks();
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err) {
                var errMsg = "Error saving trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
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

    var getLimits = function () {
        phnNumTrunkService.getLimits().then(function (data)
        {
            if (data.IsSuccess)
            {
                $scope.limitList = data.Result;
            }
            else
            {
                var errMsg = data.CustomMessage;

                if (data.Exception)
                {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading limits";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.addIpAddress = function () {
        phnNumTrunkService.addTrunkIpAddress($scope.currentTrunk.id, $scope.ipRangeData).then(function (data) {
            if (data.IsSuccess)
            {
                ngNotify.set('Ip address added successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'success'
                });

                loadIpAddresses($scope.currentTrunk);

                $scope.ipRangeData = {};
            }
            else
            {
                var errMsg = "";
                if (data.Exception && data.Exception.Message) {
                    errMsg = data.Exception.Message;
                }

                if (data.CustomMessage) {
                    errMsg = data.CustomMessage;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }

        }, function (err)
        {
            var errMsg = "Error adding ip address";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };

    $scope.setTerminationData = function () {

        if($scope.terminationInfo.TerminationType === 'CLOUD')
        {
            var cloudId = "-1";

            if($scope.terminationInfo.CloudId && parseInt($scope.terminationInfo.CloudId) > 0)
            {
                cloudId = $scope.terminationInfo.CloudId;
            }
            phnNumTrunkService.setCloudToTrunk($scope.currentTrunk.id, cloudId).then(function (data)
            {
                if (data.IsSuccess)
                {
                    ngNotify.set('Trunk terminated to cloud successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error terminating trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }
        else if($scope.terminationInfo.TerminationType === 'PROFILE')
        {
            var profId = "-1";

            if($scope.terminationInfo.ProfileId && parseInt($scope.terminationInfo.ProfileId) > 0)
            {
                profId = $scope.terminationInfo.ProfileId;
            }
            phnNumTrunkService.setProfileToTrunk($scope.currentTrunk.id, profId).then(function (data)
            {
                if (data.IsSuccess)
                {
                    ngNotify.set('Trunk terminated to profile successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error terminating trunk";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }
        else
        {
            ngNotify.set('Invalid termination type', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        }

    };

    $scope.addPhoneNumber = function ()
    {
        $scope.phnNum.TrunkId = $scope.currentTrunk.id;

        if($scope.appState === 'PHONEUPDATE')
        {
            phnNumTrunkService.updatePhoneNumberTenant($scope.phnNum).then(function (data) {
                if (data.IsSuccess)
                {
                    ngNotify.set('Phone number updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });

                    $scope.showNumberList($scope.currentTrunk);
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error updating phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            });
        }
        else
        {
            phnNumTrunkService.addPhoneNumberTenant($scope.phnNum).then(function (data) {
                if (data.IsSuccess)
                {
                    ngNotify.set('Phone number added successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });

                    $scope.showNumberList($scope.currentTrunk);
                }
                else
                {
                    var errMsg = "";
                    if (data.Exception && data.Exception.Message) {
                        errMsg = data.Exception.Message;
                    }

                    if (data.CustomMessage) {
                        errMsg = data.CustomMessage;
                    }
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }, function (err)
            {
                var errMsg = "Error adding phone number";
                if (err.statusText) {
                    errMsg = err.statusText;
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

    var loadCompanyList = function()
    {
        companyInfoServices.getAllCompanyDetails().then(function(compListResp)
        {
            if (compListResp.IsSuccess)
            {
                if (compListResp.Result)
                {
                    $scope.companyList = compListResp.Result;
                }
            }
            else
            {
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
        }).catch(function(ex)
        {
            var errMsg = "Error loading company details";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        })
    };

    var loadCloudList = function()
    {
        clusterConfigurationService.getClusters().then(function(clusterListResp)
        {
            if (clusterListResp.IsSuccess)
            {
                if (clusterListResp.Result)
                {
                    $scope.cloudList = clusterListResp.Result;
                }
            }
            else
            {
                var errMsg = clusterListResp.CustomMessage;

                if (clusterListResp.Exception) {
                    errMsg = clusterListResp.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }
        }).catch(function(ex)
        {
            var errMsg = "Error loading cluster details";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        })
    };

    var loadProfileList = function()
    {
        clusterConfigurationService.getProfiles().then(function(profileListResp)
        {
            if (profileListResp.IsSuccess)
            {
                if (profileListResp.Result)
                {
                    $scope.profileList = _.filter(profileListResp.Result, function(prof)
                    {
                        return prof.ObjCategory === 'EXTERNAL';
                    });
                }
            }
            else
            {
                var errMsg = profileListResp.CustomMessage;

                if (profileListResp.Exception) {
                    errMsg = profileListResp.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }
        }).catch(function(ex)
        {
            var errMsg = "Error loading profile details";
            if (ex.statusText) {
                errMsg = ex.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        })
    };

    loadCloudList();
    loadProfileList();



    var loadTrunk = function (trunk)
    {
        $scope.terminationInfo.CloudId = null;
        $scope.terminationInfo.ProfileId = null;
        phnNumTrunkService.getTrunk(trunk.id).then(function (data)
        {
            if (data.IsSuccess)
            {
                if (data.Result)
                {
                    if(data.Result.LoadBalancer && data.Result.LoadBalancer.Cloud)
                    {
                        $scope.terminationInfo.CloudId = data.Result.LoadBalancer.Cloud.id.toString();
                    }

                    if(data.Result.ProfileId)
                    {
                        $scope.terminationInfo.ProfileId = data.Result.ProfileId.toString();
                    }

                }

                //$scope.trunkList = data.Result;
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading trunk data";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };


    var loadIpAddresses = function (trunk) {
        $scope.currentTrunk.IpAddressList = [];
        phnNumTrunkService.getTrunkIpAddresses(trunk.id).then(function (data) {
            if (data.IsSuccess)
            {
                if (data.Result)
                {
                    $scope.currentTrunk.IpAddressList = data.Result.map(function (ip) {
                        var newIpAddressObj = ip;
                        newIpAddressObj.DisplayValue = ip.IpAddress + '/' + ip.Mask;
                        return newIpAddressObj;
                    });
                }

                //$scope.trunkList = data.Result;
            }
            else {
                var errMsg = data.CustomMessage;

                if (data.Exception) {
                    errMsg = data.Exception.Message;
                }
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });

            }

        }, function (err) {
            var errMsg = "Error occurred while loading trunk ip addresses";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        });
    };



    $scope.editPhone = function(phn)
    {
        angular.copy(phn, $scope.phnNum);

        if(phn.LimitInfoInbound)
        {
            $scope.phnNum.InboundLimit = phn.LimitInfoInbound.MaxCount;
        }

        if(phn.LimitInfoOutbound)
        {
            $scope.phnNum.OutboundLimit = phn.LimitInfoOutbound.MaxCount;
        }

        if(phn.LimitInfoBoth)
        {
            $scope.phnNum.BothLimit = phn.LimitInfoBoth.MaxCount;
        }

        $scope.phnNum.ClientCompany = phn.CompanyId.toString();

        $scope.appState = 'PHONEUPDATE';

        $scope.collapsedButton = 'Back To Trunk List';
        $scope.dynamicCss = 'trunk-app-button-dynamic-back';
        $scope.status = 'Update';

    };


    $scope.editTrunk = function(trunk)
    {
        angular.copy(trunk, $scope.currentTrunk);

        if($scope.currentTrunk.TranslationId)
        {
            $scope.currentTrunk.TranslationId = $scope.currentTrunk.TranslationId.toString();
        }

        $scope.currentCodecs = $scope.currentTrunk.Codecs;
        var arrayDiff = _.difference($scope.availableCodecs, $scope.currentCodecs);
        $scope.availableCodecs = arrayDiff;

        loadIpAddresses(trunk);
        loadTrunk(trunk);

        $scope.appState = 'TRUNKUPDATE';

        $scope.collapsedButton = 'Back To Trunk List';
        $scope.dynamicCss = 'trunk-app-button-dynamic-back';
        $scope.status = 'Update';

    };

    $scope.onClickAddNewNumber = function()
    {
        $scope.appState = 'PHONESAVE';
        $scope.collapsedButton = 'Back To Phone Number List';
        $scope.dynamicCss = 'trunk-app-button-dynamic-back';

        $scope.resetPhoneForm();
    };

    $scope.showNumberList = function(trunk)
    {
        getLimits();
        loadCompanyList();

        if(trunk !== $scope.currentTrunk)
        {
            angular.copy(trunk, $scope.currentTrunk);
        }



        if($scope.currentTrunk.TranslationId)
        {
            $scope.currentTrunk.TranslationId = $scope.currentTrunk.TranslationId.toString();
        }

        phnNumTrunkService.getPhoneNumbersByTrunk(trunk.id).then(function(numberListResp)
        {
            if(numberListResp && numberListResp.IsSuccess)
            {
                $scope.phoneNumberList = numberListResp.Result;

                $scope.appState = 'PHONELIST';

                $scope.collapsedButton = 'Back To Trunk List';
                $scope.dynamicCss = 'trunk-app-button-dynamic-back';
            }
            else
            {
                //error
                if(numberListResp.Exception)
                {
                    ngNotify.set(numberListResp.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading trunk list', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading trunk list', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })



    };

    var reloadTrunkStatus = function()
    {
        if($scope.trunkList)
        {
            monitorRestApi.getMonitorTrunks().then(function(monitorTrunkListResp)
            {
                if(monitorTrunkListResp && monitorTrunkListResp.IsSuccess)
                {
                    $scope.trunkList.forEach(function(trunk)
                    {
                        var match = _.find(monitorTrunkListResp.Result, function(monitorTr)
                        {
                            return monitorTr.Gateway === trunk.TrunkCode;
                        });

                        if(match && (match['Ping-Status'] === 'UP' || match['Ping-Status'] === 'DOWN'))
                        {
                            trunk.PingStatus = match['Ping-Status'];
                        }
                        else
                        {
                            trunk.PingStatus = 'UNKNOWN';
                        }

                        if(match && match['Event-Date-Timestamp'])
                        {
                            var timeInSeconds = match['Event-Date-Timestamp']/1000000;
                            var evtTime = moment.unix(timeInSeconds).format('YYYY-MM-DD hh:mm:ss a');
                            trunk.LastEventTime = evtTime;
                        }
                        else
                        {
                            trunk.LastEventTime = 'N/A';
                        }
                    });


                }
                else
                {
                    //error
                    if(monitorTrunkListResp.Exception)
                    {
                        ngNotify.set(monitorTrunkListResp.Exception.Message, {
                            position: 'top',
                            sticky: false,
                            duration: 3000,
                            type: 'error'
                        });
                    }
                    else
                    {
                        console.log(new Error('Error occurred while reloading trunk status'));
                    }

                }

            }).catch(function(err)
            {
                console.log(err);

            })
        }

        $timeout(reloadTrunkStatus, 10000);

    };

    var loadTrunks = function()
    {
        phnNumTrunkService.getTrunks().then(function(trunkListResp)
        {
            if(trunkListResp && trunkListResp.IsSuccess)
            {
                monitorRestApi.getMonitorTrunks().then(function(monitorTrunkListResp)
                {
                    if(monitorTrunkListResp && monitorTrunkListResp.IsSuccess)
                    {
                        trunkListResp.Result.forEach(function(trunk)
                        {
                            var match = _.find(monitorTrunkListResp.Result, function(monitorTr)
                            {
                                return monitorTr.Gateway === trunk.TrunkCode;
                            });

                            if(match && (match['Ping-Status'] === 'UP' || match['Ping-Status'] === 'DOWN'))
                            {
                                trunk.PingStatus = match['Ping-Status'];
                            }
                            else
                            {
                                trunk.PingStatus = 'UNKNOWN';
                            }

                            if(match && match['Event-Date-Timestamp'])
                            {
                                var timeInSeconds = match['Event-Date-Timestamp']/1000000;
                                var evtTime = moment.unix(timeInSeconds).format('YYYY-MM-DD hh:mm:ss a');
                                trunk.LastEventTime = evtTime;
                            }
                            else
                            {
                                trunk.LastEventTime = 'N/A';
                            }
                        });

                        $scope.trunkList = trunkListResp.Result;

                        if(trunkListResp.Result.LoadBalancer && trunkListResp.Result.LoadBalancer.Cloud)
                        {
                            $scope.trunkList.CloudId = trunkListResp.Result.LoadBalancer.Cloud.id
                        }


                    }
                    else
                    {
                        //error
                        if(monitorTrunkListResp.Exception)
                        {
                            ngNotify.set(monitorTrunkListResp.Exception.Message, {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }
                        else
                        {
                            ngNotify.set('Error occurred while loading trunk monitor list', {
                                position: 'top',
                                sticky: false,
                                duration: 3000,
                                type: 'error'
                            });
                        }

                    }

                }).catch(function(err)
                {
                    ngNotify.set('Error occurred while loading trunk monitor list', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });

                })

            }
            else
            {
                //error
                if(trunkListResp.Exception)
                {
                    ngNotify.set(trunkListResp.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set('Error occurred while loading trunk list', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }

            }

        }).catch(function(err)
        {
            ngNotify.set('Error occurred while loading trunk list', {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

        })
    };


    $scope.gridOptions = {
        enableRowHashing: false,
        enableGridMenu: false,
        data: 'data',
        columnDefs: [],
    };
    $scope.data = [];
    $scope.uploadFile = function (inputElement) {
        var file = inputElement.files[0];
        if (file && file.name.endsWith('.csv')) {
            Papa.parse(file, {
                complete: function (results) {
                    $scope.data = results.data;

                    var headerRow = results.data[0];
                    $scope.gridOptions.columnDefs = headerRow.map(function (columnName) {
                        return {
                            name: columnName,
                            field: columnName
                        };
                    });

                    $scope.$apply();
                },
                header: true,
                skipEmptyLines: true
            });
        } else {
            $scope.showAlert('Please upload a valid CSV file', errMsg, 'error');
        }
    };

    $scope.refreshData = function () {
        $scope.data = [];
        $scope.gridOptions.columnDefs = [];
        $scope.$apply();
        document.getElementById('fileInput').value = '';
    };


    loadTrunks();

    reloadTrunkStatus();

    loadTranslations();


});
