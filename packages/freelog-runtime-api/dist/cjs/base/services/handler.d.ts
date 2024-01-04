export declare const nativeOpen: {
    (method: string, url: string | URL): void;
    (method: string, url: string | URL, async: boolean, username?: string | null | undefined, password?: string | null | undefined): void;
};
/**
 *
 * @param action api namespace.apiName
 * @param urlData array, use item for replace url's placeholder
 * @param data  body data or query data  string | object | Array<any> | null | JSON | undefined
 */
export default function frequest(action: any, urlData: Array<string | number> | null | undefined | "", data: any, returnUrl?: boolean, config?: any): any;
