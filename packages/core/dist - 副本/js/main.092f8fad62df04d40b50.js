/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 678:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// NAMESPACE OBJECT: ./src/platform/runtime/single-spa/single-spa.js
var single_spa_namespaceObject = {};
__webpack_require__.r(single_spa_namespaceObject);
__webpack_require__.d(single_spa_namespaceObject, {
  "BOOTSTRAPPING": function() { return BOOTSTRAPPING; },
  "LOADING_SOURCE_CODE": function() { return LOADING_SOURCE_CODE; },
  "LOAD_ERROR": function() { return LOAD_ERROR; },
  "MOUNTED": function() { return MOUNTED; },
  "MOUNTING": function() { return MOUNTING; },
  "NOT_BOOTSTRAPPED": function() { return NOT_BOOTSTRAPPED; },
  "NOT_LOADED": function() { return NOT_LOADED; },
  "NOT_MOUNTED": function() { return NOT_MOUNTED; },
  "SKIP_BECAUSE_BROKEN": function() { return SKIP_BECAUSE_BROKEN; },
  "UNMOUNTING": function() { return UNMOUNTING; },
  "UPDATING": function() { return UPDATING; },
  "addErrorHandler": function() { return addErrorHandler; },
  "ensureJQuerySupport": function() { return ensureJQuerySupport; },
  "mountRootParcel": function() { return mountRootParcel; },
  "removeErrorHandler": function() { return removeErrorHandler; },
  "setBootstrapMaxTime": function() { return setBootstrapMaxTime; },
  "setMountMaxTime": function() { return setMountMaxTime; },
  "setUnloadMaxTime": function() { return setUnloadMaxTime; },
  "setUnmountMaxTime": function() { return setUnmountMaxTime; }
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/axios@0.21.4/node_modules/axios/index.js
var axios = __webpack_require__(326);
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);
;// CONCATENATED MODULE: ./src/services/request.ts

axios_default().interceptors.request.use(function (config) {
  return config;
}, function (error) {
  console.error(error); // for debug 11

  Promise.reject(error);
}); // response 拦截器

axios_default().interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // TODO
  console.error(error); // for debug 11
});
/* harmony default export */ const request = ((axios_default()));
;// CONCATENATED MODULE: ./src/services/base.ts
window.isTest = window.location.host.split('.')[1] === 't';
var placeHolder = 'urlPlaceHolder';
var baseURL = window.location.protocol + '//qi.freelog.com/v2/';

if (window.location.href.indexOf('testfreelog') > -1) {
  baseURL = window.location.protocol + '//qi.testfreelog.com/v2/';
}

window.baseURL = baseURL;
var base_baseUrl = (/* unused pure expression or super */ null && (baseURL));
var baseConfig = {
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000
}; // TODO 上传文件进度等需要配置
;// CONCATENATED MODULE: ./src/utils/utils.ts
/**
 *
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
function compareObjects(origin, data, diff) {
  if (diff === void 0) {
    diff = false;
  }

  var otype = Object.prototype.toString.call(origin);
  var dtype = Object.prototype.toString.call(data);

  if (dtype === otype && otype === "[object Array]") {
    origin = {
      0: origin
    };
    data = {
      0: data
    };
  } else if (otype !== dtype || otype !== "[object Object]") {
    !["[object Array]", "[object object]"].includes(otype) && console.error(origin + " is not object or array");
    !["[object Array]", "[object object]"].includes(dtype) && console.error(data + " is not object or array");
    return;
  }

  Object.keys(data).forEach(function (dkey) {
    // depend on whether diff
    var isDelete = !diff;
    Object.keys(origin).some(function (okey) {
      if (dkey === okey) {
        isDelete = !isDelete;

        if (diff) {
          return true;
        }

        var otype_1 = Object.prototype.toString.call(origin[okey]);
        var dtype_1 = Object.prototype.toString.call(data[dkey]); // loop if they are object the same time

        if (otype_1 === dtype_1 && dtype_1 === "[object Object]") {
          compareObjects(origin[okey], data[dkey], diff);
        } else if (otype_1 === dtype_1 && dtype_1 === "[object Array]" && Object.prototype.toString.call(origin[dkey][0]) === "[object Object]") {
          // if they are array the same time and origin[dkey][0] is object,
          data[dkey].forEach(function (item) {
            Object.prototype.toString.call(item) === "[object Array]" && compareObjects(origin[okey][0], item, diff);
          });
        }

        return true;
      }

      return false;
    });
    isDelete && delete data[dkey];
  });
}
function isMobile() {
  var browser = {
    versions: function () {
      var u = navigator.userAgent; // app = navigator.appVersion;

      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1,
        presto: u.indexOf("Presto") > -1,
        webKit: u.indexOf("AppleWebKit") > -1,
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1,
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
        iPhone: u.indexOf("iPhone") > -1,
        iPad: u.indexOf("iPad") > -1,
        webApp: u.indexOf("Safari") === -1 //是否web应该程序，没有头部与底部

      };
    }(),
    // @ts-ignore
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }; //如果是移动端就进行这里

  if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
    return true;
  } else {
    return false;
  }
}
;// CONCATENATED MODULE: ./src/bridge/eventType.ts
var NODE_FREEZED = 0;
var THEME_NONE = 1;
var THEME_FREEZED = 2;
var LOGIN = 3;
var CONTRACT = 4;
var LOGIN_OUT = 5;
var USER_FREEZED = 6;
var eventType = {
  NODE_FREEZED: NODE_FREEZED,
  THEME_NONE: THEME_NONE,
  THEME_FREEZED: THEME_FREEZED,
  LOGIN: LOGIN,
  CONTRACT: CONTRACT,
  LOGIN_OUT: LOGIN_OUT,
  USER_FREEZED: USER_FREEZED
};
var SUCCESS = 0;
var FAILED = 1;
var USER_CANCEL = 2;
var DATA_ERROR = 3;
var TEST_NODE = 4;
var OFFLINE = 5; // 展品已下线

var resultType = {
  SUCCESS: SUCCESS,
  FAILED: FAILED,
  USER_CANCEL: USER_CANCEL,
  DATA_ERROR: DATA_ERROR,
  TEST_NODE: TEST_NODE,
  OFFLINE: OFFLINE
};
// EXTERNAL MODULE: ../../node_modules/.pnpm/doc-cookies@1.1.0/node_modules/doc-cookies/cookies.js
var cookies = __webpack_require__(319);
var cookies_default = /*#__PURE__*/__webpack_require__.n(cookies);
;// CONCATENATED MODULE: ./src/services/api/modules/exhibit.ts

var exhibit = {
  // placeHolder: nodeId exhibitId
  getExhibitDetail: {
    url: "exhibits/".concat(placeHolder, "/").concat(placeHolder),
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadResourceDetailInfo: 'int',
      isLoadContract: "int"
    }
  },
  // placeHolder: nodeId exhibitId
  getTestExhibitDetail: {
    url: "exhibits/".concat(placeHolder, "/test/").concat(placeHolder),
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadContract: "int"
    }
  },
  getExhibitListById: {
    url: "exhibits/".concat(placeHolder, "/list"),
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int"
    }
  },
  getTestExhibitById: {
    url: "exhibits/".concat(placeHolder, "/test/list"),
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int"
    }
  },
  // placeHolder: nodeId
  getExhibitListByPaging: {
    url: "exhibits/".concat(placeHolder),
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitArticleResourceType: "string",
      onlineStatus: "int",
      tags: "string",
      projection: "string",
      sort: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadResourceDetailInfo: 'int',
      isLoadPolicyInfo: "int",
      isTranslate: "int",
      tagQueryType: "int"
    }
  },
  getTestExhibitByPaging: {
    url: "exhibits/".concat(placeHolder, "/test"),
    method: "GET",
    dataModel: {
      skip: "int",
      limit: "int",
      articleResourceTypes: "string",
      omitArticleResourceType: "string",
      onlineStatus: "int",
      sort: "string",
      tags: "string",
      projection: "string",
      keywords: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
      tagQueryType: "int"
    }
  },
  // exhibitId  {result|info|fileStream}
  getExhibitAuthById: {
    url: "auths/exhibits/".concat(placeHolder, "/").concat(placeHolder, "/").concat(placeHolder),
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string" // 主题或插件的压缩包内部子作品,需要带相对路径

    }
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitAuthById: {
    url: "auths/exhibits/".concat(placeHolder, "/test/").concat(placeHolder, "/").concat(placeHolder),
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string"
    }
  },
  // nodeId
  getExhibitAuthStatus: {
    url: "auths/exhibits/".concat(placeHolder, "/batchAuth/results"),
    method: "GET",
    dataModel: {
      authType: "string",
      exhibitIds: "string" // 展品ID,多个逗号分隔

    }
  },
  // nodeId
  getTestExhibitAuthStatus: {
    url: "auths/exhibits/".concat(placeHolder, "/test/batchAuth/results"),
    method: "GET",
    dataModel: {
      authType: "string",
      exhibitIds: "string" // 展品ID,多个逗号分隔

    }
  },
  getExhibitSignCount: {
    url: "contracts/subjects/signCount",
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string"
    }
  },
  // nodeId exhibitId articleNids
  getExhibitDepInfo: {
    url: "exhibits/".concat(placeHolder, "/").concat(placeHolder, "/articles/list"),
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string"
    }
  },
  getTestExhibitDepInfo: {
    url: "exhibits/".concat(placeHolder, "/test/").concat(placeHolder, "/articles/list"),
    method: "GET",
    dataModel: {
      subjectIds: "string",
      subjectType: "string"
    }
  }
};
/* harmony default export */ const modules_exhibit = (exhibit);
;// CONCATENATED MODULE: ./src/services/api/modules/contract.ts

var contract = {
  // exhibitId, result|info|articleInfo|fileStream
  getContractInfo: {
    url: "contracts/".concat(placeHolder),
    method: "GET",
    dataModel: {
      contractIds: "string",
      isLoadPolicyInfo: "int",
      projection: "string"
    }
  },
  getContracts: {
    url: "contracts/list",
    method: "GET",
    dataModel: {
      contractIds: "string",
      subjectIds: "string",
      subjectType: "int",
      licenseeIdentityType: "int",
      licensorId: "string",
      licenseeId: "string",
      isLoadPolicyInfo: "int",
      projection: "string",
      isTranslate: "int"
    }
  },
  contract: {
    url: "contracts",
    method: "POST",
    dataModel: {
      subjectId: "string",
      subjectType: "int",
      policyId: "string",
      licenseeId: "string",
      licenseeIdentityType: "int"
    }
  },
  contracts: {
    url: "contracts/batchSign",
    method: "POST",
    dataModel: {
      subjects: "array",
      subjectId: "string",
      subjectType: "int",
      policyId: "string",
      licenseeId: "string",
      licenseeIdentityType: "int",
      isWaitInitial: "int"
    }
  },
  getTransitionRecords: {
    url: "contracts/".concat(placeHolder, "/transitionRecords"),
    method: "GET",
    dataModel: {
      skip: 'int',
      limit: 'int'
    }
  },
  getSignStatistics: {
    url: "contracts/subjects/presentables/signStatistics",
    method: "GET" // dataModel: {
    //   nodeId: 'string', // subjectType=2&signUserIdentityType=2
    //   signUserIdentityType: 'int',
    //   keywords: "string"
    // },

  }
};
/* harmony default export */ const modules_contract = (contract);
;// CONCATENATED MODULE: ./src/platform/structure/api.ts
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};




var isTest = window.isTest; // @ts-ignore

var nodeId = "";
function init() {
  //@ts-ignore
  nodeId = window.freelogApp.nodeInfo.nodeId;
} // 展品非授权信息接口

function getExhibitListById(query) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (query && Object.prototype.toString.call(query) !== "[object Object]") {
        return [2
        /*return*/
        , "query parameter must be object"];
      }

      if (isTest) //@ts-ignore
        return [2
        /*return*/
        , frequest.bind({
          name: this.name
        })(modules_exhibit.getTestExhibitById, [nodeId], __assign({}, query))]; //@ts-ignore

      return [2
      /*return*/
      , frequest.bind({
        name: this.name
      })(modules_exhibit.getExhibitListById, [nodeId], __assign({}, query))];
    });
  });
}
function getExhibitListByPaging(query) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (query && Object.prototype.toString.call(query) !== "[object Object]") {
        return [2
        /*return*/
        , Promise.reject("query parameter must be object")];
      }

      if (isTest) // @ts-ignore
        return [2
        /*return*/
        , frequest.bind({
          name: this.name
        })(modules_exhibit.getTestExhibitByPaging, [nodeId], __assign({}, query))]; // @ts-ignore

      return [2
      /*return*/
      , frequest.bind({
        name: this.name
      })(modules_exhibit.getExhibitListByPaging, [nodeId], __assign({}, query))];
    });
  });
}
function getSignStatistics(query) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , frequest(modules_contract.getSignStatistics, "", __assign({
        signUserIdentityType: 2,
        nodeId: nodeId
      }, query))];
    });
  });
}
function getExhibitInfo(exhibitId, query) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (isTest) // @ts-ignore
        return [2
        /*return*/
        , frequest(modules_exhibit.getTestExhibitDetail, [nodeId, exhibitId], query)]; // @ts-ignore

      return [2
      /*return*/
      , frequest(modules_exhibit.getExhibitDetail, [nodeId, exhibitId], query)];
    });
  });
}
function getExhibitDepInfo(exhibitId, articleNids) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (isTest) // @ts-ignore
        return [2
        /*return*/
        , frequest(modules_exhibit.getExhibitDepInfo, [nodeId, exhibitId], {
          articleNids: articleNids
        })]; // @ts-ignore

      return [2
      /*return*/
      , frequest(modules_exhibit.getTestExhibitDepInfo, [nodeId, exhibitId], {
        articleNids: articleNids
      })];
    });
  });
}
function getExhibitSignCount(exhibitId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , frequest(modules_exhibit.getExhibitSignCount, "", {
        subjectIds: exhibitId,
        subjectType: 2
      })];
    });
  });
}
function getExhibitAvailalbe(exhibitIds) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (isTest) {
        return [2
        /*return*/
        , frequest(modules_exhibit.getTestExhibitAuthStatus, [nodeId], {
          authType: 3,
          exhibitIds: exhibitIds
        })];
      } // @ts-ignore


      return [2
      /*return*/
      , frequest(modules_exhibit.getExhibitAuthStatus, [nodeId], {
        authType: 3,
        exhibitIds: exhibitIds
      })];
    });
  });
}
function getExhibitAuthStatus(exhibitIds) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (isTest) {
        return [2
        /*return*/
        , frequest(modules_exhibit.getTestExhibitAuthStatus, [nodeId], {
          authType: window.isTest ? 3 : 4,
          exhibitIds: exhibitIds
        })];
      } // @ts-ignore


      return [2
      /*return*/
      , frequest(modules_exhibit.getExhibitAuthStatus, [nodeId], {
        authType: window.isTest ? 3 : 4,
        exhibitIds: exhibitIds
      })];
    });
  });
} // 展品授权信息接口

function getByExhibitId(name, exhibitId, type, parentNid, subArticleIdOrName, returnUrl, config) {
  if (!exhibitId) {
    return "exhibitId is required";
  }

  var form = {};

  if (parentNid) {
    form.parentNid = parentNid;
  }

  if (subArticleIdOrName) {
    form.subArticleIdOrName = subArticleIdOrName;
  }

  if (isTest) return frequest.bind({
    name: name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId
  })(modules_exhibit.getTestExhibitAuthById, [nodeId, exhibitId, type], form, returnUrl, config);
  return frequest.bind({
    name: name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId
  })(modules_exhibit.getExhibitAuthById, [nodeId, exhibitId, type], form, returnUrl, config);
}

function getExhibitFileStream(exhibitId, returnUrl, config) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , getByExhibitId( // @ts-ignore
      this.name, exhibitId, "fileStream", "", "", returnUrl, config)];
    });
  });
}
function getExhibitResultByAuth(exhibitId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , getByExhibitId(this.name, exhibitId, "result", "", "")];
    });
  });
}
function getExhibitInfoByAuth(exhibitId) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , getByExhibitId(this.name, exhibitId, "info", "", "")];
    });
  });
} // 子依赖

function getExhibitDepFileStream(exhibitId, parentNid, subArticleId, returnUrl, config) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (!parentNid || !subArticleId) {
        return [2
        /*return*/
        , Promise.reject("parentNid and subArticleId is required!")];
      } // @ts-ignore


      return [2
      /*return*/
      , getByExhibitId( // @ts-ignore
      this.name, exhibitId, "fileStream", parentNid, subArticleId, returnUrl, config)];
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/applications/app.helpers.js
 // App statuses

var NOT_LOADED = "NOT_LOADED";
var LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
var NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
var BOOTSTRAPPING = "BOOTSTRAPPING";
var NOT_MOUNTED = "NOT_MOUNTED";
var MOUNTING = "MOUNTING";
var MOUNTED = "MOUNTED";
var UPDATING = "UPDATING";
var UNMOUNTING = "UNMOUNTING";
var UNLOADING = "UNLOADING";
var LOAD_ERROR = "LOAD_ERROR";
var SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
function isActive(app) {
  return app.status === MOUNTED;
}
function shouldBeActive(app) {
  try {
    return app.activeWhen(window.location);
  } catch (err) {
    handleAppError(err, app, SKIP_BECAUSE_BROKEN);
    return false;
  }
}
function toName(app) {
  return app.name;
}
function isParcel(appOrParcel) {
  return Boolean(appOrParcel.unmountThisParcel);
}
function objectType(appOrParcel) {
  return isParcel(appOrParcel) ? "parcel" : "application";
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/utils/assign.js
// Object.assign() is not available in IE11. And the babel compiled output for object spread
// syntax checks a bunch of Symbol stuff and is almost a kb. So this function is the smaller replacement.
function assign_assign() {
  for (var i = arguments.length - 1; i > 0; i--) {
    for (var key in arguments[i]) {
      if (key === "__proto__") {
        continue;
      }

      arguments[i - 1][key] = arguments[i][key];
    }
  }

  return arguments[0];
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/utils/find.js
/* the array.prototype.find polyfill on npmjs.com is ~20kb (not worth it)
 * and lodash is ~200kb (not worth it)
 */
function find(arr, func) {
  for (var i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      return arr[i];
    }
  }

  return null;
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/applications/app-errors.js

var errorHandlers = [];
function app_errors_handleAppError(err, app, newStatus) {
  var transformedErr = transformErr(err, app, newStatus);

  if (errorHandlers.length) {
    errorHandlers.forEach(function (handler) {
      return handler(transformedErr);
    });
  } else {
    setTimeout(function () {
      throw transformedErr;
    });
  }
}
function addErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(formatErrorMessage(28, window.__DEV__ && "a single-spa error handler must be a function"));
  }

  errorHandlers.push(handler);
}
function removeErrorHandler(handler) {
  if (typeof handler !== "function") {
    throw Error(formatErrorMessage(29, window.__DEV__ && "a single-spa error handler must be a function"));
  }

  var removedSomething = false;
  errorHandlers = errorHandlers.filter(function (h) {
    var isHandler = h === handler;
    removedSomething = removedSomething || isHandler;
    return !isHandler;
  });
  return removedSomething;
}
function formatErrorMessage(code, msg) {
  var args = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }

  return "single-spa minified message #".concat(code, ": ").concat(msg ? msg + " " : "", "See https://single-spa.js.org/error/?code=").concat(code).concat(args.length ? "&arg=".concat(args.join("&arg=")) : "");
}
function transformErr(ogErr, appOrParcel, newStatus) {
  var errPrefix = "".concat(objectType(appOrParcel), " '").concat(toName(appOrParcel), "' died in status ").concat(appOrParcel.status, ": ");
  var result;

  if (ogErr instanceof Error) {
    try {
      ogErr.message = errPrefix + ogErr.message;
    } catch (err) {
      /* Some errors have read-only message properties, in which case there is nothing
       * that we can do.
       */
    }

    result = ogErr;
  } else {
    console.warn(formatErrorMessage(30, window.__DEV__ && "While ".concat(appOrParcel.status, ", '").concat(toName(appOrParcel), "' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate."), appOrParcel.status, toName(appOrParcel)));

    try {
      result = Error(errPrefix + JSON.stringify(ogErr));
    } catch (err) {
      // If it's not an Error and you can't stringify it, then what else can you even do to it?
      result = ogErr;
    }
  }

  result.appOrParcelName = toName(appOrParcel); // We set the status after transforming the error so that the error message
  // references the state the application was in before the status change.

  appOrParcel.status = newStatus;
  return result;
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/lifecycle.helpers.js



function validLifecycleFn(fn) {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));

  function isArrayOfFns(arr) {
    return Array.isArray(arr) && !find(arr, function (item) {
      return typeof item !== "function";
    });
  }
}
function flattenFnArray(appOrParcel, lifecycle) {
  var fns = appOrParcel[lifecycle] || [];
  fns = Array.isArray(fns) ? fns : [fns];

  if (fns.length === 0) {
    fns = [function () {
      return Promise.resolve();
    }];
  }

  var type = objectType(appOrParcel);
  var name = toName(appOrParcel);
  return function (props) {
    return fns.reduce(function (resultPromise, fn, index) {
      return resultPromise.then(function () {
        var thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise) ? thisPromise : Promise.reject(formatErrorMessage(15, window.__DEV__ && "Within ".concat(type, " ").concat(name, ", the lifecycle function ").concat(lifecycle, " at array index ").concat(index, " did not return a promise"), type, name, lifecycle, index));
      });
    }, Promise.resolve());
  };
}
function smellsLikeAPromise(promise) {
  return promise && typeof promise.then === "function" && typeof promise.catch === "function";
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/bootstrap.js



function toBootstrapPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }

    appOrParcel.status = BOOTSTRAPPING;

    if (!appOrParcel.bootstrap) {
      // Default implementation of bootstrap
      return Promise.resolve().then(successfulBootstrap);
    }

    return reasonableTime(appOrParcel, "bootstrap").then(successfulBootstrap).catch(function (err) {
      if (hardFail) {
        throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
      } else {
        app_errors_handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
        return appOrParcel;
      }
    });
  });

  function successfulBootstrap() {
    appOrParcel.status = NOT_MOUNTED;
    return appOrParcel;
  }
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/custom-event@1.0.1/node_modules/custom-event/index.js
var custom_event = __webpack_require__(723);
var custom_event_default = /*#__PURE__*/__webpack_require__.n(custom_event);
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/unmount.js



function toUnmountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== MOUNTED) {
      return appOrParcel;
    }

    appOrParcel.status = UNMOUNTING;
    var unmountChildrenParcels = Object.keys(appOrParcel.parcels).map(function (parcelId) {
      return appOrParcel.parcels[parcelId].unmountThisParcel();
    });
    var parcelError;
    return Promise.all(unmountChildrenParcels).then(unmountAppOrParcel, function (parcelError) {
      // There is a parcel unmount error
      return unmountAppOrParcel().then(function () {
        // Unmounting the app/parcel succeeded, but unmounting its children parcels did not
        var parentError = Error(parcelError.message);

        if (hardFail) {
          throw transformErr(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
        } else {
          app_errors_handleAppError(parentError, appOrParcel, SKIP_BECAUSE_BROKEN);
        }
      });
    }).then(function () {
      return appOrParcel;
    });

    function unmountAppOrParcel() {
      // We always try to unmount the appOrParcel, even if the children parcels failed to unmount.
      return reasonableTime(appOrParcel, "unmount").then(function () {
        // The appOrParcel needs to stay in a broken status if its children parcels fail to unmount
        if (!parcelError) {
          appOrParcel.status = NOT_MOUNTED;
        }
      }).catch(function (err) {
        if (hardFail) {
          throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
        } else {
          app_errors_handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
        }
      });
    }
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/mount.js





var beforeFirstMountFired = false;
var firstMountFired = false;
function toMountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== NOT_MOUNTED) {
      return appOrParcel;
    }

    if (!beforeFirstMountFired) {
      window.dispatchEvent(new (custom_event_default())("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }

    return reasonableTime(appOrParcel, "mount").then(function () {
      appOrParcel.status = MOUNTED;

      if (!firstMountFired) {
        window.dispatchEvent(new (custom_event_default())("single-spa:first-mount"));
        firstMountFired = true;
      }

      return appOrParcel;
    }).catch(function (err) {
      // If we fail to mount the appOrParcel, we should attempt to unmount it before putting in SKIP_BECAUSE_BROKEN
      // We temporarily put the appOrParcel into MOUNTED status so that toUnmountPromise actually attempts to unmount it
      // instead of just doing a no-op.
      appOrParcel.status = MOUNTED;
      return toUnmountPromise(appOrParcel, true).then(setSkipBecauseBroken, setSkipBecauseBroken);

      function setSkipBecauseBroken() {
        if (!hardFail) {
          app_errors_handleAppError(err, appOrParcel, SKIP_BECAUSE_BROKEN);
          return appOrParcel;
        } else {
          throw transformErr(err, appOrParcel, SKIP_BECAUSE_BROKEN);
        }
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/update.js



function toUpdatePromise(parcel) {
  return Promise.resolve().then(function () {
    if (parcel.status !== MOUNTED) {
      throw Error(formatErrorMessage(32, window.__DEV__ && "Cannot update parcel '".concat(toName(parcel), "' because it is not mounted"), toName(parcel)));
    }

    parcel.status = UPDATING;
    return reasonableTime(parcel, "update").then(function () {
      parcel.status = MOUNTED;
      return parcel;
    }).catch(function (err) {
      throw transformErr(err, parcel, SKIP_BECAUSE_BROKEN);
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/parcels/mount-parcel.js








var parcelCount = 0;
var rootParcels = {
  parcels: {}
}; // This is a public api, exported to users of single-spa

function mountRootParcel() {
  return mountParcel.apply(rootParcels, arguments);
}
function mountParcel(config, customProps) {
  var owningAppOrParcel = this;
  var name = config.name || ''; // Validate inputs

  if (!config || typeof config !== "object" && typeof config !== "function") {
    throw Error(formatErrorMessage(2, window.__DEV__ && "Cannot mount parcel without a config object or config loading function"));
  }

  if (config.name && typeof config.name !== "string") {
    throw Error(formatErrorMessage(3, window.__DEV__ && "Parcel name must be a string, if provided. Was given ".concat(typeof config.name), typeof config.name));
  }

  if (typeof customProps !== "object") {
    throw Error(formatErrorMessage(4, window.__DEV__ && "Parcel ".concat(name, " has invalid customProps -- must be an object but was given ").concat(typeof customProps), name, typeof customProps));
  }

  if (!customProps.domElement) {
    throw Error(formatErrorMessage(5, window.__DEV__ && "Parcel ".concat(name, " cannot be mounted without a domElement provided as a prop"), name));
  }

  var id = parcelCount++;
  var passedConfigLoadingFunction = typeof config === "function";
  var configLoadingFunction = passedConfigLoadingFunction ? config : function () {
    return Promise.resolve(config);
  }; // Internal representation

  var parcel = {
    id: id,
    parcels: {},
    status: passedConfigLoadingFunction ? LOADING_SOURCE_CODE : NOT_BOOTSTRAPPED,
    customProps: customProps,
    parentName: toName(owningAppOrParcel),
    unmountThisParcel: function () {
      if (parcel.status !== MOUNTED) {
        throw Error(formatErrorMessage(6, window.__DEV__ && "Cannot unmount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
      }

      return toUnmountPromise(parcel, true).then(function (value) {
        if (parcel.parentName) {
          delete owningAppOrParcel.parcels[parcel.id];
        }

        return value;
      }).then(function (value) {
        resolveUnmount(value);
        return value;
      }).catch(function (err) {
        parcel.status = SKIP_BECAUSE_BROKEN;
        rejectUnmount(err);
        throw err;
      });
    }
  }; // We return an external representation

  var externalRepresentation; // Add to owning app or parcel

  owningAppOrParcel.parcels[id] = parcel;
  var loadPromise = configLoadingFunction();

  if (!loadPromise || typeof loadPromise.then !== "function") {
    throw Error(formatErrorMessage(7, window.__DEV__ && "When mounting a parcel, the config loading function must return a promise that resolves with the parcel config"));
  }

  loadPromise = loadPromise.then(function (config) {
    if (!config) {
      throw Error(formatErrorMessage(8, window.__DEV__ && "When mounting a parcel, the config loading function returned a promise that did not resolve with a parcel config"));
    }

    var name = config.name || "parcel-".concat(id);

    if ( // ES Module objects don't have the object prototype
    Object.prototype.hasOwnProperty.call(config, "bootstrap") && !validLifecycleFn(config.bootstrap)) {
      throw Error(formatErrorMessage(9, window.__DEV__ && "Parcel ".concat(name, " provided an invalid bootstrap function"), name));
    }

    if (!validLifecycleFn(config.mount)) {
      throw Error(formatErrorMessage(10, window.__DEV__ && "Parcel ".concat(name, " must have a valid mount function"), name));
    }

    if (!validLifecycleFn(config.unmount)) {
      throw Error(formatErrorMessage(11, window.__DEV__ && "Parcel ".concat(name, " must have a valid unmount function"), name));
    }

    if (config.update && !validLifecycleFn(config.update)) {
      throw Error(formatErrorMessage(12, window.__DEV__ && "Parcel ".concat(name, " provided an invalid update function"), name));
    }

    var bootstrap = flattenFnArray(config, "bootstrap");
    var mount = flattenFnArray(config, "mount");
    var unmount = flattenFnArray(config, "unmount");
    parcel.status = NOT_BOOTSTRAPPED;
    parcel.name = name;
    parcel.bootstrap = bootstrap;
    parcel.mount = mount;
    parcel.unmount = unmount;
    parcel.timeouts = ensureValidAppTimeouts(config.timeouts);

    if (config.update) {
      parcel.update = flattenFnArray(config, "update");

      externalRepresentation.update = function (customProps) {
        parcel.customProps = customProps;
        return promiseWithoutReturnValue(toUpdatePromise(parcel));
      };
    }
  }); // Start bootstrapping and mounting
  // The .then() causes the work to be put on the event loop instead of happening immediately

  var bootstrapPromise = loadPromise.then(function () {
    return toBootstrapPromise(parcel, true);
  });
  var mountPromise = bootstrapPromise.then(function () {
    return toMountPromise(parcel, true);
  });
  var resolveUnmount, rejectUnmount;
  var unmountPromise = new Promise(function (resolve, reject) {
    resolveUnmount = resolve;
    rejectUnmount = reject;
  });
  externalRepresentation = {
    mount: function () {
      return promiseWithoutReturnValue(Promise.resolve().then(function () {
        if (parcel.status !== NOT_MOUNTED) {
          throw Error(formatErrorMessage(13, window.__DEV__ && "Cannot mount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
        } // Add to owning app or parcel


        owningAppOrParcel.parcels[id] = parcel;
        return toMountPromise(parcel);
      }));
    },
    unmount: function () {
      return promiseWithoutReturnValue(parcel.unmountThisParcel());
    },
    getStatus: function () {
      return parcel.status;
    },
    loadPromise: promiseWithoutReturnValue(loadPromise),
    bootstrapPromise: promiseWithoutReturnValue(bootstrapPromise),
    mountPromise: promiseWithoutReturnValue(mountPromise),
    unmountPromise: promiseWithoutReturnValue(unmountPromise)
  };
  return externalRepresentation;
}

function promiseWithoutReturnValue(promise) {
  return promise.then(function () {
    return null;
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/prop.helpers.js





function getProps(appOrParcel) {
  var name = toName(appOrParcel);
  var customProps = typeof appOrParcel.customProps === "function" ? appOrParcel.customProps(name, window.location) : appOrParcel.customProps;

  if (typeof customProps !== "object" || customProps === null || Array.isArray(customProps)) {
    customProps = {};
    console.warn(formatErrorMessage(40, window.__DEV__ && "single-spa: ".concat(name, "'s customProps function must return an object. Received ").concat(customProps)), name, customProps);
  }

  var result = assign_assign({}, customProps, {
    name: name,
    mountParcel: mountParcel.bind(appOrParcel),
    singleSpa: single_spa_namespaceObject
  });

  if (isParcel(appOrParcel)) {
    result.unmountSelf = appOrParcel.unmountThisParcel;
  }

  return result;
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/applications/timeouts.js




var defaultWarningMillis = 1000;
var globalTimeoutConfig = {
  bootstrap: {
    millis: 4000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  mount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  unmount: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  unload: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  },
  update: {
    millis: 3000,
    dieOnTimeout: false,
    warningMillis: defaultWarningMillis
  }
};
function setBootstrapMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(16, window.__DEV__ && "bootstrap max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.bootstrap = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setMountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(17, window.__DEV__ && "mount max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(18, window.__DEV__ && "unmount max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error(formatErrorMessage(19, window.__DEV__ && "unload max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.unload = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function reasonableTime(appOrParcel, lifecycle) {
  var timeoutConfig = appOrParcel.timeouts[lifecycle];
  var warningPeriod = timeoutConfig.warningMillis;
  var type = objectType(appOrParcel);
  return new Promise(function (resolve, reject) {
    var finished = false;
    var errored = false;
    appOrParcel[lifecycle](getProps(appOrParcel)).then(function (val) {
      finished = true;
      resolve(val);
    }).catch(function (val) {
      finished = true;
      reject(val);
    });
    setTimeout(function () {
      return maybeTimingOut(1);
    }, warningPeriod);
    setTimeout(function () {
      return maybeTimingOut(true);
    }, timeoutConfig.millis);
    var errMsg = formatErrorMessage(31, window.__DEV__ && "Lifecycle function ".concat(lifecycle, " for ").concat(type, " ").concat(toName(appOrParcel), " lifecycle did not resolve or reject for ").concat(timeoutConfig.millis, " ms."), lifecycle, type, toName(appOrParcel), timeoutConfig.millis);

    function maybeTimingOut(shouldError) {
      if (!finished) {
        if (shouldError === true) {
          errored = true;

          if (timeoutConfig.dieOnTimeout) {
            reject(Error(errMsg));
          } else {
            console.error(errMsg); //don't resolve or reject, we're waiting this one out
          }
        } else if (!errored) {
          var numWarnings_1 = shouldError;
          var numMillis = numWarnings_1 * warningPeriod;
          console.warn(errMsg);

          if (numMillis + warningPeriod < timeoutConfig.millis) {
            setTimeout(function () {
              return maybeTimingOut(numWarnings_1 + 1);
            }, warningPeriod);
          }
        }
      }
    }
  });
}
function ensureValidAppTimeouts(timeouts) {
  var result = {};

  for (var key in globalTimeoutConfig) {
    result[key] = assign_assign({}, globalTimeoutConfig[key], timeouts && timeouts[key] || {});
  }

  return result;
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/lifecycles/load.js






function toLoadPromise(app) {
  return Promise.resolve().then(function () {
    if (app.loadPromise) {
      return app.loadPromise;
    }

    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return app;
    }

    app.status = LOADING_SOURCE_CODE;
    var appOpts, isUserErr;
    return app.loadPromise = Promise.resolve().then(function () {
      var loadPromise = app.loadApp(getProps(app));

      if (!smellsLikeAPromise(loadPromise)) {
        // The name of the app will be prepended to this error message inside of the handleAppError function
        isUserErr = true;
        throw Error(formatErrorMessage(33, window.__DEV__ && "single-spa loading function did not return a promise. Check the second argument to registerApplication('".concat(toName(app), "', loadingFunction, activityFunction)"), toName(app)));
      }

      return loadPromise.then(function (val) {
        app.loadErrorTime = null;
        appOpts = val;
        var validationErrMessage, validationErrCode;

        if (typeof appOpts !== "object") {
          validationErrCode = 34;

          if (window.__DEV__) {
            validationErrMessage = "does not export anything";
          }
        }

        if ( // ES Modules don't have the Object prototype
        Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") && !validLifecycleFn(appOpts.bootstrap)) {
          validationErrCode = 35;

          if (window.__DEV__) {
            validationErrMessage = "does not export a valid bootstrap function or array of functions";
          }
        }

        if (!validLifecycleFn(appOpts.mount)) {
          validationErrCode = 36;

          if (window.__DEV__) {
            validationErrMessage = "does not export a bootstrap function or array of functions";
          }
        }

        if (!validLifecycleFn(appOpts.unmount)) {
          validationErrCode = 37;

          if (window.__DEV__) {
            validationErrMessage = "does not export a bootstrap function or array of functions";
          }
        }

        var type = objectType(appOpts);

        if (validationErrCode) {
          var appOptsStr = void 0;

          try {
            appOptsStr = JSON.stringify(appOpts);
          } catch (_a) {}

          console.error(formatErrorMessage(validationErrCode, window.__DEV__ && "The loading function for single-spa ".concat(type, " '").concat(toName(app), "' resolved with the following, which does not have bootstrap, mount, and unmount functions"), type, toName(app), appOptsStr), appOpts);
          app_errors_handleAppError(validationErrMessage, app, SKIP_BECAUSE_BROKEN);
          return app;
        }

        if (appOpts.devtools && appOpts.devtools.overlays) {
          app.devtools.overlays = assign_assign({}, app.devtools.overlays, appOpts.devtools.overlays);
        }

        app.status = NOT_BOOTSTRAPPED;
        app.bootstrap = flattenFnArray(appOpts, "bootstrap");
        app.mount = flattenFnArray(appOpts, "mount");
        app.unmount = flattenFnArray(appOpts, "unmount");
        app.unload = flattenFnArray(appOpts, "unload");
        app.timeouts = ensureValidAppTimeouts(appOpts.timeouts);
        delete app.loadPromise;
        return app;
      });
    }).catch(function (err) {
      delete app.loadPromise;
      var newStatus;

      if (isUserErr) {
        newStatus = SKIP_BECAUSE_BROKEN;
      } else {
        newStatus = LOAD_ERROR;
        app.loadErrorTime = new Date().getTime();
      }

      app_errors_handleAppError(err, app, newStatus);
      return app;
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/devtools/devtools.js



/* harmony default export */ const devtools = ({
  NOT_LOADED: NOT_LOADED,
  toLoadPromise: toLoadPromise,
  toBootstrapPromise: toBootstrapPromise
});
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/utils/runtime-environment.js
var isInBrowser = typeof window !== "undefined";
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/jquery-support.js
var hasInitialized = false;
function ensureJQuerySupport(jQuery) {
  if (jQuery === void 0) {
    jQuery = window.jQuery;
  }

  if (!jQuery) {
    if (window.$ && window.$.fn && window.$.fn.jquery) {
      jQuery = window.$;
    }
  }

  if (jQuery && !hasInitialized) {
    var originalJQueryOn_1 = jQuery.fn.on;
    var originalJQueryOff_1 = jQuery.fn.off;

    jQuery.fn.on = function (eventString, fn) {
      return captureRoutingEvents.call(this, originalJQueryOn_1, window.addEventListener, eventString, fn, arguments);
    };

    jQuery.fn.off = function (eventString, fn) {
      return captureRoutingEvents.call(this, originalJQueryOff_1, window.removeEventListener, eventString, fn, arguments);
    };

    hasInitialized = true;
  }
}

function captureRoutingEvents(originalJQueryFunction, nativeFunctionToCall, eventString, fn, originalArgs) {
  if (typeof eventString !== "string") {
    return originalJQueryFunction.apply(this, originalArgs);
  }

  var eventNames = eventString.split(/\s+/);
  eventNames.forEach(function (eventName) {
    if (["hashchange", "popstate"].indexOf(eventName) >= 0) {
      nativeFunctionToCall(eventName, fn);
      eventString = eventString.replace(eventName, "");
    }
  });

  if (eventString.trim() === "") {
    return this;
  } else {
    return originalJQueryFunction.apply(this, originalArgs);
  }
}
;// CONCATENATED MODULE: ./src/platform/runtime/single-spa/single-spa.js




window.__DEV__ = false;




if (isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
  window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = devtools;
}
;// CONCATENATED MODULE: ./src/platform/runtime/import-html-entry/utils.js
/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 * fork from https://github.com/systemjs/systemjs/blob/master/src/extras/global.js
 */
var isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;

function shouldSkipProperty(global, p) {
  if (!global.hasOwnProperty(p) || !isNaN(p) && p < global.length) return true;

  if (isIE11) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return global[p] && typeof window !== 'undefined' && global[p].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
} // safari unpredictably lists some new globals first or second in object order


var firstGlobalProp, secondGlobalProp, lastGlobalProp;
function getGlobalProp(global) {
  var cnt = 0;
  var lastProp;
  var hasIframe = false;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue; // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断

    for (var i = 0; i < window.frames.length && !hasIframe; i++) {
      var frame = window.frames[i];

      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }

    if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp)) return p;
    cnt++;
    lastProp = p;
  }

  if (lastProp !== lastGlobalProp) return lastProp;
}
function noteGlobalProps(global) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;

  for (var p in global) {
    if (shouldSkipProperty(global, p)) continue;
    if (!firstGlobalProp) firstGlobalProp = p;else if (!secondGlobalProp) secondGlobalProp = p;
    lastGlobalProp = p;
  }

  return lastGlobalProp;
}
function getInlineCode(match) {
  var start = match.indexOf('>') + 1;
  var end = match.lastIndexOf('<');
  return match.substring(start, end);
}
function defaultGetPublicPath(entry) {
  if (typeof entry === 'object') {
    return '/';
  }

  try {
    // URL 构造函数不支持使用 // 前缀的 url
    var _a = new URL(entry.startsWith('//') ? "".concat(window.location.protocol).concat(entry) : entry, window.location.href),
        origin_1 = _a.origin,
        pathname = _a.pathname;

    var paths = pathname.split('/'); // 移除最后一个元素
    // paths.pop();

    return "".concat(origin_1).concat(paths.join('/'), "/");
  } catch (e) {
    console.warn(e);
    return '';
  }
} // Detect whether browser supports `<script type=module>` or not

function isModuleScriptSupported() {
  var s = document.createElement('script');
  return 'noModule' in s;
} // RIC and shim for browsers setTimeout() without it

var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};
function readResAsString(response, autoDetectCharset) {
  // 未启用自动检测
  if (!autoDetectCharset) {
    return response.text();
  } // 如果没headers，发生在test环境下的mock数据，为兼容原有测试用例


  if (!response.headers) {
    return response.text();
  } // 如果没返回content-type，走默认逻辑


  var contentType = response.headers.get('Content-Type');

  if (!contentType) {
    return response.text();
  } // 解析content-type内的charset
  // Content-Type: text/html; charset=utf-8
  // Content-Type: multipart/form-data; boundary=something
  // GET请求下不会出现第二种content-type


  var charset = 'utf-8';
  var parts = contentType.split(';');

  if (parts.length === 2) {
    var _a = parts[1].split('='),
        value = _a[1];

    var encoding = value && value.trim();

    if (encoding) {
      charset = encoding;
    }
  } // 如果还是utf-8，那么走默认，兼容原有逻辑，这段代码删除也应该工作


  if (charset.toUpperCase() === 'UTF-8') {
    return response.text();
  } // 走流读取，编码可能是gbk，gb2312等，比如sofa 3默认是gbk编码


  return response.blob().then(function (file) {
    return new Promise(function (resolve, reject) {
      var reader = new window.FileReader();

      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = reject;
      reader.readAsText(file, charset);
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/import-html-entry/process-tpl.js
/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-09-03 15:04
 */

var ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/is;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
var SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
var SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+.*?>/isg;
var LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
var LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var LINK_IGNORE_REGEX = /<link(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;

function hasProtocol(url) {
  return url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://');
}

function getEntirePath(path, baseURI) {
  // new URL 虽然可保安全，但我们有特殊需求
  if (/\/\/$/.test(baseURI)) {
    baseURI = baseURI.substr(0, baseURI.length - 1);
  }

  if (!/\/$/.test(baseURI)) {
    baseURI = baseURI + '/';
  }

  if (path.startsWith('/')) path = path.replace('/', '');
  var url = baseURI + path;
  return url; // return new URL(path, baseURI).toString();
}

function isValidJavaScriptType(type) {
  var handleTypes = ['text/javascript', 'module', 'application/javascript', 'text/ecmascript', 'application/ecmascript'];
  return !type || handleTypes.indexOf(type) !== -1;
}

var genLinkReplaceSymbol = function (linkHref, preloadOrPrefetch) {
  if (preloadOrPrefetch === void 0) {
    preloadOrPrefetch = false;
  }

  return "<!-- ".concat(preloadOrPrefetch ? 'prefetch/preload' : '', " link ").concat(linkHref, " replaced by import-html-entry -->");
};
var genScriptReplaceSymbol = function (scriptSrc, async) {
  if (async === void 0) {
    async = false;
  }

  return "<!-- ".concat(async ? 'async' : '', " script ").concat(scriptSrc, " replaced by import-html-entry -->");
};
var inlineScriptReplaceSymbol = "<!-- inline scripts replaced by import-html-entry -->";
var genIgnoreAssetReplaceSymbol = function (url) {
  return "<!-- ignore asset ".concat(url || 'file', " replaced by import-html-entry -->");
};
var genModuleScriptReplaceSymbol = function (scriptSrc, moduleSupport) {
  return "<!-- ".concat(moduleSupport ? 'nomodule' : 'module', " script ").concat(scriptSrc, " ignored by import-html-entry -->");
};
/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param baseURI
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */

function processTpl(tpl, baseURI) {
  var scripts = [];
  var styles = [];
  var entry = null;
  var moduleSupport = isModuleScriptSupported(); // TODO 可能多余的代码

  if (/\/\/$/.test(baseURI)) {
    baseURI = baseURI.substr(0, baseURI.length - 1);
  }

  ;

  if (!/\/$/.test(baseURI)) {
    baseURI = baseURI + '/';
  }

  ;
  var template = tpl.replace(/url\(static/g, "url(".concat(baseURI, "static")).replace(/url\(\/static/g, "url(".concat(baseURI, "static"))
  /*
  remove html comment first
  */
  .replace(HTML_COMMENT_REGEX, '').replace(LINK_TAG_REGEX, function (match) {
    /*
    change the css link
    */
    var styleType = !!match.match(STYLE_TYPE_REGEX);

    if (styleType) {
      var styleHref = match.match(STYLE_HREF_REGEX);
      var styleIgnore = match.match(LINK_IGNORE_REGEX);

      if (styleHref) {
        var href = styleHref && styleHref[2];
        var newHref = href;

        if (href && !hasProtocol(href)) {
          newHref = getEntirePath(href, baseURI);
        }

        if (styleIgnore) {
          return genIgnoreAssetReplaceSymbol(newHref);
        }

        styles.push(newHref);
        return genLinkReplaceSymbol(newHref);
      }
    }

    var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX) && !match.match(LINK_AS_FONT);

    if (preloadOrPrefetchType) {
      var _a = match.match(LINK_HREF_REGEX),
          linkHref = _a[2];

      return genLinkReplaceSymbol(linkHref, true);
    }

    return match;
  }).replace(STYLE_TAG_REGEX, function (match) {
    if (STYLE_IGNORE_REGEX.test(match)) {
      return genIgnoreAssetReplaceSymbol('style file');
    }

    return match;
  }).replace(ALL_SCRIPT_REGEX, function (match, scriptTag) {
    var scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
    var moduleScriptIgnore = moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX) || !moduleSupport && !!scriptTag.match(SCRIPT_MODULE_REGEX); // in order to keep the exec order of all javascripts

    var matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
    var matchedScriptType = matchedScriptTypeMatch && matchedScriptTypeMatch[2];

    if (!isValidJavaScriptType(matchedScriptType)) {
      return match;
    } // if it is a external script


    if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
      /*
      collect scripts and replace the ref
      */
      var matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);
      var matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
      var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];

      if (entry && matchedScriptEntry) {
        throw new SyntaxError('You should not set multiply entry script!');
      } else {
        // append the domain while the script not have an protocol prefix
        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
          matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
        }

        entry = entry || matchedScriptEntry && matchedScriptSrc;
      }

      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
      }

      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol(matchedScriptSrc || 'js file', moduleSupport);
      }

      if (matchedScriptSrc) {
        var asyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);
        scripts.push(asyncScript ? {
          async: true,
          src: matchedScriptSrc
        } : matchedScriptSrc);
        return genScriptReplaceSymbol(matchedScriptSrc, asyncScript);
      }

      return match;
    } else {
      if (scriptIgnore) {
        return genIgnoreAssetReplaceSymbol('js file');
      }

      if (moduleScriptIgnore) {
        return genModuleScriptReplaceSymbol('js file', moduleSupport);
      } // if it is an inline script


      var code = getInlineCode(match); // remove script blocks when all of these lines are comments.

      var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) {
        return !line.trim() || line.trim().startsWith('//');
      });

      if (!isPureCommentBlock) {
        scripts.push(match);
      }

      return inlineScriptReplaceSymbol;
    }
  });
  scripts = scripts.filter(function (script) {
    // filter empty script
    return !!script;
  });
  return {
    template: template,
    scripts: scripts,
    styles: styles,
    // set the last script as entry if have not set
    entry: entry || scripts[scripts.length - 1]
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/import-html-entry/index.js
/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-15 11:37
 */



var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};

if (!window.fetch) {
  throw new Error('[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it');
} // function freelogFetch(url, options) {
// 	options = options || {};
// 	if (url.indexOf("freelog.com") > -1) {
// 		return rawFetch(url, { ...options, credentials: "include" });
// 	} else {
// 		return rawFetch(url, { ...options });
// 	}
// };


var defaultFetch = freelogFetch.bind(window);

function defaultGetTemplate(tpl) {
  return tpl;
}
/**
 * convert external css link to inline style for performance optimization
 * @param template
 * @param styles
 * @param opts
 * @return embedHTML
 */


function getEmbedHTML(template, styles, opts, baseURI) {
  if (opts === void 0) {
    opts = {};
  }

  var _a = opts.fetch,
      fetch = _a === void 0 ? defaultFetch : _a;
  var embedHTML = template; // if(/\/\/$/.test(baseURI)){
  // 	baseURI = baseURI.substr(0, baseURI.length - 1)
  // }
  // if(!/\/$/.test(baseURI)){
  // 	baseURI =  baseURI + '/'
  // }

  return getExternalStyleSheets(styles, fetch).then(function (styleSheets) {
    embedHTML = styles.reduce(function (html, styleSrc, i) {
      // let styleText = styleSheets[i]
      // styleText = styleText.replace(/url\(static/g,`url(${baseURI}static`) ;
      // styleText = styleText.replace(/url\(\/static/g,`url(${baseURI}static`) ;
      html = html.replace(genLinkReplaceSymbol(styleSrc), "<style>/* ".concat(styleSrc, " */").concat(styleSheets[i], "</style>"));
      return html;
    }, embedHTML);
    return embedHTML;
  });
}

var isInlineCode = function (code) {
  return code.startsWith('<');
};

function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
  var sourceUrl = isInlineCode(scriptSrc) ? '' : "//# sourceURL=".concat(scriptSrc, "\n"); // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
  // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy

  var globalWindow = (0, eval)('window');
  globalWindow.proxy = proxy; // TODO 通过 strictGlobal 方式切换切换 with 闭包，待 with 方式坑趟平后再合并

  return strictGlobal ? ";(function(window, self, globalThis){with(window){;".concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);") : ";(function(window, self, globalThis){;".concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);");
} // for prefetch


function getExternalStyleSheets(styles, fetch) {
  if (fetch === void 0) {
    fetch = defaultFetch;
  }

  return Promise.all(styles.map(function (styleLink) {
    if (isInlineCode(styleLink)) {
      // if it is inline style
      return getInlineCode(styleLink);
    } else {
      // external styles
      return styleCache[styleLink] || (styleCache[styleLink] = fetch(styleLink).then(function (response) {
        var text = response.text();
        return text;
      }));
    }
  }));
} // for prefetch

function getExternalScripts(scripts, fetch, errorCallback) {
  if (fetch === void 0) {
    fetch = defaultFetch;
  }

  if (errorCallback === void 0) {
    errorCallback = function () {};
  }

  var fetchScript = function (scriptUrl) {
    return scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch(scriptUrl).then(function (response) {
      // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
      // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
      if (response.status >= 400) {
        errorCallback();
        throw new Error("".concat(scriptUrl, " load failed with status ").concat(response.status));
      }

      return response.text();
    }));
  };

  return Promise.all(scripts.map(function (script) {
    if (typeof script === 'string') {
      if (isInlineCode(script)) {
        // if it is inline script
        return getInlineCode(script);
      } else {
        // external script
        return fetchScript(script);
      }
    } else {
      // use idle time to load async script
      var src_1 = script.src,
          async = script.async;

      if (async) {
        return {
          src: src_1,
          async: true,
          content: new Promise(function (resolve, reject) {
            return requestIdleCallback(function () {
              return fetchScript(src_1).then(resolve, reject);
            });
          })
        };
      }

      return fetchScript(src_1);
    }
  }));
}

function throwNonBlockingError(error, msg) {
  setTimeout(function () {
    console.error(msg);
    throw error;
  });
}

var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
/**
 * FIXME to consistent with browser behavior, we should only provide callback way to invoke success and error event
 * @param entry
 * @param scripts
 * @param proxy
 * @param opts
 * @returns {Promise<unknown>}
 */

function execScripts(entry, scripts, proxy, opts) {
  if (proxy === void 0) {
    proxy = window;
  }

  if (opts === void 0) {
    opts = {};
  }

  var _a = opts.fetch,
      fetch = _a === void 0 ? defaultFetch : _a,
      _b = opts.strictGlobal,
      strictGlobal = _b === void 0 ? false : _b,
      success = opts.success,
      _c = opts.error,
      error = _c === void 0 ? function () {} : _c,
      _d = opts.beforeExec,
      beforeExec = _d === void 0 ? function () {} : _d,
      _e = opts.afterExec,
      afterExec = _e === void 0 ? function () {} : _e;
  return getExternalScripts(scripts, fetch, error).then(function (scriptsText) {
    var geval = function (scriptSrc, inlineScript) {
      var rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
      var code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
      (0, eval)(code);
      afterExec(inlineScript, scriptSrc);
    };

    function exec(scriptSrc, inlineScript, resolve) {
      var markName = "Evaluating script ".concat(scriptSrc);
      var measureName = "Evaluating Time Consuming: ".concat(scriptSrc);

      if (false) {}

      if (scriptSrc === entry) {
        noteGlobalProps(strictGlobal ? proxy : window);

        try {
          // bind window.proxy to change `this` reference in script
          geval(scriptSrc, inlineScript);
          var exports_1 = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
          resolve(exports_1);
        } catch (e) {
          // entry error must be thrown to make the promise settled
          console.error("[import-html-entry]: error occurs while executing entry script ".concat(scriptSrc));
          throw e;
        }
      } else {
        if (typeof inlineScript === 'string') {
          try {
            // bind window.proxy to change `this` reference in script
            geval(scriptSrc, inlineScript);
          } catch (e) {
            // consistent with browser behavior, any independent script evaluation error should not block the others
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing normal script ".concat(scriptSrc));
          }
        } else {
          // external script marked with async
          inlineScript.async && (inlineScript === null || inlineScript === void 0 ? void 0 : inlineScript.content.then(function (downloadedScriptText) {
            return geval(inlineScript.src, downloadedScriptText);
          }).catch(function (e) {
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing async script ".concat(inlineScript.src));
          }));
        }
      }

      if (false) {}
    }

    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        var scriptSrc = scripts[i];
        var inlineScript = scriptsText[i];
        exec(scriptSrc, inlineScript, resolvePromise); // resolve the promise while the last script executed and entry not provided

        if (!entry && i === scripts.length - 1) {
          resolvePromise();
        } else {
          schedule(i + 1, resolvePromise);
        }
      }
    }

    return new Promise(function (resolve) {
      return schedule(0, success || resolve);
    });
  });
}
function importHTML(url, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var fetch = defaultFetch;
  var autoDecodeResponse = false;
  var getPublicPath = defaultGetPublicPath;
  var getTemplate = defaultGetTemplate; // compatible with the legacy importHTML api

  if (typeof opts === 'function') {
    fetch = opts;
  } else {
    // fetch option is availble
    if (opts.fetch) {
      // fetch is a funciton
      if (typeof opts.fetch === 'function') {
        fetch = opts.fetch;
      } else {
        // configuration
        fetch = opts.fetch.fn || defaultFetch;
        autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
      }
    }

    getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
    getTemplate = opts.getTemplate || defaultGetTemplate;
  }

  if (/\/$/.test(url)) {
    url = url.substr(0, url.length - 1);
  }

  return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url + '/index.html').then(function (response) {
    return readResAsString(response, autoDecodeResponse);
  }).then(function (html) {
    var assetPublicPath = url; // getPublicPath(url);

    var _a = processTpl(getTemplate(html), assetPublicPath),
        template = _a.template,
        scripts = _a.scripts,
        entry = _a.entry,
        styles = _a.styles;

    return getEmbedHTML(template, styles, {
      fetch: fetch
    }, assetPublicPath).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: assetPublicPath,
        getExternalScripts: function () {
          return getExternalScripts(scripts, fetch);
        },
        getExternalStyleSheets: function () {
          return getExternalStyleSheets(styles, fetch);
        },
        execScripts: function (proxy, strictGlobal, execScriptsHooks) {
          if (execScriptsHooks === void 0) {
            execScriptsHooks = {};
          }

          if (!scripts.length) {
            return Promise.resolve();
          }

          return execScripts(entry, scripts, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal,
            beforeExec: execScriptsHooks.beforeExec,
            afterExec: execScriptsHooks.afterExec
          });
        }
      };
    });
  }));
}
function importEntry(entry, opts) {
  if (opts === void 0) {
    opts = {};
  }

  var _a = opts.fetch,
      fetch = _a === void 0 ? defaultFetch : _a,
      _b = opts.getTemplate,
      getTemplate = _b === void 0 ? defaultGetTemplate : _b;
  var getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;

  if (!entry) {
    throw new SyntaxError('entry should not be empty!');
  } // html entry


  if (typeof entry === 'string') {
    return importHTML(entry, {
      fetch: fetch,
      getPublicPath: getPublicPath,
      getTemplate: getTemplate
    });
  } // config entry


  if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
    var _c = entry.scripts,
        scripts_1 = _c === void 0 ? [] : _c,
        _d = entry.styles,
        styles_1 = _d === void 0 ? [] : _d,
        _e = entry.html,
        html = _e === void 0 ? '' : _e;

    var getHTMLWithStylePlaceholder = function (tpl) {
      return styles_1.reduceRight(function (html, styleSrc) {
        return "".concat(genLinkReplaceSymbol(styleSrc)).concat(html);
      }, tpl);
    };

    var getHTMLWithScriptPlaceholder = function (tpl) {
      return scripts_1.reduce(function (html, scriptSrc) {
        return "".concat(html).concat(genScriptReplaceSymbol(scriptSrc));
      }, tpl);
    };

    return getEmbedHTML(getTemplate(getHTMLWithScriptPlaceholder(getHTMLWithStylePlaceholder(html))), styles_1, {
      fetch: fetch
    }).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: getPublicPath(entry),
        getExternalScripts: function () {
          return getExternalScripts(scripts_1, fetch);
        },
        getExternalStyleSheets: function () {
          return getExternalStyleSheets(styles_1, fetch);
        },
        execScripts: function (proxy, strictGlobal, execScriptsHooks) {
          if (execScriptsHooks === void 0) {
            execScriptsHooks = {};
          }

          if (!scripts_1.length) {
            return Promise.resolve();
          }

          return execScripts(scripts_1[scripts_1.length - 1], scripts_1, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal,
            beforeExec: execScriptsHooks.beforeExec,
            afterExec: execScriptsHooks.afterExec
          });
        }
      };
    });
  } else {
    throw new SyntaxError('entry scripts or styles should be array!');
  }
}
// EXTERNAL MODULE: ../../node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js
var lodash = __webpack_require__(378);
;// CONCATENATED MODULE: ./src/platform/runtime/addons/runtimePublicPath.ts
var runtimePublicPath_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var runtimePublicPath_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
function getAddOn(global, publicPath) {
  if (publicPath === void 0) {
    publicPath = '/';
  }

  var hasMountedOnce = false;
  return {
    beforeLoad: function () {
      return runtimePublicPath_awaiter(this, void 0, void 0, function () {
        return runtimePublicPath_generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = publicPath;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeMount: function () {
      return runtimePublicPath_awaiter(this, void 0, void 0, function () {
        return runtimePublicPath_generator(this, function (_a) {
          if (hasMountedOnce) {
            // eslint-disable-next-line no-param-reassign
            global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = publicPath;
          }

          return [2
          /*return*/
          ];
        });
      });
    },
    beforeUnmount: function () {
      return runtimePublicPath_awaiter(this, void 0, void 0, function () {
        return runtimePublicPath_generator(this, function (_a) {
          if (rawPublicPath === undefined) {
            // eslint-disable-next-line no-param-reassign
            delete global.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
          } else {
            // eslint-disable-next-line no-param-reassign
            global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = rawPublicPath;
          }

          hasMountedOnce = true;
          return [2
          /*return*/
          ];
        });
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/addons/engineFlag.ts
/**
 * @author Kuitos
 * @since 2020-05-15
 */
var engineFlag_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var engineFlag_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

function engineFlag_getAddOn(global) {
  return {
    beforeLoad: function () {
      return engineFlag_awaiter(this, void 0, void 0, function () {
        return engineFlag_generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__POWERED_BY_FREELOG__ = true;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeMount: function () {
      return engineFlag_awaiter(this, void 0, void 0, function () {
        return engineFlag_generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__POWERED_BY_FREELOG__ = true;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeUnmount: function () {
      return engineFlag_awaiter(this, void 0, void 0, function () {
        return engineFlag_generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          delete global.__POWERED_BY_FREELOG__;
          return [2
          /*return*/
          ];
        });
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/addons/index.ts
/**
 * @author Kuitos
 * @since 2020-03-02
 */



function getAddOns(global, publicPath) {
  // @ts-ignore
  return (0,lodash.mergeWith)({}, engineFlag_getAddOn(global), getAddOn(global, publicPath), function (v1, v2) {
    return (0,lodash.concat)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/globalState.ts
/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

var globalState = {};
var deps = {}; // 触发全局监听

function emitGlobal(state, prevState) {
  Object.keys(deps).forEach(function (id) {
    if (deps[id] instanceof Function) {
      deps[id]((0,lodash.cloneDeep)(state), (0,lodash.cloneDeep)(prevState));
    }
  });
}

function initGlobalState(state) {
  if (state === void 0) {
    state = {};
  }

  if (state === globalState) {
    console.warn('[freelog] state has not changed！');
  } else {
    var prevGlobalState = cloneDeep(globalState);
    globalState = cloneDeep(state);
    emitGlobal(globalState, prevGlobalState);
  }

  return getMicroAppStateActions("global-".concat(+new Date()), true);
}
function getMicroAppStateActions(id, isMaster) {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange: function (callback, fireImmediately) {
      if (!(callback instanceof Function)) {
        console.error('[freelog] callback must be function!');
        return;
      }

      if (deps[id]) {
        console.warn("[freelog] '".concat(id, "' global listener already exists before this, new listener will overwrite it."));
      }

      deps[id] = callback;
      var cloneState = (0,lodash.cloneDeep)(globalState);

      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState: function (state) {
      if (state === void 0) {
        state = {};
      }

      if (state === globalState) {
        console.warn('[freelog] state has not changed！');
        return false;
      }

      var changeKeys = [];
      var prevGlobalState = (0,lodash.cloneDeep)(globalState);
      globalState = (0,lodash.cloneDeep)(Object.keys(state).reduce(function (_globalState, changeKey) {
        var _a;

        if (isMaster || _globalState.hasOwnProperty(changeKey)) {
          changeKeys.push(changeKey);
          return Object.assign(_globalState, (_a = {}, _a[changeKey] = state[changeKey], _a));
        }

        console.warn("[freelog] '".concat(changeKey, "' not declared when init state\uFF01"));
        return _globalState;
      }, globalState));

      if (changeKeys.length === 0) {
        console.warn('[freelog] state has not changed！');
        return false;
      }

      emitGlobal(globalState, prevGlobalState);
      return true;
    },
    // 注销该应用下的依赖
    offGlobalStateChange: function () {
      delete deps[id];
      return true;
    }
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/interfaces.ts
var SandBoxType;

(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot"; // for legacy sandbox
  // https://github.com/umijs/freelog/blob/0d1d3f0c5ed1642f01854f96c3fabf0a2148bd26/src/sandbox/legacy/sandbox.ts#L22...L25

  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (SandBoxType = {}));
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/css.ts
/**
 * @author Saviio
 * @since 2020-4-19
 */
 // https://developer.mozilla.org/en-US/docs/Web/API/CSSRule

var RuleType;

(function (RuleType) {
  // type: rule will be rewrote
  RuleType[RuleType["STYLE"] = 1] = "STYLE";
  RuleType[RuleType["MEDIA"] = 4] = "MEDIA";
  RuleType[RuleType["SUPPORTS"] = 12] = "SUPPORTS"; // type: value will be kept

  RuleType[RuleType["IMPORT"] = 3] = "IMPORT";
  RuleType[RuleType["FONT_FACE"] = 5] = "FONT_FACE";
  RuleType[RuleType["PAGE"] = 6] = "PAGE";
  RuleType[RuleType["KEYFRAMES"] = 7] = "KEYFRAMES";
  RuleType[RuleType["KEYFRAME"] = 8] = "KEYFRAME";
})(RuleType || (RuleType = {}));

var arrayify = function (list) {
  return [].slice.call(list, 0);
};

var rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;

var ScopedCSS =
/** @class */
function () {
  function ScopedCSS(data) {
    var styleNode = document.createElement('style');
    rawDocumentBodyAppend.call(document.body, styleNode);
    this.appName = data.appName;
    this.swapNode = styleNode;
    this.sheet = styleNode.sheet;
    this.sheet.disabled = true;
  }

  ScopedCSS.prototype.process = function (styleNode, prefix) {
    var _this = this;

    var _a;

    if (prefix === void 0) {
      prefix = '';
    }

    if (styleNode.textContent !== '') {
      var textNode = document.createTextNode(styleNode.textContent || '');
      this.swapNode.appendChild(textNode);
      var sheet = this.swapNode.sheet; // type is missing

      var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);
      var css = this.rewrite(rules, prefix); // eslint-disable-next-line no-param-reassign

      styleNode.textContent = css; // cleanup

      this.swapNode.removeChild(textNode);
      return;
    }

    var mutator = new MutationObserver(function (mutations) {
      var _a;

      for (var i = 0; i < mutations.length; i += 1) {
        var mutation = mutations[i];

        if (ScopedCSS.ModifiedTag in styleNode) {
          return;
        }

        if (mutation.type === 'childList') {
          var sheet = styleNode.sheet;
          var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);

          var css = _this.rewrite(rules, prefix); // eslint-disable-next-line no-param-reassign


          styleNode.textContent = css; // eslint-disable-next-line no-param-reassign

          styleNode[ScopedCSS.ModifiedTag] = true;
        }
      }
    }); // since observer will be deleted when node be removed
    // we dont need create a cleanup function manually
    // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect

    mutator.observe(styleNode, {
      childList: true
    });
  };

  ScopedCSS.prototype.rewrite = function (rules, prefix) {
    var _this = this;

    if (prefix === void 0) {
      prefix = '';
    }

    var css = '';
    rules.forEach(function (rule) {
      switch (rule.type) {
        case RuleType.STYLE:
          css += _this.ruleStyle(rule, prefix);
          break;

        case RuleType.MEDIA:
          css += _this.ruleMedia(rule, prefix);
          break;

        case RuleType.SUPPORTS:
          css += _this.ruleSupport(rule, prefix);
          break;
        // case RuleType.FONT_FACE:
        //   css += this.ruleFont(rule, prefix);
        //   break;

        default:
          css += "".concat(rule.cssText);
          break;
      }
    });
    return css;
  }; // @font-face repalce exclude [http, data:,//]


  ScopedCSS.prototype.ruleFont = function (rule, prefix) {
    var cssText = rule.cssText; // url("/

    cssText = cssText.replace(/url\(\"\//ig, 'url("' + widgetsConfig.get(this.appName).entry + '/');
    return cssText;
  }; // handle case:
  // .app-main {}
  // html, body {}
  // eslint-disable-next-line class-methods-use-this


  ScopedCSS.prototype.ruleStyle = function (rule, prefix) {
    var rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
    var rootCombinationRE = /(html[^\w{[]+)/gm;
    var selector = rule.selectorText.trim();
    var cssText = rule.cssText; // handle html { ... }
    // handle body { ... }
    // handle :root { ... }

    if (selector === 'html' || selector === 'body' || selector === ':root') {
      return cssText.replace(rootSelectorRE, prefix);
    } // handle html body { ... }
    // handle html > body { ... }


    if (rootCombinationRE.test(rule.selectorText)) {
      var siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm; // since html + body is a non-standard rule for html
      // transformer will ignore it

      if (!siblingSelectorRE.test(rule.selectorText)) {
        cssText = cssText.replace(rootCombinationRE, '');
      }
    } // handle grouping selector, a,span,p,div { ... }


    cssText = cssText.replace(/^[\s\S]+{/, function (selectors) {
      return selectors.replace(/(^|,\n?)([^,]+)/g, function (item, p, s) {
        // handle div,body,span { ... }
        if (rootSelectorRE.test(item)) {
          return item.replace(rootSelectorRE, function (m) {
            // do not discard valid previous character, such as body,html or *:not(:root)
            var whitePrevChars = [',', '('];

            if (m && whitePrevChars.includes(m[0])) {
              return "".concat(m[0]).concat(prefix);
            } // replace root selector with prefix


            return prefix;
          });
        }

        return "".concat(p).concat(prefix, " ").concat(s.replace(/^ */, ''));
      });
    });
    return cssText;
  }; // handle case:
  // @media screen and (max-width: 300px) {}


  ScopedCSS.prototype.ruleMedia = function (rule, prefix) {
    var css = this.rewrite(arrayify(rule.cssRules), prefix);
    return "@media ".concat(rule.conditionText, " {").concat(css, "}");
  }; // handle case:
  // @supports (display: grid) {}


  ScopedCSS.prototype.ruleSupport = function (rule, prefix) {
    var css = this.rewrite(arrayify(rule.cssRules), prefix);
    return "@supports ".concat(rule.conditionText, " {").concat(css, "}");
  };

  ScopedCSS.ModifiedTag = 'Symbol(style-modified-freelog)';
  return ScopedCSS;
}();


var processor;
var FreelogCSSRewriteAttr = 'data-freelog';
var process = function (appWrapper, stylesheetElement, appName) {
  // lazy singleton pattern
  if (!processor) {
    processor = new ScopedCSS({
      appName: appName
    });
  }

  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  var mountDOM = appWrapper;

  if (!mountDOM) {
    return;
  }

  var tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    var prefix = "".concat(tag, "[").concat(FreelogCSSRewriteAttr, "=\"").concat(appName, "\"]");
    processor.process(stylesheetElement, prefix);
  }
};
;// CONCATENATED MODULE: ./src/platform/runtime/utils.ts
/**
 * @author Kuitos
 * @since 2019-05-15
 */

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/**
 * run a callback after next tick
 * @param cb
 */

function nextTick(cb) {
  Promise.resolve().then(cb);
}
var constructableMap = new WeakMap();
function isConstructable(fn) {
  if (constructableMap.has(fn)) {
    return constructableMap.get(fn);
  }

  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  var constructable = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
  constructableMap.set(fn, constructable);
  return constructable;
}
/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */

var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
var isCallable = naughtySafari ? function (fn) {
  return typeof fn === 'function' && typeof fn !== 'undefined';
} : function (fn) {
  return typeof fn === 'function';
};
var boundedMap = new WeakMap();
function isBoundedFunction(fn) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */


  var bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}
function getDefaultTplWrapper(id, name) {
  return function (tpl) {
    return "<div id=\"".concat(getWrapperId(id), "\" data-name=\"").concat(name, "\">").concat(tpl, "</div>");
  };
}
function getWrapperId(id) {
  return "__freelog_microapp_wrapper_for_".concat((0,lodash.snakeCase)(id), "__");
}
/** 校验子应用导出的 生命周期 对象是否正确 */

function validateExportLifecycle(exports) {
  var _a = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _a.bootstrap,
      mount = _a.mount,
      unmount = _a.unmount;

  return (0,lodash.isFunction)(bootstrap) && (0,lodash.isFunction)(mount) && (0,lodash.isFunction)(unmount);
}

var Deferred =
/** @class */
function () {
  function Deferred() {
    var _this = this;

    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }

  return Deferred;
}();


var utils_supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function' && typeof performance.getEntriesByName === 'function';
function performanceGetEntriesByName(markName, type) {
  var marks = null;

  if (utils_supportsUserTiming) {
    marks = performance.getEntriesByName(markName, type);
  }

  return marks;
}
function performanceMark(markName) {
  if (utils_supportsUserTiming) {
    performance.mark(markName);
  }
}
function performanceMeasure(measureName, markName) {
  if (utils_supportsUserTiming && performance.getEntriesByName(markName, 'mark').length) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}
function isEnableScopedCSS(sandbox) {
  if (typeof sandbox !== 'object') {
    return false;
  }

  if (sandbox.strictStyleIsolation) {
    return false;
  }

  return !!sandbox.experimentalStyleIsolation;
}
/**
 * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
 * @param el
 * @param document
 */

function getXPathForElement(el, document) {
  // not support that if el not existed in document yet(such as it not append to document before it mounted)
  if (!document.body.contains(el)) {
    return undefined;
  }

  var xpath = '';
  var pos;
  var tmpEle;
  var element = el;

  while (element !== document.documentElement) {
    pos = 0;
    tmpEle = element;

    while (tmpEle) {
      if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
        // If it is ELEMENT_NODE of the same name
        pos += 1;
      }

      tmpEle = tmpEle.previousSibling;
    }

    xpath = "*[name()='".concat(element.nodeName, "' and namespace-uri()='").concat(element.namespaceURI === null ? '' : element.namespaceURI, "'][").concat(pos, "]/").concat(xpath);
    element = element.parentNode;
  }

  xpath = "/*[name()='".concat(document.documentElement.nodeName, "' and namespace-uri()='").concat(element.namespaceURI === null ? '' : element.namespaceURI, "']/").concat(xpath);
  xpath = xpath.replace(/\/$/, '');
  return xpath;
}
function getContainer(container) {
  return typeof container === 'string' ? document.querySelector.bind(document)(container) : container;
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/common.ts
/**
 * @author Kuitos
 * @since 2020-04-13
 */

var currentRunningSandboxProxy;
function getCurrentRunningSandboxProxy() {
  return currentRunningSandboxProxy;
}
function setCurrentRunningSandboxProxy(proxy) {
  currentRunningSandboxProxy = proxy;
}
var functionBoundedValueMap = new WeakMap();
function getTargetValue(target, value) {
  var cachedBoundFunction = functionBoundedValueMap.get(value);

  if (cachedBoundFunction) {
    return cachedBoundFunction;
  }
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */


  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    var boundValue = Function.prototype.bind.call(value, target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
    // use for..in rather than Object.keys.forEach for performance reason
    // eslint-disable-next-line guard-for-in,no-restricted-syntax

    for (var key in value) {
      boundValue[key] = value[key];
    } // copy prototype if bound function not have
    // mostly a bound function have no own prototype, but it not absolute in some old version browser, see https://github.com/umijs/freelog/issues/1121


    if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) boundValue.prototype = value.prototype;
    functionBoundedValueMap.set(value, boundValue);
    return boundValue;
  }

  return value;
}
var getterInvocationResultMap = new WeakMap();
function getProxyPropertyValue(getter) {
  var getterResult = getterInvocationResultMap.get(getter);

  if (!getterResult) {
    var result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }

  return getterResult;
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/dynamicAppend/common.ts
/**
 * @author Kuitos
 * @since 2019-10-21
 */





var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
var rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
var rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
var rawRemoveChild = HTMLElement.prototype.removeChild;
var SCRIPT_TAG_NAME = 'SCRIPT';
var LINK_TAG_NAME = 'LINK';
var STYLE_TAG_NAME = 'STYLE';
function isHijackingTag(tagName) {
  return (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME;
}
/**
 * Check if a style element is a styled-component liked.
 * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
 * Such as the style element generated by styled-components and emotion.
 * @param element
 */

function isStyledComponentsLike(element) {
  var _a, _b;

  return !element.textContent && (((_a = element.sheet) === null || _a === void 0 ? void 0 : _a.cssRules.length) || ((_b = getStyledElementCSSRules(element)) === null || _b === void 0 ? void 0 : _b.length));
}

function patchCustomEvent(e, elementGetter) {
  Object.defineProperties(e, {
    srcElement: {
      get: elementGetter
    },
    target: {
      get: elementGetter
    }
  });
  return e;
}

function manualInvokeElementOnLoad(element) {
  // we need to invoke the onload event manually to notify the event listener that the script was completed
  // here are the two typical ways of dynamic script loading
  // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
  // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
  var loadEvent = new CustomEvent('load');
  var patchedEvent = patchCustomEvent(loadEvent, function () {
    return element;
  });

  if ((0,lodash.isFunction)(element.onload)) {
    element.onload(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}

function manualInvokeElementOnError(element) {
  var errorEvent = new CustomEvent('error');
  var patchedEvent = patchCustomEvent(errorEvent, function () {
    return element;
  });

  if ((0,lodash.isFunction)(element.onerror)) {
    element.onerror(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}

function convertLinkAsStyle(element, postProcess, fetchFn) {
  if (fetchFn === void 0) {
    fetchFn = freelogFetch;
  }

  var styleElement = document.createElement('style');
  var href = element.href; // add source link element href

  styleElement.dataset.freelogHref = href;
  fetchFn(href).then(function (res) {
    return res.text();
  }).then(function (styleContext) {
    styleElement.appendChild(document.createTextNode(styleContext));
    postProcess(styleElement);
    manualInvokeElementOnLoad(element);
  }).catch(function () {
    return manualInvokeElementOnError(element);
  });
  return styleElement;
}

var styledComponentCSSRulesMap = new WeakMap();
var dynamicScriptAttachedCommentMap = new WeakMap();
var dynamicLinkAttachedInlineStyleMap = new WeakMap();
function recordStyledComponentsCSSRules(styleElements) {
  styleElements.forEach(function (styleElement) {
    /*
     With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
     We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
     see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
     */
    if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
      if (styleElement.sheet) {
        // record the original css rules of the style element for restore
        styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
      }
    }
  });
}
function getStyledElementCSSRules(styledElement) {
  return styledComponentCSSRulesMap.get(styledElement);
}

function getOverwrittenAppendChildOrInsertBefore(opts) {
  return function appendChildOrInsertBefore(newChild, refChild) {
    var _a, _b;

    var element = newChild;
    var rawDOMAppendOrInsertBefore = opts.rawDOMAppendOrInsertBefore,
        isInvokedByMicroApp = opts.isInvokedByMicroApp,
        containerConfigGetter = opts.containerConfigGetter;

    if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
      return rawDOMAppendOrInsertBefore.call(this, element, refChild);
    }

    if (element.tagName) {
      var containerConfig = containerConfigGetter(element);
      var appName_1 = containerConfig.appName,
          appWrapperGetter = containerConfig.appWrapperGetter,
          proxy = containerConfig.proxy,
          strictGlobal = containerConfig.strictGlobal,
          dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements,
          scopedCSS = containerConfig.scopedCSS,
          excludeAssetFilter = containerConfig.excludeAssetFilter;

      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME:
          {
            var stylesheetElement = newChild;
            var href = stylesheetElement.href;

            if (excludeAssetFilter && href && excludeAssetFilter(href)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }

            var mountDOM_1 = appWrapperGetter();

            if (scopedCSS) {
              // exclude link elements like <link rel="icon" href="favicon.ico">
              var linkElementUsingStylesheet = ((_a = element.tagName) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === LINK_TAG_NAME && element.rel === 'stylesheet' && element.href;

              if (linkElementUsingStylesheet) {
                var fetch_1 = typeof frameworkConfiguration.fetch === 'function' ? frameworkConfiguration.fetch : (_b = frameworkConfiguration.fetch) === null || _b === void 0 ? void 0 : _b.fn;
                stylesheetElement = convertLinkAsStyle(element, function (styleElement) {
                  return process(mountDOM_1, styleElement, appName_1);
                }, fetch_1);
                dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
              } else {
                process(mountDOM_1, stylesheetElement, appName_1);
              }
            } // eslint-disable-next-line no-shadow


            dynamicStyleSheetElements.push(stylesheetElement);
            var referenceNode = mountDOM_1.contains(refChild) ? refChild : null;
            return rawDOMAppendOrInsertBefore.call(mountDOM_1, stylesheetElement, referenceNode);
          }

        case SCRIPT_TAG_NAME:
          {
            var _c = element,
                src = _c.src,
                text = _c.text; // some script like jsonp maybe not support cors which should't use execScripts

            if (excludeAssetFilter && src && excludeAssetFilter(src)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }

            var mountDOM = appWrapperGetter();
            var fetch_2 = frameworkConfiguration.fetch;
            var referenceNode = mountDOM.contains(refChild) ? refChild : null;

            if (src) {
              execScripts(null, [src], proxy, {
                fetch: fetch_2,
                strictGlobal: strictGlobal,
                beforeExec: function () {
                  Object.defineProperty(document, 'currentScript', {
                    get: function () {
                      return element;
                    },
                    configurable: true
                  });
                },
                success: function () {
                  manualInvokeElementOnLoad(element);
                  element = null;
                },
                error: function () {
                  manualInvokeElementOnError(element);
                  element = null;
                }
              });
              var dynamicScriptCommentElement = document.createComment("dynamic script ".concat(src, " replaced by freelog"));
              dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
              return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicScriptCommentElement, referenceNode);
            } // inline script never trigger the onload and onerror event


            execScripts(null, ["<script>".concat(text, "</script>")], proxy, {
              strictGlobal: strictGlobal
            });
            var dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by freelog');
            dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
            return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicInlineScriptCommentElement, referenceNode);
          }

        default:
          break;
      }
    }

    return rawDOMAppendOrInsertBefore.call(this, element, refChild);
  };
}

function getNewRemoveChild(headOrBodyRemoveChild, appWrapperGetterGetter) {
  return function removeChild(child) {
    var tagName = child.tagName;
    if (!isHijackingTag(tagName)) return headOrBodyRemoveChild.call(this, child);

    try {
      var attachedElement = void 0;

      switch (tagName) {
        case LINK_TAG_NAME:
          {
            attachedElement = dynamicLinkAttachedInlineStyleMap.get(child) || child;
            break;
          }

        case SCRIPT_TAG_NAME:
          {
            attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;
            break;
          }

        default:
          {
            attachedElement = child;
          }
      } // container may had been removed while app unmounting if the removeChild action was async


      var appWrapperGetter = appWrapperGetterGetter(child);
      var container = appWrapperGetter();

      if (container.contains(attachedElement)) {
        return rawRemoveChild.call(container, attachedElement);
      }
    } catch (e) {
      console.warn(e);
    }

    return headOrBodyRemoveChild.call(this, child);
  };
}

function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
  // Just overwrite it while it have not been overwrite
  if (HTMLHeadElement.prototype.appendChild === rawHeadAppendChild && HTMLBodyElement.prototype.appendChild === rawBodyAppendChild && HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore) {
    HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
    HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawBodyAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
    HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp
    });
  } // Just overwrite it while it have not been overwrite


  if (HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild && HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild) {
    HTMLHeadElement.prototype.removeChild = getNewRemoveChild(rawHeadRemoveChild, function (element) {
      return containerConfigGetter(element).appWrapperGetter;
    });
    HTMLBodyElement.prototype.removeChild = getNewRemoveChild(rawBodyRemoveChild, function (element) {
      return containerConfigGetter(element).appWrapperGetter;
    });
  }

  return function unpatch() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
    HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
    HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
    HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
  };
}
function rebuildCSSRules(styleSheetElements, reAppendElement) {
  styleSheetElements.forEach(function (stylesheetElement) {
    // re-append the dynamic stylesheet to sub-app container
    var appendSuccess = reAppendElement(stylesheetElement);

    if (appendSuccess) {
      /*
      get the stored css rules from styled-components generated element, and the re-insert rules for them.
      note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
      check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
       */
      if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
        var cssRules = getStyledElementCSSRules(stylesheetElement);

        if (cssRules) {
          // eslint-disable-next-line no-plusplus
          for (var i = 0; i < cssRules.length; i++) {
            var cssRule = cssRules[i];
            var cssStyleSheetElement = stylesheetElement.sheet;
            cssStyleSheetElement.insertRule(cssRule.cssText, cssStyleSheetElement.cssRules.length);
          }
        }
      }
    }
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/dynamicAppend/forStrictSandbox.ts
/**
 * @author Kuitos
 * @since 2020-10-13
 */


var rawDocumentCreateElement = Document.prototype.createElement;
var proxyAttachContainerConfigMap = new WeakMap();
var elementAttachContainerConfigMap = new WeakMap();

function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement(tagName, options) {
      var element = rawDocumentCreateElement.call(this, tagName, options);

      if (isHijackingTag(tagName)) {
        var currentRunningSandboxProxy = getCurrentRunningSandboxProxy();

        if (currentRunningSandboxProxy) {
          var proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);

          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
        }
      }

      return element;
    };
  }

  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}

var bootstrappingPatchCount = 0;
var mountingPatchCount = 0;
function patchStrictSandbox(appName, appWrapperGetter, proxy, mounting, scopedCSS, excludeAssetFilter) {
  if (mounting === void 0) {
    mounting = true;
  }

  if (scopedCSS === void 0) {
    scopedCSS = false;
  }

  var containerConfig = proxyAttachContainerConfigMap.get(proxy);

  if (!containerConfig) {
    containerConfig = {
      appName: appName,
      proxy: proxy,
      appWrapperGetter: appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter: excludeAssetFilter,
      scopedCSS: scopedCSS
    };
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  } // all dynamic style sheets are stored in proxy container


  var dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements;
  var unpatchDocumentCreate = patchDocumentCreateElement();
  var unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(function (element) {
    return elementAttachContainerConfigMap.has(element);
  }, function (element) {
    return elementAttachContainerConfigMap.get(element);
  });
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;
    var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0; // release the overwrite prototype after all the micro apps unmounted

    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();

        if (!appWrapper.contains(stylesheetElement)) {
          rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/dynamicAppend/index.ts
/**
 * @author Kuitos
 * @since 2020-10-13
 */

;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/historyListener.ts
/**
 * @author Kuitos
 * @since 2019-04-11
 */

function patch() {
  // FIXME umi unmount feature request
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var rawHistoryListen = function (_) {
    return lodash.noop;
  };

  var historyListeners = [];
  var historyUnListens = [];

  if (window.g_history && (0,lodash.isFunction)(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history);

    window.g_history.listen = function (listener) {
      historyListeners.push(listener);
      var unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);
      return function () {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }

  return function free() {
    var rebuild = lodash.noop;
    /*
     还存在余量 listener 表明未被卸载，存在两种情况
     1. 应用在 unmout 时未正确卸载 listener
     2. listener 是应用 mount 之前绑定的，
     第二种情况下应用在下次 mount 之前需重新绑定该 listener
     */

    if (historyListeners.length) {
      rebuild = function () {
        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
        historyListeners.forEach(function (listener) {
          return window.g_history.listen(listener);
        });
      };
    } // 卸载余下的 listener


    historyUnListens.forEach(function (unListen) {
      return unListen();
    }); // restore

    if (window.g_history && (0,lodash.isFunction)(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }

    return rebuild;
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/interval.ts
/* eslint-disable no-param-reassign */

/**
 * @author Kuitos
 * @since 2019-04-11
 */
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};


var rawWindowInterval = window.setInterval;
var rawWindowClearInterval = window.clearInterval;
function interval_patch(global) {
  var intervals = [];

  global.clearInterval = function (intervalId) {
    intervals = intervals.filter(function (id) {
      return id !== intervalId;
    });
    return rawWindowClearInterval(intervalId);
  };

  global.setInterval = function (handler, timeout) {
    var args = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }

    var intervalId = rawWindowInterval.apply(void 0, __spreadArray([handler, timeout], args, false));
    intervals = __spreadArray(__spreadArray([], intervals, true), [intervalId], false);
    return intervalId;
  };

  return function free() {
    intervals.forEach(function (id) {
      return global.clearInterval(id);
    });
    global.setInterval = rawWindowInterval;
    global.clearInterval = rawWindowClearInterval;
    return lodash.noop;
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/windowListener.ts
/* eslint-disable no-param-reassign */

/**
 * @author Kuitos
 * @since 2019-04-11
 */
var windowListener_spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};


var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
function windowListener_patch(global) {
  var listenerMap = new Map();

  global.addEventListener = function (type, listener, options) {
    var listeners = listenerMap.get(type) || [];
    listenerMap.set(type, windowListener_spreadArray(windowListener_spreadArray([], listeners, true), [listener], false));
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = function (type, listener, options) {
    var storedTypeListeners = listenerMap.get(type);

    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return windowListener_spreadArray([], listeners, true).forEach(function (listener) {
        return global.removeEventListener(type, listener);
      });
    });
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return lodash.noop;
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/patchers/index.ts
/**
 * @author Kuitos
 * @since 2019-04-11
 */
var patchers_spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};







function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;

  var _b;

  var basePatchers = [function () {
    return interval_patch(sandbox.proxy);
  }, function () {
    return windowListener_patch(sandbox.proxy);
  }, function () {
    return patch();
  }];
  var patchersInSandbox = (_a = {}, _a[SandBoxType.Proxy] = patchers_spreadArray(patchers_spreadArray([], basePatchers, true), [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }], false), _a); // @ts-ignore

  return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) {
    return patch();
  });
}
function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;

  var _b;

  var patchersInSandbox = (_a = {}, _a[SandBoxType.Proxy] = [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }], _a); // @ts-ignore

  return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) {
    return patch();
  });
}

;// CONCATENATED MODULE: ./src/platform/structure/history.ts
var history_assign = undefined && undefined.__assign || function () {
  history_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return history_assign.apply(this, arguments);
};

var widgetHistories = new Map();
function setHistory(key, history, isReplace) {
  var obj = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0
  };

  if (isReplace && obj.length > 0) {
    obj.histories.splice(obj.position, 1, history);
  } else {
    var cut = obj.position;
    obj.histories = obj.histories.slice(0, cut + 1);
    obj.histories.push(history);
    obj.length = obj.histories.length;
    obj.position = obj.histories.length - 1;
  }

  widgetHistories.set(key, obj);
}
function getHistory(key) {
  var obj = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0
  };
  return history_assign({}, obj);
}
function historyBack(key) {
  var obj = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0
  };

  if (obj.length > 0 && obj.position > 0) {
    obj.position = obj.position - 1;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
function historyForward(key) {
  var obj = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0
  };

  if (obj.length > 0 && obj.position < obj.length - 1) {
    obj.position = obj.position + 1;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
function historyGo(key, count) {
  var obj = widgetHistories.get(key) || {
    length: 0,
    histories: [],
    position: 0
  };

  if (obj.length > 0 && obj.position > 0 && obj.position + count < obj.length - 1 && obj.position + count >= 0) {
    obj.position = obj.position + count;
    return obj.histories[obj.position];
  } else {
    return false;
  }
}
;// CONCATENATED MODULE: ./src/platform/structure/dev.ts
var DEV_FALSE = 0;
var DEV_WIDGET = 1; // 插件开发模式

var DEV_TYPE_REPLACE = 2; // 插件替换模式

function dev() {
  var searchs = window.location.search ? window.location.search.split("?") : [];

  if (!searchs[1]) {
    return {
      type: DEV_FALSE
    };
  }

  var paramsArray = window.location.search.split("?")[1].split("&");
  var params = {};
  paramsArray.forEach(function (item) {
    params[item.split("=")[0]] = item.split("=")[1];
  });
  params.dev = params.dev || params.devconsole;

  if (!params.dev) {
    return {
      type: DEV_FALSE
    };
  }

  if (params.dev.toLowerCase() === "replace") {
    return {
      type: DEV_TYPE_REPLACE,
      params: params,
      config: {
        vconsole: !!params.devconsole
      }
    };
  } else {
    // TODO $_是路由前缀，这里有错误，需要引用常量
    params.dev = params.dev.split("$_")[0];
  }

  return {
    type: DEV_WIDGET,
    params: params,
    config: {
      vconsole: !!params.devconsole
    }
  };
}
;// CONCATENATED MODULE: ./src/platform/structure/proxy.ts
var proxy_assign = undefined && undefined.__assign || function () {
  proxy_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return proxy_assign.apply(this, arguments);
};

var proxy_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var proxy_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
/**
 * 需求与问题：
 *    1.首先进来时需要根据路由启动存在的不同插件（主要点是启动）:
 *      1.1 location解析
 *      1.2 路由拦截，存为历史
 *      1.3 整体回退前进
 *      1.4 插件回退前进
 *      1.5 抽象路由的插件
 *      1.6 懒加载或点击按钮加载插件的问题：
 *          1.6.1 懒加载：提供属性空闲后加载，或指定延迟时间（不精准）
 *          1.6.1 点击再加载：提供属性标明不加载，点击按钮，提供api（mountWidget(pluginId)）
 *    2.插件控制插件进入不同路由：
 *      2.1 给插件对象提供api，（例如push(home/about?age=18)）劫持重定向的路由进行unmount后再mount
 *    3.
 * 总结：window.FreelogApp.mountWidget
 */





var rawDocument = document;
var HISTORY = "history";
var HASH = "hash";
var rawHistory = window["history"];
var rawLocation = window["location"];
var rawLocalStorage = window["localStorage"]; // widgetName  {routerType: 'history' || 'hash'}

var locations = new Map();
var freelogPopstate = new PopStateEvent("freelog-popstate"); // for history back and forword

var state = 0;
var moveLock = false;
window.addEventListener("popstate", function (event) {
  var estate = event.state;
  if (!estate) estate = 0;

  if (estate < state) {
    moveLock = true; // this is back,  make all of locations position++
    // @ts-ignore

    locations.forEach(function (value, key) {
      historyBack(key);
    });
  } else if (estate > state) {
    moveLock = true; // this is forword make all of locations position--
    // @ts-ignore

    locations.forEach(function (value, key) {
      historyForward(key);
    });
  }

  setTimeout(function () {
    moveLock = false;
  }, 0);
  state = estate;
  initLocation();
  window.dispatchEvent(freelogPopstate);
}, true);
window.addEventListener("hashchange", function () {
  initLocation();
}, true);
function freelogAddEventListener() {
  if (arguments[0] === "popstate") {
    window.addEventListener("freelog-popstate", arguments[1]);
    return;
  } // @ts-ignore


  window.addEventListener.apply(window, arguments);
} // TODO 如果授权UI插件想要请求之外的接口，可以通过freelogAuths放进去

var rawFetch = window.fetch;
var nativeOpen = XMLHttpRequest.prototype.open;
var whiteList = ["https://image.freelog.com", "https://image.testfreelog.com"];
var forbiddenList = ["http://qi.testfreelog.com", "http://qi.freelog.com", "https://api.freelog.com", "https://api.testfreelog.com"];
var authWhiteList = ["http://qi.testfreelog.com", "http://qi.freelog.com", "https://api.freelog.com", "https://api.testfreelog.com"]; // TODO 将fetch和XMLHttpRequest放到沙盒里处理

function ajaxProxy(type, name) {
  // @ts-ignore
  if (type === "fetch") {
    return function (url, options, widgetWindow) {
      options = options || {};
      var base = url.split(".com")[0] + ".com";

      if (!forbiddenList.includes(base) || whiteList.includes(base) || isFreelogAuth(name) && authWhiteList.includes(base)) {
        return rawFetch(url, proxy_assign({}, options));
      } else {
        return Promise.reject("can not request data from freelog.com directly!"); // rawFetch(url, { ...options, credentials: "include" });
      }
    };
  }

  if (type === "XMLHttpRequest") {
    var customizeOpen = function (method, url, async, user, password) {
      var base = url.split(".com")[0] + ".com";

      if (!forbiddenList.includes(base) || whiteList.includes(base) || isFreelogAuth(name) && authWhiteList.includes(base)) {
        // @ts-ignore
        nativeOpen.bind(this)(method, url, async, user, password);
      } // @ts-ignore


      nativeOpen.bind(this)(method, url, async, user, password); // TODO 使用假错误正常返回  暂时无法使用
      // return "can not request data from freelog.com directly!";
    }; // @ts-ignore


    XMLHttpRequest.prototype.open = customizeOpen;
    return XMLHttpRequest;
  }
}
function isFreelogAuth(name) {
  return widgetsConfig.get(name).isUI;
}
function initLocation() {
  if (rawLocation.href.includes("$freelog")) {
    var loc = rawLocation.href.split("freelog.com/")[1].split("$");

    if (window.freelogApp.devData.type === DEV_WIDGET) {
      var temp = rawLocation.search.split("$_")[1]; // @ts-ignore

      loc = temp ? temp.split("$") : [];
    }

    loc.forEach(function (item) {
      try {
        if (!item) return;
        item = item.replace("_", "?");

        if (item.indexOf("?") > -1) {
          var index = item.indexOf("?");

          var _a = item.substring(0, index).split("="),
              id = _a[0],
              pathname = _a[1];

          var search = item.substring(index); // TODO 判断id是否存在 isExist(id) &&

          locations.set(id, {
            pathname: pathname,
            href: pathname + search,
            search: search
          });
          return;
        }

        var l = item.split("=");
        locations.set(l[0], {
          pathname: l[1],
          href: l[1],
          search: ""
        });
      } catch (e) {
        console.error("url is error" + e);
      }
    });
  }
}
function setLocation() {
  // TODO 只有在线的应用才在url上显示, 只有pathname和query需要
  var hash = "";
  locations.forEach(function (value, key) {
    if (!activeWidgets.get(key)) {
      locations.delete(key);
      return;
    }

    hash += "$" + key + "=" + value.href || 0;
  });

  if (window.freelogApp.devData.type === DEV_WIDGET) {
    var devUrl = rawLocation.search.split("$_")[0];

    if (!devUrl.endsWith("/")) {
      devUrl = devUrl + "/";
    }

    var url = rawLocation.origin + "/" + devUrl + "$_" + hash.replace("?", "_") + rawLocation.hash;
    if (url === rawLocation.href) return;
    window.history.pushState(state++, "", url);
  } else {
    var url = rawLocation.origin + "/" + hash.replace("?", "_") + rawLocation.hash + rawLocation.search;
    if (url === rawLocation.href) return;
    window.history.pushState(state++, "", url);
  } // rawLocation.hash = hash; state++

} // TODO pathname  search 需要不可变

var locationCenter = {
  set: function (name, attr) {
    var loc = locations.get(name) || {};

    if (attr.pathname && attr.pathname.indexOf(rawLocation.host) > -1) {
      // for vue3
      attr.pathname = attr.pathname.replace(rawLocation.protocol, "").replace(rawLocation.host, "").replace("//", "");
    }

    locations.set(name, proxy_assign(proxy_assign({}, loc), attr));
    setLocation();
  },
  get: function (name) {
    return locations.get(name);
  }
};
function freelogLocalStorage(id) {
  return {
    // @ts-ignore
    clear: function (name) {},
    getItem: function (name) {
      return rawLocalStorage.getItem(id + name);
    },
    // @ts-ignore
    key: function (name) {},
    removeItem: function (name) {
      rawLocalStorage.removeItem(id + name);
    },
    setItem: function (name, value) {
      rawLocalStorage.setItem(id + name, value);
    },
    length: 0
  };
}
var saveSandBox = function (name, sandBox) {
  addSandBox(name, sandBox);
};
var createHistoryProxy = function (name) {
  var widgetConfig = widgetsConfig.get(name);

  function patch() {
    var hash = "";
    var routerType = HISTORY; // TODO 解析query参数  search   vue3会把origin也传过来

    var href = arguments[2].replace(rawLocation.origin, "");

    if (arguments[2] && arguments[2].indexOf("#") > -1) {
      href = href.substring(1);
      routerType = HASH;
      hash = arguments[2].replace(rawLocation.origin, ""); // console.warn("hash route is not suggested!");
      // return;
    }

    var _a = href.split("?"),
        pathname = _a[0],
        search = _a[1];

    locationCenter.set(name, {
      pathname: pathname,
      href: href,
      search: search ? "?" + search : "",
      hash: hash,
      routerType: routerType
    });
  }

  function pushPatch() {
    if (moveLock) return; // @ts-ignore

    patch.apply(void 0, arguments);
    setHistory(name, arguments);
  }

  function replacePatch() {
    // @ts-ignore
    patch.apply(void 0, arguments);
    setHistory(name, arguments, true);
  }

  function go(count) {
    if (widgetConfig.config.historyFB) {
      return rawHistory.go(count);
    }

    var history = historyGo(name, count);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      window.dispatchEvent(freelogPopstate);
    } // else if(count == -1){
    //   window.history.go(-1)
    // }

  }

  function back() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.back();
    }

    var history = historyBack(name);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      window.dispatchEvent(freelogPopstate);
    }
  }

  function forward() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.forward();
    }

    var history = historyForward(name);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      window.dispatchEvent(freelogPopstate);
    }
  }

  var state = getHistory(name).histories[getHistory(name).position] ? [0] : {};
  var length = getHistory(name).length;

  var historyProxy = proxy_assign(proxy_assign({}, window.history), {
    // @ts-ignore
    length: length,
    pushState: pushPatch,
    replaceState: replacePatch,
    state: state,
    go: go,
    back: back,
    forward: forward
  });

  return historyProxy;
};
var createLocationProxy = function (name) {
  var locationProxy = {};
  var widgetConfig = widgetsConfig.get(name);
  return new Proxy(locationProxy, {
    /*
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
         TODO reload 是重新加载插件
     */
    // @ts-ignore
    set: function (target, p, value) {
      if (p === "hash") {
        var _history = createHistoryProxy(name); // @ts-ignore


        _history.pushState("", "", value);
      }

      return true;
    },
    // @ts-ignore
    get: function get(target, property) {
      if (["href", "pathname", "hash", "search"].indexOf(property) > -1) {
        if (locationCenter.get(name)) {
          // @ts-ignore
          return locationCenter.get(name)[property] || "";
        } // @ts-ignore


        return "";
      } else {
        if (["replace"].indexOf(property) > -1) {
          return function () {};
        }

        if (["currentURL"].indexOf(property) > -1) {
          return rawLocation.href;
        }

        if (["reload"].indexOf(property) > -1) {
          // TODO 增加是否保留数据
          return function (reject) {
            return proxy_awaiter(this, void 0, void 0, function () {
              return proxy_generator(this, function (_a) {
                flatternWidgets.get(name).unmount(function () {
                  flatternWidgets.get(name).mount();
                }, function () {
                  // 失败了再试一次
                  flatternWidgets.get(name).unmount(function () {
                    flatternWidgets.get(name).mount();
                  }, function () {
                    reject && reject();
                  });
                }, true);
                return [2
                /*return*/
                ];
              });
            });
          };
        }

        if (property === "toString") {
          return function () {
            // @ts-ignore
            return locationCenter.get(name) && (locationCenter.get(name)["pathname"] || "");
          };
        }

        if (property === "protocol") {
          return widgetConfig.entry.indexOf('https') === 0 ? 'https:' : 'http:';
        } // @ts-ignore


        if (typeof rawLocation[property] === "function") {
          // @ts-ignore
          return rawLocation[property].bind();
        } // @ts-ignore


        return rawLocation[property];
      }
    }
  });
};

rawDocument.write = function () {
  console.warn("please be careful");
};

rawDocument.writeln = function () {
  console.warn("please be careful");
};

var querySelector = rawDocument.querySelector; // document的代理

var createDocumentProxy = function (name) {
  // TODO  firstChild还没创建,这里需要改，加载后才能
  var doc = widgetsConfig.get(name).container.firstChild; //  || widgetsConfig.get(name).container;

  var rootDoc = doc;
  rawDocument.getElementsByClassName = rootDoc.getElementsByClassName.bind(doc);

  rawDocument.getElementsByTagName = function (tag) {
    if (tag === "head") {
      return [rawDocument.head];
    }

    if (tag === "body") {
      return [rootDoc];
    }

    return rootDoc.getElementsByTagName(tag);
  };

  rawDocument.getElementsByTagNameNS = rootDoc.getElementsByTagNameNS.bind(rootDoc);
  rawDocument.querySelectorAll = rootDoc.querySelectorAll.bind(rootDoc); // rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);

  rawDocument.removeEventListener = rootDoc.removeEventListener.bind(rootDoc);
  rawDocument.body.appendChild = rootDoc.appendChild.bind(rootDoc);
  rawDocument.body.removeChild = rootDoc.removeChild.bind(rootDoc);

  rawDocument.querySelector = function () {
    if (["head", "html"].indexOf(arguments[0]) !== -1) {
      if (arguments[0] === "head") return rawDocument.head; // @ts-ignore

      if (arguments[0] === "html") {
        // @ts-ignore
        return querySelector.bind(document).apply(void 0, arguments);
      }
    } else {
      if (["body"].indexOf(arguments[0]) !== -1) {
        return rootDoc;
      } // @ts-ignore


      return rootDoc.querySelector.apply(rootDoc, arguments);
    }
  };

  rawDocument.getElementById = function (id) {
    // @ts-ignore
    var children = rootDoc.getElementsByTagName("*");

    if (children) {
      for (var i = 0; i < children.length; i++) {
        if (children.item(i).getAttribute("id") === id) {
          return children.item(i);
        }
      }
    }

    return null;
  };

  return rawDocument;
};
var createWidgetProxy = function (name) {
  var proxyWidget = {};
  return new Proxy(proxyWidget, {
    // @ts-ignore
    get: function get(childWidgets, property) {
      if (property === "getAll") {
        return function () {
          var children = childrenWidgets.get(name);
          var childrenArray = [];
          children && children.forEach(function (childId) {
            childrenArray.push(flatternWidgets.get(childId));
          });
          return childrenArray;
        };
      }

      if (property === "unmount") {}
    }
  });
};
function getPublicPath(name) {
  var config = widgetsConfig.get(name);

  if (/\/$/.test(config.entry)) {
    return config.entry;
  }

  return config.entry + "/";
} // @ts-ignore

var createFreelogAppProxy = function (name, sandbox) {
  var freelogAppProxy = {};
  return new Proxy(freelogAppProxy, {
    // @ts-ignore
    get: function get(app, p) {
      var pro = window.freelogApp[p];

      if (typeof pro === "function") {
        return function () {
          // @ts-ignore
          return pro.bind(sandbox).apply(void 0, arguments);
        };
      }

      return pro;
    }
  });
};
function pathATag() {
  document.addEventListener.bind(document)("click", function (e) {
    if (e.target.nodeName === "A") {
      return false;
    }

    return true;
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/proxySandbox.ts
var proxySandbox_assign = undefined && undefined.__assign || function () {
  proxySandbox_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return proxySandbox_assign.apply(this, arguments);
};

var proxySandbox_spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};





/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */

function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, Object.create(null));
} // zone.js will overwrite Object.defineProperty


var rawObjectDefineProperty = Object.defineProperty;
var variableWhiteListInDev =  false || window.__FREELOG_DEVELOPMENT__ ? [// for react hot reload
// see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
"__REACT_ERROR_OVERLAY_GLOBAL_HOOK__"] : []; // who could escape the sandbox

var variableWhiteList = proxySandbox_spreadArray([// FIXME System.js used a indirect call with eval, which would make it scope escape to global
// To make System.js works well, we write it back to global window temporary
// see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
"System", // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
"__cjsWrapper"], variableWhiteListInDev, true);
/*
 variables who are impossible to be overwrite need to be escaped from proxy sandbox for performance reasons
 */


var unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
};

function createFakeWindow(global) {
  // map always has the fastest performance in has check scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  var propertiesWithGetter = new Map();
  var fakeWindow = {};
  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */

  Object.getOwnPropertyNames(global).filter(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);
    return !(descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable);
  }).forEach(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);

    if (descriptor) {
      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, "get");
      /*
       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
       */

      if (p === "top" || p === "parent" || p === "self" || p === "window" ||  false && (0)) {
        descriptor.configurable = true;
        /*
         The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
         Example:
          Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
          Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
         */

        if (!hasGetter) {
          descriptor.writable = true;
        }
      }

      if (hasGetter) propertiesWithGetter.set(p, true); // freeze the descriptor to avoid being modified by zone.js
      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  });
  return {
    fakeWindow: fakeWindow,
    propertiesWithGetter: propertiesWithGetter
  };
}

var activeSandboxCount = 0;
/**
 * 基于 Proxy 实现的沙箱
 */

var ProxySandbox =
/** @class */
function () {
  function ProxySandbox(name) {
    var _this_1 = this;
    /** window 值变更记录 */


    this.updatedValueSet = new Set();
    this.sandboxRunning = true;
    this.latestSetProp = null;
    this.name = name;
    this.type = SandBoxType.Proxy;
    var updatedValueSet = this.updatedValueSet;
    var rawWindow = window;

    var _a = createFakeWindow(rawWindow),
        fakeWindow = _a.fakeWindow,
        propertiesWithGetter = _a.propertiesWithGetter;

    var descriptorTargetMap = new Map();

    var hasOwnProperty = function (key) {
      return fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
    };

    var proxyDoc;
    var proxyHis;
    var proxyLoc;
    var proxyWidget;
    var freelogAppProxy;

    var _this = this;

    var proxy = new Proxy(fakeWindow, {
      set: function (target, p, value) {
        if (p === "freelogApp" || p === "freelogAuth") return false;

        if (_this_1.sandboxRunning) {
          // We must kept its description while the property existed in rawWindow before
          if (!target.hasOwnProperty(p) && rawWindow.hasOwnProperty(p)) {
            var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
            var _a = descriptor,
                writable = _a.writable,
                configurable = _a.configurable,
                enumerable = _a.enumerable;

            if (writable) {
              Object.defineProperty(target, p, {
                configurable: configurable,
                enumerable: enumerable,
                writable: writable,
                value: value
              });
            }
          } else {
            // @ts-ignore
            target[p] = value;
          }

          if (variableWhiteList.indexOf(p) !== -1) {
            // @ts-ignore
            rawWindow[p] = value;
          }

          updatedValueSet.add(p);
          _this_1.latestSetProp = p;
          return true;
        }

        if (false) {} // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function (target, p) {
        if (typeof p === "string" && ["fetch", "XMLHttpRequest"].includes(p)) {
          return ajaxProxy(p, name);
        }

        if (p === "freelogAuth") {
          if (isFreelogAuth(name)) {
            return rawWindow.freelogAuth;
          }

          return false;
        }

        if (p === Symbol.unscopables) return unscopables;

        if (p === "__INJECTED_PUBLIC_PATH_BY_FREELOG__") {
          return getPublicPath(name);
        }

        if (p === "fetch") {
          return function (url, options) {
            if (url.indexOf("i18n-ts") > -1) {
              return rawWindow.fetch(url, proxySandbox_assign(proxySandbox_assign({}, options), {
                credentials: "include"
              }));
            } // if(url.indexOf("freelog.com") > -1){
            //   const patchUrl = getPublicPath(name) + url.split("freelog.com/")[1];
            //   return rawWindow.fetch(patchUrl, {...options});
            // }else{


            return rawWindow.fetch(url, options); // }
          };
        } // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13


        if (p === "window" || p === "self") {
          return proxy;
        } // hijack global accessing with globalThis keyword


        if (p === "globalThis") {
          return proxy;
        }

        if (p === "top" || p === "parent" ||  false && (0)) {
          // if your master app in an iframe context, allow these props escape the sandbox
          if (rawWindow === rawWindow.parent) {
            return proxy;
          }

          return rawWindow[p];
        } // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty


        if (p === "hasOwnProperty") {
          return hasOwnProperty;
        }

        if (p === "addEventListener") {
          return freelogAddEventListener;
        }

        if (p === "freelogApp") {
          freelogAppProxy = freelogAppProxy || createFreelogAppProxy(name, _this);
          return freelogAppProxy;
        }

        if (p === "widgetName") {
          return name;
        } // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher


        if (p === "history") {
          // TODO 如果是单应用模式（提升性能）则不用代理
          proxyHis = createHistoryProxy(name); // proxyHis || createHistoryProxy(name);

          return proxyHis;
        }

        if (p === "childWidgets") {
          proxyWidget = proxyWidget || createWidgetProxy(name);
        }

        if (p === "location") {
          // TODO 如果是单应用模式（提升性能）则不用代理, 可以设置location.href的使用权限
          // TODO reload相当于重载应用，想办法把主应用的对应操控函数弄过来，发布订阅模式
          // TODO replace与reload、toString方法无法访问
          proxyLoc = proxyLoc || createLocationProxy(name);
          return proxyLoc;
        } // TODO test localstorage


        if (p === "localStorage") {
          return freelogLocalStorage(name);
        }

        if (p === "document" || p === "eval") {
          setCurrentRunningSandboxProxy(proxy); // FIXME if you have any other good ideas
          // remove the mark in next tick, thus we can identify whether it in micro app or not
          // this approach is just a workaround, it could not cover all complex cases, such as the micro app runs in the same task context with master in some case

          nextTick(function () {
            return setCurrentRunningSandboxProxy(null);
          });

          switch (p) {
            case "document":
              proxyDoc = createDocumentProxy(name);
              return proxyDoc;

            case "eval":
              // eslint-disable-next-line no-eval
              return eval;
            // no default
          }
        } // eslint-disable-next-line no-nested-ternary
        // eslint-disable-next-line no-nested-ternary


        var value = propertiesWithGetter.has(p) ? rawWindow[p] : p in target ? target[p] : rawWindow[p];
        return getTargetValue(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function (target, p) {
        return p in unscopables || p in target || p in rawWindow;
      },
      getOwnPropertyDescriptor: function (target, p) {
        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (target.hasOwnProperty(p)) {
          var descriptor = Object.getOwnPropertyDescriptor(target, p);
          descriptorTargetMap.set(p, "target");
          return descriptor;
        }

        if (rawWindow.hasOwnProperty(p)) {
          var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
          descriptorTargetMap.set(p, "rawWindow"); // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }

          return descriptor;
        }

        return undefined;
      },
      // trap to support iterator with sandbox
      // @ts-ignore
      ownKeys: function (target) {
        var keys = uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
        return keys;
      },
      defineProperty: function (target, p, attributes) {
        var from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */

        switch (from) {
          case "rawWindow":
            return Reflect.defineProperty(rawWindow, p, attributes);

          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty: function (target, p) {
        if (target.hasOwnProperty(p)) {
          // @ts-ignore
          delete target[p];
          updatedValueSet.delete(p);
          return true;
        }

        return true;
      }
    });
    this.proxy = proxy;
    activeSandboxCount++;
    saveSandBox(name, this);
  }

  ProxySandbox.prototype.active = function () {
    if (!this.sandboxRunning) activeSandboxCount++;
    this.sandboxRunning = true;
  };

  ProxySandbox.prototype.inactive = function () {
    var _this_1 = this;

    if (false) {}

    if (--activeSandboxCount === 0) {
      variableWhiteList.forEach(function (p) {
        if (_this_1.proxy.hasOwnProperty(p)) {
          // @ts-ignore
          delete window[p];
        }
      });
    }

    this.sandboxRunning = false;
  };

  return ProxySandbox;
}();

/* harmony default export */ const proxySandbox = (ProxySandbox);
;// CONCATENATED MODULE: ./src/platform/runtime/sandbox/index.ts
var sandbox_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var sandbox_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var sandbox_spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};




/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param elementGetter
 * @param scopedCSS
 * @param useLooseSandbox
 * @param excludeAssetFilter
 */

function createSandboxContainer(appName, elementGetter, scopedCSS, useLooseSandbox, excludeAssetFilter) {
  var sandbox;
  sandbox = new proxySandbox(appName); // some side effect could be be invoked while bootstrapping, such as dynamic stylesheet injection with style-loader, especially during the development phase

  var bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter); // mounting freers are one-off and should be re-init at every mounting time

  var mountingFreers = [];
  var sideEffectsRebuilders = [];
  return {
    instance: sandbox,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount: function () {
      return sandbox_awaiter(this, void 0, void 0, function () {
        var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
        return sandbox_generator(this, function (_a) {
          /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

          /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
          sandbox.active();
          sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
          sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length); // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state

          if (sideEffectsRebuildersAtBootstrapping.length) {
            sideEffectsRebuildersAtBootstrapping.forEach(function (rebuild) {
              return rebuild();
            });
          }
          /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
          // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用


          mountingFreers = patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
          /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
          // 存在 rebuilder 则表明有些副作用需要重建

          if (sideEffectsRebuildersAtMounting.length) {
            sideEffectsRebuildersAtMounting.forEach(function (rebuild) {
              return rebuild();
            });
          } // clean up rebuilders


          sideEffectsRebuilders = [];
          return [2
          /*return*/
          ];
        });
      });
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount: function () {
      return sandbox_awaiter(this, void 0, void 0, function () {
        return sandbox_generator(this, function (_a) {
          // record the rebuilders of window side effects (event listeners or timers)
          // note that the frees of mounting phase are one-off as it will be re-init at next mounting
          sideEffectsRebuilders = sandbox_spreadArray(sandbox_spreadArray([], bootstrappingFreers, true), mountingFreers, true).map(function (free) {
            return free();
          });
          sandbox.inactive();
          return [2
          /*return*/
          ];
        });
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/platform/runtime/loader.ts
/**
 * @author Kuitos
 * @since 2020-04-01
 */
var loader_assign = undefined && undefined.__assign || function () {
  loader_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return loader_assign.apply(this, arguments);
};

var loader_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var loader_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};








function assertElementExist(element, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error('[freelog] element not existed!');
  }
}

function execHooksChain(hooks, app, global) {
  if (global === void 0) {
    global = window;
  }

  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app, global);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return loader_awaiter(this, void 0, void 0, function () {
    return loader_generator(this, function (_a) {
      return [2
      /*return*/
      , typeof validate === 'function' ? validate(app) : !!validate];
    });
  });
} // @ts-ignore


var supportShadowDOM = document.head.attachShadow || document.head.createShadowRoot;

function createElement(appContent, strictStyleIsolation, scopedCSS, appName) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

  var appElement = containerElement.firstChild;

  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[freelog]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow = void 0;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({
          mode: 'open'
        });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = appElement.createShadowRoot();
      }

      shadow.innerHTML = innerHTML;
    }
  }

  appElement.setAttribute('style', 'width: 100%; height: 100%; position: relative;z-index:1;');

  if (scopedCSS) {
    var attr = appElement.getAttribute(FreelogCSSRewriteAttr);

    if (!attr) {
      appElement.setAttribute(FreelogCSSRewriteAttr, appName);
    }

    var styleNodes = appElement.querySelectorAll('style') || [];
    (0,lodash.forEach)(styleNodes, function (stylesheetElement) {
      process(appElement, stylesheetElement, appName);
    });
  }

  return appElement;
}
/** generate app wrapper dom getter */


function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new Error('[freelog]: strictStyleIsolation can not be used with legacy render!');
      if (scopedCSS) throw new Error('[freelog]: experimentalStyleIsolation can not be used with legacy render!');
      var appWrapper = document.getElementById.bind(document)(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, "[freelog] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, "[freelog] Wrapper element for ".concat(appName, " with instance ").concat(appInstanceId, " is not existed!"));

    if (strictStyleIsolation) {
      return element.shadowRoot;
    }

    return element;
  };
}

var rawAppendChild = HTMLElement.prototype.appendChild;
var loader_rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by freelog
 * @param appName
 * @param appContent
 * @param legacyRender
 */

function getRender(appName, appContent, legacyRender) {
  var render = function (_a, phase) {
    var element = _a.element,
        loading = _a.loading,
        container = _a.container;

    if (legacyRender) {
      if (false) {}

      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }

    var containerElement = getContainer(container); // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed

    if (phase !== 'unmounted') {
      var errorMsg = function () {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return "[freelog] Target container with ".concat(container, " not existed while ").concat(appName, " ").concat(phase, "!");

          case 'mounted':
            return "[freelog] Target container with ".concat(container, " not existed after ").concat(appName, " ").concat(phase, "!");

          default:
            return "[freelog] Target container with ".concat(container, " not existed while ").concat(appName, " rendering!");
        }
      }();

      assertElementExist(containerElement, errorMsg);
    }

    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        loader_rawRemoveChild.call(containerElement, containerElement.firstChild);
      } // append the element to container if it exist


      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

function getLifecyclesFromExports(scriptExports, appName, global, globalLatestSetProp) {
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  } // fallback to sandbox latest set property if it had


  if (globalLatestSetProp) {
    var lifecycles = global[globalLatestSetProp];

    if (validateExportLifecycle(lifecycles)) {
      return lifecycles;
    }
  }

  if (false) {} // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error("[freelog] You need to export lifecycle functions in ".concat(appName, " entry"));
}

var prevAppUnmountedDeferred;
function loadApp(app, configuration, lifeCycles) {
  var _a;

  if (configuration === void 0) {
    configuration = {};
  }

  return loader_awaiter(this, void 0, void 0, function () {
    var entry, appName, appInstanceId, markName, _b, singular, _c, sandbox, excludeAssetFilter, importEntryOpts, _d, template, execScripts, assetPublicPath, appContent, strictStyleIsolation, scopedCSS, initialAppWrapperElement, initialContainer, legacyRender, render, initialAppWrapperGetter, global, mountSandbox, unmountSandbox, useLooseSandbox, sandboxContainer, _e, _f, beforeUnmount, _g, afterUnmount, _h, afterMount, _j, beforeMount, _k, beforeLoad, scriptExports, _l, bootstrap, mount, unmount, update, _m, onGlobalStateChange, setGlobalState, offGlobalStateChange, syncAppWrapperElement2Sandbox, parcelConfigGetter;

    var _this = this;

    return loader_generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          entry = app.entry, appName = app.name;
          appInstanceId = "".concat(appName, "_").concat(+new Date(), "_").concat(Math.floor(Math.random() * 1000));
          markName = "[freelog] App ".concat(appInstanceId, " Loading");

          if (false) {}

          _b = configuration.singular, singular = _b === void 0 ? false : _b, _c = configuration.sandbox, sandbox = _c === void 0 ? true : _c, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = __rest(configuration, ["singular", "sandbox", "excludeAssetFilter"]);
          return [4
          /*yield*/
          , importEntry(entry, importEntryOpts)];

        case 1:
          _d = _o.sent(), template = _d.template, execScripts = _d.execScripts, assetPublicPath = _d.assetPublicPath;
          return [4
          /*yield*/
          , validateSingularMode(singular, app)];

        case 2:
          if (!_o.sent()) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise];

        case 3:
          _o.sent();

          _o.label = 4;

        case 4:
          appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
          strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
          scopedCSS = isEnableScopedCSS(sandbox);
          initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
          initialContainer = 'container' in app ? app.container : undefined;
          legacyRender = 'render' in app ? app.render : undefined;
          render = getRender(appName, appContent, legacyRender); // 第一次加载设置应用可见区域 dom 结构
          // 确保每次应用加载前容器 dom 结构已经设置完毕

          render({
            element: initialAppWrapperElement,
            loading: true,
            container: initialContainer
          }, 'loading');
          initialAppWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
            return initialAppWrapperElement;
          });
          global = window;

          mountSandbox = function () {
            return Promise.resolve();
          };

          unmountSandbox = function () {
            return Promise.resolve();
          };

          useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;

          if (sandbox) {
            sandboxContainer = createSandboxContainer(appName, // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/freelog/issues/518
            initialAppWrapperGetter, scopedCSS, useLooseSandbox, excludeAssetFilter); // 用沙箱的代理对象作为接下来使用的全局对象

            global = sandboxContainer.instance.proxy;
            mountSandbox = sandboxContainer.mount;
            unmountSandbox = sandboxContainer.unmount;
          }

          _e = (0,lodash.mergeWith)({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return (0,lodash.concat)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _f = _e.beforeUnmount, beforeUnmount = _f === void 0 ? [] : _f, _g = _e.afterUnmount, afterUnmount = _g === void 0 ? [] : _g, _h = _e.afterMount, afterMount = _h === void 0 ? [] : _h, _j = _e.beforeMount, beforeMount = _j === void 0 ? [] : _j, _k = _e.beforeLoad, beforeLoad = _k === void 0 ? [] : _k;
          return [4
          /*yield*/
          , execHooksChain(toArray(beforeLoad), app, global)];

        case 5:
          _o.sent();

          return [4
          /*yield*/
          , execScripts(global, !useLooseSandbox)];

        case 6:
          scriptExports = _o.sent();
          _l = getLifecyclesFromExports(scriptExports, appName, global, (_a = sandboxContainer === null || sandboxContainer === void 0 ? void 0 : sandboxContainer.instance) === null || _a === void 0 ? void 0 : _a.latestSetProp), bootstrap = _l.bootstrap, mount = _l.mount, unmount = _l.unmount, update = _l.update;
          _m = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _m.onGlobalStateChange, setGlobalState = _m.setGlobalState, offGlobalStateChange = _m.offGlobalStateChange;

          syncAppWrapperElement2Sandbox = function (element) {
            return initialAppWrapperElement = element;
          };

          parcelConfigGetter = function (remountContainer) {
            if (remountContainer === void 0) {
              remountContainer = initialContainer;
            }

            var appWrapperElement = initialAppWrapperElement;
            var appWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
              return appWrapperElement;
            });
            var parcelConfig = {
              name: appInstanceId,
              bootstrap: bootstrap,
              mount: [function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  var marks;
                  return loader_generator(this, function (_a) {
                    if (false) {}

                    return [2
                    /*return*/
                    ];
                  });
                });
              }, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , validateSingularMode(singular, app)];

                      case 1:
                        if (_a.sent() && prevAppUnmountedDeferred) {
                          return [2
                          /*return*/
                          , prevAppUnmountedDeferred.promise];
                        }

                        return [2
                        /*return*/
                        , undefined];
                    }
                  });
                });
              }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
              function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  var useNewContainer;
                  return loader_generator(this, function (_a) {
                    useNewContainer = remountContainer !== initialContainer;

                    if (useNewContainer || !appWrapperElement) {
                      // element will be destroyed after unmounted, we need to recreate it if it not exist
                      // or we try to remount into a new container
                      appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
                      syncAppWrapperElement2Sandbox(appWrapperElement);
                    }

                    render({
                      element: appWrapperElement,
                      loading: true,
                      container: remountContainer
                    }, 'mounting');
                    return [2
                    /*return*/
                    ];
                  });
                });
              }, mountSandbox, // exec the chain after rendering to keep the behavior with beforeLoad
              function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain(toArray(beforeMount), app, global)];
                  });
                });
              }, function (props) {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , mount(loader_assign(loader_assign({}, props), {
                      container: appWrapperGetter(),
                      setGlobalState: setGlobalState,
                      onGlobalStateChange: onGlobalStateChange
                    }))];
                  });
                });
              }, // finish loading after app mounted
              function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , render({
                      element: appWrapperElement,
                      loading: false,
                      container: remountContainer
                    }, 'mounted')];
                  });
                });
              }, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain(toArray(afterMount), app, global)];
                  });
                });
              }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
              function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , validateSingularMode(singular, app)];

                      case 1:
                        if (_a.sent()) {
                          prevAppUnmountedDeferred = new Deferred();
                        }

                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  var measureName;
                  return loader_generator(this, function (_a) {
                    if (false) {}

                    return [2
                    /*return*/
                    ];
                  });
                });
              }],
              unmount: [function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain(toArray(beforeUnmount), app, global)];
                  });
                });
              }, function (props) {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , unmount(loader_assign(loader_assign({}, props), {
                      container: appWrapperGetter()
                    }))];
                  });
                });
              }, unmountSandbox, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain(toArray(afterUnmount), app, global)];
                  });
                });
              }, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    render({
                      element: null,
                      loading: false,
                      container: remountContainer
                    }, 'unmounted');
                    offGlobalStateChange(appInstanceId); // for gc

                    appWrapperElement = null;
                    syncAppWrapperElement2Sandbox(appWrapperElement);
                    return [2
                    /*return*/
                    ];
                  });
                });
              }, function () {
                return loader_awaiter(_this, void 0, void 0, function () {
                  return loader_generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , validateSingularMode(singular, app)];

                      case 1:
                        if (_a.sent() && prevAppUnmountedDeferred) {
                          prevAppUnmountedDeferred.resolve();
                        }

                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }]
            };

            if (typeof update === 'function') {
              parcelConfig.update = update;
            }

            return parcelConfig;
          };

          return [2
          /*return*/
          , parcelConfigGetter];
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/runtime/apis.ts
var apis_assign = undefined && undefined.__assign || function () {
  apis_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return apis_assign.apply(this, arguments);
};

