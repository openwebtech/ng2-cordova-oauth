"use strict";
var utility_1 = require("../utility");
var PROVIDER_NAME = "Google";
var Google = (function () {
    function Google(options) {
        if (options === void 0) { options = {}; }
        this.apiUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        this.approvalUrl = 'https://accounts.google.com/o/oauth2/approval';
        if (!options.clientId || options.clientId == "") {
            throw Error("A " + PROVIDER_NAME + " client id must exist");
        }
        if (!options.appScope || options.appScope.length <= 0) {
            throw Error("A " + PROVIDER_NAME + " app scope must exist");
        }
        this.googleOptions = options;
        this.googleOptions.redirectUri = options.redirectUri || "urn:ietf:wg:oauth:2.0:oob";
        var params = {
            client_id: this.googleOptions.clientId,
            redirect_uri: this.googleOptions.redirectUri,
            response_type: 'code',
            scope: this.googleOptions.appScope.join(" ")
        };
        this.flowUrl = this.apiUrl + '?' + utility_1.OauthUtility.buildQuery(params);
    }
    Google.prototype.login = function () {
        var _this = this;
        var getTitleScript = 'document.querySelector("title").text;';
        var approvalUrlPattern = new RegExp('^' + this.approvalUrl);
        var browserRef;
        return new Promise(function (resolve, reject) {
            browserRef = window.cordova.InAppBrowser.open(_this.flowUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
            var onExitIAB = function (event) {
                reject("The " + PROVIDER_NAME + " sign in flow was canceled");
            };
            browserRef.addEventListener("exit", onExitIAB);
            browserRef.addEventListener("loadstop", function (event) {
                // console.log('loadstop', event);
                if (!approvalUrlPattern.test(event.url)) {
                    return;
                }
                new Promise(function (resolve2) {
                    browserRef.executeScript({ code: getTitleScript }, resolve2);
                })
                    .then(function (ret) {
                    // console.log('executeScript', ret);
                    var title = ret[0] || '';
                    var titleArray = title.split('=');
                    if (titleArray[0] === 'Success code' && titleArray[1]) {
                        browserRef.removeEventListener("exit", onExitIAB);
                        browserRef.close();
                        return { access_token: titleArray[1] };
                    }
                })
                    .then(resolve)
                    .catch(reject);
            });
        });
    };
    return Google;
}());
exports.Google = Google;
