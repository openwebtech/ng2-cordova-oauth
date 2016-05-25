import { IOauthProvider } from "../oauth";
import { OauthUtility } from "../utility";

declare var window: any;
const PROVIDER_NAME = "Google";

/*
 * Configuration options for using Google oauth
 */
export interface IGoogleOptions {
  clientId?: String;
  appScope?: Array<String>;
  redirectUri?: String;
}

export class Google implements IOauthProvider {

  googleOptions: IGoogleOptions;
  flowUrl: String;
  apiUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  approvalUrl = 'https://accounts.google.com/o/oauth2/approval';

  constructor(options: IGoogleOptions = {}) {
    if (!options.clientId || options.clientId == "") {
      throw Error("A " + PROVIDER_NAME + " client id must exist");
    }
    if (!options.appScope || options.appScope.length <= 0) {
      throw Error("A " + PROVIDER_NAME + " app scope must exist");
    }
    this.googleOptions = options;
    this.googleOptions.redirectUri = options.redirectUri || "urn:ietf:wg:oauth:2.0:oob";
    const params = {
      client_id: this.googleOptions.clientId,
      redirect_uri: this.googleOptions.redirectUri,
      response_type: 'code',
      scope: this.googleOptions.appScope.join(" ")
    };
    this.flowUrl = this.apiUrl + '?' + OauthUtility.buildQuery(params);
  }

  login() {
    const getTitleScript = 'document.querySelector("title").text;';
    const approvalUrlPattern = new RegExp('^' + this.approvalUrl);
    var browserRef;
    return new Promise((resolve, reject) => {
      browserRef = window.cordova.InAppBrowser.open(this.flowUrl, "_blank",
        "location=no,clearsessioncache=yes,clearcache=yes");
      const onExitIAB = (event) => {
        reject("The " + PROVIDER_NAME + " sign in flow was canceled");
      };
      browserRef.addEventListener("exit", onExitIAB);
      browserRef.addEventListener("loadstop", event => {
        // console.log('loadstop', event);
        if (!approvalUrlPattern.test(event.url)) {
          return;
        }
        new Promise(resolve2 => {
          browserRef.executeScript({code: getTitleScript}, resolve2);
        })
        .then(ret => {
          // console.log('executeScript', ret);
          const title = ret[0] || '';
          const titleArray = title.split('=');
          if (titleArray[0] === 'Success code' && titleArray[1]) {
            browserRef.removeEventListener("exit", onExitIAB);
            browserRef.close();
            return {access_token: titleArray[1]};
          }
        })
        .then(resolve)
        .catch(reject);
      });
    });
  }
}