var apis_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var apis_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};



 // eslint-disable-next-line import/no-mutable-exports

var frameworkConfiguration = {};
var appConfigPromiseGetterMap = new Map();
function loadMicroApp(app, configuration, lifeCycles) {
  var _this = this;

  var props = app.props,
      name = app.name;

  var getContainerXpath = function (container) {
    var containerElement = getContainer(container);

    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }

    return undefined;
  };

  var wrapParcelConfigForRemount = function (config) {
    return apis_assign(apis_assign({}, config), {
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: function () {
        return Promise.resolve();
      }
    });
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */


  var memorizedLoadingFn = function () {
    return apis_awaiter(_this, void 0, void 0, function () {
      var userConfiguration, $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, _a, xpath, parcelConfigGetterPromise, _b, parcelConfigObjectGetterPromise, xpath;

      return apis_generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            userConfiguration = configuration !== null && configuration !== void 0 ? configuration : apis_assign(apis_assign({}, frameworkConfiguration), {
              singular: false
            });
            $$cacheLifecycleByAppName = userConfiguration.$$cacheLifecycleByAppName;
            container = 'container' in app ? app.container : undefined;
            if (!container) return [3
            /*break*/
            , 4];
            if (!$$cacheLifecycleByAppName) return [3
            /*break*/
            , 2];
            parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
            if (!parcelConfigGetterPromise) return [3
            /*break*/
            , 2];
            _a = wrapParcelConfigForRemount;
            return [4
            /*yield*/
            , parcelConfigGetterPromise];

          case 1:
            return [2
            /*return*/
            , _a.apply(void 0, [_c.sent()(container)])];

          case 2:
            xpath = getContainerXpath(container);
            if (!xpath) return [3
            /*break*/
            , 4];
            parcelConfigGetterPromise = appConfigPromiseGetterMap.get("".concat(name, "-").concat(xpath));
            if (!parcelConfigGetterPromise) return [3
            /*break*/
            , 4];
            _b = wrapParcelConfigForRemount;
            return [4
            /*yield*/
            , parcelConfigGetterPromise];

          case 3:
            return [2
            /*return*/
            , _b.apply(void 0, [_c.sent()(container)])];

          case 4:
            parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);

            if (container) {
              if ($$cacheLifecycleByAppName) {
                appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
              } else {
                xpath = getContainerXpath(container);
                if (xpath) appConfigPromiseGetterMap.set("".concat(name, "-").concat(xpath), parcelConfigObjectGetterPromise);
              }
            }

            return [4
            /*yield*/
            , parcelConfigObjectGetterPromise];

          case 5:
            return [2
            /*return*/
            , _c.sent()(container)];
        }
      });
    });
  }; // @ts-ignore


  return mountRootParcel(memorizedLoadingFn, apis_assign({
    domElement: document.createElement('div')
  }, props));
}
;// CONCATENATED MODULE: ./src/platform/runtime/errorHandler.ts
/**
 * @author Kuitos
 * @since 2020-02-21
 */

