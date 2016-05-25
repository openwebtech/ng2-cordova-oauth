export class OauthUtility {

    static parseImplicitResponse(responseParameters: Array<String>): Object {
        var parameterMap = {};
        for (var i = 0; i < responseParameters.length; i++) {
            parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        }
        if (parameterMap["access_token"] !== undefined && parameterMap["access_token"] !== null) {
            return parameterMap;
        } else {
            return null;
        }
    }

    static buildQuery(params: Object): string {
      return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
    }

}
