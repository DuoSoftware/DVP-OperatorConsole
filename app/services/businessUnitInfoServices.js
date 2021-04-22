/**
 * Created by marlon on 2/3/19.
 */

'use strict';

opConsoleApp.factory('businessUnitInfoServices', function ($http, baseUrls) {


    //get all bu info
    var getAllBUDetails = function () {
        return $http({
            method: 'GET',
            url: baseUrls.organizationServiceBaseUrl + 'BusinessUnits/'
        }).then(function (resp) {
            return resp.data;

        });
    };

    var getConsolidatedBusinessUnits = function () {
        return $http({
            method: 'GET',
            url: baseUrls.organizationServiceBaseUrl + 'ConsolidatedBusinessUnits/consolidated'
        }).then(function (resp) {
            return resp.data;

        });
    };

    var getAllUsersForBU = function (bu) {
        return $http({
            method: 'GET',
            url: baseUrls.organizationServiceBaseUrl + 'BusinessUnit/' + bu + '/Users/'
        }).then(function (resp) {
            return resp.data;

        });
    };

    var getConsolidatedUsersForBU = function (bu, page, size) {
        return $http({
            method: 'GET',
            url: baseUrls.organizationServiceBaseUrl + 'ConsolidatedBusinessUnitFull/' + bu + '/Users/consolidated?Page=' + page + '&Size=' + size
        }).then(function (resp) {
            return resp.data;

        });
    };

    return {
        getAllBUDetails: getAllBUDetails,
        getConsolidatedBusinessUnits: getConsolidatedBusinessUnits,
        getAllUsersForBU: getAllUsersForBU,
        getConsolidatedUsersForBU: getConsolidatedUsersForBU
    };


}
)
    ;