function addGlobalUncaughtErrorHandler(errorHandler) {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);
}
function removeGlobalUncaughtErrorHandler(errorHandler) {
  window.removeEventListener('error', errorHandler);
  window.removeEventListener('unhandledrejection', errorHandler);
}
;// CONCATENATED MODULE: ./src/platform/runtime/index.ts
/**
 * @author Kuitos
 * @since 2019-04-25
 */





;// CONCATENATED MODULE: ./src/platform/structure/widgetConfigData.ts
// TODO 节点配置数据优于插件传递数据
// TODO 请求子依赖时需要配置数据
// 只有展品解决方案：请求子
var defaultWidgetConfigData = {
  historyFB: true,
  hbfOnlyToTheme: true // 总开关，默认只给主题，只有主题时才判断

};
;// CONCATENATED MODULE: ./src/platform/structure/widget.ts
// 插件对象管理plugins：flatternWidgets childrenWidgets sandBoxs
var widget_assign = undefined && undefined.__assign || function () {
  widget_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return widget_assign.apply(this, arguments);
};

var widget_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var widget_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
/**
 * 1.数据结构
 *   flatternWidgets Map<key：plugin id,value: object: 所有插件配置与状态与加载后控制对象> 插件集合 平行 关系 所有插件配置与状态与
 *   childrenWidgets Map<key：father-plugin id,value: Array:[child-plugin id]> 插件对应的子插件集合
 *   sandBoxs Map<key: plugin id, value: sandbox>  所有插件对应沙盒对象
 * 2.设计模式
 *   自顶向下： 加载与卸载权限控制： 注册后通过沙盒提供控制对象给运行时或上层插件沙盒变量进行管控
 *   loadMicroApp({ name: 'vue', entry: '//localhost:7101', container: '#vue' }, { sandbox: { experimentalStyleIsolation: true } }, );
 *   状态管理：
 *      运行状态管理： bootstrap,mounting,mounted,unmounting,unmounted   后期思考：怎样算paused，能否实现？
 *      权限状态？？？
 *   中央集权：沙盒全部在运行时进行管控，一旦有恶意侵入可中断（对沙盒的中断算paused?）， 挂载后控制对象就在全局，故有加载与卸载任何插件权限。
 *
 */






