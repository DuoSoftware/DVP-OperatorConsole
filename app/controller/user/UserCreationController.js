/**
 * Created by Pawan on 6/5/2018.
 */
opConsoleApp.controller('usercreationController', function ($scope, ngNotify, userProfileServices) {



    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });

        /* new PNotify({
         title: title,
         text: content,
         type: type,
         styling: 'bootstrap3',
         animate: {
         animate: true,
         in_class: "bounceIn",
         out_class: "bounceOut"
         }
         });*/
    };

    $scope.collapsedButton = 'New User';
    $scope.userObj={};
    $scope.userObj.role="reportadmin";
    $scope.saveReportUser = function () {

        $scope.userObj.isReportAdmin=true;

        userProfileServices.addReportUser($scope.userObj).then(function (data) {
            if (data.IsSuccess) {
                // $scope.notify('User Saved Successfully', 'success');


                var editedMenus = [];
                editedMenus = [{
                    "menuItem": "AGENTPRODUCTIVITY",//"navigationName": "ARDS_CONFIGURATION",
                    "menuAction": [
                        {
                            delete:	false,
                            read:	true,
                            scope:	"productivity",
                            write:	false
                        },

                        {
                            delete:	false,
                            read:	true,
                            scope:	"ardsresource",
                            write:	false
                        },
                        {
                            scope : "myNavigation",
                            read : true,
                            write : true,
                            delete : true
                        },
                        {
                            scope : "notification",
                            read : true
                        },
                        {
                            scope : "myUserProfile",
                            read : true
                        },
                        {
                            scope : "consolidatedreports",
                            read : true
                        }
                    ]
                },



                    {
                        "menuItem" : "AGENTSUMMERY",
                        "menuAction" : [
                            {
                                "scope" : "cdr",
                                "read" : true
                            }
                        ]
                    }

                ];

                userProfileServices.AddSelectedNavigationToUser($scope.userObj.mail,"OPERATOR_CONSOLE", editedMenus).then(function (response) {
                    if (response.IsSuccess) {
                        $scope.showAlert("Info", "Info", "AGENT_PRODUCTIVITY" + " Successfully Updated.")
                    }
                    else {
                        if (response.CustomMessage) {
                            $scope.showAlert("Error","error", response.CustomMessage);
                        }
                        else {
                            $scope.showAlert("Error","error", "AGENT_PRODUCTIVITY" + " Failed To Update.");
                        }

                    }

                }, function (error) {
                    $scope.showAlert("Error","error", "Failed to Add Permissions AGENT_PRODUCTIVITY");
                });



            }
            else
            {
                $scope.showAlert("Error","error", "Failed to Create Report User");
            }
        });
    }

    /*
     $anchorScroll();

     $scope.companyData = {}

     $scope.companyObj = null;
     $scope.companyFilteredList = [];
     $scope.isLoadingCompany = false;
     $scope.searchCriteria = "";
     var getAllCompanyInfo = function () {
     $scope.isLoadingCompany = true;
     companyInfoServices.getAllCompanyDetails().then(function (data) {
     $scope.isLoadingCompany = false;
     if (data.IsSuccess) {
     $scope.companyObj = data.Result;
     $scope.companyFilteredList = angular.copy($scope.companyObj);
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
     };*/

});