export { baseInfo } from "../config/env";
import { baseInfo } from "../config/env";

export const isTest = baseInfo.isTest;
export const baseURL = baseInfo.directURL;
window.baseURL = baseInfo.directURL;
window.isTest = isTest;