var FREELOG_DEV = "freelogDev";
var flatternWidgets = new Map();
var widgetsConfig = new Map();
var activeWidgets = new Map();
var childrenWidgets = new Map();
var sandBoxs = new Map(); // 沙盒不交给plugin, 因为plugin是插件可以用的

var widgetUserData = new Map(); // TODO plugin type

function addWidget(key, plugin) {
  if (activeWidgets.has(key)) {
    console.warn(flatternWidgets.get(key).name + " reloaded");
  }

  flatternWidgets.set(key, plugin);
  activeWidgets.set(key, plugin);
}
function addWidgetConfig(key, config) {
  widgetsConfig.set(key, config);
} // TODO error

function removeWidget(key) {
  flatternWidgets.has(key) && flatternWidgets.delete(key) && removeSandBox(key);
}
function deactiveWidget(key) {
  activeWidgets.has(key) && activeWidgets.delete(key);
}
function addChildWidget(key, childKey) {
  var arr = childrenWidgets.get(key) || [];
  !arr.contains(childKey) && arr.push(childKey);
  childrenWidgets.set(key, arr);
}
function removeChildWidget(key, childKey) {
  if (childrenWidgets.has(key)) {
    var arr = childrenWidgets.get(key) || [];
    arr.contains(childKey) && arr.splice(arr.indexOf(childKey), 1);
    childrenWidgets.set(key, arr);
  }
} // maybe plugin is not exists in flatternWidgets

