/**
 * Created by dinusha on 4/7/2017.
 */
(function () {

    var sipUserService = function ($http, baseUrls) {
        var getContexts = function (companyId) {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'SipUser/Contexts/ClientCompany/' + companyId
            }).then(function (resp) {
                return resp.data;
            })
        };

        var saveCodecPreferenses = function (codecInfo, companyId) {

            return $http({
                method: 'POST',
                url: baseUrls.sipUserEndpointService + 'SipUser/ContextCodecPreferences/ClientCompany/' + companyId,
                data: codecInfo
            }).then(function (resp) {
                return resp.data;
            })
        };

        var updateCodecPreferenses = function (context1, context2, codecInfo, companyId) {

            return $http({
                method: 'PUT',
                url: baseUrls.sipUserEndpointService + 'SipUser/ContextCodecPreferences/Context1/' + context1 + '/Context2/' + context2 + '/ClientCompany/' + companyId,
                data: codecInfo
            }).then(function (resp) {
                return resp.data;
            })
        };

        var removeCodecPreferences = function (id, companyId) {

            return $http({
                method: 'DELETE',
                url: baseUrls.sipUserEndpointService + 'SipUser/ContextCodecPreferences/' + id + '/ClientCompany/' + companyId
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getCodecPreferenses = function (companyId) {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'SipUser/ContextCodecPreferences/ClientCompany/' + companyId
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getPhoneConfigs = function () {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'IPPhone/Configs'
            }).then(function (resp) {
                return (resp.data && resp.data.IsSuccess) ? resp.data.Result : [];
            })
        };

        var reassignIpPhoneToCompany = function (mac,company) {
            return $http({
                method: 'PUT',
                url: baseUrls.sipUserEndpointService + 'IPPhone/Config/'+mac+'/reassign',
                data:{company:company}
            }).then(function (resp) {
                return resp.data.IsSuccess;
            })
        };

        var postCompanyPhoneList = function (phoneList) {
            return $http({
                method: 'POST',
                url: baseUrls.sipUserEndpointService + 'IPPhone/Configs',
                data: phoneList
            }).then(function (resp) {
                return resp.data;
            })
        };
        var getAllPhoneList = function (tenant,company) {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'IPPhone/Configs/company/'+company+'/tenant/'+tenant,
            }).then(function (resp) {
                return resp.data;

            });
        };

        var getPhoneTemplates = function (tenant,company) {
            return $http({
                method: 'GET',
                url: baseUrls.sipUserEndpointService + 'IPPhone/Templates',
            }).then(function (resp) {
                return (resp.data && resp.data.IsSuccess) ? resp.data.Result : [];

            });
        };

        return {
            getPhoneTemplates:getPhoneTemplates,
            postCompanyPhoneList: postCompanyPhoneList,
            getAllPhoneList:getAllPhoneList,
            reassignIpPhoneToCompany: reassignIpPhoneToCompany,
            getPhoneConfigs: getPhoneConfigs,
            getContexts: getContexts,
            saveCodecPreferenses: saveCodecPreferenses,
            getCodecPreferenses: getCodecPreferenses,
            updateCodecPreferenses: updateCodecPreferenses,
            removeCodecPreferences: removeCodecPreferences
        };
    };

    var module = angular.module("opConsoleApp");
    module.factory("sipUserService", sipUserService);

}());