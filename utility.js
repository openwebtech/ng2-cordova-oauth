"use strict";
var OauthUtility = (function () {
    function OauthUtility() {
    }
    OauthUtility.parseImplicitResponse = function (responseParameters) {
        var parameterMap = {};
        for (var i = 0; i < responseParameters.length; i++) {
            parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        }
        if (parameterMap["access_token"] !== undefined && parameterMap["access_token"] !== null) {
            return parameterMap;
        }
        else {
            return null;
        }
    };
    OauthUtility.buildQuery = function (params) {
        return Object.keys(params)
            .map(function (key) { return (key + "=" + params[key]); })
            .join('&');
    };
    return OauthUtility;
}());
exports.OauthUtility = OauthUtility;
