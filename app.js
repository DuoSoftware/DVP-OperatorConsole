/**
 * Created by damith on 3/31/17.
 */

var opConsoleApp = angular.module('opConsoleApp', ['ngRoute', 'ui.bootstrap',
    'ui.router', 'angular-jwt', 'angular.filter', 'satellizer',
    'LocalStorageModule', 'base64', 'easypiechart', 'ngNotify',
    'checklist-model', 'as.sortable', 'ui.slimscroll', 'oitozero.ngSweetAlert',
    'ngTagsInput', 'btford.socket-io', 'cp.ngConfirm', 'ui.grid','ui.grid.importer', 'ui.grid.pinning',
    'ui.grid.autoResize',
    'ui.grid.exporter',
    'ui.grid.resizeColumns',
    'ui.grid.resizeColumns',
    'ui.grid.selection',
    'ui.grid.moveColumns',
    'ui.grid.infiniteScroll',
    'ui.grid.grouping', 'ui.select', 'ngSanitize', 'ngCsv', 'ui.bootstrap.datetimepicker', 'ngTagsInput', 'gantt',
    'gantt.table',
    'gantt.labels',
    'gantt.tooltips',
    'gantt.sortable',
    'gantt.resizeSensor',
    'gantt.dependencies', 'angularMoment', 'moment-picker']);


opConsoleApp.constant('moment', moment);
//app router
opConsoleApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider", "$authProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider, $authProvider) {

        //auth URL
        var authProviderUrl = 'http://userservice.app1.veery.cloud/';
        $authProvider.loginUrl = authProviderUrl + 'auth/login';
        $authProvider.signupUrl = authProviderUrl + 'auth/signup';

        $urlRouterProvider.otherwise('/sign-in');
        $stateProvider.state("op-console", {
            url: "/op-console",
            templateUrl: "app/views/main-op-console.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.test', {
            url: "/test",
            templateUrl: "app/views/template/test.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.monitor-server-performance', {
            url: "/monitor-server-performance",
            templateUrl: "app/views/monitor-server-performance.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.codec-management', {
            url: "/codec-management",
            templateUrl: "app/views/codec-management/codec-management.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.trunk-configuration', {
            url: "/trunk-configuration",
            templateUrl: "app/views/trunk-configuration/trunk-configuration.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.voxbone-number-configuration', {
            url: "/voxbone-number-configuration",
            templateUrl: "app/views/voxbone-number-config/voxboneNumberConfigMain.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.all-company-information', {
            url: "/all-company-information",
            templateUrl: "app/views/company/all-company-information.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.company-summary', {
            url: "/company-summary?id",
            templateUrl: "app/views/company/company-summary.html",
            data: {
                requireLogin: true
            }
        }).state('sign-in', {
            url: "/sign-in",
            templateUrl: "app/auth/app/views/sign-in.html",
            data: {
                requireLogin: false
            }
        }).state('op-console.package', {
            url: "/package",
            templateUrl: "app/views/package/package.html",
            controller: "packageController",
            data: {
                requireLogin: true
            }
        }).state('op-console.unit', {
            url: "/unit",
            templateUrl: "app/views/package/unit.html",
            controller: "unitController",
            data: {
                requireLogin: true
            }
        }).state('op-console.create-company', {
            url: "/create-company",
            templateUrl: "app/views/company/createCompany.html",
            controller: "createCompanyController",
            data: {
                requireLogin: true
            }
        }).state('op-console.phone_configuration', {
            url: "/phone_configuration",
            templateUrl: "app/views/ipPhone/phone_configuration.html",
            controller: "phone_configuration_controller",
            data: {
                requireLogin: true
            }
        }).state('op-console.agent-productivity', {
            url: "/agent-productivity",
            controller: "agentProductivityController",
            templateUrl: "app/views/reports/agentProductivity.html",
            data: {
                requireLogin: true
            }
        }).state('op-console.agent-summery', {
            url: "/agent-summery",
            controller: "agentStatusEventController",
            templateUrl: "app/views/reports/agentStatusEventList.html"
        }).state('op-console.ipPhone', {
            url: "/ip-phone-list",
            templateUrl: "app/views/ipPhone/ipPhone.html",
            controller: "ipPhoneController",
            data: {
                requireLogin: true
            }
        }).state('op-console.ipPhoneUpload', {
            url: "/ip-phone-upload",
            templateUrl: "app/views/ipPhone/ipPhoneUpload.html",
            controller: "ipPhoneController",
            data: {
                requireLogin: true
            }
        }).state('op-console.create-report-user', {
            url: "/user-create",
            controller: "usercreationController",
            templateUrl: "app/views/user/userList.html",
            data :{
                requireLogin:true,
                navigation: "REPORTUSERCREATION"
            }
        })
    }], function () {

});


//app base URL
var baseUrls = {
    'userServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/', //userservice.app.veery.cloud
    'monitorServerUrl': 'http://monitorrestapi.app.veery.cloud/DVP/API/1.0.0.0/MonitorRestAPI/',
    'sipUserEndpointService': 'http://localhost:8086/DVP/API/1.0.0.0/',// 'http://sipuserendpointservice.app.veery.cloud/DVP/API/1.0.0.0/SipUser/',
    'userServiceAuthUrl': 'http://userservice.app1.veery.cloud/',
    'resourceServiceBaseUrl': 'http://resourceservice.app.veery.cloud/DVP/API/1.0.0.0/ResourceManager/',// resourceservice.app.veery.cloud
    'phoneNumTrunkServiceBaseURL': 'http://phonenumbertrunkservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'ruleServiceBaseURL': 'http://ruleservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'limitHandlerBaseURL': 'http://limithandler.app.veery.cloud/DVP/API/1.0.0.0/',
    'clusterConfigurationBaseURL': 'http://clusterconfig.app.veery.cloud/DVP/API/1.0.0.0/',
    'ipMessageURL': 'http://ipmessagingservice.app.veery.cloud/',
    'billingserviceURL': 'http://billingservice.app.veery.cloud/DVP/API/1.0.0.0/Billing/',
    'notification': 'http://notificationservice.app.veery.cloud',
    'authUrl': 'http://userservice.app1.veery.cloud',
    'cdrProcessor': 'http://cdrprocessor.app.veery.cloud/DVP/API/1.0.0.0/CallCDR/', //cdrprocessor.app.veery.cloud
    'voxboneApi': 'http://localhost:8832/DVP/API/1.0.0.0/voxbone/'
};

opConsoleApp.constant('moment', moment);
opConsoleApp.constant('baseUrls', baseUrls);

opConsoleApp.constant('config', {
    Auth_API: 'http://userservice.app1.veery.cloud/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048',
    clusterId: '2'
});

opConsoleApp.run(['$anchorScroll', function ($anchorScroll, $rootScope, loginService, $location, $state) {
    $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]);


//authentication
//Authentication
opConsoleApp.run(function ($rootScope, loginService, $location, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin) {
            if (!loginService.getToken()) {
                event.preventDefault();
                $state.go('sign-in');
            }
            // get me a login modal!
        }
    });
    var decodeToken = loginService.getTokenDecode();
    if (!decodeToken) {
        $state.go('sign-in');
        return;
    }
});


//Password verification
opConsoleApp.directive('passwordVerify', function () {
    return {
        restrict: 'A', // only activate on element attribute
        require: 'ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('passwordVerify', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;
                // set validity
                var status = !val1 || !val2 || val1 === val2;
                ngModel.$setValidity('passwordVerify', status);
                // return val1
            };
        }
    }
});


opConsoleApp.filter('secondsToDateTime', [function () {
    return function (seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);