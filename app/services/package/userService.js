/**
 * Created by Heshan.i on 4/7/2017.
 */
'use strict';
(function () {

    opConsoleApp.factory('userService', function ($http, baseUrls) {

        //---------------------------------Package management----------------------------------
        var getAllPackages = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Packages'
            }).then(function (resp) {
                return resp.data;
            });
        };

        var createNewPackage = function (veeryPackage) {
            return $http({
                method: 'POST',
                url: baseUrls.userServiceBaseUrl + 'Package',
                data: veeryPackage
            }).then(function (resp) {
                return resp.data;
            });
        };

        var updatePackage = function (veeryPackage) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'Package/' + veeryPackage.packageName,
                data: veeryPackage
            }).then(function (resp) {
                return resp.data;
            });
        };

        var removePackage = function (veeryPackageName) {
            return $http({
                method: 'DELETE',
                url: baseUrls.userServiceBaseUrl + 'Package/' + veeryPackageName
            }).then(function (resp) {
                return resp.data;
            });
        };

        var getAllSystemTask = function () {
            return $http({
                method: 'GET',
                url: baseUrls.resourceServiceBaseUrl + 'System/Task'
            }).then(function (resp) {
                return resp.data;
            });
        };

        //---------------------------------Unit management----------------------------------

        var getAllUnits = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'PackageUnits'
            }).then(function (resp) {
                return resp.data;
            });
        };

        var createNewUnit = function (veeryUnit) {
            return $http({
                method: 'POST',
                url: baseUrls.userServiceBaseUrl + 'PackageUnit',
                data: veeryUnit
            }).then(function (resp) {
                return resp.data;
            });
        };

        var updateUnit = function (veeryUnit) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'PackageUnit/' + veeryUnit.unitName,
                data: veeryUnit
            }).then(function (resp) {
                return resp.data;
            });
        };

        var removeUnit = function (veeryUnitName) {
            return $http({
                method: 'DELETE',
                url: baseUrls.userServiceBaseUrl + 'PackageUnit/' + veeryUnitName
            }).then(function (resp) {
                return resp.data;
            });
        };


        //---------------------------------Company management----------------------------------

        var createNewCompany = function (company) {
            return $http({
                method: 'POST',
                url: baseUrls.userServiceAuthUrl + 'auth/signup',
                data: company
            }).then(function (resp) {
                return resp.data;
            }).catch(function (ex) {
                return undefined;
            });
        };

        var getCompanyData = function (companyId) {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Tenant/Company/' + companyId
            }).then(function (resp) {
                return resp.data;
            }).catch(function (ex) {
                return undefined;
            });
        };

        var assignPackage = function (param) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'Organisation/' + param.companyId + '/Package/' + param.packageName
            }).then(function (resp) {
                return resp.data;
            }).catch(function (ex) {
                return undefined;
            });
        };

        var assignUnit = function (param) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'Organisation/' + param.companyId + '/Package/' +
                param.packageName + '/Unit/' + param.unit.unitName + '/' + param.topUpCount
            }).then(function (resp) {
                return resp.data;
            }).catch(function (ex) {
                return undefined;
            });
        };


        return {
            GetAllPackages: getAllPackages,
            CreateNewPackage: createNewPackage,
            UpdatePackage: updatePackage,
            RemovePackage: removePackage,
            GetAllUnits: getAllUnits,
            CreateNewUnit: createNewUnit,
            UpdateUnit: updateUnit,
            RemoveUnit: removeUnit,
            CreateNewCompany: createNewCompany,
            GetCompanyData: getCompanyData,
            AssignPackage: assignPackage,
            AssignUnit: assignUnit,
            GetAllSystemTask: getAllSystemTask
        }
    });
}());