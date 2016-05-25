import { IOauthProvider } from "../oauth";
export interface IGoogleOptions {
    clientId?: String;
    appScope?: Array<String>;
    redirectUri?: String;
}
export declare class Google implements IOauthProvider {
    googleOptions: IGoogleOptions;
    flowUrl: String;
    apiUrl: string;
    approvalUrl: string;
    constructor(options?: IGoogleOptions);
    login(): Promise<{}>;
}
