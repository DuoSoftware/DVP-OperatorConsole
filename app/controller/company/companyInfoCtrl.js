/**
 * Created by damith on 4/6/17.
 */

opConsoleApp.directive('companyInfoEnterPress', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.companyInfoEnterPress);
                });

                event.preventDefault();
            }
        });
    };
});

opConsoleApp.directive('companyInfoOtherPress', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if(event.which !== 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.companyInfoOtherPress);
                });

                event.preventDefault();
            }
        });
    };
});

opConsoleApp.controller('companyInfoCtrl', function ($scope, ngNotify, companyInfoServices, phnNumTrunkService,
                                                     $state, $anchorScroll, userService) {


    $anchorScroll();

    $scope.companyData = {}

    $scope.companyObj = null;
    $scope.companyFilteredList = [];
    $scope.isLoadingCompany = false;
    $scope.searchCriteria = "";
    var getAllCompanyInfo = function () {
        $scope.totalUsers = 0;
        $scope.isLoadingCompany = true;
        companyInfoServices.getAllCompanyDetails().then(function (data) {
            $scope.isLoadingCompany = false;
            if (data.IsSuccess) {
                $scope.companyObj = data.Result;
                $scope.companyFilteredList = angular.copy($scope.companyObj);
                $scope.companyFilteredList.forEach(function myFunction(item, index) {
                    $scope.totalUsers = $scope.totalUsers + parseInt(item.activeUsers);
                });
                console.log("TOTAL USERS : " + $scope.totalUsers);
            }
        }, function (err) {
            console.log(err);
        });
    };
    getAllCompanyInfo();

    $scope.refreshPage = function () {
        getAllCompanyInfo();
    };

    $scope.searchByNumber = function(){
        $scope.setToSearchString();
    };

    $scope.searchByCompanyName = function(){
        $scope.isLoadingCompany = true;
        var comp = $scope.companyObj.filter(function(comp)
        {
            var regexp = '^(' + $scope.searchCompanyInfo + ')[^\s]*';
            var matchArray = comp.companyName.match(regexp);

            if(matchArray && matchArray.length > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        });

        if(comp && comp.length > 0)
        {
            $scope.companyFilteredList = comp;
        }
        else
        {
            ngNotify.set("No company found with given name", {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'warn'
            });
            $scope.companyFilteredList = [];
        }

        $scope.isLoadingCompany = false;
    };

    $scope.setToSearchString = function()
    {
        $scope.isLoadingCompany = true;
        phnNumTrunkService.getTenantNumber($scope.searchCompanyInfo).then(function(phnNumInfo)
        {
            if(phnNumInfo && phnNumInfo.Result)
            {
                var comp = $scope.companyObj.filter(function(comp)
                {
                    if(comp.companyId === phnNumInfo.Result.CompanyId)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                });

                if(comp)
                {
                    $scope.companyFilteredList = comp;
                }
                else
                {
                    $scope.companyFilteredList = [];
                }
                $scope.isLoadingCompany = false;

            }
            else
            {
                $scope.companyFilteredList = [];
                if(phnNumInfo.Exception)
                {
                    ngNotify.set(phnNumInfo.Exception.Message, {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'error'
                    });
                }
                else
                {
                    ngNotify.set("No company found for given number", {
                        position: 'top',
                        sticky: false,
                        duration: 3000,
                        type: 'warn'
                    });
                }

                $scope.isLoadingCompany = false;

            }

        }).catch(function(err)
        {
            $scope.companyFilteredList = [];
            ngNotify.set("Error occurred while searching company", {
                position: 'top',
                sticky: false,
                duration: 3000,
                type: 'error'
            });

            $scope.isLoadingCompany = false;

        })

    };

    $scope.resetSearch = function()
    {
        $scope.searchByNum = angular.copy($scope.searchCompanyInfo);
    };

    $scope.filterFunction = function(searchVal)
    {
        return searchVal === $scope.searchCompanyInfo || searchVal === $scope.searchByNum;
    };


    //go to view company summary
    $scope.goToCompany = function (company) {
        $state.go('op-console.company-summary', {
            "id": company.companyId
        });
    };

    //create new company
    $scope.isCreateNewCompany = false;
    $scope.createNewCompany = function () {
        $scope.isCreateNewCompany = !$scope.isCreateNewCompany;
        // if ($scope.isCreateNewCompany) {
        //     $('.blur-this').addClass('blur-me');
        // } else {
        //     $('.blur-this').removeClass('blur-me');
        // }
    };


    //form
    $scope.isLoadingNextForm = false;
    var formWizard = function () {
        return {
            next: function () {
                $scope.isLoadingNextForm = true;
                userService.CreateNewCompany($scope.companyData).then(function (response) {
                    $scope.isLoadingNextForm = false;
                    if (response) {
                        // $scope.getCompanyDetail(response.companyId);
                        $scope.createNewCompany();
                        $state.go('op-console.company-summary', {
                            "id": response.companyId
                        });
                    } else {
                        $scope.notify('Save Company Failed', 'error');
                    }
                });
            }
        }
    }();

    $scope.nextWizard = function () {
        formWizard.next();
    };

});
