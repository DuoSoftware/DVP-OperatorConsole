/**
 * Created by marlon on 2/3/19.
 */

'use strict';

opConsoleApp.factory('businessUnitInfoServices', function ($http, baseUrls) {


        //get all company info
        var getAllBUDetails = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'BusinessUnits/'
            }).then(function (resp) {
                return resp.data;

            });
        };



        return {
            getAllBUDetails: getAllBUDetails
        }


    }
)
;