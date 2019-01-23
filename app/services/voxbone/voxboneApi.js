(function () {

    var voxboneApiAccess = function ($http, baseUrls) {

        var getDidRequestCounts = function () {
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApi + 'order/DidRequest/counts'

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getDidRequestByStatus = function (status) {
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApi + 'order/DidRequest/status/'+status

            }).then(function (resp) {
                return resp.data;
            })
        };

        var configDidRequest = function (didRequest) {
            return $http({
                method: 'PUT',
                url: baseUrls.voxboneApi + 'order/ConfigDid',
                data: didRequest

            }).then(function (resp) {
                return resp.data;
            })
        };


        return{
            GetDidRequestCounts: getDidRequestCounts,
            GetDidRequestByStatus: getDidRequestByStatus,
            ConfigDidRequest: configDidRequest
        }

    };

    var module = angular.module("opConsoleApp");
    module.factory("voxboneApiAccess", voxboneApiAccess);

}());