function addSandBox(key, sandbox) {
  if (sandBoxs.has(key)) {
    console.warn(flatternWidgets.get(key).name + "reloaded");
  }

  sandBoxs.set(key, sandbox);
}
function removeSandBox(key) {
  sandBoxs.has(key) && sandBoxs.delete(key);
}
var firstDev = false;
var hbfOnlyToTheme = true; // 保存是否前进后退只给主题

function mountUI(name, container, entry, config) {
  var widgetConfig = {
    container: container,
    name: name,
    entry: entry,
    isUI: true,
    config: config
  };
  addWidgetConfig(name, widgetConfig);
  var app = loadMicroApp(widgetConfig, {
    sandbox: {
      strictStyleIsolation: config ? !!config.shadowDom : false,
      experimentalStyleIsolation: config ? !!config.scopedCss : true
    }
  }); // TODO 增加是否保留数据

  var _app = widget_assign(widget_assign({}, app), {
    mount: function (resolve, reject) {
      app.mount().then(function () {
        addWidget(name, app); // TODO 验证是否是函数

        resolve && resolve();
      }, function () {
        reject();
      });
    },
    unmount: function (resolve, reject) {
      app.unmount().then(function () {
        deactiveWidget(name);
        setLocation(); // TODO 验证是否是函数

        resolve && resolve();
      }, function () {
        reject();
      });
    }
  });

  addWidget(name, _app); // TODO 拦截mount做处理

  return _app;
} // 可供插件自己加载子插件  widget需要验证格式

