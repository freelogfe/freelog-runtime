/**
 *
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
export declare function compareObjects(origin: any, data: any, diff?: boolean): void;
export declare function isMobile(): boolean;
export declare function checkPhone(phone: string): boolean;
export declare function checkEmail(email: string): boolean;
export declare function checkPassword(password: string): boolean;
export declare function checkPayPassword(password: string): boolean;
export declare function checkUsername(username: string): boolean;
