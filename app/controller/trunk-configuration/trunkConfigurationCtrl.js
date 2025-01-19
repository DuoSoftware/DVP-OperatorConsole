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
   
    // $scope.gridOptions = {
    //     enableRowHashing: false,
    //     enableGridMenu: false,
    //     data: 'data',
    //     importerDataAddCallback: function (grid, newObjects) {
    //         $scope.data = newObjects;
    //     },
    //     onRegisterApi: function (gridApi) {
    //         $scope.gridApi = gridApi;
    //     },
    //     importerProcessHeaders: function (hData, headerArray) {
    //         var myHeaderColumns = [];
    //         var thisCol;

    //         headerArray.forEach(function (value, index) {

    //             thisCol = mySpecialLookupFunction(value, index);
    //             if (myHeaderColumns.indexOf(thisCol.name) === -1) {
    //                 myHeaderColumns.push(thisCol.name);
    //                 $scope.headerData.push({name: thisCol.name, index: index});
    //             } else {
    //                 // $scope.showAlert('Campaign Number Upload', errMsg, 'error');
    //             }

    //         });

    //         return myHeaderColumns;
    //     }
    // };
    $scope.gridOptions = {
        columnDefs: [],
        data: [],
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi; // Store the gridApi reference
        }
    };
    
    // Function to handle file upload
    $scope.uploadFile = function(element) {
        var file = element.files[0];
        if (file && file.name.endsWith('.csv')) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var csvData = event.target.result;
                $scope.processCSV(csvData);
            };
            reader.readAsText(file);
        }
    };
    
    // Function to process CSV data
    $scope.processCSV = function(csvData) {
        var lines = csvData.split('\n');
        var headers = lines[0].split(',');
    
        // // Normalize headers (convert to lowercase and trim spaces)
        // var normalizedHeaders = headers.map(function(header) {
        //     return header.trim().toLowerCase().replace(/\s+/g, '_'); // Normalize space to underscore and convert to lowercase
        // });
    
        // Set column definitions for the grid
        $scope.gridOptions.columnDefs = headers.map(function(header) {
            return { name: header };
        });
    
        // Set data for the grid and filter out rows with empty columns
        $scope.gridOptions.data = lines.slice(1).map(function(line) {
            var row = line.split(',');
            var rowData = {};
            var isValidRow = true;
    
            // Check each cell in the row to ensure it's not empty
            row.forEach(function(cell, index) {
                rowData[headers[index]] = cell.trim();
                // If any cell is empty, mark the row as invalid
                if (cell.trim() === '') {
                    isValidRow = false;
                }
            });
            if (isValidRow && rowData["ClientCompany"]) {
                console.log("ClientCompany value in rowData: ", rowData["ClientCompany"]);
                console.log("Company List: ", $scope.companyList);
            
                let company = $scope.companyList.find(function(companyItem) {
                    const companyName = companyItem.companyName ? companyItem.companyName.trim().toLowerCase() : '';
                    const clientCompany = rowData["ClientCompany"] ? rowData["ClientCompany"].trim().toLowerCase() : '';
                    return companyName === clientCompany;
                });
                if (company) {
                    rowData["ClientCompany"] = company.companyId;
                } else {
                    rowData["ClientCompany"] = null;
                }
            } else if (!rowData["ClientCompany"]) {
                console.warn("Missing ClientCompany in row data: ", rowData);
            }
            if (rowData["PhoneNumbers"]) {
                const originalPhoneNumber = rowData["PhoneNumbers"];
                rowData["PhoneNumbers"] = rowData["PhoneNumbers"].startsWith('0')
                    ? rowData["PhoneNumbers"]
                    : '0' + rowData["PhoneNumbers"];
                console.log(
                    `Original Phone: ${originalPhoneNumber}, Updated Phone: ${rowData["PhoneNumbers"]}`
                );
            }
            // Only include valid rows (no empty columns)
            return isValidRow ? rowData : null;
        }).filter(function(row) {
            return row !== null; // Remove null entries from the final data
        });
    
        $scope.$apply();
    };
    
    $scope.refreshData = function () {
        $scope.gridOptions.columnDefs = [];
        $scope.gridOptions.data = [];
        $scope.$apply();
        document.getElementById('files123').value = '';
    };
    $scope.apply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase === "$apply" || phase === "$digest") {
            if (fn && typeof fn === "function") fn();
        } else {
            this.$apply(fn);
        }
    };
    $scope.addPhoneNumberBulk = function () {
        // Assuming the grid data or bulk data is stored in $scope.gridOptions.data
        let bulkData = $scope.gridOptions.data; // Modify this based on where your grid data is stored
        $scope.status = 'Saving...'; // Set status to 'Saving...'
        
        // Initialize counters for success and error tracking
        let successCount = 0;
        let errorCount = 0;
    
        // Update each phone number with the TrunkId
        angular.forEach(bulkData, function(phnNum) {
            phnNum.TrunkId = $scope.currentTrunk.id;
        });
    
        // Depending on the appState, we send either an add or update request
        let savePromise = phnNumTrunkService.addPhoneNumberTenant(bulkData);
    
        savePromise.then(function (data) {
            if (data.IsSuccess) {
                successCount = bulkData.length; 
                $scope.showNumberList($scope.currentTrunk);// All phone numbers are successfully saved
            } else {
                errorCount = bulkData.length; // All failed (can customize further to track failed records)
                var errMsg = data.Exception && data.Exception.Message ? data.Exception.Message : data.CustomMessage || 'Unknown error';
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            }
        }, function (err) {
            errorCount = bulkData.length; // All failed
            var errMsg = err.statusText || 'Error processing phone numbers';
            ngNotify.set(errMsg, {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });
        }).finally(function () {
            // After all promises have been processed, update the status
            if (errorCount > 0) {
                ngNotify.set(successCount + ' phone numbers saved successfully, ' + errorCount + ' failed', {
                    position: 'top',
                    sticky: false,
                    duration: 5000,
                    type: 'warning'
                });
            } else {
                ngNotify.set('All phone numbers saved successfully', {
                    position: 'top',
                    sticky: false,
                    duration: 5000,
                    type: 'success'
                });
            }
            $scope.status = 'Save Grid Data';  // Reset the status to the original button text
            $scope.refreshData(); // This will reset the grid and the file input
        });
    };
    
    $scope.updatePhoneNumber = function () {
        // Change the status to "Saving..." or a loading message before submitting
        $scope.status = 'Saving...';
    
        // Call the service to update the phone number
        phnNumTrunkService.updatePhoneNumberTenant($scope.phnNum)
            .then(function (data) {
                if (data.IsSuccess) {
                    // Display success notification
                    ngNotify.set('Phone number updated successfully', {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'success'
                    });
    
                    // Call the function to show the updated number list
                    $scope.showNumberList($scope.currentTrunk);
    
                    // Reset form data and status after successful update
                    $scope.resetPhoneForm();  // Reset the form and status
                } else {
                    // Handle error scenario
                    var errMsg = data.Exception && data.Exception.Message || data.CustomMessage || "Unknown error occurred";
                    ngNotify.set(errMsg, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
            })
            .catch(function (err) {
                // Handle catch block error
                var errMsg = err.statusText || "Error updating phone number";
                ngNotify.set(errMsg, {
                    position: 'top',
                    sticky: false,
                    duration: 3000,
                    type: 'error'
                });
            })
            .finally(function () {
                if ($scope.status !== 'Saving...') {
                    $scope.status = 'Upload';
                }
            });
    };
    
    $scope.resetPhoneForm = function () {
        // Reset form model (phnNum)
        $scope.phnNum = {
            PhoneNumber: '',
            ObjCategory: '',
            ClientCompany: '',
            Enable: false,
            InboundLimit: '',
            OutboundLimit: '',
            BothLimit: ''
        };
    
        // Reset form status
        $scope.status = 'Upload'; // Set status to 'Upload' after saving
    
        // // Optionally, reset form validation state
        // if ($scope.phoneForm) {
        //     $scope.phoneForm.$setPristine();   // Marks the form as pristine (not dirty)
        //     $scope.phoneForm.$setUntouched();  // Marks the form as untouched
        // }
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




    loadTrunks();

    reloadTrunkStatus();

    loadTranslations();


})