/**
 *
 * @param widget      插件数据
 * @param container   挂载容器
 * @param commonData  最外层展品数据（子孙插件都需要用）
 * @param config      配置数据
 * @param seq         一个节点内可以使用多个插件，但需要传递序号，
 * TODO 如果需要支持不同插件下使用同一个插件，需要将展品id也加上
 *
 * @returns
 * 情况1.加载展品插件  topExhibitData只能为""或null值
 * 情况2.加载子插件  topPresenbleData必须传
 * 情况3.dev开发模式，
 */

function mountWidget(widget, container, topExhibitData, config, seq, widget_entry // 因为插件加载者并不使用，所以 可以当成 widget_entry 
) {
  return widget_awaiter(this, void 0, void 0, function () {
    var isTheme, that, configData, devData, commonData, entry, widgetId, fentry, widgetConfig, app, freelog_app;
    return widget_generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          isTheme = typeof widget_entry === 'boolean' ? widget_entry : false;
          that = this;
          configData = config; // TODO 为了安全，得验证是否是插件使用还是运行时使用mountWidget

          if (that && that.name) {
            isTheme = false;
            defaultWidgetConfigData.historyFB = false;
          }

          isTheme && (widget_entry = '');
          config = widget_assign(widget_assign(widget_assign({}, defaultWidgetConfigData), widget.versionInfo ? widget.versionInfo.exhibitProperty : {}), config);

          if (!isTheme) {
            config.historyFB = hbfOnlyToTheme ? false : config.historyFB;
          } else {
            hbfOnlyToTheme = config.hbfOnlyToTheme;
          }

          devData = window.freelogApp.devData; // 不是开发模式禁用

          if (devData.type === DEV_FALSE) widget_entry = '';
          entry = "";

          if (!topExhibitData) {
            commonData = {
              id: widget.articleInfo.articleId,
              name: widget.articleInfo.name || widget.articleInfo.articleName,
              exhibitId: widget.exhibitId || "",
              articleNid: "",
              articleInfo: {
                articleId: widget.articleInfo.articleId,
                articleName: widget.articleInfo.name || widget.articleInfo.articleName
              }
            };
          } else {
            commonData = {
              id: widget.id,
              name: widget.name,
              exhibitId: topExhibitData.exhibitId || "",
              articleNid: topExhibitData.articleNid,
              articleInfo: {
                articleId: widget.id,
                articleName: widget.name
              }
            };
          }

          widgetId = "freelog-" + commonData.articleInfo.articleId;
          widget_entry && console.warn('you are using widget entry ' + widget_entry + ' for widget-articleId: ' + commonData.articleInfo.articleId); // @ts-ignore

          if (devData) {
            if (devData.type === DEV_TYPE_REPLACE) {
              entry = devData.params[commonData.id] || "";
            }

            if (devData.type === DEV_WIDGET && !firstDev) {
              entry = devData.params.dev;
              firstDev = true;
            }
          } // @ts-ignore


          entry = widget_entry || entry;

          if (seq || seq === 0) {
            widgetId = "freelog-" + commonData.id + seq;
          }

          fentry = '';
          if (!commonData.articleNid) return [3
          /*break*/
          , 2];
          return [4
          /*yield*/
          , window.freelogApp.getExhibitDepFileStream.bind(that || {})(commonData.exhibitId, commonData.articleNid, commonData.articleInfo.articleId, true)];

        case 1:
          fentry = _a.sent();
          fentry = fentry + "&subFilePath=";
          return [3
          /*break*/
          , 4];

        case 2:
          return [4
          /*yield*/
          , window.freelogApp.getExhibitFileStream.bind(that || {})(commonData.exhibitId, true)];

        case 3:
          fentry = _a.sent();
          fentry = fentry + '?subFilePath=';
          _a.label = 4;

        case 4:
          widgetConfig = {
            container: container,
            name: widgetId,
            isTheme: !!isTheme,
            exhibitId: commonData.exhibitId,
            widgetName: commonData.articleInfo.articleName.replace("/", "-"),
            parentNid: commonData.articleNid,
            articleName: commonData.articleInfo.articleName,
            subArticleIdOrName: commonData.articleInfo.articleId,
            articleId: commonData.articleInfo.articleId,
            entry: entry || fentry,
            isDev: !!entry,
            config: config,
            isUI: false
          };
          addWidgetConfig(widgetId, widgetConfig);
          app = loadMicroApp(widgetConfig, {
            sandbox: {
              strictStyleIsolation: configData ? !!configData.shadowDom : false,
              experimentalStyleIsolation: configData ? !!configData.scopedCss : true
            }
          });
          freelog_app = widget_assign(widget_assign({}, app), {
            mount: function (resolve, reject) {
              app.mount().then(function () {
                addWidget(widgetId, freelog_app); // TODO 验证是否是函数

                resolve && resolve();
              }, function () {
                reject && reject();
              });
            },
            unmount: function (resolve, reject, keepLocation) {
              app.unmount().then(function () {
                deactiveWidget(widgetId);
                !keepLocation && setLocation(); // TODO 验证是否是函数

                resolve && resolve();
              }, function () {
                reject && reject();
              });
            }
          });
          addWidget(widgetId, freelog_app);
          return [2
          /*return*/
          , freelog_app];
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/security.ts

/**
 * 目标：防止插件通过非运行时的途径调用接口
 */

function hookAJAX() {
  // @ts-ignore
  XMLHttpRequest.prototype.nativeOpen = XMLHttpRequest.prototype.open; // @ts-ignore

  var customizeOpen = function (method, url, async, user, password) {// do something
  }; // @ts-ignore


  XMLHttpRequest.prototype.open = customizeOpen;
}
/**
 *全局拦截Image的图片请求添加token
 */

function hookImg() {
  var property = Object.getOwnPropertyDescriptor(Image.prototype, "src"); // @ts-ignore

  var nativeSet = property.set; // @ts-ignore

  function customiseSrcSet(url) {
    // @ts-ignore
    nativeSet.call(this, url);
  }

  Object.defineProperty(Image.prototype, "src", {
    set: customiseSrcSet
  });
}
/**
 * 拦截全局open的url添加token
 *
 */

function hookOpen() {
  var nativeOpen = window.open; // @ts-ignore

  window.open = function (url) {
    // do something
    nativeOpen.call(this, url);
  };
}
function hookFetch() {
  var fet = Object.getOwnPropertyDescriptor(window, "fetch");
  Object.defineProperty(window, "fetch", {
    // @ts-ignore
    value: function (a, b, c) {
      // do something
      // @ts-ignore
      return fet.value.apply(this, args);
    }
  });
}
var inited = false;
function initUserCheck() {
  inited = true;
}
var security_rawLocation = window.location;
function isUserChange() {
  var uid = cookies_default().getItem("uid");
  uid = uid ? uid : "";

  if (inited && uid !== window.userId) {
    security_rawLocation.reload();
    return true;
  } // 有页面登出后，还处于登录状态的页面处理方式


  if (inited && window.userId && !uid) {
    security_rawLocation.reload();
    return true;
  }

  return false;
}
;// CONCATENATED MODULE: ./src/services/api/modules/user.ts

var user = {
  login: {
    url: "passport/login",
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      isRemember: "string",
      returnUrl: "string",
      jwtType: "string"
    }
  },
  loginVerify: {
    url: "users/verifyLoginPassword",
    method: "get",
    dataModel: {
      password: "string"
    }
  },
  loginOut: {
    url: "passport/logout",
    method: "get",
    params: {
      returnUrl: "string"
    }
  },
  getCurrent: {
    url: "users/current",
    method: "get"
  },
  getAccount: {
    url: "accounts/individualAccounts/".concat(placeHolder),
    method: "get"
  },
  postRegister: {
    url: "users",
    method: "post",
    dataModel: {
      loginName: "string",
      password: "string",
      username: "string",
      authCode: "string"
    }
  },
  getAuthCode: {
    url: "messages/send",
    method: "post",
    dataModel: {
      loginName: "string",
      authCodeType: "string"
    }
  },
  verifyAuthCode: {
    url: "messages/verify",
    method: "get",
    dataModel: {
      authCode: "string",
      address: "string",
      authCodeType: "string"
    }
  },
  putResetPassword: {
    url: "users/".concat(placeHolder, "/resetPassword"),
    method: "put",
    dataModel: {
      password: "string",
      authCode: "string"
    }
  },
  putResetPayPassword: {
    url: "accounts/individualAccounts/resetPassword",
    method: "put",
    dataModel: {
      loginPassword: "string",
      password: "string",
      authCode: "string",
      messageAddress: "string"
    }
  }
};
/* harmony default export */ const modules_user = (user);
;// CONCATENATED MODULE: ./src/services/api/modules/node.ts

var node = {
  getInfoById: {
    url: "nodes/".concat(placeHolder),
    method: "GET"
  },
  // exhibitId, result|info|articleInfo|fileStream
  getInfoByNameOrDomain: {
    url: "nodes/detail",
    method: "GET",
    dataModel: {
      nodeName: "string",
      nodeDomain: "string",
      isLoadOwnerUserInfo: "int"
    }
  },
  // storages/buckets/.UserNodeData/objects   post
  postUserData: {
    url: "storages/buckets/.UserNodeData/objects",
    method: "POST",
    dataModel: {
      nodeId: "int",
      nodeDomain: "string",
      userNodeData: "object"
    }
  },
  // storages/buckets/.UserNodeData/objects/{nodeId}  PUT
  putUserData: {
    url: "storages/buckets/.UserNodeData/objects/".concat(placeHolder),
    method: "PUT",
    dataModel: {
      removeFields: "",
      appendOrReplaceObject: ""
    }
  },
  // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
  getUserData: {
    url: "storages/buckets/.UserNodeData/objects/".concat(placeHolder, "/customPick"),
    method: "GET",
    dataModel: {
      fields: "string"
    }
  }
};
/* harmony default export */ const modules_node = (node);
;// CONCATENATED MODULE: ./src/platform/structure/utils.ts
// 工具utils：获取容器，生成容器，销毁容器，生成id
var utils_assign = undefined && undefined.__assign || function () {
  utils_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return utils_assign.apply(this, arguments);
};

var utils_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var utils_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};









function freelogFetch(url, options) {
  options = options || {};

  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, utils_assign(utils_assign({}, options), {
      credentials: "include"
    }));
  } else {
    return fetch(url, utils_assign({}, options));
  }
} // TODO  此文件的方法需要整理分离出freeelogApp下的和内部使用的

function utils_getContainer(container) {
  // @ts-ignore
  return typeof container === "string" ? document.querySelector.bind(document)("#" + container) : container;
}
function createContainer(container, id) {
  var father = typeof container === "string" ? document.querySelector.bind(document)("#" + container) : container; // @ts-ignore

  if (father === null || father === void 0 ? void 0 : father.querySelector("#" + id)) return father === null || father === void 0 ? void 0 : father.querySelector("#" + id);
  var child = document.createElement("DIV");
  child.setAttribute("id", id);
  father === null || father === void 0 ? void 0 : father.appendChild(child);
  return child;
} // TODO 确定返回类型

function deleteContainer(father, child) {
  var fatherContainer = typeof father === "string" ? document.querySelector("#" + father) : father;
  var childContainer = typeof child === "string" ? document.querySelector("#" + child) : child;
  return childContainer ? fatherContainer === null || fatherContainer === void 0 ? void 0 : fatherContainer.removeChild(childContainer) : true;
}
function createScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject; // script.async = true

    script.defer = true; // @ts-ignore

    document.getElementsByTagName.bind(document)("head").item(0).appendChild(script);
  });
}
function createCssLink(href, type) {
  return new Promise(function (resolve, reject) {
    var link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.type = type || "text/css";
    link.onload = resolve;
    link.onerror = reject; // @ts-ignore

    document.getElementsByTagName.bind(document)("head").item(0).appendChild(link);
  });
} //

function resolveUrl(path, params) {
  // @ts-ignore
  var nodeType = window.freelogApp.nodeInfo.nodeType;
  params = Object.assign({
    nodeType: nodeType
  }, params);
  var queryStringArr = [];

  for (var key in params) {
    if (params[key] != null) {
      queryStringArr.push("".concat(key, "=").concat(params[key]));
    }
  }

  return "".concat(baseUrl).concat(path, "?").concat(queryStringArr.join("&"));
} // TODO 这个根本不需要

function getSelfId() {
  var _a;

  return utils_awaiter(this, void 0, void 0, function () {
    return utils_generator(this, function (_b) {
      // @ts-ignore
      return [2
      /*return*/
      , (_a = widgetsConfig.get(this.name)) === null || _a === void 0 ? void 0 : _a.exhibitId];
    });
  });
}
function getSelfConfig() {
  // @ts-ignore  由于config只有一层，所以用...就够了
  return utils_assign({}, widgetsConfig.get(this.name).config);
} // TODO if error  这里不需要参数，除了运行时自行调用，需要抽离出来不与插件调用混在一起
// TODO 紧急，增加方法加载子依赖传递作品id，通过作品id查询到孙依赖插件

function getSubDep(exhibitId) {
  return utils_awaiter(this, void 0, void 0, function () {
    var isTheme, that, widgetSandBox, response, exhibitName, articleNid, resourceType, subDep, exhibitProperty;

    var _this = this;

    return utils_generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          isTheme = false;
          that = this || {};
          widgetSandBox = sandBoxs.get(that.name);

          if (!widgetSandBox) {
            isTheme = true;
            widgetSandBox = {
              name: "freelog-" + exhibitId,
              exhibitId: exhibitId,
              isTheme: isTheme
            };
          } else {
            exhibitId = exhibitId || widgetsConfig.get(that.name).exhibitId;
          }

          return [4
          /*yield*/
          , getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId)];

        case 1:
          response = _a.sent();
          if (!(response.authErrorType && isTheme)) return [3
          /*break*/
          , 7];
          return [4
          /*yield*/
          , new Promise(function (resolve, reject) {
            return utils_awaiter(_this, void 0, void 0, function () {
              var _this = this;

              return utils_generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!(response.authCode === 502)) return [3
                    /*break*/
                    , 3];
                    return [4
                    /*yield*/
                    , new Promise(function (resolve, reject) {
                      return utils_awaiter(_this, void 0, void 0, function () {
                        var _this = this;

                        return utils_generator(this, function (_a) {
                          addAuth.bind(widgetSandBox)(exhibitId, {
                            immediate: true
                          });
                          window.freelogApp.onLogin(function () {
                            return utils_awaiter(_this, void 0, void 0, function () {
                              return utils_generator(this, function (_a) {
                                resolve();
                                return [2
                                /*return*/
                                ];
                              });
                            });
                          });
                          return [2
                          /*return*/
                          ];
                        });
                      });
                    })];

                  case 1:
                    _a.sent();

                    return [4
                    /*yield*/
                    , getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId)];

                  case 2:
                    response = _a.sent();
                    _a.label = 3;

                  case 3:
                    if (!response.authErrorType) return [3
                    /*break*/
                    , 5];
                    return [4
                    /*yield*/
                    , addAuth.bind(widgetSandBox)(exhibitId, {
                      immediate: true
                    })];

                  case 4:
                    _a.sent();

                    _a.label = 5;

                  case 5:
                    resolve();
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          })];

        case 2:
          _a.sent();

          return [4
          /*yield*/
          , getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId)];

        case 3:
          response = _a.sent();
          if (!response.authErrorType) return [3
          /*break*/
          , 5];
          return [4
          /*yield*/
          , new Promise(function (resolve, reject) {
            return utils_awaiter(_this, void 0, void 0, function () {
              return utils_generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4
                    /*yield*/
                    , addAuth.bind(widgetSandBox)(exhibitId, {
                      immediate: true
                    })];

                  case 1:
                    _a.sent();

                    resolve();
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          })];

        case 4:
          _a.sent();

          _a.label = 5;

        case 5:
          return [4
          /*yield*/
          , getExhibitInfoByAuth.bind(widgetSandBox)(exhibitId)];

        case 6:
          response = _a.sent();
          _a.label = 7;

        case 7:
          exhibitName = decodeURI(response.headers["freelog-exhibit-name"]);
          articleNid = decodeURI(response.headers["freelog-article-nid"]);
          resourceType = decodeURI(response.headers["freelog-article-resource-type"]);
          subDep = decodeURI(response.headers["freelog-article-sub-dependencies"]);
          subDep = subDep ? JSON.parse(decodeURIComponent(subDep)) : [];
          exhibitProperty = decodeURI(response.headers["freelog-exhibit-property"]);
          exhibitProperty = exhibitProperty ? JSON.parse(decodeURIComponent(exhibitProperty)) : {};
          return [2
          /*return*/
          , utils_assign({
            exhibitName: exhibitName,
            exhibitId: exhibitId,
            articleNid: articleNid,
            resourceType: resourceType,
            subDep: subDep,
            versionInfo: {
              exhibitProperty: exhibitProperty
            }
          }, response.data.data)];
      }
    });
  });
}
var userInfo = null;
function getUserInfo() {
  return utils_awaiter(this, void 0, void 0, function () {
    var res;
    return utils_generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (userInfo) return [2
          /*return*/
          , userInfo];
          return [4
          /*yield*/
          , frequest(modules_user.getCurrent, "", "")];

        case 1:
          res = _a.sent();
          userInfo = res.data.errCode === 0 ? res.data.data : null;
          setUserInfo(userInfo);
          initUserCheck();
          return [2
          /*return*/
          , userInfo];
      }
    });
  });
}
function getCurrentUser() {
  return userInfo;
}
function setUserInfo(info) {
  return utils_awaiter(this, void 0, void 0, function () {
    return utils_generator(this, function (_a) {
      window.userId = info ? info.userId + "" : "";
      userInfo = info;
      return [2
      /*return*/
      ];
    });
  });
}
function getStaticPath(path) {
  if (!/^\//.test(path)) {
    path = "/" + path;
  } // @ts-ignore


  return widgetsConfig.get(this.name).entry + path;
}
var utils_rawLocation = window.location;
function reload() {
  // @ts-ignore
  if (widgetsConfig.get(this.name).isTheme) {
    utils_rawLocation.reload();
  }
}
var immutableKeys = ["width"];
var viewPortValue = {
  width: "device-width",
  height: "device-height",
  "initial-scale": 1,
  "maximum-scale": 1,
  "minimum-scale": 1,
  "user-scalable": "no",
  "viewport-fit": "auto" // not supported in browser

};
var utils_rawDocument = window.document;
function setViewport(keys) {
  var _a; // @ts-ignore


  var that = this; // 如果是主题

  if (!((_a = widgetsConfig.get(that.name)) === null || _a === void 0 ? void 0 : _a.isTheme)) {
    return;
  }

  Object.keys(keys).forEach(function (key) {
    if (viewPortValue.hasOwnProperty(key) && !immutableKeys.includes(key)) {
      // TODO 开发体验最好做下验证值是否合法
      // @ts-ignore
      viewPortValue[key] = keys[key];
    }
  });
  var metaEl = utils_rawDocument.querySelector('meta[name="viewport"]');
  var content = "";
  Object.keys(viewPortValue).forEach(function (key) {
    if (viewPortValue.hasOwnProperty(key)) {
      // @ts-ignore
      content += key + "=" + viewPortValue[key] + ",";
    }
  });
  metaEl.setAttribute("content", content);
}
/**
 *
 *
 *
 */
// export async function createUserData(userNodeData: any) {
//   const nodeId = window.freelogApp.nodeInfo.nodeId
//   const res = await frequest(node.postUserData, "", {
//     nodeId,
//     userNodeData
//   });
//   return res;
// }

