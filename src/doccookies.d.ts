declare module "doc-cookies" {
  export function getItem(sKey: string) : string;
   export function setItem(sKey: string, sValue: string, vEnd: string, sPath: string, sDomain: string, bSecure: string): any;
   export function removeItem(sKey: string, sPath: string, sDomain: string): any;
   export function hasItem(sKey: string): any;
   export function keys(): any;
}
