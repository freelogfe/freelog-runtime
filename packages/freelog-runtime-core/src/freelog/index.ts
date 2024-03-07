import { baseURL, isTest } from "./structure/base";
import { baseInit, getInfoByNameOrDomain } from "freelog-runtime-api";

import { initNode } from "./structure/init";
baseInit(baseURL, isTest);
export function run() {
  initNode();
}