function setUserData(key, data) {
  return utils_awaiter(this, void 0, void 0, function () {
    var name, userData, config, widgetId, nodeId, res;

    var _a;

    return utils_generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          key = window.isTest ? key + "-test" : key;
          name = this.name;
          userData = widgetUserData.get(name) || {};
          config = widgetsConfig.get(name);
          userData[key] = data;
          widgetId = btoa(encodeURI(config.articleName));

          if (name === FREELOG_DEV) {
            widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME;
          }

          nodeId = window.freelogApp.nodeInfo.nodeId;
          return [4
          /*yield*/
          , frequest(modules_node.putUserData, [nodeId], {
            appendOrReplaceObject: (_a = {}, _a[widgetId] = userData, _a)
          })];

        case 1:
          res = _b.sent();
          return [2
          /*return*/
          , res];
      }
    });
  });
}
function getUserData(key) {
  return utils_awaiter(this, void 0, void 0, function () {
    var name, userData, config, widgetId, nodeId, res;
    return utils_generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          key = window.isTest ? key + "-test" : key;
          name = this.name;
          userData = widgetUserData.get(name);

          if (userData) {
            return [2
            /*return*/
            , userData[key]];
          }

          config = widgetsConfig.get(name);
          widgetId = btoa(encodeURI(config.articleName));

          if (name === FREELOG_DEV) {
            widgetId = sandBoxs.get(name).proxy.FREELOG_RESOURCENAME;
          }

          nodeId = window.freelogApp.nodeInfo.nodeId;
          return [4
          /*yield*/
          , frequest(modules_node.getUserData, [nodeId], "")];

        case 1:
          res = _a.sent();
          userData = res.data[widgetId] || {};
          widgetUserData.set(name, userData);
          return [2
          /*return*/
          , userData[key]];
      }
    });
  });
}
function callLogin(resolve) {
  if (!userInfo) {
    goLogin(resolve);
  }
}
function callLoginOut() {
  if (userInfo) {
    goLoginOut();
  }
}
function setTabLogo(Url) {
  // fetch("/freelog.ico").then((res: Response) => {
  //   res.blob().then((blob: Blob) => {
  //     const objectURL = URL.createObjectURL(blob);
  //     var link: HTMLLinkElement =
  //       document.querySelector.bind(document)('link[rel*="icon"]') ||
  //       document.createElement("link");
  //     link.type = "image/x-icon";
  //     link.rel = "shortcut icon";
  //     link.href = objectURL; // 'http://www.stackoverflow.com/favicon.ico'
  //     document.getElementsByTagName.bind(document)("head")[0].appendChild(link);
  //   });
  // });
  var link = document.querySelector.bind(document)('link[rel*="icon"]') || document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = Url; // 'http://www.stackoverflow.com/favicon.ico'

  document.getElementsByTagName.bind(document)("head")[0].appendChild(link);
}
function utils_isMobile() {
  var browser = {
    versions: function () {
      var u = navigator.userAgent; // app = navigator.appVersion;

      return {
        //移动终端浏览器版本信息
        trident: u.indexOf("Trident") > -1,
        presto: u.indexOf("Presto") > -1,
        webKit: u.indexOf("AppleWebKit") > -1,
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1,
        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
        iPhone: u.indexOf("iPhone") > -1,
        iPad: u.indexOf("iPad") > -1,
        webApp: u.indexOf("Safari") === -1 //是否web应该程序，没有头部与底部

      };
    }(),
    // @ts-ignore
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }; //如果是移动端就进行这里

  if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
    return true;
  } else {
    return false;
  }
}
;// CONCATENATED MODULE: ./src/bridge/eventOn.ts
var eventOn_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var eventOn_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};



var loginCallback = []; // 登录和切换用户需要触发

function onLogin(callback) {
  return eventOn_awaiter(this, void 0, void 0, function () {
    return eventOn_generator(this, function (_a) {
      if (typeof callback === "function") {
        loginCallback.push(callback);
      } else {
        console.error("onLogin error: ", callback, " is not a function!");
      }

      return [2
      /*return*/
      ];
    });
  });
}
var userChangeCallback = []; // 交给主题或插件去刷新用户，或者可以做成由节点选择是否在运行时里面控制

function onUserChange(callback) {
  if (typeof callback === "function") {
    userChangeCallback.push(callback);
  } else {
    console.error("onLogin error: ", callback, " is not a function!");
  }
}
var initWindowListener = function () {
  window.document.addEventListener("visibilitychange", function () {
    if (cookies_default().getItem("uid") != (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId)) {
      userChangeCallback.forEach(function (func) {
        func && func();
      });
    }
  });
};
;// CONCATENATED MODULE: ./src/bridge/index.ts
var bridge_assign = undefined && undefined.__assign || function () {
  bridge_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return bridge_assign.apply(this, arguments);
};

var bridge_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var bridge_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};





var exhibitQueue = new Map();
var eventMap = new Map(); // 数组

var failedMap = new Map();
var bridge_rawDocument = document;
var rawWindow = window;
var UI = null;
var updateUI = null;
var locked = false;
var uiInited = false;
/**
 *
 * @param ui    签约事件型UI，登录UI，节点冻结UI，主题冻结UI，无主题UI，
 * @param update    更新签约事件型UI
 * @param login    提供给插件唤起登录UI
 * @param loginOut  提供给插件唤起登出UI
 *
 *
 */

function reisterUI(ui, update) {
  UI = ui;
  updateUI = update;
}
function callUI(type, data) {
  UI && UI(type, data);
}
function updateLock(status) {
  locked = !!status;
}
function setPresentableQueue(name, value) {
  exhibitQueue.set(name, value);
} // TODO 公共非展品事件UI， 后面考虑

function addAuth(exhibitId, options) {
  var _a;

  return bridge_awaiter(this, void 0, void 0, function () {
    var that, name, arr;
    return bridge_generator(this, function (_b) {
      that = this;
      name = that.name;
      arr = ((_a = eventMap.get(exhibitId)) === null || _a === void 0 ? void 0 : _a.callBacks) || [];
      return [2
      /*return*/
      , new Promise(function (resolve, rej) {
        Promise.all([getExhibitInfo(exhibitId, {
          isLoadPolicyInfo: 1,
          isLoadVersionProperty: 1,
          isLoadContract: 1,
          isLoadResourceDetailInfo: 1,
          isTranslate: 1
        }), getExhibitAuthStatus(exhibitId), getExhibitAvailalbe(exhibitId)]).then(function (response) {
          if (response[1].data.errCode) {
            resolve({
              status: DATA_ERROR,
              data: response[1].data
            });
            return;
          } // if (response[0].data.data.onlineStatus === 0) {
          //   resolve({ status: OFFLINE, data: response[0].data });
          //   return;
          // }


          var data = response[0].data.data;
          data.contracts = data.contracts || [];
          data.defaulterIdentityType = response[1].data.data[0].authCode;
          data.isAvailable = response[2].data.data[0].isAuth;
          data.availableData = response[2].data.data[0];
          arr.push({
            resolve: resolve,
            options: options,
            widgetName: name
          });
          var id = exhibitId;
          eventMap.set(id, bridge_assign(bridge_assign({
            isTheme: that.isTheme,
            eventId: id
          }, data), {
            callBacks: arr
          }));

          if (options && options.immediate) {
            if (!uiInited) {
              UI && UI(CONTRACT);
            } else {
              if (locked) {
                setTimeout(function () {
                  updateUI && updateUI();
                }, 0);
              } else {
                updateUI && updateUI();
              }
            }
          }

          uiInited = true;
        });
      })];
    });
  });
}
function callAuth() {
  if (window.isTest) return;

  if (!uiInited) {
    UI && UI(CONTRACT);
  } else {
    if (locked) {
      setTimeout(function () {
        updateUI && updateUI();
      }, 0);
    } else {
      updateUI && updateUI();
    }
  }
}
function clearEvent() {
  eventMap.clear();
  lowerUI();
  uiInited = false;
}
function updateEvent(event) {
  if (!event) return eventMap;
  eventMap.set(event.eventId, event);
  return eventMap;
}

function removeEvent(eventId) {
  if (eventId) {
    eventMap.delete(eventId);
  } else {
    eventMap.clear();
    uiInited = false;
  }

  if (locked) {
    setTimeout(function () {
      updateUI && updateUI();
    }, 0);
  } else {
    updateUI && updateUI();
  }
}

function endEvent(eventId, type, data) {
  // if (eventMap.get(eventId)) {
  // TODO 重复代码
  switch (type) {
    case SUCCESS:
      eventMap.get(eventId).callBacks.forEach(function (item) {
        item.resolve({
          status: SUCCESS,
          data: data
        });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;

    case FAILED:
      eventMap.get(eventId).callBacks.forEach(function (item) {
        item.resolve({
          status: FAILED,
          data: data
        });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;

    case USER_CANCEL:
      uiInited = false;
      eventMap.forEach(function (event) {
        event.callBacks.forEach(function (item) {
          item.resolve({
            status: USER_CANCEL,
            data: data
          });
        });
      });
      exhibitQueue.clear();
      removeEvent();
      break;
  } // }

}
function goLogin(resolve) {
  if (uiInited) {
    console.error("ui has been launched, can not callLogin");
    return "ui has been launched, can not callLogin";
  }

  resolve && onLogin(resolve);
  UI && UI(LOGIN);
}
function goLoginOut() {
  UI && UI(LOGIN_OUT);
}
var uiRoot = bridge_rawDocument.getElementById("ui-root");
var widgetContainer = bridge_rawDocument.getElementById("freelog-plugin-container");
function upperUI() {
  // @ts-ignore
  uiRoot.style.zIndex = 1; // uiRoot.style.opacity = 1;
  // @ts-ignore

  widgetContainer.style.zIndex = 0;
}
function lowerUI() {
  uiInited = false; // @ts-ignore

  uiRoot.style.zIndex = 0; // // @ts-ignore
  // uiRoot.style.opacity = 0;
  // @ts-ignore

  widgetContainer.style.zIndex = 1;
}
function bridge_reload() {
  rawWindow.location.reload();
}
;// CONCATENATED MODULE: ./src/services/handler.ts
var handler_assign = undefined && undefined.__assign || function () {
  handler_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return handler_assign.apply(this, arguments);
};

var handler_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var handler_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};





var noAuthCode = [301, 302, 303, 304, 305, 306, 307];
var authCode = (/* unused pure expression or super */ null && ([200, 201, 202, 203]));
var errorAuthCode = [401, 402, 403, 501, 502, 503, 504, 505, 900, 901];
var handler_nativeOpen = XMLHttpRequest.prototype.open;
/**
 *
 * @param action api namespace.apiName
 * @param urlData array, use item for replace url's placeholder
 * @param data  body data or query data  string | object | Array<any> | null | JSON | undefined
 */

function frequest(action, urlData, data, returnUrl, config) {
  var _this = this; // if(isUserChange()){
  //   return 
  // }
  // @ts-ignore


  XMLHttpRequest.prototype.open = handler_nativeOpen; // @ts-ignore

  var caller = this;
  var api = Object.assign({}, action); // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>

  var url = api.url;

  if (url.indexOf(placeHolder) > -1) {
    if (!urlData || !urlData.length) {
      console.error("urlData is required: " + urlData);
      return;
    }

    urlData.forEach(function (item) {
      url = url.replace(placeHolder, item + "");
    });
  } // filter data if there is dataModel


  if (api.dataModel && caller) {
    // TODO 需要用deepclone
    data = Object.assign({}, data);
    compareObjects(api.dataModel, data, !!api.isDiff);
  } // pre method


  if (api.before) {
    data = api.before(data) || data;
  }

  if (api.method.toLowerCase() === "get") {
    api.params = data;
  } else {
    api.data = data;
  } // delete extra keys


  ["url", "before", "after"].forEach(function (item) {
    delete api[item];
  });
  var _config = {};

  if (config) {
    ["onUploadProgress", "onDownloadProgress", "responseType"].forEach(function (key) {
      if (config[key]) _config[key] = config[key];
    });
  }

  var _api = Object.assign(_config, baseConfig, api);

  if (returnUrl && _api.method.toLowerCase() === "get") {
    var query_1 = "";

    if (_api.params) {
      Object.keys(_api.params).forEach(function (key) {
        query_1 = query_1 ? query_1 + "&" + key + "=" + _api.params[key] : key + "=" + _api.params[key];
      });
    }

    if (query_1) {
      query_1 = "?" + query_1;
    }

    return _api.baseURL + url + query_1;
  } // show msg


  return new Promise(function (resolve, reject) {
    request(url, _api).then(function (response) {
      return handler_awaiter(_this, void 0, void 0, function () {
        var resData, exhibitId, exhibitName, articleNid, resourceType, subDep, exhibitProperty;
        return handler_generator(this, function (_a) {
          api.after && api.after(response); // 如果是授权接口，而且有数据

          if (caller && caller.isAuth && response.data && response.data.data) {
            resData = response.data.data;
            exhibitId = response.headers["freelog-exhibit-id"];
            exhibitName = decodeURI(response.headers["freelog-exhibit-name"]);
            articleNid = decodeURI(response.headers["freelog-article-nid"]);
            resourceType = decodeURI(response.headers["freelog-article-resource-type"]);
            subDep = decodeURI(response.headers["freelog-article-sub-dependencies"]);
            subDep = subDep ? JSON.parse(decodeURIComponent(subDep)) : [];
            exhibitProperty = decodeURI(response.headers["freelog-exhibit-property"]);
            exhibitProperty = exhibitProperty ? JSON.parse(decodeURIComponent(exhibitProperty)) : {};

            if (noAuthCode.includes(resData.authCode) && (caller.exhibitId || caller.articleIdOrName)) {
              setPresentableQueue(exhibitId, handler_assign({
                widget: caller.name,
                authCode: resData.authCode,
                contracts: resData.data ? resData.data.contracts : [],
                policies: resData.data ? resData.data.policies : [],
                exhibitName: exhibitName,
                exhibitId: exhibitId,
                articleNid: articleNid,
                resourceType: resourceType,
                subDep: subDep,
                versionInfo: {
                  exhibitProperty: exhibitProperty
                }
              }, resData));
              resolve(handler_assign({
                authErrorType: 1,
                authCode: resData.authCode,
                exhibitName: exhibitName,
                exhibitId: exhibitId,
                articleNid: articleNid,
                resourceType: resourceType,
                subDep: subDep,
                versionInfo: {
                  exhibitProperty: exhibitProperty
                }
              }, resData));
            } else if (errorAuthCode.includes(resData.authCode)) {
              resolve(handler_assign({
                authErrorType: 2,
                authCode: resData.authCode,
                exhibitName: exhibitName,
                exhibitId: exhibitId,
                articleNid: articleNid,
                resourceType: resourceType,
                subDep: subDep,
                versionInfo: {
                  exhibitProperty: exhibitProperty
                }
              }, resData));
            } else {
              resolve(response);
            }
          } else {
            resolve(response);
          }

          return [2
          /*return*/
          ];
        });
      });
    }).catch(function (error) {
      // 防止error为空
      reject({
        error: error
      });
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/structure/global.ts







var devData = "";
var freelogApp = {
  mountWidget: mountWidget,
  getExhibitListById: getExhibitListById,
  getExhibitListByPaging: getExhibitListByPaging,
  getExhibitInfo: getExhibitInfo,
  getExhibitSignCount: getExhibitSignCount,
  getExhibitAuthStatus: getExhibitAuthStatus,
  getExhibitFileStream: getExhibitFileStream,
  getExhibitDepFileStream: getExhibitDepFileStream,
  getExhibitInfoByAuth: getExhibitInfoByAuth,
  getExhibitDepInfo: getExhibitDepInfo,
  getSignStatistics: getSignStatistics,
  getExhibitAvailalbe: getExhibitAvailalbe,
  devData: devData,
  getStaticPath: getStaticPath,
  getSubDep: getSubDep,
  getSelfId: getSelfId,
  callAuth: callAuth,
  addAuth: addAuth,
  onLogin: onLogin,
  onUserChange: onUserChange,
  callLogin: callLogin,
  callLoginOut: callLoginOut,
  getCurrentUser: getCurrentUser,
  setViewport: setViewport,
  setUserData: setUserData,
  getUserData: getUserData,
  getSelfConfig: getSelfConfig,
  isUserChange: isUserChange,
  reload: reload,
  resultType: resultType
};
;// CONCATENATED MODULE: ./src/platform/structure/freelogAuth.ts




var freelogAuth = {
  reisterUI: reisterUI,
  eventMap: eventMap,
  failedMap: failedMap,
  endEvent: endEvent,
  updateLock: updateLock,
  updateEvent: updateEvent,
  clearEvent: clearEvent,
  lowerUI: lowerUI,
  upperUI: upperUI,
  resultType: resultType,
  loginCallback: loginCallback,
  setUserInfo: setUserInfo,
  getCurrentUser: getCurrentUser,
  getUserInfo: getUserInfo,
  reload: bridge_reload,
  eventType: eventType
};
// EXTERNAL MODULE: ../../node_modules/.pnpm/vconsole@3.14.6/node_modules/vconsole/dist/vconsole.min.js
var vconsole_min = __webpack_require__(836);
var vconsole_min_default = /*#__PURE__*/__webpack_require__.n(vconsole_min);
;// CONCATENATED MODULE: ./src/platform/structure/init.ts
var init_assign = undefined && undefined.__assign || function () {
  init_assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return init_assign.apply(this, arguments);
};

var init_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var init_generator = undefined && undefined.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var _a;















var mobile = utils_isMobile(); // @ts-ignore

var uiPath =  false ? 0 : mobile ? "/mobile" : "/pc";
window.ENV = "freelog.com";

if (window.location.host.includes(".testfreelog.com")) {
  window.ENV = "testfreelog.com";
}

!mobile && ((_a = document.querySelector.bind(document)('meta[name="viewport"]')) === null || _a === void 0 ? void 0 : _a.setAttribute("content", "width=device-width, initial-scale=1.0"));
window.freelogApp = freelogApp;
window.freelogAuth = freelogAuth;
function initNode() {
  var _this = this; // TODO 这个位置问题需要可考虑，最好放到UI插件之后


  initWindowListener();
  pathATag();
  return new Promise(function (resolve) {
    return init_awaiter(_this, void 0, void 0, function () {
      var nodeDomain;

      var _this = this;

      return init_generator(this, function (_a) {
        nodeDomain = getDomain(window.location.host);
        Promise.all([requestNodeInfo(nodeDomain), getUserInfo()]).then(function (values) {
          return init_awaiter(_this, void 0, void 0, function () {
            var nodeData, userInfo, nodeInfo, devData, container;

            var _this = this;

            return init_generator(this, function (_a) {
              nodeData = values[0];

              if (!nodeData.data) {
                confirm("节点网址不正确，请检查网址！");
                return [2
                /*return*/
                ];
              }

              userInfo = values[1];
              nodeInfo = nodeData.data;
              freelogApp.nodeInfo = nodeInfo; // if (
              //   (!nodeInfo.nodeThemeId && !window.isTest) ||
              //   (!nodeInfo.nodeTestThemeId && window.isTest)
              // ) {
              //   const nothemeTip =
              //     document.getElementById.bind(document)("freelog-no-theme");
              //   // @ts-ignore
              //   nothemeTip?.style.display = "flex";
              //   // @ts-ignore
              //   nothemeTip?.style.paddingTop = mobile ? "26vh" : "32vh";
              //   resolve();
              //   return;
              // }

              document.title = nodeInfo.nodeName;

              if (window.isTest) {
                document.title = '[T]' + nodeInfo.nodeName;
              }

              if (!userInfo && window.isTest) {
                confirm("测试节点必须登录！");
                return [2
                /*return*/
                ];
              }

              if (userInfo && userInfo.userId !== nodeInfo.ownerUserId && window.isTest) {
                confirm("测试节点只允许节点拥有者访问！");
                return [2
                /*return*/
                ];
              }

              Object.defineProperty(document, "title", {
                set: function (msg) {},
                get: function () {
                  return document.title;
                }
              });
              init();
              devData = dev(); // window.vconsole = new VConsole()

              if (devData.type !== DEV_FALSE && devData.config.vconsole) {
                window.vconsole = new (vconsole_min_default())();
              }

              Object.freeze(devData);
              freelogApp.devData = devData;
              Object.freeze(freelogApp);
              Object.freeze(freelogApp.nodeInfo);
              initLocation();
              container = document.getElementById.bind(document)("freelog-plugin-container");
              mountUI("freelog-ui", document.getElementById.bind(document)("ui-root"), uiPath, {
                shadowDom: false,
                scopedCss: true
              }).mountPromise.then(function () {
                return init_awaiter(_this, void 0, void 0, function () {
                  var availableData, theme;
                  return init_generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        // 节点冻结
                        if ((nodeInfo.status & 4) === 4) {
                          resolve && resolve();
                          setTimeout(function () {
                            return callUI(NODE_FREEZED, nodeInfo);
                          }, 10);
                          return [2
                          /*return*/
                          ];
                        } // 用户冻结


                        if (userInfo && userInfo.status == 1) {
                          console.log(userInfo);
                          resolve && resolve();
                          setTimeout(function () {
                            return callUI(USER_FREEZED, userInfo);
                          }, 10);
                          return [2
                          /*return*/
                          ];
                        } // 没有主题


                        if (!nodeInfo.nodeThemeId && !window.isTest || !nodeInfo.nodeTestThemeId && window.isTest) {
                          resolve && resolve();
                          setTimeout(function () {
                            return callUI(THEME_NONE, nodeInfo);
                          }, 10);
                          return [2
                          /*return*/
                          ];
                        }

                        return [4
                        /*yield*/
                        , getExhibitAvailalbe(window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId)];

                      case 1:
                        availableData = _a.sent(); // 主题冻结 

                        if (availableData && availableData.authCode === 403) {
                          resolve && resolve();
                          return [2
                          /*return*/
                          ];
                        }

                        return [4
                        /*yield*/
                        , getSubDep(window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId)];

                      case 2:
                        theme = _a.sent();
                        freelogApp.mountWidget(theme, container, "", init_assign({
                          shadowDom: false,
                          scopedCss: true
                        }, theme.exhibitProperty), null, true);
                        resolve && resolve();
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }, function (e) {
                console.error(e);
              });
              return [2
              /*return*/
              ];
            });
          });
        });
        return [2
        /*return*/
        ];
      });
    });
  });
}

function getDomain(url) {
  if (url.split(".")[0] === "t") {
    return url.split(".")[1];
  }

  return url.split(".")[0];
}

function requestNodeInfo(nodeDomain) {
  return init_awaiter(this, void 0, void 0, function () {
    var info;
    return init_generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , frequest.bind({
            name: "node"
          })(modules_node.getInfoByNameOrDomain, "", {
            nodeDomain: nodeDomain,
            isLoadOwnerUserInfo: 1
          })];

        case 1:
          info = _a.sent();
          return [2
          /*return*/
          , info.data];
      }
    });
  });
}
;// CONCATENATED MODULE: ./src/platform/index.ts

function run() {
  initNode();
}
;// CONCATENATED MODULE: ./src/main.ts

window.global = window;
run();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcore"] = self["webpackChunkcore"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [736], function() { return __webpack_require__(678); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;