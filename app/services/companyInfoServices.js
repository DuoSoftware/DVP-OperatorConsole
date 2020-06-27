/**
 * Created by damith on 4/6/17.
 */

"use strict";

opConsoleApp.factory("companyInfoServices", function ($http, baseUrls) {
  //get all company info
  var getAllCompanyDetails = function () {
    return $http({
      method: "GET",
      url: baseUrls.userServiceBaseUrl + "TenantInfo/company",
    }).then(function (resp) {
      return resp.data;
    });
  };

  var getCurrentCompanyById = function (param) {
    return $http({
      method: "GET",
      url: baseUrls.userServiceBaseUrl + "Tenant/Company/" + param.companyId,
    }).then(function (resp) {
      return resp.data;
    });
  };

  var changeCompanyActivation = function (param) {
    return $http({
      method: "PUT",
      url:
        baseUrls.userServiceBaseUrl +
        "Organisation/" +
        param.companyId +
        "/Activate/" +
        param.state,
    }).then(function (resp) {
      return resp.data;
    });
  };

  //company summary details

  return {
    getAllCompanyDetails: getAllCompanyDetails,
    getCurrentCompanyById: getCurrentCompanyById,
    changeCompanyActivation: changeCompanyActivation,
  };
});
