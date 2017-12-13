(function () {
    var ipPhoneServices = function ($http, baseUrls) {
        var postCompanyPhoneList = function (phoneList) {
            return $http({
                method: 'POST',
                url: baseUrls.ipPhoneUrl + 'IPPhone/UploadPhoneList',
                data: phoneList
            }).then(function (resp) {
                return resp.data;
            })
        };
        var getAllPhoneList = function (param) {
            return $http({
                method: 'GET',
                url: baseUrls.ipPhoneUrl + 'IPPhone/getAllPhoneList/'+ param,
            }).then(function (resp) {
                return resp.data;

            });
        };
        return {
            postCompanyPhoneList: postCompanyPhoneList,
            getAllPhoneList:getAllPhoneList
        };
    }


    var module = angular.module("opConsoleApp");
    module.factory("ipPhoneServices", ipPhoneServices);
}());