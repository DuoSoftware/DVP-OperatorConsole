/**
 * Created by dinusha on 6/11/2016.
 */

(function () {

    var userProfileApiAccess = function ($http, baseUrls) {

        var getProfileByName = function (user) {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'User/' + user + '/profile'

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUsers = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Users'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUsersWithPaging = function (page, size) {

            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + "Users/" + "?Page=" + page + "&Size=" + size
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            });
        };

        var getUserCount = function () {


            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + "UserCount"
            }).then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            });
        };

        var addContactToProfile = function (user, contact, type) {
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'User/' + user + '/profile/contact/' + contact,
                data: {
                    type: type
                }
            }).then(function (resp) {
                return resp.data;
            })
        };

        var addUser = function (userObj) {
            var jsonStr = JSON.stringify(userObj);
            return $http({
                method: 'POST',
                url: baseUrls.userServiceBaseUrl + 'User',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };

        var updateProfile = function (user, profileInfo) {
            delete profileInfo.email;
            profileInfo.birthday = profileInfo.dob.year + "-" + profileInfo.dob.month + "-" + profileInfo.dob.day;
            var jsonStr = JSON.stringify(profileInfo);
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'User/' + user + '/profile',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };

        var deleteContactFromProfile = function (user, contact) {
            return $http({
                method: 'DELETE',
                url: baseUrls.userServiceBaseUrl + 'User/' + user + '/profile/contact/' + contact
            }).then(function (resp) {
                return resp.data;
            })
        };

        var deleteUser = function (username) {
            return $http({
                method: 'DELETE',
                url: baseUrls.userServiceBaseUrl + 'User/' + username
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUserGroups = function () {
            return $http({
                method: 'GET',
                url: baseUrls.groupServiceBaseUrl + 'UserGroups'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getConsolidatedUserGroups = function () {
            return $http({
                method: 'GET',
                url: baseUrls.groupServiceBaseUrl + 'ConsolidatedUserGroups/consolidated'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getGroupMembers = function (groupID) {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'UserGroup/' + groupID + "/members",
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addUserGroup = function (userObj) {
            return $http({
                method: 'POST',
                url: baseUrls.groupServiceBaseUrl + 'UserGroup',
                data: userObj
            }).then(function (resp) {
                return resp.data;
            })
        };
        var removeUserFromGroup = function (gripID, userID) {
            return $http({
                method: 'DELETE',
                url: baseUrls.groupServiceBaseUrl + 'UserGroup/' + gripID + "/User/" + userID
            }).then(function (resp) {
                return resp.data;
            })
        };
        var addMemberToGroup = function (gripID, userID) {
            return $http({
                method: 'PUT',
                url: baseUrls.groupServiceBaseUrl + 'UserGroup/' + gripID + "/User/" + userID
            }).then(function (resp) {
                return resp.data;
            })
        };


        /*-------- function my profile ------------*/
        var getMyProfile = function () {
            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl + 'Myprofile'
            }).then(function (resp) {
                return resp.data;
            })
        };


        var updateMyProfile = function (profileInfo) {
            profileInfo.birthday = profileInfo.dob.year + "-" + profileInfo.dob.month + "-" + profileInfo.dob.day;
            var jsonStr = JSON.stringify(profileInfo);
            return $http({
                method: 'PUT',
                url: baseUrls.userServiceBaseUrl + 'Myprofile',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getMyRatings = function (owner) {
            return $http({
                method: 'GET',
                url: baseUrls.qaModule + 'QuestionPaperSubmission/Owner/' + owner + '/Completed/true',
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getOrganization = function () {
            return $http({
                method: 'GET',
                url: baseUrls.organizationServiceBaseUrl + 'Organisation'
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getMyOrganization = function (companyId) {

            return $http({
                method: 'GET',
                url: baseUrls.organizationServiceBaseUrl + 'Tenant/Company/' + companyId
            }).then(function (resp) {
                return resp.data;
            })
        };

        var addReportUser = function (userObj) {

            var jsonStr = JSON.stringify(userObj);
            return $http({
                method: 'POST',
                url: baseUrls.userServiceBaseUrl + 'User',
                data: jsonStr
            }).then(function (resp) {
                return resp.data;
            })
        };


        var AddSelectedNavigationToUser = function (userName, consoleName, navigationData) {
            return $http({
                method: 'put',
                url: baseUrls.userServiceBaseUrl + "ReportUser/" + userName + "/Console/" + consoleName + "/Navigation",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: navigationData
            }).then(function (response) {
                return response.data;
            });
        };


        return {
            getProfileByName: getProfileByName,
            addContactToProfile: addContactToProfile,
            deleteContactFromProfile: deleteContactFromProfile,
            updateProfile: updateProfile,
            getUsers: getUsers,
            addUser: addUser,
            deleteUser: deleteUser,
            addUserGroup: addUserGroup,
            getUserGroups: getUserGroups,
            getConsolidatedUserGroups: getConsolidatedUserGroups,
            removeUserFromGroup: removeUserFromGroup,
            getGroupMembers: getGroupMembers,
            addMemberToGroup: addMemberToGroup,
            getMyProfile: getMyProfile,
            updateMyProfile: updateMyProfile,
            getMyRatings: getMyRatings,
            getOrganization: getOrganization,
            getMyOrganization: getMyOrganization,
            addReportUser: addReportUser,
            AddSelectedNavigationToUser: AddSelectedNavigationToUser,
            getUsersWithPaging: getUsersWithPaging,
            getUserCount: getUserCount

        };
    };


    var module = angular.module("opConsoleApp");
    module.factory("userProfileServices", userProfileApiAccess);

}());
