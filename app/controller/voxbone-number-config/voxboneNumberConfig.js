
opConsoleApp.controller('voxboneNumberConfigCtrl', function ($scope, ngNotify, voxboneApiAccess) {

    $scope.showRequestCounts = false;
    $scope.isLoadingRequests = false;
    $scope.isUpdatingDidRequest = false;
    $scope.DidRequests = [];
    $scope.ActiveRequestType = 'requested';
    $scope.DetailedView = false;
    $scope.selectedDidRequest = {};
    $scope.RequestCounts = {
        requested: 0,
        processing: 0,
        completed: 0
    };

    $scope.notify = function (message, type) {
        ngNotify.set(message, {
            position: 'top',
            sticky: false,
            duration: 3000,
            type: type
        });
    };

    var loadVoxRequestCounts = function () {
        voxboneApiAccess.GetDidRequestCounts().then(function (response) {
            if (response.IsSuccess && response.Result && response.Result.length > 0) {
                response.Result.forEach(function (counts) {
                    $scope.RequestCounts[counts.RequestStatus] = counts.Count;
                });
                $scope.showRequestCounts = true;
            }
            else {
                $scope.showRequestCounts = true;
                $scope.notify('No voxbone request found', 'warn');
            }
        }, function (error) {
            $scope.showRequestCounts = true;
            $scope.notify('Load voxbone request counts failed', 'error');
            console.log("Error in Load voxbone request counts " + error);
            loginService.isCheckResponse(error);
        });
    };

    $scope.loadVoxRequestByStatus = function (status) {
        $scope.DidRequests = [];
        $scope.isLoadingRequests = true;
        $scope.ActiveRequestType = status;
        $scope.DetailedView = false;
        $scope.selectedDidRequest = {};
        voxboneApiAccess.GetDidRequestByStatus(status).then(function (response) {
            if (response.IsSuccess && response.Result && response.Result.length > 0){
                $scope.isLoadingRequests = false;
                $scope.DidRequests = response.Result.map(function (didReq) {
                    didReq.updatedAt = moment(didReq.updatedAt).local().format("YYYY-MM-DD HH:mm:ss");
                    didReq.createdAt = moment(didReq.createdAt).local().format("YYYY-MM-DD HH:mm:ss");
                    return didReq;
                });
            }else {
                $scope.isLoadingRequests = false;
                $scope.notify('No voxbone request found', 'warn');
            }
        }, function (error) {
            $scope.isLoadingRequests = false;
            $scope.notify('Load voxbone request failed', 'error');
            console.log("Error in Agent details picking " + error);
            loginService.isCheckResponse(error);
        });
    };

    $scope.goToDidRequest = function (didRequest) {
        $scope.DetailedView = true;
        $scope.selectedDidRequest = didRequest;
    };

    $scope.backToNumberList = function () {
        $scope.DetailedView = false;
        $scope.selectedDidRequest = {};
    };

    $scope.refreshData = function () {
        loadVoxRequestCounts();
        $scope.loadVoxRequestByStatus($scope.ActiveRequestType);
    };

    $scope.searchDidRequest = function (query) {
        $scope.filterResult =  $scope.DidRequests.filter(function (didReq) {
            return didReq.DidNumber.match(query);
        });
    };

    $scope.configureDidRequest = function () {
        voxboneApiAccess.ConfigDidRequest($scope.selectedDidRequest).then(function (response) {
            if (response.IsSuccess){
                $scope.notify('Configure DID request success', 'success');
                $scope.refreshData();
            }else {
                $scope.notify(response.Message, 'error');
            }
        }, function (error) {
            $scope.notify('Configure DID request failed', 'error');
            console.log("Error in Configure DID request " + error);
            loginService.isCheckResponse(error);
        });
    }

    loadVoxRequestCounts();
    $scope.loadVoxRequestByStatus('requested');

});
