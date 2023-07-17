/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9669:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(1609);

/***/ }),

/***/ 5448:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var cookies = __webpack_require__(4372);
var buildURL = __webpack_require__(5327);
var buildFullPath = __webpack_require__(4097);
var parseHeaders = __webpack_require__(4109);
var isURLSameOrigin = __webpack_require__(7985);
var createError = __webpack_require__(5061);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 1609:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var bind = __webpack_require__(1849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(7185);
var defaults = __webpack_require__(5655);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(5263);
axios.CancelToken = __webpack_require__(4972);
axios.isCancel = __webpack_require__(6502);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(6268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 5263:
/***/ (function(module) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 4972:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(5263);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 6502:
/***/ (function(module) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var buildURL = __webpack_require__(5327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(3572);
var mergeConfig = __webpack_require__(7185);
var validator = __webpack_require__(4875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 782:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 4097:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(1793);
var combineURLs = __webpack_require__(7303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5061:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(481);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 3572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var transformData = __webpack_require__(8527);
var isCancel = __webpack_require__(6502);
var defaults = __webpack_require__(5655);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 481:
/***/ (function(module) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 7185:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 6026:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(5061);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 8527:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var defaults = __webpack_require__(5655);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 5655:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);
var normalizeHeaderName = __webpack_require__(6016);
var enhanceError = __webpack_require__(481);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(5448);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 1849:
/***/ (function(module) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 5327:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7303:
/***/ (function(module) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4372:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1793:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6268:
/***/ (function(module) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7985:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6016:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 4109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(4867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 8713:
/***/ (function(module) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 4875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var pkg = __webpack_require__(8593);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 4867:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(1849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 1351:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IS": function() { return /* binding */ loginCallback; },
/* harmony export */   "Sx": function() { return /* binding */ onLogin; },
/* harmony export */   "iP": function() { return /* binding */ onUserChange; },
/* harmony export */   "Ib": function() { return /* binding */ initWindowListener; }
/* harmony export */ });
/* unused harmony export userChangeCallback */
/* harmony import */ var doc_cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5746);
/* harmony import */ var doc_cookies__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(doc_cookies__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _platform_structure_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7198);
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



var loginCallback = []; // 登录和切换用户需要触发

function onLogin(callback) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
    if (doc_cookies__WEBPACK_IMPORTED_MODULE_0___default().getItem("uid") != (_platform_structure_utils__WEBPACK_IMPORTED_MODULE_1__/* .userInfo */ .eY === null || _platform_structure_utils__WEBPACK_IMPORTED_MODULE_1__/* .userInfo */ .eY === void 0 ? void 0 : _platform_structure_utils__WEBPACK_IMPORTED_MODULE_1__/* .userInfo.userId */ .eY.userId)) {
      userChangeCallback.forEach(function (func) {
        func && func();
      });
    }
  });
};

/***/ }),

/***/ 6924:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dB": function() { return /* binding */ NODE_FREEZED; },
/* harmony export */   "di": function() { return /* binding */ NODE_OFFLINE; },
/* harmony export */   "xM": function() { return /* binding */ NODE_PRIVATE; },
/* harmony export */   "BY": function() { return /* binding */ THEME_NONE; },
/* harmony export */   "ym": function() { return /* binding */ LOGIN; },
/* harmony export */   "l$": function() { return /* binding */ CONTRACT; },
/* harmony export */   "n2": function() { return /* binding */ LOGIN_OUT; },
/* harmony export */   "W5": function() { return /* binding */ USER_FREEZED; },
/* harmony export */   "a7": function() { return /* binding */ eventType; },
/* harmony export */   "MR": function() { return /* binding */ SUCCESS; },
/* harmony export */   "ig": function() { return /* binding */ FAILED; },
/* harmony export */   "eG": function() { return /* binding */ USER_CANCEL; },
/* harmony export */   "QB": function() { return /* binding */ DATA_ERROR; },
/* harmony export */   "uq": function() { return /* binding */ resultType; }
/* harmony export */ });
/* unused harmony exports THEME_FREEZED, TEST_NODE, OFFLINE */
var NODE_FREEZED = 0;
var NODE_OFFLINE = 1;
var NODE_PRIVATE = 2;
var THEME_NONE = 3;
var THEME_FREEZED = 4;
var LOGIN = 5;
var CONTRACT = 6;
var LOGIN_OUT = 7;
var USER_FREEZED = 8;
var eventType = {
  NODE_FREEZED: NODE_FREEZED,
  NODE_OFFLINE: NODE_OFFLINE,
  NODE_PRIVATE: NODE_PRIVATE,
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

/***/ }),

/***/ 9779:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hx": function() { return /* binding */ eventMap; },
/* harmony export */   "Bw": function() { return /* binding */ failedMap; },
/* harmony export */   "BK": function() { return /* binding */ registerUI; },
/* harmony export */   "w0": function() { return /* binding */ callUI; },
/* harmony export */   "N1": function() { return /* binding */ updateLock; },
/* harmony export */   "a9": function() { return /* binding */ setPresentableQueue; },
/* harmony export */   "Ei": function() { return /* binding */ addAuth; },
/* harmony export */   "PF": function() { return /* binding */ callAuth; },
/* harmony export */   "sf": function() { return /* binding */ clearEvent; },
/* harmony export */   "eJ": function() { return /* binding */ updateEvent; },
/* harmony export */   "L4": function() { return /* binding */ endEvent; },
/* harmony export */   "ni": function() { return /* binding */ goLogin; },
/* harmony export */   "sl": function() { return /* binding */ goLoginOut; },
/* harmony export */   "jE": function() { return /* binding */ upperUI; },
/* harmony export */   "nU": function() { return /* binding */ lowerUI; },
/* harmony export */   "H5": function() { return /* binding */ reload; }
/* harmony export */ });
/* unused harmony export exhibitQueue */
/* harmony import */ var _eventType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6924);
/* harmony import */ var _eventOn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1351);
/* harmony import */ var _platform_structure_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(106);
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





var exhibitQueue = new Map();
var eventMap = new Map(); // 数组

var failedMap = new Map();
var rawDocument = document;
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

function registerUI(ui, update) {
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

  return __awaiter(this, void 0, void 0, function () {
    var that, name, arr;
    return __generator(this, function (_b) {
      that = this;
      name = that.name;
      arr = ((_a = eventMap.get(exhibitId)) === null || _a === void 0 ? void 0 : _a.callBacks) || [];
      return [2
      /*return*/
      , new Promise(function (resolve, rej) {
        Promise.all([(0,_platform_structure_api__WEBPACK_IMPORTED_MODULE_0__/* .getExhibitInfo */ .RS)(exhibitId, {
          isLoadPolicyInfo: 1,
          isLoadVersionProperty: 1,
          isLoadContract: 1,
          isLoadResourceDetailInfo: 1,
          isTranslate: 1
        }), (0,_platform_structure_api__WEBPACK_IMPORTED_MODULE_0__/* .getExhibitAuthStatus */ .yr)(exhibitId), (0,_platform_structure_api__WEBPACK_IMPORTED_MODULE_0__/* .getExhibitAvailalbe */ .Yi)(exhibitId)]).then(function (response) {
          if (response[1].data.errCode) {
            resolve({
              status: _eventType__WEBPACK_IMPORTED_MODULE_1__/* .DATA_ERROR */ .QB,
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
          eventMap.set(id, __assign(__assign({
            isTheme: that.isTheme,
            eventId: id
          }, data), {
            callBacks: arr
          }));

          if (options && options.immediate) {
            if (!uiInited) {
              UI && UI(_eventType__WEBPACK_IMPORTED_MODULE_1__/* .CONTRACT */ .l$);
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
    UI && UI(_eventType__WEBPACK_IMPORTED_MODULE_1__/* .CONTRACT */ .l$);
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
    case _eventType__WEBPACK_IMPORTED_MODULE_1__/* .SUCCESS */ .MR:
      eventMap.get(eventId).callBacks.forEach(function (item) {
        item.resolve({
          status: _eventType__WEBPACK_IMPORTED_MODULE_1__/* .SUCCESS */ .MR,
          data: data
        });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;

    case _eventType__WEBPACK_IMPORTED_MODULE_1__/* .FAILED */ .ig:
      eventMap.get(eventId).callBacks.forEach(function (item) {
        item.resolve({
          status: _eventType__WEBPACK_IMPORTED_MODULE_1__/* .FAILED */ .ig,
          data: data
        });
      });
      exhibitQueue.delete(eventId);
      removeEvent(eventId);
      break;

    case _eventType__WEBPACK_IMPORTED_MODULE_1__/* .USER_CANCEL */ .eG:
      uiInited = false;
      eventMap.forEach(function (event) {
        event.callBacks.forEach(function (item) {
          item.resolve({
            status: _eventType__WEBPACK_IMPORTED_MODULE_1__/* .USER_CANCEL */ .eG,
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

  resolve && (0,_eventOn__WEBPACK_IMPORTED_MODULE_2__/* .onLogin */ .Sx)(resolve);
  UI && UI(_eventType__WEBPACK_IMPORTED_MODULE_1__/* .LOGIN */ .ym);
}
function goLoginOut() {
  UI && UI(_eventType__WEBPACK_IMPORTED_MODULE_1__/* .LOGIN_OUT */ .n2);
}
var uiRoot = rawDocument.getElementById("ui-root");
var widgetContainer = rawDocument.getElementById("freelog-plugin-container");
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
function reload() {
  rawWindow.location.reload();
}

/***/ }),

/***/ 9572:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": function() { return /* binding */ run; }
/* harmony export */ });
/* harmony import */ var _structure_init__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4208);

function run() {
  console.log(1234234);
  (0,_structure_init__WEBPACK_IMPORTED_MODULE_0__/* .initNode */ .q)();
}

/***/ }),

/***/ 4381:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ getAddOn; }
/* harmony export */ });
/**
 * @author Kuitos
 * @since 2020-05-15
 */
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

function getAddOn(global) {
  return {
    beforeLoad: function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__POWERED_BY_FREELOG__ = true;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeMount: function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__POWERED_BY_FREELOG__ = true;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeUnmount: function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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

/***/ }),

/***/ 415:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ getAddOns; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9177);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7895);
/* harmony import */ var _runtimePublicPath__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4310);
/* harmony import */ var _engineFlag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4381);
/**
 * @author Kuitos
 * @since 2020-03-02
 */



function getAddOns(global, publicPath) {
  // @ts-ignore
  return (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)({}, (0,_engineFlag__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(global), (0,_runtimePublicPath__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(global, publicPath), function (v1, v2) {
    return (0,lodash_es__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
  });
}

/***/ }),

/***/ 4310:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ getAddOn; }
/* harmony export */ });
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

var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
function getAddOn(global, publicPath) {
  if (publicPath === void 0) {
    publicPath = '/';
  }

  var hasMountedOnce = false;
  return {
    beforeLoad: function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // eslint-disable-next-line no-param-reassign
          global.__INJECTED_PUBLIC_PATH_BY_FREELOG__ = publicPath;
          return [2
          /*return*/
          ];
        });
      });
    },
    beforeMount: function () {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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

/***/ }),

/***/ 3415:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ frameworkConfiguration; },
/* harmony export */   "Z": function() { return /* binding */ loadMicroApp; }
/* harmony export */ });
/* harmony import */ var _single_spa_single_spa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(354);
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4106);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3678);
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



 // eslint-disable-next-line import/no-mutable-exports

var frameworkConfiguration = {};
var appConfigPromiseGetterMap = new Map();
function loadMicroApp(app, configuration, lifeCycles) {
  var _this = this;

  var props = app.props,
      name = app.name;

  var getContainerXpath = function (container) {
    var containerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getContainer */ .ZO)(container);

    if (containerElement) {
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getXPathForElement */ .y4)(containerElement, document);
    }

    return undefined;
  };

  var wrapParcelConfigForRemount = function (config) {
    return __assign(__assign({}, config), {
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
    return __awaiter(_this, void 0, void 0, function () {
      var userConfiguration, $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, _a, xpath, parcelConfigGetterPromise, _b, parcelConfigObjectGetterPromise, xpath;

      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            userConfiguration = configuration !== null && configuration !== void 0 ? configuration : __assign(__assign({}, frameworkConfiguration), {
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
            parcelConfigObjectGetterPromise = (0,_loader__WEBPACK_IMPORTED_MODULE_1__/* .loadApp */ .o)(app, userConfiguration, lifeCycles);

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


  return (0,_single_spa_single_spa__WEBPACK_IMPORTED_MODULE_2__/* .mountRootParcel */ .B)(memorizedLoadingFn, __assign({
    domElement: document.createElement('div')
  }, props));
}

/***/ }),

/***/ 2506:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "N": function() { return /* binding */ initGlobalState; },
/* harmony export */   "I": function() { return /* binding */ getMicroAppStateActions; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8652);
/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

var globalState = {};
var deps = {}; // 触发全局监听

function emitGlobal(state, prevState) {
  Object.keys(deps).forEach(function (id) {
    if (deps[id] instanceof Function) {
      deps[id]((0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(state), (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(prevState));
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
    var prevGlobalState = (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(globalState);
    globalState = (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(state);
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
      var cloneState = (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(globalState);

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
      var prevGlobalState = (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(globalState);
      globalState = (0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Object.keys(state).reduce(function (_globalState, changeKey) {
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

/***/ }),

/***/ 4286:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZA": function() { return /* binding */ execScripts; },
/* harmony export */   "IH": function() { return /* binding */ importEntry; }
/* harmony export */ });
/* unused harmony exports getExternalStyleSheets, getExternalScripts, default */
/* harmony import */ var _process_tpl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2721);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8544);
/* harmony import */ var _structure_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7198);
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


var defaultFetch = _structure_utils__WEBPACK_IMPORTED_MODULE_0__/* .freelogFetch.bind */ .Dm.bind(window);

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
      html = html.replace((0,_process_tpl__WEBPACK_IMPORTED_MODULE_1__/* .genLinkReplaceSymbol */ .O6)(styleSrc), "<style>/* ".concat(styleSrc, " */").concat(styleSheets[i], "</style>"));
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
      return (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getInlineCode */ .AZ)(styleLink);
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
        return (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getInlineCode */ .AZ)(script);
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
            return (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .requestIdleCallback */ .Kk)(function () {
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
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .noteGlobalProps */ .nw)(strictGlobal ? proxy : window);

        try {
          // bind window.proxy to change `this` reference in script
          geval(scriptSrc, inlineScript);
          var exports_1 = proxy[(0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getGlobalProp */ .kk)(strictGlobal ? proxy : window)] || {};
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
  var getPublicPath = _utils__WEBPACK_IMPORTED_MODULE_2__/* .defaultGetPublicPath */ .t7;
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

    getPublicPath = opts.getPublicPath || opts.getDomain || _utils__WEBPACK_IMPORTED_MODULE_2__/* .defaultGetPublicPath */ .t7;
    getTemplate = opts.getTemplate || defaultGetTemplate;
  }

  if (/\/$/.test(url)) {
    url = url.substr(0, url.length - 1);
  }

  return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url + '/index.html').then(function (response) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .readResAsString */ .ps)(response, autoDecodeResponse);
  }).then(function (html) {
    var assetPublicPath = url; // getPublicPath(url);

    var _a = (0,_process_tpl__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .ZP)(getTemplate(html), assetPublicPath),
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
  var getPublicPath = opts.getPublicPath || opts.getDomain || _utils__WEBPACK_IMPORTED_MODULE_2__/* .defaultGetPublicPath */ .t7;

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
        return "".concat((0,_process_tpl__WEBPACK_IMPORTED_MODULE_1__/* .genLinkReplaceSymbol */ .O6)(styleSrc)).concat(html);
      }, tpl);
    };

    var getHTMLWithScriptPlaceholder = function (tpl) {
      return scripts_1.reduce(function (html, scriptSrc) {
        return "".concat(html).concat((0,_process_tpl__WEBPACK_IMPORTED_MODULE_1__/* .genScriptReplaceSymbol */ .n0)(scriptSrc));
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

/***/ }),

/***/ 2721:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O6": function() { return /* binding */ genLinkReplaceSymbol; },
/* harmony export */   "n0": function() { return /* binding */ genScriptReplaceSymbol; },
/* harmony export */   "ZP": function() { return /* binding */ processTpl; }
/* harmony export */ });
/* unused harmony exports inlineScriptReplaceSymbol, genIgnoreAssetReplaceSymbol, genModuleScriptReplaceSymbol */
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8544);
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
  var moduleSupport = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .isModuleScriptSupported */ .UD)(); // TODO 可能多余的代码

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


      var code = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getInlineCode */ .AZ)(match); // remove script blocks when all of these lines are comments.

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

/***/ }),

/***/ 8544:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "kk": function() { return /* binding */ getGlobalProp; },
/* harmony export */   "nw": function() { return /* binding */ noteGlobalProps; },
/* harmony export */   "AZ": function() { return /* binding */ getInlineCode; },
/* harmony export */   "t7": function() { return /* binding */ defaultGetPublicPath; },
/* harmony export */   "UD": function() { return /* binding */ isModuleScriptSupported; },
/* harmony export */   "Kk": function() { return /* binding */ requestIdleCallback; },
/* harmony export */   "ps": function() { return /* binding */ readResAsString; }
/* harmony export */ });
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

/***/ }),

/***/ 5453:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ SandBoxType; }
/* harmony export */ });
var SandBoxType;

(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot"; // for legacy sandbox
  // https://github.com/umijs/freelog/blob/0d1d3f0c5ed1642f01854f96c3fabf0a2148bd26/src/sandbox/legacy/sandbox.ts#L22...L25

  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (SandBoxType = {}));

/***/ }),

/***/ 4106:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "o": function() { return /* binding */ loadApp; }
/* harmony export */ });
/* harmony import */ var _import_html_entry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4286);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(870);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9177);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7895);
/* harmony import */ var _addons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(415);
/* harmony import */ var _globalState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2506);
/* harmony import */ var _sandbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8193);
/* harmony import */ var _sandbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(721);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3678);
/**
 * @author Kuitos
 * @since 2020-04-01
 */
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
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
    var attr = appElement.getAttribute(_sandbox__WEBPACK_IMPORTED_MODULE_0__/* .FreelogCSSRewriteAttr */ .mh);

    if (!attr) {
      appElement.setAttribute(_sandbox__WEBPACK_IMPORTED_MODULE_0__/* .FreelogCSSRewriteAttr */ .mh, appName);
    }

    var styleNodes = appElement.querySelectorAll('style') || [];
    (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(styleNodes, function (stylesheetElement) {
      _sandbox__WEBPACK_IMPORTED_MODULE_0__/* .process */ .N4(appElement, stylesheetElement, appName);
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
      var appWrapper = document.getElementById.bind(document)((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getWrapperId */ .Jj)(appInstanceId));
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
var rawRemoveChild = HTMLElement.prototype.removeChild;
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

    var containerElement = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getContainer */ .ZO)(container); // The container might have be removed after micro app unmounted.
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
        rawRemoveChild.call(containerElement, containerElement.firstChild);
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
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .validateExportLifecycle */ .BS)(scriptExports)) {
    return scriptExports;
  } // fallback to sandbox latest set property if it had


  if (globalLatestSetProp) {
    var lifecycles = global[globalLatestSetProp];

    if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .validateExportLifecycle */ .BS)(lifecycles)) {
      return lifecycles;
    }
  }

  if (false) {} // fallback to global variable who named with ${appName} while module exports not found


  var globalVariableExports = global[appName];

  if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .validateExportLifecycle */ .BS)(globalVariableExports)) {
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

  return __awaiter(this, void 0, void 0, function () {
    var entry, appName, appInstanceId, markName, _b, singular, _c, sandbox, excludeAssetFilter, importEntryOpts, _d, template, execScripts, assetPublicPath, appContent, strictStyleIsolation, scopedCSS, initialAppWrapperElement, initialContainer, legacyRender, render, initialAppWrapperGetter, global, mountSandbox, unmountSandbox, useLooseSandbox, sandboxContainer, _e, _f, beforeUnmount, _g, afterUnmount, _h, afterMount, _j, beforeMount, _k, beforeLoad, scriptExports, _l, bootstrap, mount, unmount, update, _m, onGlobalStateChange, setGlobalState, offGlobalStateChange, syncAppWrapperElement2Sandbox, parcelConfigGetter;

    var _this = this;

    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          entry = app.entry, appName = app.name;
          appInstanceId = "".concat(appName, "_").concat(+new Date(), "_").concat(Math.floor(Math.random() * 1000));
          markName = "[freelog] App ".concat(appInstanceId, " Loading");

          if (false) {}

          _b = configuration.singular, singular = _b === void 0 ? false : _b, _c = configuration.sandbox, sandbox = _c === void 0 ? true : _c, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = __rest(configuration, ["singular", "sandbox", "excludeAssetFilter"]);
          return [4
          /*yield*/
          , (0,_import_html_entry__WEBPACK_IMPORTED_MODULE_3__/* .importEntry */ .IH)(entry, importEntryOpts)];

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
          appContent = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getDefaultTplWrapper */ .sQ)(appInstanceId, appName)(template);
          strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
          scopedCSS = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .isEnableScopedCSS */ .FO)(sandbox);
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
            sandboxContainer = (0,_sandbox__WEBPACK_IMPORTED_MODULE_4__/* .createSandboxContainer */ .I)(appName, // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/freelog/issues/518
            initialAppWrapperGetter, scopedCSS, useLooseSandbox, excludeAssetFilter); // 用沙箱的代理对象作为接下来使用的全局对象

            global = sandboxContainer.instance.proxy;
            mountSandbox = sandboxContainer.mount;
            unmountSandbox = sandboxContainer.unmount;
          }

          _e = (0,lodash_es__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)({}, (0,_addons__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return (0,lodash_es__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _f = _e.beforeUnmount, beforeUnmount = _f === void 0 ? [] : _f, _g = _e.afterUnmount, afterUnmount = _g === void 0 ? [] : _g, _h = _e.afterMount, afterMount = _h === void 0 ? [] : _h, _j = _e.beforeMount, beforeMount = _j === void 0 ? [] : _j, _k = _e.beforeLoad, beforeLoad = _k === void 0 ? [] : _k;
          return [4
          /*yield*/
          , execHooksChain((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .toArray */ .qo)(beforeLoad), app, global)];

        case 5:
          _o.sent();

          return [4
          /*yield*/
          , execScripts(global, !useLooseSandbox)];

        case 6:
          scriptExports = _o.sent();
          _l = getLifecyclesFromExports(scriptExports, appName, global, (_a = sandboxContainer === null || sandboxContainer === void 0 ? void 0 : sandboxContainer.instance) === null || _a === void 0 ? void 0 : _a.latestSetProp), bootstrap = _l.bootstrap, mount = _l.mount, unmount = _l.unmount, update = _l.update;
          _m = (0,_globalState__WEBPACK_IMPORTED_MODULE_8__/* .getMicroAppStateActions */ .I)(appInstanceId), onGlobalStateChange = _m.onGlobalStateChange, setGlobalState = _m.setGlobalState, offGlobalStateChange = _m.offGlobalStateChange;

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
                return __awaiter(_this, void 0, void 0, function () {
                  var marks;
                  return __generator(this, function (_a) {
                    if (false) {}

                    return [2
                    /*return*/
                    ];
                  });
                });
              }, function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
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
                return __awaiter(_this, void 0, void 0, function () {
                  var useNewContainer;
                  return __generator(this, function (_a) {
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
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .toArray */ .qo)(beforeMount), app, global)];
                  });
                });
              }, function (props) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , mount(__assign(__assign({}, props), {
                      container: appWrapperGetter(),
                      setGlobalState: setGlobalState,
                      onGlobalStateChange: onGlobalStateChange
                    }))];
                  });
                });
              }, // finish loading after app mounted
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
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
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .toArray */ .qo)(afterMount), app, global)];
                  });
                });
              }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
              function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4
                        /*yield*/
                        , validateSingularMode(singular, app)];

                      case 1:
                        if (_a.sent()) {
                          prevAppUnmountedDeferred = new _utils__WEBPACK_IMPORTED_MODULE_2__/* .Deferred */ .BH();
                        }

                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              }, function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var measureName;
                  return __generator(this, function (_a) {
                    if (false) {}

                    return [2
                    /*return*/
                    ];
                  });
                });
              }],
              unmount: [function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .toArray */ .qo)(beforeUnmount), app, global)];
                  });
                });
              }, function (props) {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , unmount(__assign(__assign({}, props), {
                      container: appWrapperGetter()
                    }))];
                  });
                });
              }, unmountSandbox, function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    return [2
                    /*return*/
                    , execHooksChain((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .toArray */ .qo)(afterUnmount), app, global)];
                  });
                });
              }, function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
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
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
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

/***/ }),

/***/ 2923:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sj": function() { return /* binding */ getCurrentRunningSandboxProxy; },
/* harmony export */   "vd": function() { return /* binding */ setCurrentRunningSandboxProxy; },
/* harmony export */   "cd": function() { return /* binding */ getTargetValue; }
/* harmony export */ });
/* unused harmony export getProxyPropertyValue */
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3678);
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


  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .isCallable */ .GV)(value) && !(0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .isBoundedFunction */ .WE)(value) && !(0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .isConstructable */ .RL)(value)) {
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

/***/ }),

/***/ 721:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": function() { return /* binding */ createSandboxContainer; }
/* harmony export */ });
/* harmony import */ var _patchers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3268);
/* harmony import */ var _proxySandbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1727);
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

var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
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
  sandbox = new _proxySandbox__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(appName); // some side effect could be be invoked while bootstrapping, such as dynamic stylesheet injection with style-loader, especially during the development phase

  var bootstrappingFreers = (0,_patchers__WEBPACK_IMPORTED_MODULE_1__/* .patchAtBootstrapping */ .Fv)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter); // mounting freers are one-off and should be re-init at every mounting time

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
      return __awaiter(this, void 0, void 0, function () {
        var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
        return __generator(this, function (_a) {
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


          mountingFreers = (0,_patchers__WEBPACK_IMPORTED_MODULE_1__/* .patchAtMounting */ .BP)(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
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
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          // record the rebuilders of window side effects (event listeners or timers)
          // note that the frees of mounting phase are one-off as it will be re-init at next mounting
          sideEffectsRebuilders = __spreadArray(__spreadArray([], bootstrappingFreers, true), mountingFreers, true).map(function (free) {
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

/***/ }),

/***/ 8193:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mh": function() { return /* binding */ FreelogCSSRewriteAttr; },
/* harmony export */   "N4": function() { return /* binding */ process; }
/* harmony export */ });
/* unused harmony export ScopedCSS */
/* harmony import */ var _structure_widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
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

    cssText = cssText.replace(/url\(\"\//ig, 'url("' + _structure_widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.appName).entry + '/');
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

/***/ }),

/***/ 5059:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R4": function() { return /* binding */ rawHeadAppendChild; },
/* harmony export */   "Dr": function() { return /* binding */ isHijackingTag; },
/* harmony export */   "HU": function() { return /* binding */ recordStyledComponentsCSSRules; },
/* harmony export */   "q2": function() { return /* binding */ patchHTMLDynamicAppendPrototypeFunctions; },
/* harmony export */   "gU": function() { return /* binding */ rebuildCSSRules; }
/* harmony export */ });
/* unused harmony exports isStyledComponentsLike, getStyledElementCSSRules */
/* harmony import */ var _import_html_entry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4286);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3234);
/* harmony import */ var _apis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3415);
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8193);
/* harmony import */ var _structure_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7198);
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

  if ((0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(element.onload)) {
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

  if ((0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(element.onerror)) {
    element.onerror(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}

function convertLinkAsStyle(element, postProcess, fetchFn) {
  if (fetchFn === void 0) {
    fetchFn = _structure_utils__WEBPACK_IMPORTED_MODULE_1__/* .freelogFetch */ .Dm;
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
                var fetch_1 = typeof _apis__WEBPACK_IMPORTED_MODULE_2__/* .frameworkConfiguration.fetch */ .s.fetch === 'function' ? _apis__WEBPACK_IMPORTED_MODULE_2__/* .frameworkConfiguration.fetch */ .s.fetch : (_b = _apis__WEBPACK_IMPORTED_MODULE_2__/* .frameworkConfiguration.fetch */ .s.fetch) === null || _b === void 0 ? void 0 : _b.fn;
                stylesheetElement = convertLinkAsStyle(element, function (styleElement) {
                  return _css__WEBPACK_IMPORTED_MODULE_3__/* .process */ .N4(mountDOM_1, styleElement, appName_1);
                }, fetch_1);
                dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
              } else {
                _css__WEBPACK_IMPORTED_MODULE_3__/* .process */ .N4(mountDOM_1, stylesheetElement, appName_1);
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
            var fetch_2 = _apis__WEBPACK_IMPORTED_MODULE_2__/* .frameworkConfiguration.fetch */ .s.fetch;
            var referenceNode = mountDOM.contains(refChild) ? refChild : null;

            if (src) {
              (0,_import_html_entry__WEBPACK_IMPORTED_MODULE_4__/* .execScripts */ .ZA)(null, [src], proxy, {
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


            (0,_import_html_entry__WEBPACK_IMPORTED_MODULE_4__/* .execScripts */ .ZA)(null, ["<script>".concat(text, "</script>")], proxy, {
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

/***/ }),

/***/ 866:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": function() { return /* binding */ patchStrictSandbox; }
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2923);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5059);
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

      if ((0,_common__WEBPACK_IMPORTED_MODULE_0__/* .isHijackingTag */ .Dr)(tagName)) {
        var currentRunningSandboxProxy = (0,_common__WEBPACK_IMPORTED_MODULE_1__/* .getCurrentRunningSandboxProxy */ .Sj)();

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
  var unpatchDynamicAppendPrototypeFunctions = (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .patchHTMLDynamicAppendPrototypeFunctions */ .q2)(function (element) {
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

    (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .recordStyledComponentsCSSRules */ .HU)(dynamicStyleSheetElements); // As now the sub app content all wrapped with a special id container,
    // the dynamic style sheet would be removed automatically while unmoutting

    return function rebuild() {
      (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .rebuildCSSRules */ .gU)(dynamicStyleSheetElements, function (stylesheetElement) {
        var appWrapper = appWrapperGetter();

        if (!appWrapper.contains(stylesheetElement)) {
          _common__WEBPACK_IMPORTED_MODULE_0__/* .rawHeadAppendChild.call */ .R4.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ patch; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2054);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3234);
/**
 * @author Kuitos
 * @since 2019-04-11
 */

function patch() {
  // FIXME umi unmount feature request
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var rawHistoryListen = function (_) {
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
  };

  var historyListeners = [];
  var historyUnListens = [];

  if (window.g_history && (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(window.g_history.listen)) {
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
    var rebuild = lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
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

    if (window.g_history && (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }

    return rebuild;
  };
}

/***/ }),

/***/ 3268:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BP": function() { return /* binding */ patchAtMounting; },
/* harmony export */   "Fv": function() { return /* binding */ patchAtBootstrapping; }
/* harmony export */ });
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5453);
/* harmony import */ var _dynamicAppend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(866);
/* harmony import */ var _historyListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(717);
/* harmony import */ var _interval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6662);
/* harmony import */ var _windowListener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(125);
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







function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;

  var _b;

  var basePatchers = [function () {
    return (0,_interval__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(sandbox.proxy);
  }, function () {
    return (0,_windowListener__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(sandbox.proxy);
  }, function () {
    return (0,_historyListener__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)();
  }];
  var patchersInSandbox = (_a = {}, _a[_interfaces__WEBPACK_IMPORTED_MODULE_3__/* .SandBoxType.Proxy */ .u.Proxy] = __spreadArray(__spreadArray([], basePatchers, true), [function () {
    return (0,_dynamicAppend__WEBPACK_IMPORTED_MODULE_4__/* .patchStrictSandbox */ .E)(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }], false), _a); // @ts-ignore

  return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) {
    return patch();
  });
}
function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
  var _a;

  var _b;

  var patchersInSandbox = (_a = {}, _a[_interfaces__WEBPACK_IMPORTED_MODULE_3__/* .SandBoxType.Proxy */ .u.Proxy] = [function () {
    return (0,_dynamicAppend__WEBPACK_IMPORTED_MODULE_4__/* .patchStrictSandbox */ .E)(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }], _a); // @ts-ignore

  return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) {
    return patch();
  });
}


/***/ }),

/***/ 6662:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ patch; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2054);
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
function patch(global) {
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
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
  };
}

/***/ }),

/***/ 125:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ patch; }
/* harmony export */ });
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2054);
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


var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
function patch(global) {
  var listenerMap = new Map();

  global.addEventListener = function (type, listener, options) {
    var listeners = listenerMap.get(type) || [];
    listenerMap.set(type, __spreadArray(__spreadArray([], listeners, true), [listener], false));
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
      return __spreadArray([], listeners, true).forEach(function (listener) {
        return global.removeEventListener(type, listener);
      });
    });
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
  };
}

/***/ }),

/***/ 1727:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5453);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3678);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2923);
/* harmony import */ var _structure_proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2936);
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

var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
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

var variableWhiteList = __spreadArray([// FIXME System.js used a indirect call with eval, which would make it scope escape to global
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
    this.type = _interfaces__WEBPACK_IMPORTED_MODULE_0__/* .SandBoxType.Proxy */ .u.Proxy;
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
      get: function (target, p, receiver) {
        if (typeof p === "string" && ["fetch", "XMLHttpRequest"].includes(p)) {
          return (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .ajaxProxy */ .LD)(p, name);
        }

        if (p === "freelogAuth") {
          if ((0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .isFreelogAuth */ .b)(name)) {
            return rawWindow.freelogAuth;
          }

          return false;
        }

        if (p === Symbol.unscopables) return unscopables;

        if (p === "__INJECTED_PUBLIC_PATH_BY_FREELOG__") {
          return (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .getPublicPath */ .Ak)(name);
        }

        if (p === "fetch") {
          return function (url, options) {
            if (url.indexOf("i18n-ts") > -1) {
              return rawWindow.fetch(url, __assign(__assign({}, options), {
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
          return (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .freelogAddEventListener */ .qS)(proxy, target);
        }

        if (p === "freelogApp") {
          freelogAppProxy = freelogAppProxy || (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .createFreelogAppProxy */ .ZK)(name, _this);
          return freelogAppProxy;
        }

        if (p === "widgetName") {
          return name;
        } // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher


        if (p === "history") {
          // TODO 如果是单应用模式（提升性能）则不用代理
          proxyHis = (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .createHistoryProxy */ ._n)(name); // proxyHis || createHistoryProxy(name);

          return proxyHis;
        }

        if (p === "childWidgets") {
          proxyWidget = proxyWidget || (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .createWidgetProxy */ .p5)(name);
        }

        if (p === "location") {
          // TODO 如果是单应用模式（提升性能）则不用代理, 可以设置location.href的使用权限
          // TODO reload相当于重载应用，想办法把主应用的对应操控函数弄过来，发布订阅模式
          // TODO replace与reload、toString方法无法访问
          proxyLoc = proxyLoc || (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .createLocationProxy */ .jt)(name);
          return proxyLoc;
        } // TODO test localstorage


        if (p === "localStorage") {
          return (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .freelogLocalStorage */ .wx)(name);
        }

        if (p === "document" || p === "eval") {
          (0,_common__WEBPACK_IMPORTED_MODULE_2__/* .setCurrentRunningSandboxProxy */ .vd)(proxy); // FIXME if you have any other good ideas
          // remove the mark in next tick, thus we can identify whether it in micro app or not
          // this approach is just a workaround, it could not cover all complex cases, such as the micro app runs in the same task context with master in some case

          (0,_utils__WEBPACK_IMPORTED_MODULE_3__/* .nextTick */ .Y3)(function () {
            return (0,_common__WEBPACK_IMPORTED_MODULE_2__/* .setCurrentRunningSandboxProxy */ .vd)(null);
          });

          switch (p) {
            case "document":
              proxyDoc = (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .createDocumentProxy */ .ib)(name);
              return proxyDoc;

            case "eval":
              // eslint-disable-next-line no-eval
              return eval;
            // no default
          }
        } // eslint-disable-next-line no-nested-ternary
        // eslint-disable-next-line no-nested-ternary


        var value = propertiesWithGetter.has(p) ? rawWindow[p] : p in target ? target[p] : rawWindow[p];
        return (0,_common__WEBPACK_IMPORTED_MODULE_2__/* .getTargetValue */ .cd)(rawWindow, value);
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
    (0,_structure_proxy__WEBPACK_IMPORTED_MODULE_1__/* .saveSandBox */ .f)(name, this);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProxySandbox);

/***/ }),

/***/ 8031:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lB": function() { return /* binding */ handleAppError; },
/* harmony export */   "Td": function() { return /* binding */ addErrorHandler; },
/* harmony export */   "ld": function() { return /* binding */ removeErrorHandler; },
/* harmony export */   "jN": function() { return /* binding */ formatErrorMessage; },
/* harmony export */   "QA": function() { return /* binding */ transformErr; }
/* harmony export */ });
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);

var errorHandlers = [];
function handleAppError(err, app, newStatus) {
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
  var errPrefix = "".concat((0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .objectType */ .$m)(appOrParcel), " '").concat((0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(appOrParcel), "' died in status ").concat(appOrParcel.status, ": ");
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
    console.warn(formatErrorMessage(30, window.__DEV__ && "While ".concat(appOrParcel.status, ", '").concat((0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(appOrParcel), "' rejected its lifecycle function promise with a non-Error. This will cause stack traces to not be accurate."), appOrParcel.status, (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(appOrParcel)));

    try {
      result = Error(errPrefix + JSON.stringify(ogErr));
    } catch (err) {
      // If it's not an Error and you can't stringify it, then what else can you even do to it?
      result = ogErr;
    }
  }

  result.appOrParcelName = (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(appOrParcel); // We set the status after transforming the error so that the error message
  // references the state the application was in before the status change.

  appOrParcel.status = newStatus;
  return result;
}

/***/ }),

/***/ 5590:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "xD": function() { return /* binding */ NOT_LOADED; },
/* harmony export */   "mp": function() { return /* binding */ LOADING_SOURCE_CODE; },
/* harmony export */   "HO": function() { return /* binding */ NOT_BOOTSTRAPPED; },
/* harmony export */   "ip": function() { return /* binding */ BOOTSTRAPPING; },
/* harmony export */   "Bp": function() { return /* binding */ NOT_MOUNTED; },
/* harmony export */   "NL": function() { return /* binding */ MOUNTING; },
/* harmony export */   "Ni": function() { return /* binding */ MOUNTED; },
/* harmony export */   "Eo": function() { return /* binding */ UPDATING; },
/* harmony export */   "Gn": function() { return /* binding */ UNMOUNTING; },
/* harmony export */   "Wc": function() { return /* binding */ LOAD_ERROR; },
/* harmony export */   "sf": function() { return /* binding */ SKIP_BECAUSE_BROKEN; },
/* harmony export */   "dR": function() { return /* binding */ toName; },
/* harmony export */   "AN": function() { return /* binding */ isParcel; },
/* harmony export */   "$m": function() { return /* binding */ objectType; }
/* harmony export */ });
/* unused harmony exports UNLOADING, isActive, shouldBeActive */
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

/***/ }),

/***/ 3322:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$1": function() { return /* binding */ setBootstrapMaxTime; },
/* harmony export */   "Cd": function() { return /* binding */ setMountMaxTime; },
/* harmony export */   "JK": function() { return /* binding */ setUnmountMaxTime; },
/* harmony export */   "Ky": function() { return /* binding */ setUnloadMaxTime; },
/* harmony export */   "yr": function() { return /* binding */ reasonableTime; },
/* harmony export */   "Ut": function() { return /* binding */ ensureValidAppTimeouts; }
/* harmony export */ });
/* harmony import */ var _utils_assign__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7877);
/* harmony import */ var _lifecycles_prop_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6989);
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5590);
/* harmony import */ var _app_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8031);




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
    throw Error((0,_app_errors__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(16, window.__DEV__ && "bootstrap max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.bootstrap = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setMountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error((0,_app_errors__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(17, window.__DEV__ && "mount max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.mount = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnmountMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error((0,_app_errors__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(18, window.__DEV__ && "unmount max time must be a positive integer number of milliseconds"));
  }

  globalTimeoutConfig.unmount = {
    millis: time,
    dieOnTimeout: dieOnTimeout,
    warningMillis: warningMillis || defaultWarningMillis
  };
}
function setUnloadMaxTime(time, dieOnTimeout, warningMillis) {
  if (typeof time !== "number" || time <= 0) {
    throw Error((0,_app_errors__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(19, window.__DEV__ && "unload max time must be a positive integer number of milliseconds"));
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
  var type = (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__/* .objectType */ .$m)(appOrParcel);
  return new Promise(function (resolve, reject) {
    var finished = false;
    var errored = false;
    appOrParcel[lifecycle]((0,_lifecycles_prop_helpers__WEBPACK_IMPORTED_MODULE_2__/* .getProps */ .A)(appOrParcel)).then(function (val) {
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
    var errMsg = (0,_app_errors__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(31, window.__DEV__ && "Lifecycle function ".concat(lifecycle, " for ").concat(type, " ").concat((0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__/* .toName */ .dR)(appOrParcel), " lifecycle did not resolve or reject for ").concat(timeoutConfig.millis, " ms."), lifecycle, type, (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__/* .toName */ .dR)(appOrParcel), timeoutConfig.millis);

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
    result[key] = (0,_utils_assign__WEBPACK_IMPORTED_MODULE_3__/* .assign */ .f)({}, globalTimeoutConfig[key], timeouts && timeouts[key] || {});
  }

  return result;
}

/***/ }),

/***/ 1001:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _lifecycles_load__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1250);
/* harmony import */ var _lifecycles_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2409);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  NOT_LOADED: _applications_app_helpers__WEBPACK_IMPORTED_MODULE_0__/* .NOT_LOADED */ .xD,
  toLoadPromise: _lifecycles_load__WEBPACK_IMPORTED_MODULE_1__/* .toLoadPromise */ .w,
  toBootstrapPromise: _lifecycles_bootstrap__WEBPACK_IMPORTED_MODULE_2__/* .toBootstrapPromise */ .$
});

/***/ }),

/***/ 5738:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": function() { return /* binding */ ensureJQuerySupport; }
/* harmony export */ });
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

/***/ }),

/***/ 2409:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ toBootstrapPromise; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3322);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8031);



function toBootstrapPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .NOT_BOOTSTRAPPED */ .HO) {
      return appOrParcel;
    }

    appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .BOOTSTRAPPING */ .ip;

    if (!appOrParcel.bootstrap) {
      // Default implementation of bootstrap
      return Promise.resolve().then(successfulBootstrap);
    }

    return (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__/* .reasonableTime */ .yr)(appOrParcel, "bootstrap").then(successfulBootstrap).catch(function (err) {
      if (hardFail) {
        throw (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .transformErr */ .QA)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
      } else {
        (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .handleAppError */ .lB)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
        return appOrParcel;
      }
    });
  });

  function successfulBootstrap() {
    appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .NOT_MOUNTED */ .Bp;
    return appOrParcel;
  }
}

/***/ }),

/***/ 1719:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mh": function() { return /* binding */ validLifecycleFn; },
/* harmony export */   "UA": function() { return /* binding */ flattenFnArray; },
/* harmony export */   "G2": function() { return /* binding */ smellsLikeAPromise; }
/* harmony export */ });
/* harmony import */ var _utils_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9914);
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5590);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8031);



function validLifecycleFn(fn) {
  return fn && (typeof fn === "function" || isArrayOfFns(fn));

  function isArrayOfFns(arr) {
    return Array.isArray(arr) && !(0,_utils_find_js__WEBPACK_IMPORTED_MODULE_0__/* .find */ .s)(arr, function (item) {
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

  var type = (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .objectType */ .$m)(appOrParcel);
  var name = (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .toName */ .dR)(appOrParcel);
  return function (props) {
    return fns.reduce(function (resultPromise, fn, index) {
      return resultPromise.then(function () {
        var thisPromise = fn(props);
        return smellsLikeAPromise(thisPromise) ? thisPromise : Promise.reject((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__/* .formatErrorMessage */ .jN)(15, window.__DEV__ && "Within ".concat(type, " ").concat(name, ", the lifecycle function ").concat(lifecycle, " at array index ").concat(index, " did not return a promise"), type, name, lifecycle, index));
      });
    }, Promise.resolve());
  };
}
function smellsLikeAPromise(promise) {
  return promise && typeof promise.then === "function" && typeof promise.catch === "function";
}

/***/ }),

/***/ 1250:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "w": function() { return /* binding */ toLoadPromise; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3322);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8031);
/* harmony import */ var _lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1719);
/* harmony import */ var _prop_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6989);
/* harmony import */ var _utils_assign_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7877);






function toLoadPromise(app) {
  return Promise.resolve().then(function () {
    if (app.loadPromise) {
      return app.loadPromise;
    }

    if (app.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .NOT_LOADED */ .xD && app.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .LOAD_ERROR */ .Wc) {
      return app;
    }

    app.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .LOADING_SOURCE_CODE */ .mp;
    var appOpts, isUserErr;
    return app.loadPromise = Promise.resolve().then(function () {
      var loadPromise = app.loadApp((0,_prop_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .getProps */ .A)(app));

      if (!(0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .smellsLikeAPromise */ .G2)(loadPromise)) {
        // The name of the app will be prepended to this error message inside of the handleAppError function
        isUserErr = true;
        throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_3__/* .formatErrorMessage */ .jN)(33, window.__DEV__ && "single-spa loading function did not return a promise. Check the second argument to registerApplication('".concat((0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(app), "', loadingFunction, activityFunction)"), (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(app)));
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
        Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") && !(0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .validLifecycleFn */ .Mh)(appOpts.bootstrap)) {
          validationErrCode = 35;

          if (window.__DEV__) {
            validationErrMessage = "does not export a valid bootstrap function or array of functions";
          }
        }

        if (!(0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .validLifecycleFn */ .Mh)(appOpts.mount)) {
          validationErrCode = 36;

          if (window.__DEV__) {
            validationErrMessage = "does not export a bootstrap function or array of functions";
          }
        }

        if (!(0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .validLifecycleFn */ .Mh)(appOpts.unmount)) {
          validationErrCode = 37;

          if (window.__DEV__) {
            validationErrMessage = "does not export a bootstrap function or array of functions";
          }
        }

        var type = (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .objectType */ .$m)(appOpts);

        if (validationErrCode) {
          var appOptsStr = void 0;

          try {
            appOptsStr = JSON.stringify(appOpts);
          } catch (_a) {}

          console.error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_3__/* .formatErrorMessage */ .jN)(validationErrCode, window.__DEV__ && "The loading function for single-spa ".concat(type, " '").concat((0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(app), "' resolved with the following, which does not have bootstrap, mount, and unmount functions"), type, (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(app), appOptsStr), appOpts);
          (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_3__/* .handleAppError */ .lB)(validationErrMessage, app, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
          return app;
        }

        if (appOpts.devtools && appOpts.devtools.overlays) {
          app.devtools.overlays = (0,_utils_assign_js__WEBPACK_IMPORTED_MODULE_4__/* .assign */ .f)({}, app.devtools.overlays, appOpts.devtools.overlays);
        }

        app.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .NOT_BOOTSTRAPPED */ .HO;
        app.bootstrap = (0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .flattenFnArray */ .UA)(appOpts, "bootstrap");
        app.mount = (0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .flattenFnArray */ .UA)(appOpts, "mount");
        app.unmount = (0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .flattenFnArray */ .UA)(appOpts, "unmount");
        app.unload = (0,_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_2__/* .flattenFnArray */ .UA)(appOpts, "unload");
        app.timeouts = (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_5__/* .ensureValidAppTimeouts */ .Ut)(appOpts.timeouts);
        delete app.loadPromise;
        return app;
      });
    }).catch(function (err) {
      delete app.loadPromise;
      var newStatus;

      if (isUserErr) {
        newStatus = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf;
      } else {
        newStatus = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .LOAD_ERROR */ .Wc;
        app.loadErrorTime = new Date().getTime();
      }

      (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_3__/* .handleAppError */ .lB)(err, app, newStatus);
      return app;
    });
  });
}

/***/ }),

/***/ 6637:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m": function() { return /* binding */ toMountPromise; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5590);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8031);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3322);
/* harmony import */ var custom_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9638);
/* harmony import */ var custom_event__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(custom_event__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _unmount_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);





var beforeFirstMountFired = false;
var firstMountFired = false;
function toMountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .NOT_MOUNTED */ .Bp) {
      return appOrParcel;
    }

    if (!beforeFirstMountFired) {
      window.dispatchEvent(new (custom_event__WEBPACK_IMPORTED_MODULE_0___default())("single-spa:before-first-mount"));
      beforeFirstMountFired = true;
    }

    return (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__/* .reasonableTime */ .yr)(appOrParcel, "mount").then(function () {
      appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .MOUNTED */ .Ni;

      if (!firstMountFired) {
        window.dispatchEvent(new (custom_event__WEBPACK_IMPORTED_MODULE_0___default())("single-spa:first-mount"));
        firstMountFired = true;
      }

      return appOrParcel;
    }).catch(function (err) {
      // If we fail to mount the appOrParcel, we should attempt to unmount it before putting in SKIP_BECAUSE_BROKEN
      // We temporarily put the appOrParcel into MOUNTED status so that toUnmountPromise actually attempts to unmount it
      // instead of just doing a no-op.
      appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .MOUNTED */ .Ni;
      return (0,_unmount_js__WEBPACK_IMPORTED_MODULE_3__/* .toUnmountPromise */ .M)(appOrParcel, true).then(setSkipBecauseBroken, setSkipBecauseBroken);

      function setSkipBecauseBroken() {
        if (!hardFail) {
          (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_4__/* .handleAppError */ .lB)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .SKIP_BECAUSE_BROKEN */ .sf);
          return appOrParcel;
        } else {
          throw (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_4__/* .transformErr */ .QA)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .SKIP_BECAUSE_BROKEN */ .sf);
        }
      }
    });
  });
}

/***/ }),

/***/ 6989:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "A": function() { return /* binding */ getProps; }
/* harmony export */ });
/* harmony import */ var _single_spa_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5152);
/* harmony import */ var _parcels_mount_parcel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(354);
/* harmony import */ var _utils_assign_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7877);
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8031);





function getProps(appOrParcel) {
  var name = (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(appOrParcel);
  var customProps = typeof appOrParcel.customProps === "function" ? appOrParcel.customProps(name, window.location) : appOrParcel.customProps;

  if (typeof customProps !== "object" || customProps === null || Array.isArray(customProps)) {
    customProps = {};
    console.warn((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .formatErrorMessage */ .jN)(40, window.__DEV__ && "single-spa: ".concat(name, "'s customProps function must return an object. Received ").concat(customProps)), name, customProps);
  }

  var result = (0,_utils_assign_js__WEBPACK_IMPORTED_MODULE_2__/* .assign */ .f)({}, customProps, {
    name: name,
    mountParcel: _parcels_mount_parcel_js__WEBPACK_IMPORTED_MODULE_3__/* .mountParcel.bind */ .F.bind(appOrParcel),
    singleSpa: _single_spa_js__WEBPACK_IMPORTED_MODULE_4__
  });

  if ((0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .isParcel */ .AN)(appOrParcel)) {
    result.unmountSelf = appOrParcel.unmountThisParcel;
  }

  return result;
}

/***/ }),

/***/ 15:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "M": function() { return /* binding */ toUnmountPromise; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8031);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3322);



function toUnmountPromise(appOrParcel, hardFail) {
  return Promise.resolve().then(function () {
    if (appOrParcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .MOUNTED */ .Ni) {
      return appOrParcel;
    }

    appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .UNMOUNTING */ .Gn;
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
          throw (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .transformErr */ .QA)(parentError, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
        } else {
          (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .handleAppError */ .lB)(parentError, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
        }
      });
    }).then(function () {
      return appOrParcel;
    });

    function unmountAppOrParcel() {
      // We always try to unmount the appOrParcel, even if the children parcels failed to unmount.
      return (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__/* .reasonableTime */ .yr)(appOrParcel, "unmount").then(function () {
        // The appOrParcel needs to stay in a broken status if its children parcels fail to unmount
        if (!parcelError) {
          appOrParcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .NOT_MOUNTED */ .Bp;
        }
      }).catch(function (err) {
        if (hardFail) {
          throw (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .transformErr */ .QA)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
        } else {
          (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .handleAppError */ .lB)(err, appOrParcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
        }
      });
    }
  });
}

/***/ }),

/***/ 5154:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H": function() { return /* binding */ toUpdatePromise; }
/* harmony export */ });
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5590);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8031);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3322);



function toUpdatePromise(parcel) {
  return Promise.resolve().then(function () {
    if (parcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .MOUNTED */ .Ni) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .formatErrorMessage */ .jN)(32, window.__DEV__ && "Cannot update parcel '".concat((0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(parcel), "' because it is not mounted"), (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .toName */ .dR)(parcel)));
    }

    parcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .UPDATING */ .Eo;
    return (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_2__/* .reasonableTime */ .yr)(parcel, "update").then(function () {
      parcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .MOUNTED */ .Ni;
      return parcel;
    }).catch(function (err) {
      throw (0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .transformErr */ .QA)(err, parcel, _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_0__/* .SKIP_BECAUSE_BROKEN */ .sf);
    });
  });
}

/***/ }),

/***/ 354:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "B": function() { return /* binding */ mountRootParcel; },
/* harmony export */   "F": function() { return /* binding */ mountParcel; }
/* harmony export */ });
/* harmony import */ var _lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1719);
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5590);
/* harmony import */ var _lifecycles_bootstrap_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2409);
/* harmony import */ var _lifecycles_mount_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6637);
/* harmony import */ var _lifecycles_update_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5154);
/* harmony import */ var _lifecycles_unmount_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3322);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8031);








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
    throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(2, window.__DEV__ && "Cannot mount parcel without a config object or config loading function"));
  }

  if (config.name && typeof config.name !== "string") {
    throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(3, window.__DEV__ && "Parcel name must be a string, if provided. Was given ".concat(typeof config.name), typeof config.name));
  }

  if (typeof customProps !== "object") {
    throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(4, window.__DEV__ && "Parcel ".concat(name, " has invalid customProps -- must be an object but was given ").concat(typeof customProps), name, typeof customProps));
  }

  if (!customProps.domElement) {
    throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(5, window.__DEV__ && "Parcel ".concat(name, " cannot be mounted without a domElement provided as a prop"), name));
  }

  var id = parcelCount++;
  var passedConfigLoadingFunction = typeof config === "function";
  var configLoadingFunction = passedConfigLoadingFunction ? config : function () {
    return Promise.resolve(config);
  }; // Internal representation

  var parcel = {
    id: id,
    parcels: {},
    status: passedConfigLoadingFunction ? _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .LOADING_SOURCE_CODE */ .mp : _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .NOT_BOOTSTRAPPED */ .HO,
    customProps: customProps,
    parentName: (0,_applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .toName */ .dR)(owningAppOrParcel),
    unmountThisParcel: function () {
      if (parcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .MOUNTED */ .Ni) {
        throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(6, window.__DEV__ && "Cannot unmount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
      }

      return (0,_lifecycles_unmount_js__WEBPACK_IMPORTED_MODULE_2__/* .toUnmountPromise */ .M)(parcel, true).then(function (value) {
        if (parcel.parentName) {
          delete owningAppOrParcel.parcels[parcel.id];
        }

        return value;
      }).then(function (value) {
        resolveUnmount(value);
        return value;
      }).catch(function (err) {
        parcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .SKIP_BECAUSE_BROKEN */ .sf;
        rejectUnmount(err);
        throw err;
      });
    }
  }; // We return an external representation

  var externalRepresentation; // Add to owning app or parcel

  owningAppOrParcel.parcels[id] = parcel;
  var loadPromise = configLoadingFunction();

  if (!loadPromise || typeof loadPromise.then !== "function") {
    throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(7, window.__DEV__ && "When mounting a parcel, the config loading function must return a promise that resolves with the parcel config"));
  }

  loadPromise = loadPromise.then(function (config) {
    if (!config) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(8, window.__DEV__ && "When mounting a parcel, the config loading function returned a promise that did not resolve with a parcel config"));
    }

    var name = config.name || "parcel-".concat(id);

    if ( // ES Module objects don't have the object prototype
    Object.prototype.hasOwnProperty.call(config, "bootstrap") && !(0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .validLifecycleFn */ .Mh)(config.bootstrap)) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(9, window.__DEV__ && "Parcel ".concat(name, " provided an invalid bootstrap function"), name));
    }

    if (!(0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .validLifecycleFn */ .Mh)(config.mount)) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(10, window.__DEV__ && "Parcel ".concat(name, " must have a valid mount function"), name));
    }

    if (!(0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .validLifecycleFn */ .Mh)(config.unmount)) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(11, window.__DEV__ && "Parcel ".concat(name, " must have a valid unmount function"), name));
    }

    if (config.update && !(0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .validLifecycleFn */ .Mh)(config.update)) {
      throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(12, window.__DEV__ && "Parcel ".concat(name, " provided an invalid update function"), name));
    }

    var bootstrap = (0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .flattenFnArray */ .UA)(config, "bootstrap");
    var mount = (0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .flattenFnArray */ .UA)(config, "mount");
    var unmount = (0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .flattenFnArray */ .UA)(config, "unmount");
    parcel.status = _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .NOT_BOOTSTRAPPED */ .HO;
    parcel.name = name;
    parcel.bootstrap = bootstrap;
    parcel.mount = mount;
    parcel.unmount = unmount;
    parcel.timeouts = (0,_applications_timeouts_js__WEBPACK_IMPORTED_MODULE_4__/* .ensureValidAppTimeouts */ .Ut)(config.timeouts);

    if (config.update) {
      parcel.update = (0,_lifecycles_lifecycle_helpers_js__WEBPACK_IMPORTED_MODULE_3__/* .flattenFnArray */ .UA)(config, "update");

      externalRepresentation.update = function (customProps) {
        parcel.customProps = customProps;
        return promiseWithoutReturnValue((0,_lifecycles_update_js__WEBPACK_IMPORTED_MODULE_5__/* .toUpdatePromise */ .H)(parcel));
      };
    }
  }); // Start bootstrapping and mounting
  // The .then() causes the work to be put on the event loop instead of happening immediately

  var bootstrapPromise = loadPromise.then(function () {
    return (0,_lifecycles_bootstrap_js__WEBPACK_IMPORTED_MODULE_6__/* .toBootstrapPromise */ .$)(parcel, true);
  });
  var mountPromise = bootstrapPromise.then(function () {
    return (0,_lifecycles_mount_js__WEBPACK_IMPORTED_MODULE_7__/* .toMountPromise */ .m)(parcel, true);
  });
  var resolveUnmount, rejectUnmount;
  var unmountPromise = new Promise(function (resolve, reject) {
    resolveUnmount = resolve;
    rejectUnmount = reject;
  });
  externalRepresentation = {
    mount: function () {
      return promiseWithoutReturnValue(Promise.resolve().then(function () {
        if (parcel.status !== _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_1__/* .NOT_MOUNTED */ .Bp) {
          throw Error((0,_applications_app_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .formatErrorMessage */ .jN)(13, window.__DEV__ && "Cannot mount parcel '".concat(name, "' -- it is in a ").concat(parcel.status, " status"), name, parcel.status));
        } // Add to owning app or parcel


        owningAppOrParcel.parcels[id] = parcel;
        return (0,_lifecycles_mount_js__WEBPACK_IMPORTED_MODULE_7__/* .toMountPromise */ .m)(parcel);
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

/***/ }),

/***/ 5152:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ensureJQuerySupport": function() { return /* reexport safe */ _jquery_support_js__WEBPACK_IMPORTED_MODULE_0__.q; },
/* harmony export */   "setBootstrapMaxTime": function() { return /* reexport safe */ _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__.$1; },
/* harmony export */   "setMountMaxTime": function() { return /* reexport safe */ _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__.Cd; },
/* harmony export */   "setUnmountMaxTime": function() { return /* reexport safe */ _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__.JK; },
/* harmony export */   "setUnloadMaxTime": function() { return /* reexport safe */ _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__.Ky; },
/* harmony export */   "addErrorHandler": function() { return /* reexport safe */ _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__.Td; },
/* harmony export */   "removeErrorHandler": function() { return /* reexport safe */ _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__.ld; },
/* harmony export */   "mountRootParcel": function() { return /* reexport safe */ _parcels_mount_parcel_js__WEBPACK_IMPORTED_MODULE_3__.B; },
/* harmony export */   "NOT_LOADED": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.xD; },
/* harmony export */   "LOADING_SOURCE_CODE": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.mp; },
/* harmony export */   "NOT_BOOTSTRAPPED": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.HO; },
/* harmony export */   "BOOTSTRAPPING": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.ip; },
/* harmony export */   "NOT_MOUNTED": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.Bp; },
/* harmony export */   "MOUNTING": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.NL; },
/* harmony export */   "UPDATING": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.Eo; },
/* harmony export */   "LOAD_ERROR": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.Wc; },
/* harmony export */   "MOUNTED": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.Ni; },
/* harmony export */   "UNMOUNTING": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.Gn; },
/* harmony export */   "SKIP_BECAUSE_BROKEN": function() { return /* reexport safe */ _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__.sf; }
/* harmony export */ });
/* harmony import */ var _devtools_devtools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1001);
/* harmony import */ var _utils_runtime_environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(215);
/* harmony import */ var _jquery_support_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5738);
/* harmony import */ var _applications_timeouts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3322);
/* harmony import */ var _applications_app_errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8031);
/* harmony import */ var _parcels_mount_parcel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(354);
/* harmony import */ var _applications_app_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5590);




window.__DEV__ = false;




if (_utils_runtime_environment_js__WEBPACK_IMPORTED_MODULE_5__/* .isInBrowser */ .L && window.__SINGLE_SPA_DEVTOOLS__) {
  window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = _devtools_devtools__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z;
}

/***/ }),

/***/ 7877:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "f": function() { return /* binding */ assign; }
/* harmony export */ });
// Object.assign() is not available in IE11. And the babel compiled output for object spread
// syntax checks a bunch of Symbol stuff and is almost a kb. So this function is the smaller replacement.
function assign() {
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

/***/ }),

/***/ 9914:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "s": function() { return /* binding */ find; }
/* harmony export */ });
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

/***/ }),

/***/ 215:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ isInBrowser; }
/* harmony export */ });
var isInBrowser = typeof window !== "undefined";

/***/ }),

/***/ 3678:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "qo": function() { return /* binding */ toArray; },
/* harmony export */   "Y3": function() { return /* binding */ nextTick; },
/* harmony export */   "RL": function() { return /* binding */ isConstructable; },
/* harmony export */   "GV": function() { return /* binding */ isCallable; },
/* harmony export */   "WE": function() { return /* binding */ isBoundedFunction; },
/* harmony export */   "sQ": function() { return /* binding */ getDefaultTplWrapper; },
/* harmony export */   "Jj": function() { return /* binding */ getWrapperId; },
/* harmony export */   "BS": function() { return /* binding */ validateExportLifecycle; },
/* harmony export */   "BH": function() { return /* binding */ Deferred; },
/* harmony export */   "FO": function() { return /* binding */ isEnableScopedCSS; },
/* harmony export */   "y4": function() { return /* binding */ getXPathForElement; },
/* harmony export */   "ZO": function() { return /* binding */ getContainer; }
/* harmony export */ });
/* unused harmony exports sleep, performanceGetEntriesByName, performanceMark, performanceMeasure */
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6865);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3234);
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
  return "__freelog_microapp_wrapper_for_".concat((0,lodash_es__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(id), "__");
}
/** 校验子应用导出的 生命周期 对象是否正确 */

function validateExportLifecycle(exports) {
  var _a = exports !== null && exports !== void 0 ? exports : {},
      bootstrap = _a.bootstrap,
      mount = _a.mount,
      unmount = _a.unmount;

  return (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(bootstrap) && (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(mount) && (0,lodash_es__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(unmount);
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


var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function' && typeof performance.getEntriesByName === 'function';
function performanceGetEntriesByName(markName, type) {
  var marks = null;

  if (supportsUserTiming) {
    marks = performance.getEntriesByName(markName, type);
  }

  return marks;
}
function performanceMark(markName) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}
function performanceMeasure(measureName, markName) {
  if (supportsUserTiming && performance.getEntriesByName(markName, 'mark').length) {
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

/***/ }),

/***/ 596:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OK": function() { return /* binding */ initUserCheck; },
/* harmony export */   "WU": function() { return /* binding */ isUserChange; }
/* harmony export */ });
/* unused harmony exports hookAJAX, hookImg, hookOpen, hookFetch */
/* harmony import */ var doc_cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5746);
/* harmony import */ var doc_cookies__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(doc_cookies__WEBPACK_IMPORTED_MODULE_0__);

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
var rawLocation = window.location;
function isUserChange() {
  var uid = doc_cookies__WEBPACK_IMPORTED_MODULE_0___default().getItem("uid");
  uid = uid ? uid : "";

  if (inited && uid !== window.userId) {
    rawLocation.reload();
    return true;
  } // 有页面登出后，还处于登录状态的页面处理方式


  if (inited && window.userId && !uid) {
    rawLocation.reload();
    return true;
  }

  return false;
}

/***/ }),

/***/ 106:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S1": function() { return /* binding */ init; },
/* harmony export */   "Pd": function() { return /* binding */ getExhibitListById; },
/* harmony export */   "yI": function() { return /* binding */ getExhibitListByPaging; },
/* harmony export */   "Xg": function() { return /* binding */ getSignStatistics; },
/* harmony export */   "RS": function() { return /* binding */ getExhibitInfo; },
/* harmony export */   "hz": function() { return /* binding */ getExhibitDepInfo; },
/* harmony export */   "xL": function() { return /* binding */ getExhibitSignCount; },
/* harmony export */   "Yi": function() { return /* binding */ getExhibitAvailalbe; },
/* harmony export */   "yr": function() { return /* binding */ getExhibitAuthStatus; },
/* harmony export */   "ae": function() { return /* binding */ getExhibitFileStream; },
/* harmony export */   "_P": function() { return /* binding */ getExhibitInfoByAuth; },
/* harmony export */   "nt": function() { return /* binding */ getExhibitDepTree; },
/* harmony export */   "rb": function() { return /* binding */ getExhibitDepFileStream; }
/* harmony export */ });
/* unused harmony export getExhibitResultByAuth */
/* harmony import */ var _services_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9812);
/* harmony import */ var _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8229);
/* harmony import */ var _services_api_modules_contract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7248);
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
        , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
          name: this.name
        })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitListById */ .Z.getTestExhibitListById, [nodeId], __assign({}, query))]; //@ts-ignore

      return [2
      /*return*/
      , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
        name: this.name
      })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitListById */ .Z.getExhibitListById, [nodeId], __assign({}, query))];
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
        , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
          name: this.name
        })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitByPaging */ .Z.getTestExhibitByPaging, [nodeId], __assign({}, query))]; // @ts-ignore

      return [2
      /*return*/
      , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
        name: this.name
      })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitListByPaging */ .Z.getExhibitListByPaging, [nodeId], __assign({}, query))];
    });
  });
}
function getSignStatistics(query) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      // @ts-ignore
      return [2
      /*return*/
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_contract__WEBPACK_IMPORTED_MODULE_2__/* ["default"].getSignStatistics */ .Z.getSignStatistics, "", __assign({
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
        , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitDetail */ .Z.getTestExhibitDetail, [nodeId, exhibitId], query)]; // @ts-ignore

      return [2
      /*return*/
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitDetail */ .Z.getExhibitDetail, [nodeId, exhibitId], query)];
    });
  });
}
function getExhibitDepInfo(exhibitId, articleNids) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (isTest) // @ts-ignore
        return [2
        /*return*/
        , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitDepInfo */ .Z.getTestExhibitDepInfo, [nodeId, exhibitId], {
          articleNids: articleNids
        })]; // @ts-ignore

      return [2
      /*return*/
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitDepInfo */ .Z.getExhibitDepInfo, [nodeId, exhibitId], {
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
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitSignCount */ .Z.getExhibitSignCount, "", {
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
        , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitAuthStatus */ .Z.getTestExhibitAuthStatus, [nodeId], {
          authType: 3,
          exhibitIds: exhibitIds
        })];
      } // @ts-ignore


      return [2
      /*return*/
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitAuthStatus */ .Z.getExhibitAuthStatus, [nodeId], {
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
        , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitAuthStatus */ .Z.getTestExhibitAuthStatus, [nodeId], {
          authType: window.isTest ? 3 : 4,
          exhibitIds: exhibitIds
        })];
      } // @ts-ignore


      return [2
      /*return*/
      , (0,_services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitAuthStatus */ .Z.getExhibitAuthStatus, [nodeId], {
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

  if (isTest) return _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
    name: name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId
  })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitAuthById */ .Z.getTestExhibitAuthById, [nodeId, exhibitId, type], form, returnUrl, config);
  return _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
    name: name,
    isAuth: true,
    exhibitId: parentNid ? "" : exhibitId
  })(_services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitAuthById */ .Z.getExhibitAuthById, [nodeId, exhibitId, type], form, returnUrl, config);
}

function getExhibitFileStream(exhibitId, options, config) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
        // @ts-ignore
        name: this.name,
        isAuth: true,
        exhibitId: exhibitId
      })(isTest ? _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitById */ .Z.getTestExhibitById : _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitById */ .Z.getExhibitById, [exhibitId], (options === null || options === void 0 ? void 0 : options.subFilePath) ? {
        subFilePath: options.subFilePath
      } : null, typeof options === "boolean" ? options : options === null || options === void 0 ? void 0 : options.returnUrl, config || (options === null || options === void 0 ? void 0 : options.config))];
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
} // 子依赖树

function getExhibitDepTree(exhibitId, options) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
        // @ts-ignore
        name: this.name,
        exhibitId: exhibitId
      })(isTest ? _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitDepTree */ .Z.getTestExhibitDepTree : _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitDepTree */ .Z.getExhibitDepTree, [exhibitId], options ? {
        nid: options.nid,
        maxDeep: options.maxDeep,
        version: options.version,
        isContainRootNode: options.isContainRootNode
      } : null)];
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
      }

      return [2
      /*return*/
      , _services_handler__WEBPACK_IMPORTED_MODULE_0__/* ["default"].bind */ .Z.bind({
        // @ts-ignore
        name: this.name,
        isAuth: true,
        exhibitId: exhibitId
      })(isTest ? _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getTestExhibitById */ .Z.getTestExhibitById : _services_api_modules_exhibit__WEBPACK_IMPORTED_MODULE_1__/* ["default"].getExhibitById */ .Z.getExhibitById, [exhibitId], {
        parentNid: parentNid,
        subArticleIdOrName: subArticleId
      }, returnUrl, config)];
    });
  });
}

/***/ }),

/***/ 6181:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Qq": function() { return /* binding */ DEV_FALSE; },
/* harmony export */   "gt": function() { return /* binding */ DEV_WIDGET; },
/* harmony export */   "E8": function() { return /* binding */ DEV_TYPE_REPLACE; },
/* harmony export */   "WI": function() { return /* binding */ dev; }
/* harmony export */ });
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

/***/ }),

/***/ 3567:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "v": function() { return /* binding */ freelogAuth; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7198);
/* harmony import */ var _bridge_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9779);
/* harmony import */ var _bridge_eventOn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1351);
/* harmony import */ var _bridge_eventType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6924);




var freelogAuth = {
  registerUI: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .registerUI */ .BK,
  eventMap: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .eventMap */ .Hx,
  failedMap: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .failedMap */ .Bw,
  endEvent: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .endEvent */ .L4,
  updateLock: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .updateLock */ .N1,
  updateEvent: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .updateEvent */ .eJ,
  clearEvent: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .clearEvent */ .sf,
  lowerUI: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .lowerUI */ .nU,
  upperUI: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .upperUI */ .jE,
  resultType: _bridge_eventType__WEBPACK_IMPORTED_MODULE_1__/* .resultType */ .uq,
  loginCallback: _bridge_eventOn__WEBPACK_IMPORTED_MODULE_2__/* .loginCallback */ .IS,
  setUserInfo: _utils__WEBPACK_IMPORTED_MODULE_3__/* .setUserInfo */ .ps,
  getCurrentUser: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getCurrentUser */ .ts,
  getUserInfo: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getUserInfo */ .bG,
  reload: _bridge_index__WEBPACK_IMPORTED_MODULE_0__/* .reload */ .H5,
  eventType: _bridge_eventType__WEBPACK_IMPORTED_MODULE_1__/* .eventType */ .a7
};

/***/ }),

/***/ 3770:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": function() { return /* binding */ freelogApp; }
/* harmony export */ });
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8049);
/* harmony import */ var _bridge_eventType__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6924);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7198);
/* harmony import */ var _bridge_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9779);
/* harmony import */ var _bridge_eventOn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1351);
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(596);
/* harmony import */ var _runtime_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2506);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(106);








var devData = "";
var freelogApp = {
  initGlobalState: _runtime_index__WEBPACK_IMPORTED_MODULE_0__/* .initGlobalState */ .N,
  nodeInfo: "",
  status: {
    authUIMounted: false,
    themeMounted: false
  },
  mountWidget: _widget__WEBPACK_IMPORTED_MODULE_1__/* .mountWidget */ .lA,
  getExhibitListById: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitListById */ .Pd,
  getExhibitListByPaging: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitListByPaging */ .yI,
  getExhibitInfo: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitInfo */ .RS,
  getExhibitSignCount: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitSignCount */ .xL,
  getExhibitAuthStatus: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitAuthStatus */ .yr,
  getExhibitFileStream: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitFileStream */ .ae,
  getExhibitDepFileStream: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitDepFileStream */ .rb,
  getExhibitInfoByAuth: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitInfoByAuth */ ._P,
  getExhibitDepInfo: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitDepInfo */ .hz,
  getExhibitDepTree: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitDepTree */ .nt,
  getSignStatistics: _api__WEBPACK_IMPORTED_MODULE_2__/* .getSignStatistics */ .Xg,
  getExhibitAvailalbe: _api__WEBPACK_IMPORTED_MODULE_2__/* .getExhibitAvailalbe */ .Yi,
  devData: devData,
  getStaticPath: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getStaticPath */ .lg,
  getSubDep: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getSubDep */ .Jr,
  getSelfArticleId: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getSelfArticleId */ .JY,
  getSelfExhibitId: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getSelfExhibitId */ .Nd,
  getSelfWidgetId: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getSelfWidgetId */ .Tw,
  callAuth: _bridge_index__WEBPACK_IMPORTED_MODULE_4__/* .callAuth */ .PF,
  addAuth: _bridge_index__WEBPACK_IMPORTED_MODULE_4__/* .addAuth */ .Ei,
  onLogin: _bridge_eventOn__WEBPACK_IMPORTED_MODULE_5__/* .onLogin */ .Sx,
  onUserChange: _bridge_eventOn__WEBPACK_IMPORTED_MODULE_5__/* .onUserChange */ .iP,
  callLogin: _utils__WEBPACK_IMPORTED_MODULE_3__/* .callLogin */ .rG,
  callLoginOut: _utils__WEBPACK_IMPORTED_MODULE_3__/* .callLoginOut */ .yo,
  getCurrentUser: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getCurrentUser */ .ts,
  setViewport: _utils__WEBPACK_IMPORTED_MODULE_3__/* .setViewport */ ._o,
  setUserData: _utils__WEBPACK_IMPORTED_MODULE_3__/* .setUserData */ .M,
  getUserData: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getUserData */ .is,
  getSelfConfig: _utils__WEBPACK_IMPORTED_MODULE_3__/* .getSelfConfig */ .KR,
  isUserChange: _security__WEBPACK_IMPORTED_MODULE_6__/* .isUserChange */ .WU,
  reload: _utils__WEBPACK_IMPORTED_MODULE_3__/* .reload */ .H5,
  resultType: _bridge_eventType__WEBPACK_IMPORTED_MODULE_7__/* .resultType */ .uq
};

/***/ }),

/***/ 3913:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JB": function() { return /* binding */ setHistory; },
/* harmony export */   "s1": function() { return /* binding */ getHistory; },
/* harmony export */   "$i": function() { return /* binding */ historyBack; },
/* harmony export */   "G1": function() { return /* binding */ historyForward; },
/* harmony export */   "dA": function() { return /* binding */ historyGo; }
/* harmony export */ });
/* unused harmony export widgetHistories */
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
  return __assign({}, obj);
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

/***/ }),

/***/ 4208:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": function() { return /* binding */ initNode; }
/* harmony export */ });
/* harmony import */ var _services_handler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9812);
/* harmony import */ var _services_api_modules_node__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(4837);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7198);
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3770);
/* harmony import */ var _freelogAuth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3567);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(106);
/* harmony import */ var _dev__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6181);
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2936);
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8049);
/* harmony import */ var _bridge_index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9779);
/* harmony import */ var _bridge_eventType__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6924);
/* harmony import */ var _bridge_eventOn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1351);
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

var _a;









 // import VConsole from "vconsole";



 // @ts-ignore

delete window.setImmediate;
var mobile = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .isMobile */ .tq)(); // @ts-ignore

var uiPath =  false ? 0 : mobile ? "/mobile" : "/pc";
window.ENV = "freelog.com";

if (window.location.host.includes(".testfreelog.com")) {
  window.ENV = "testfreelog.com";
}

var rawDocument = document;
!mobile && ((_a = document.querySelector.bind(document)('meta[name="viewport"]')) === null || _a === void 0 ? void 0 : _a.setAttribute("content", "width=device-width, initial-scale=1.0"));
window.freelogApp = _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp */ .L;
window.freelogAuth = _freelogAuth__WEBPACK_IMPORTED_MODULE_2__/* .freelogAuth */ .v;
function initNode() {
  var _this = this; // TODO 这个位置问题需要可考虑，最好放到UI插件之后


  (0,_bridge_eventOn__WEBPACK_IMPORTED_MODULE_3__/* .initWindowListener */ .Ib)();
  (0,_proxy__WEBPACK_IMPORTED_MODULE_4__/* .pathATag */ .FC)();
  return new Promise(function (resolve) {
    return __awaiter(_this, void 0, void 0, function () {
      var nodeDomain;

      var _this = this;

      return __generator(this, function (_a) {
        nodeDomain = getDomain(window.location.host);
        Promise.all([requestNodeInfo(nodeDomain), (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getUserInfo */ .bG)()]).then(function (values) {
          return __awaiter(_this, void 0, void 0, function () {
            var nodeData, userInfo, nodeInfo, devData, script, container, loadingContainer, mountTheme;

            var _this = this;

            return __generator(this, function (_a) {
              nodeData = values[0];

              if (!nodeData.data) {
                confirm("节点网址不正确，请检查网址！");
                return [2
                /*return*/
                ];
              }

              userInfo = values[1];
              nodeInfo = nodeData.data;
              _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.nodeInfo */ .L.nodeInfo = nodeInfo; // if (
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
                document.title = "[T]" + nodeInfo.nodeName;
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
              (0,_api__WEBPACK_IMPORTED_MODULE_5__/* .init */ .S1)();
              devData = (0,_dev__WEBPACK_IMPORTED_MODULE_6__/* .dev */ .WI)(); // TODO 提供一个开发者模式，能在全局创建一个VConsole
              // window.vconsole = new VConsole()
              // if (devData.type !== DEV_FALSE && devData.config.vconsole) {
              //   window.vconsole = new VConsole();
              // }

              console.log(mobile, 123123);

              if (devData.type !== _dev__WEBPACK_IMPORTED_MODULE_6__/* .DEV_FALSE */ .Qq && mobile) {
                script = document.createElement("script");
                script.src = "https://unpkg.com/vconsole@latest/dist/vconsole.min.js";
                document.head.appendChild(script);

                script.onload = function () {
                  // @ts-ignore
                  window.vconsole = new window.VConsole();
                  console.log(234234);
                };
              }

              Object.freeze(devData);
              _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.devData */ .L.devData = devData;
              Object.freeze(_global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp */ .L);
              Object.freeze(_global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.nodeInfo */ .L.nodeInfo);
              (0,_proxy__WEBPACK_IMPORTED_MODULE_4__/* .initLocation */ .jT)();
              container = document.getElementById.bind(rawDocument)("freelog-plugin-container");
              loadingContainer = document.getElementById.bind(rawDocument)("runtime-loading");
              mountTheme = new Promise(function (themeResolve) {
                return __awaiter(_this, void 0, void 0, function () {
                  var theme, themeApp;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        // 节点冻结
                        if ((nodeInfo.status & 4) === 4) {
                          themeResolve(false);
                          return [2
                          /*return*/
                          ];
                        } // 用户冻结


                        if (userInfo && userInfo.status == 1) {
                          themeResolve(false);
                          return [2
                          /*return*/
                          ];
                        } // 没有主题


                        if (!nodeInfo.nodeThemeId && !window.isTest || !nodeInfo.nodeTestThemeId && window.isTest) {
                          themeResolve(false);
                          return [2
                          /*return*/
                          ];
                        }

                        return [4
                        /*yield*/
                        , (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getSubDep */ .Jr)(window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId)];

                      case 1:
                        theme = _a.sent(); // @ts-ignore

                        loadingContainer.style.display = "none";
                        return [4
                        /*yield*/
                        , _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.mountWidget */ .L.mountWidget(theme, container, "", __assign({
                          shadowDom: false,
                          scopedCss: true
                        }, theme.exhibitProperty), null, true)];

                      case 2:
                        themeApp = _a.sent();
                        themeApp.mountPromise.then(function () {
                          themeResolve(true);
                        });
                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              });
              mountTheme.then(function (flag) {
                _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.status.themeMounted */ .L.status.themeMounted = flag;
              });
              (0,_widget__WEBPACK_IMPORTED_MODULE_7__/* .mountUI */ .wG)("freelog-ui", document.getElementById.bind(rawDocument)("ui-root"), uiPath, {
                shadowDom: false,
                scopedCss: true
              }).mountPromise.then(function () {
                return __awaiter(_this, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    // @ts-ignore
                    loadingContainer.style.display = "none";
                    _global__WEBPACK_IMPORTED_MODULE_1__/* .freelogApp.status.authUIMounted */ .L.status.authUIMounted = true; // 节点冻结

                    if ((nodeInfo.status & 5) === 5 || (nodeInfo.status & 6) === 6 || (nodeInfo.status & 12) === 12) {
                      resolve && resolve();
                      setTimeout(function () {
                        return (0,_bridge_index__WEBPACK_IMPORTED_MODULE_8__/* .callUI */ .w0)(_bridge_eventType__WEBPACK_IMPORTED_MODULE_9__/* .NODE_FREEZED */ .dB, nodeInfo);
                      }, 10);
                      return [2
                      /*return*/
                      ];
                    } // 节点下线


                    if ((nodeInfo.status & 8) === 8) {
                      resolve && resolve();
                      setTimeout(function () {
                        return (0,_bridge_index__WEBPACK_IMPORTED_MODULE_8__/* .callUI */ .w0)(_bridge_eventType__WEBPACK_IMPORTED_MODULE_9__/* .NODE_OFFLINE */ .di, nodeInfo);
                      }, 10);
                      return [2
                      /*return*/
                      ];
                    } // 私密节点


                    if ((nodeInfo.status & 2) === 2 && nodeInfo.ownerUserId !== (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId)) {
                      resolve && resolve();
                      setTimeout(function () {
                        return (0,_bridge_index__WEBPACK_IMPORTED_MODULE_8__/* .callUI */ .w0)(_bridge_eventType__WEBPACK_IMPORTED_MODULE_9__/* .NODE_PRIVATE */ .xM, nodeInfo);
                      }, 10);
                      return [2
                      /*return*/
                      ];
                    } // 用户冻结


                    if (userInfo && userInfo.status == 1) {
                      resolve && resolve();
                      setTimeout(function () {
                        return (0,_bridge_index__WEBPACK_IMPORTED_MODULE_8__/* .callUI */ .w0)(_bridge_eventType__WEBPACK_IMPORTED_MODULE_9__/* .USER_FREEZED */ .W5, userInfo);
                      }, 10);
                      return [2
                      /*return*/
                      ];
                    } // 没有主题


                    if (!nodeInfo.nodeThemeId && !window.isTest || !nodeInfo.nodeTestThemeId && window.isTest) {
                      resolve && resolve();
                      setTimeout(function () {
                        return (0,_bridge_index__WEBPACK_IMPORTED_MODULE_8__/* .callUI */ .w0)(_bridge_eventType__WEBPACK_IMPORTED_MODULE_9__/* .THEME_NONE */ .BY, nodeInfo);
                      }, 10);
                      return [2
                      /*return*/
                      ];
                    } // const availableData = await getExhibitAvailalbe(
                    //   window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
                    // );
                    // // 主题冻结
                    // if (availableData && availableData.authCode === 403) {
                    //   resolve && resolve();
                    //   return;
                    // }
                    // const theme = await getSubDep(
                    //   window.isTest ? nodeInfo.nodeTestThemeId : nodeInfo.nodeThemeId
                    // );
                    // freelogApp.mountWidget(
                    //   theme,
                    //   container,
                    //   "",
                    //   { shadowDom: false, scopedCss: true, ...theme.exhibitProperty },
                    //   null,
                    //   true
                    // );


                    resolve && resolve();
                    return [2
                    /*return*/
                    ];
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
  return __awaiter(this, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , _services_handler__WEBPACK_IMPORTED_MODULE_10__/* ["default"].bind */ .Z.bind({
            name: "node"
          })(_services_api_modules_node__WEBPACK_IMPORTED_MODULE_11__/* ["default"].getInfoByNameOrDomain */ .Z.getInfoByNameOrDomain, "", {
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

/***/ }),

/***/ 2936:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "qS": function() { return /* binding */ freelogAddEventListener; },
/* harmony export */   "LD": function() { return /* binding */ ajaxProxy; },
/* harmony export */   "b": function() { return /* binding */ isFreelogAuth; },
/* harmony export */   "jT": function() { return /* binding */ initLocation; },
/* harmony export */   "l6": function() { return /* binding */ setLocation; },
/* harmony export */   "wx": function() { return /* binding */ freelogLocalStorage; },
/* harmony export */   "f": function() { return /* binding */ saveSandBox; },
/* harmony export */   "_n": function() { return /* binding */ createHistoryProxy; },
/* harmony export */   "jt": function() { return /* binding */ createLocationProxy; },
/* harmony export */   "ib": function() { return /* binding */ createDocumentProxy; },
/* harmony export */   "p5": function() { return /* binding */ createWidgetProxy; },
/* harmony export */   "Ak": function() { return /* binding */ getPublicPath; },
/* harmony export */   "ZK": function() { return /* binding */ createFreelogAppProxy; },
/* harmony export */   "FC": function() { return /* binding */ pathATag; }
/* harmony export */ });
/* unused harmony exports rawFetch, nativeOpen, isTheme, locationCenter */
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8049);
/* harmony import */ var _runtime_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2506);
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3913);
/* harmony import */ var _dev__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6181);
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

var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
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
var rawLocalStorage = window["localStorage"];
var rawWindow = window; // widgetName  {routerType: 'history' || 'hash'}

var locations = new Map();
var freelogPopstate = new PopStateEvent("freelog-popstate"); // for history back and forword

var state = 0;
var moveLock = false;
rawWindow.addEventListener("popstate", function (event) {
  var estate = event.state;
  if (!estate) estate = 0;

  if (estate < state) {
    moveLock = true; // this is back,  make all of locations position++
    // @ts-ignore

    locations.forEach(function (value, key) {
      (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .historyBack */ .$i)(key);
    });
  } else if (estate > state) {
    moveLock = true; // this is forword make all of locations position--
    // @ts-ignore

    locations.forEach(function (value, key) {
      (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .historyForward */ .G1)(key);
    });
  }

  setTimeout(function () {
    moveLock = false;
  }, 0);
  state = estate;
  initLocation();
  rawWindow.dispatchEvent(freelogPopstate);
}, true);
rawWindow.addEventListener("hashchange", function () {
  initLocation();
}, true);
function freelogAddEventListener(proxy, target) {
  return function () {
    // @ts-ignore
    console.log(5555, arguments);
    var arr = Array.prototype.slice.apply(arguments);

    if (arguments[0] === "popstate") {
      rawWindow.addEventListener("freelog-popstate", arr[1]);
      return;
    } // TODO onmessage需要处理, 此方法只能支持window.addEventListener


    if (arguments[0] === "message") {
      var func_1 = arr[1];
      rawWindow.addEventListener.apply(rawWindow, __spreadArray(["message", function (event) {
        if (typeof func_1 === "function") {
          func_1(new Proxy({}, {
            get: function (target, p, receiver) {
              if (p === "source") {
                return proxy;
              }

              return event[p];
            }
          }));
        }
      }], arr.slice(2), false));
      return;
    } // @ts-ignore


    rawWindow.addEventListener.apply(rawWindow, arguments);
  };
} // TODO 如果授权UI插件想要请求之外的接口，可以通过freelogAuths放进去

var rawFetch = rawWindow.fetch;
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
        return rawFetch(url, __assign({}, options));
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
  return _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name).isUI;
}
function isTheme(name) {
  return _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name).isTheme;
}
function initLocation() {
  if (rawLocation.href.includes("$freelog")) {
    var loc = rawLocation.href.split("freelog.com/")[1].split("$");

    if (rawWindow.freelogApp.devData.type === _dev__WEBPACK_IMPORTED_MODULE_2__/* .DEV_WIDGET */ .gt) {
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
    if (!_widget__WEBPACK_IMPORTED_MODULE_1__/* .activeWidgets.get */ .VP.get(key)) {
      locations.delete(key);
      return;
    }

    hash += "$" + key + "=" + value.href || 0;
  });

  if (rawWindow.freelogApp.devData.type === _dev__WEBPACK_IMPORTED_MODULE_2__/* .DEV_WIDGET */ .gt) {
    var devUrl = rawLocation.search.split("$_")[0];

    if (!devUrl.endsWith("/")) {
      devUrl = devUrl + "/";
    }

    var url = rawLocation.origin + "/" + devUrl + "$_" + hash.replace("?", "_") + rawLocation.hash;
    if (url === rawLocation.href) return;
    rawWindow.history.pushState(state++, "", url);
  } else {
    var url = rawLocation.origin + "/" + hash.replace("?", "_") + rawLocation.hash + rawLocation.search;
    if (url === rawLocation.href) return;
    rawWindow.history.pushState(state++, "", url);
  } // rawLocation.hash = hash; state++

} // TODO pathname  search 需要不可变

var locationCenter = {
  set: function (name, attr) {
    var loc = locations.get(name) || {};

    if (attr.pathname && attr.pathname.indexOf(rawLocation.host) > -1) {
      // for vue3
      attr.pathname = attr.pathname.replace(rawLocation.protocol, "").replace(rawLocation.host, "").replace("//", "");
    }

    locations.set(name, __assign(__assign({}, loc), attr));
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
  (0,_widget__WEBPACK_IMPORTED_MODULE_1__/* .addSandBox */ .mn)(name, sandBox);
};
var createHistoryProxy = function (name) {
  var widgetConfig = _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name);

  function patch() {
    var hash = "";
    var routerType = HISTORY; // TODO 解析query参数  search   vue3会把origin也传过来

    var href = arguments[2].replace(rawLocation.origin, "").replace(rawLocation.origin.replace('http:', "https:"), "");

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
    (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .setHistory */ .JB)(name, arguments);
  }

  function replacePatch() {
    // @ts-ignore
    patch.apply(void 0, arguments);
    (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .setHistory */ .JB)(name, arguments, true);
  }

  function go(count) {
    if (widgetConfig.config.historyFB) {
      return rawHistory.go(count);
    }

    var history = (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .historyGo */ .dA)(name, count);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      rawWindow.dispatchEvent(freelogPopstate);
    } // else if(count == -1){
    //   rawWindow.history.go(-1)
    // }

  }

  function back() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.back();
    }

    var history = (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .historyBack */ .$i)(name);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      rawWindow.dispatchEvent(freelogPopstate);
    }
  }

  function forward() {
    if (widgetConfig.config.historyFB) {
      return rawHistory.forward();
    }

    var history = (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .historyForward */ .G1)(name);

    if (history) {
      // @ts-ignore
      patch.apply(void 0, history);
      rawWindow.dispatchEvent(freelogPopstate);
    }
  }

  var state = (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .getHistory */ .s1)(name).histories[(0,_history__WEBPACK_IMPORTED_MODULE_0__/* .getHistory */ .s1)(name).position] ? [0] : {};
  var length = (0,_history__WEBPACK_IMPORTED_MODULE_0__/* .getHistory */ .s1)(name).length;

  var historyProxy = __assign(__assign({}, rawWindow.history), {
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
  var widgetConfig = _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name);
  return new Proxy(locationProxy, {
    /*
        a标签的href需要拦截，// TODO 如果以http开头则不拦截
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
            return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                _widget__WEBPACK_IMPORTED_MODULE_1__/* .flatternWidgets.get */ .qr.get(name).unmount();
                _widget__WEBPACK_IMPORTED_MODULE_1__/* .flatternWidgets.get */ .qr.get(name).unmountPromise.then(function () {
                  _widget__WEBPACK_IMPORTED_MODULE_1__/* .flatternWidgets.get */ .qr.get(name).mount();
                }, reject);
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
          return widgetConfig.entry.indexOf("https") === 0 ? "https:" : "http:";
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
  var doc = _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name).container.firstChild; //  || widgetsConfig.get(name).container;

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
  rawDocument.querySelectorAll = rootDoc.querySelectorAll.bind(rootDoc); // react 兼容问题， 按道理应该绑定rootDoc，但react不兼容，需要记录不兼容的地方
  // rawDocument.addEventListener = rootDoc.addEventListener.bind(rootDoc);
  // rawDocument.removeEventListener = rootDoc.removeEventListener.bind(rootDoc);

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
          var children = _widget__WEBPACK_IMPORTED_MODULE_1__/* .childrenWidgets.get */ .RH.get(name);
          var childrenArray = [];
          children && children.forEach(function (childId) {
            childrenArray.push(_widget__WEBPACK_IMPORTED_MODULE_1__/* .flatternWidgets.get */ .qr.get(childId));
          });
          return childrenArray;
        };
      }

      if (property === "unmount") {}
    }
  });
};
function getPublicPath(name) {
  var config = _widget__WEBPACK_IMPORTED_MODULE_1__/* .widgetsConfig.get */ .md.get(name);

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
      var pro = rawWindow.freelogApp[p];

      if (typeof pro === "function") {
        if (p === "initGlobalState") {
          if (isTheme(name)) {
            return _runtime_index__WEBPACK_IMPORTED_MODULE_3__/* .initGlobalState */ .N;
          }

          return function () {};
        }

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

/***/ }),

/***/ 7198:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dm": function() { return /* binding */ freelogFetch; },
/* harmony export */   "Tw": function() { return /* binding */ getSelfWidgetId; },
/* harmony export */   "JY": function() { return /* binding */ getSelfArticleId; },
/* harmony export */   "Nd": function() { return /* binding */ getSelfExhibitId; },
/* harmony export */   "KR": function() { return /* binding */ getSelfConfig; },
/* harmony export */   "Jr": function() { return /* binding */ getSubDep; },
/* harmony export */   "eY": function() { return /* binding */ userInfo; },
/* harmony export */   "bG": function() { return /* binding */ getUserInfo; },
/* harmony export */   "ts": function() { return /* binding */ getCurrentUser; },
/* harmony export */   "ps": function() { return /* binding */ setUserInfo; },
/* harmony export */   "lg": function() { return /* binding */ getStaticPath; },
/* harmony export */   "H5": function() { return /* binding */ reload; },
/* harmony export */   "_o": function() { return /* binding */ setViewport; },
/* harmony export */   "M": function() { return /* binding */ setUserData; },
/* harmony export */   "is": function() { return /* binding */ getUserData; },
/* harmony export */   "rG": function() { return /* binding */ callLogin; },
/* harmony export */   "yo": function() { return /* binding */ callLoginOut; },
/* harmony export */   "tq": function() { return /* binding */ isMobile; }
/* harmony export */ });
/* unused harmony exports getContainer, createContainer, deleteContainer, createScript, createCssLink, resolveUrl, setTabLogo */
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(106);
/* harmony import */ var _widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8049);
/* harmony import */ var _services_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9812);
/* harmony import */ var _security__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(596);
/* harmony import */ var _services_api_modules_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1718);
/* harmony import */ var _services_api_modules_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4837);
/* harmony import */ var _bridge_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9779);
// 工具utils：获取容器，生成容器，销毁容器，生成id
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









function freelogFetch(url, options) {
  options = options || {};

  if (url.indexOf("freelog.com") > -1) {
    return fetch(url, __assign(__assign({}, options), {
      credentials: "include"
    }));
  } else {
    return fetch(url, __assign({}, options));
  }
} // TODO  此文件的方法需要整理分离出freeelogApp下的和内部使用的

function getContainer(container) {
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
} // TODO 调试用的widgetId，未来应该在测试节点去显示，目前用的是articledId

function getSelfWidgetId() {
  var _a; // @ts-ignore


  return (_a = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name)) === null || _a === void 0 ? void 0 : _a.articleId;
}
function getSelfArticleId() {
  var _a; // @ts-ignore


  return (_a = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name)) === null || _a === void 0 ? void 0 : _a.articleId;
}
function getSelfExhibitId() {
  var _a; // @ts-ignore


  return (_a = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name)) === null || _a === void 0 ? void 0 : _a.exhibitId;
}
function getSelfConfig() {
  // @ts-ignore  由于config只有一层，所以用...就够了
  return __assign({}, _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name).config);
} // TODO if error  这里不需要参数，除了运行时自行调用，需要抽离出来不与插件调用混在一起
// TODO 紧急，增加方法加载子依赖传递作品id，通过作品id查询到孙依赖插件

function getSubDep(exhibitId) {
  return __awaiter(this, void 0, void 0, function () {
    var isTheme, that, widgetSandBox, response, exhibitName, articleNid, resourceType, subDep, exhibitProperty;

    var _this = this;

    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          isTheme = false;
          that = this || {};
          widgetSandBox = _widget__WEBPACK_IMPORTED_MODULE_0__/* .sandBoxs.get */ .sF.get(that.name);

          if (!widgetSandBox) {
            isTheme = true;
            widgetSandBox = {
              name: "freelog-" + exhibitId,
              exhibitId: exhibitId,
              isTheme: isTheme
            };
          } else {
            exhibitId = exhibitId || _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(that.name).exhibitId;
          }

          return [4
          /*yield*/
          , _api__WEBPACK_IMPORTED_MODULE_1__/* .getExhibitInfoByAuth.bind */ ._P.bind(widgetSandBox)(exhibitId)];

        case 1:
          response = _a.sent();
          if (!(response.authErrorType && isTheme)) return [3
          /*break*/
          , 7];
          return [4
          /*yield*/
          , new Promise(function (resolve, reject) {
            return __awaiter(_this, void 0, void 0, function () {
              var _this = this;

              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!(response.authCode === 502)) return [3
                    /*break*/
                    , 3];
                    return [4
                    /*yield*/
                    , new Promise(function (resolve, reject) {
                      return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;

                        return __generator(this, function (_a) {
                          _bridge_index__WEBPACK_IMPORTED_MODULE_2__/* .addAuth.bind */ .Ei.bind(widgetSandBox)(exhibitId, {
                            immediate: true
                          });
                          window.freelogApp.onLogin(function () {
                            return __awaiter(_this, void 0, void 0, function () {
                              return __generator(this, function (_a) {
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
                    , _api__WEBPACK_IMPORTED_MODULE_1__/* .getExhibitInfoByAuth.bind */ ._P.bind(widgetSandBox)(exhibitId)];

                  case 2:
                    response = _a.sent();
                    _a.label = 3;

                  case 3:
                    if (!response.authErrorType) return [3
                    /*break*/
                    , 5];
                    return [4
                    /*yield*/
                    , _bridge_index__WEBPACK_IMPORTED_MODULE_2__/* .addAuth.bind */ .Ei.bind(widgetSandBox)(exhibitId, {
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
          , _api__WEBPACK_IMPORTED_MODULE_1__/* .getExhibitInfoByAuth.bind */ ._P.bind(widgetSandBox)(exhibitId)];

        case 3:
          response = _a.sent();
          if (!response.authErrorType) return [3
          /*break*/
          , 5];
          return [4
          /*yield*/
          , new Promise(function (resolve, reject) {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4
                    /*yield*/
                    , _bridge_index__WEBPACK_IMPORTED_MODULE_2__/* .addAuth.bind */ .Ei.bind(widgetSandBox)(exhibitId, {
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
          , _api__WEBPACK_IMPORTED_MODULE_1__/* .getExhibitInfoByAuth.bind */ ._P.bind(widgetSandBox)(exhibitId)];

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
          , __assign({
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
  return __awaiter(this, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (userInfo) return [2
          /*return*/
          , userInfo];
          return [4
          /*yield*/
          , (0,_services_handler__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(_services_api_modules_user__WEBPACK_IMPORTED_MODULE_4__/* ["default"].getCurrent */ .Z.getCurrent, "", "")];

        case 1:
          res = _a.sent();
          userInfo = res.data.errCode === 0 ? res.data.data : null;
          setUserInfo(userInfo);
          (0,_security__WEBPACK_IMPORTED_MODULE_5__/* .initUserCheck */ .OK)();
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
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
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


  return _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name).entry + path;
}
var rawLocation = window.location;
function reload() {
  // @ts-ignore
  if (_widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(this.name).isTheme) {
    rawLocation.reload();
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
var rawDocument = window.document;
function setViewport(keys) {
  var _a; // @ts-ignore


  var that = this; // 如果是主题

  if (!((_a = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(that.name)) === null || _a === void 0 ? void 0 : _a.isTheme)) {
    return;
  }

  Object.keys(keys).forEach(function (key) {
    if (viewPortValue.hasOwnProperty(key) && !immutableKeys.includes(key)) {
      // TODO 开发体验最好做下验证值是否合法
      // @ts-ignore
      viewPortValue[key] = keys[key];
    }
  });
  var metaEl = rawDocument.querySelector('meta[name="viewport"]');
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
  return __awaiter(this, void 0, void 0, function () {
    var name, userData, config, widgetId, nodeId, res;

    var _a;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          key = window.isTest ? key + "-test" : key;
          name = this.name;
          userData = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetUserData.get */ .XT.get(name) || {};
          config = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(name);
          userData[key] = data;
          widgetId = btoa(encodeURI(config.articleName));

          if (name === _widget__WEBPACK_IMPORTED_MODULE_0__/* .FREELOG_DEV */ .li) {
            widgetId = _widget__WEBPACK_IMPORTED_MODULE_0__/* .sandBoxs.get */ .sF.get(name).proxy.FREELOG_RESOURCENAME;
          }

          nodeId = window.freelogApp.nodeInfo.nodeId;
          return [4
          /*yield*/
          , (0,_services_handler__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(_services_api_modules_node__WEBPACK_IMPORTED_MODULE_6__/* ["default"].putUserData */ .Z.putUserData, [nodeId], {
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
  return __awaiter(this, void 0, void 0, function () {
    var name, userData, config, widgetId, nodeId, res;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          key = window.isTest ? key + "-test" : key;
          name = this.name;
          userData = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetUserData.get */ .XT.get(name);

          if (userData) {
            return [2
            /*return*/
            , userData[key]];
          }

          config = _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetsConfig.get */ .md.get(name);
          widgetId = btoa(encodeURI(config.articleName));

          if (name === _widget__WEBPACK_IMPORTED_MODULE_0__/* .FREELOG_DEV */ .li) {
            widgetId = _widget__WEBPACK_IMPORTED_MODULE_0__/* .sandBoxs.get */ .sF.get(name).proxy.FREELOG_RESOURCENAME;
          }

          nodeId = window.freelogApp.nodeInfo.nodeId;
          return [4
          /*yield*/
          , (0,_services_handler__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(_services_api_modules_node__WEBPACK_IMPORTED_MODULE_6__/* ["default"].getUserData */ .Z.getUserData, [nodeId], "")];

        case 1:
          res = _a.sent();
          userData = res.data[widgetId] || {};
          _widget__WEBPACK_IMPORTED_MODULE_0__/* .widgetUserData.set */ .XT.set(name, userData);
          return [2
          /*return*/
          , userData[key]];
      }
    });
  });
}
function callLogin(resolve) {
  if (!userInfo) {
    (0,_bridge_index__WEBPACK_IMPORTED_MODULE_2__/* .goLogin */ .ni)(resolve);
  }
}
function callLoginOut() {
  if (userInfo) {
    (0,_bridge_index__WEBPACK_IMPORTED_MODULE_2__/* .goLoginOut */ .sl)();
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

/***/ }),

/***/ 8049:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "li": function() { return /* binding */ FREELOG_DEV; },
/* harmony export */   "qr": function() { return /* binding */ flatternWidgets; },
/* harmony export */   "md": function() { return /* binding */ widgetsConfig; },
/* harmony export */   "VP": function() { return /* binding */ activeWidgets; },
/* harmony export */   "RH": function() { return /* binding */ childrenWidgets; },
/* harmony export */   "sF": function() { return /* binding */ sandBoxs; },
/* harmony export */   "XT": function() { return /* binding */ widgetUserData; },
/* harmony export */   "mn": function() { return /* binding */ addSandBox; },
/* harmony export */   "wG": function() { return /* binding */ mountUI; },
/* harmony export */   "lA": function() { return /* binding */ mountWidget; }
/* harmony export */ });
/* unused harmony exports addWidget, addWidgetConfig, removeWidget, deactiveWidget, addChildWidget, removeChildWidget, removeSandBox */
/* harmony import */ var _runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3415);
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2936);
/* harmony import */ var _dev__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6181);
/* harmony import */ var _widgetConfigData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4876);
// 插件对象管理plugins：flatternWidgets childrenWidgets sandBoxs
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
    console.warn(widgetsConfig.get(key).name + " reloaded");
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
    console.warn(widgetsConfig.get(key).name + " reloaded");
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
  var app = (0,_runtime__WEBPACK_IMPORTED_MODULE_0__/* .loadMicroApp */ .Z)(widgetConfig, {
    sandbox: {
      strictStyleIsolation: config ? !!config.shadowDom : false,
      experimentalStyleIsolation: config ? !!config.scopedCss : true
    }
  }); // TODO 增加是否保留数据

  var _app = __assign(__assign({}, app), {
    mount: function () {
      return new Promise(function (resolve, reject) {
        app.mount().then(function () {
          addWidget(name, _app); // TODO 验证是否是函数

          resolve && resolve();
        }, function () {
          reject();
        });
      });
    },
    unmount: function () {
      return new Promise(function (resolve, reject) {
        app.unmount().then(function () {
          deactiveWidget(name);
          (0,_proxy__WEBPACK_IMPORTED_MODULE_1__/* .setLocation */ .l6)(); // TODO 验证是否是函数

          resolve && resolve();
        }, function () {
          reject();
        });
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
 * @param topExhibitData  最外层展品数据（子孙插件都需要用）
 * @param config      配置数据
 * @param seq         一个节点内可以使用多个插件，但需要传递序号，
 * @param widget_entry    用于父插件中去本地调试子插件
 * TODO 如果需要支持不同插件下使用同一个插件，需要将作品id也加在运行时管理的插件id以实现全局唯一
 *      这里就有了一个问题，freelogApp.getSelfId() 与 作品id是不同的，
 *      造成问题：想在url上进行调试时 无法提前知道自身id。
 *      解决方案：1.做一个插件加载树，对于同级（同一个父插件，如果没有传递seq序号区分，直接报错不允许）
 *               2.提供浏览器插件， 打开测试节点时 可以将正在运行的插件加载树信息展示出来，以便开发者找到对应id
 *
 * @returns
 * 情况1.加载展品插件  topExhibitData只能为""或null值
 * 情况2.加载子插件  topPresenbleData必须传
 * 情况3.dev开发模式，
 */

function mountWidget(options) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }

  return __awaiter(this, void 0, void 0, function () {
    var widget, container, topExhibitData, config, seq, widget_entry, isTheme, that, configData, devData, commonData, entry, widgetId, fentry, once, api, widgetConfig, app, freelog_app;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          widget = options.widget, container = options.container, topExhibitData = options.topExhibitData, config = options.config, seq = options.seq, widget_entry = options.widget_entry;

          if (args === null || args === void 0 ? void 0 : args.length) {
            widget = options;
            container = args[0], topExhibitData = args[1], config = args[2], seq = args[3], widget_entry = args[4];
          }

          isTheme = typeof widget_entry === "boolean" ? widget_entry : false;
          that = this;
          configData = config; // TODO 为了安全，得验证是否是插件使用还是运行时使用mountWidget

          if (that === null || that === void 0 ? void 0 : that.name) {
            isTheme = false;
            _widgetConfigData__WEBPACK_IMPORTED_MODULE_2__/* .defaultWidgetConfigData.historyFB */ .T.historyFB = false;
          }

          isTheme && (widget_entry = "");
          config = __assign(__assign(__assign({}, _widgetConfigData__WEBPACK_IMPORTED_MODULE_2__/* .defaultWidgetConfigData */ .T), widget.versionInfo ? widget.versionInfo.exhibitProperty : {}), config);

          if (!isTheme) {
            config.historyFB = hbfOnlyToTheme ? false : config.historyFB;
          } else {
            hbfOnlyToTheme = config.hbfOnlyToTheme;
          }

          devData = window.freelogApp.devData; // 不是开发模式禁用

          if (devData.type === _dev__WEBPACK_IMPORTED_MODULE_3__/* .DEV_FALSE */ .Qq) widget_entry = "";
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
          widget_entry && console.warn("you are using widget entry " + widget_entry + " for widget-articleId: " + commonData.articleInfo.articleId); // @ts-ignore

          if (devData) {
            if (devData.type === _dev__WEBPACK_IMPORTED_MODULE_3__/* .DEV_TYPE_REPLACE */ .E8) {
              entry = devData.params[commonData.id] || "";
              console.log(entry, 22222);
            }

            if (devData.type === _dev__WEBPACK_IMPORTED_MODULE_3__/* .DEV_WIDGET */ .gt && !firstDev) {
              entry = devData.params.dev;
              firstDev = true;
            }
          } // @ts-ignore


          entry = widget_entry || entry;

          if (seq || seq === 0) {
            widgetId = "freelog-" + commonData.id + seq;
          }

          fentry = "";
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
          , window.freelogApp.getExhibitFileStream.bind(that || {})(commonData.exhibitId, {
            returnUrl: true
          })];

        case 3:
          fentry = _a.sent();
          fentry = fentry + "?subFilePath="; // '/package/'

          _a.label = 4;

        case 4:
          once = false;
          api = {};
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
            isUI: false,
            props: {
              registerApi: function (apis) {
                if (once) {
                  console.error("registerApi 只能在加在时使用一次");
                  return "只能使用一次";
                }

                api = apis;
                once = true;
              }
            }
          };
          addWidgetConfig(widgetId, widgetConfig);
          app = (0,_runtime__WEBPACK_IMPORTED_MODULE_0__/* .loadMicroApp */ .Z)(widgetConfig, {
            sandbox: {
              strictStyleIsolation: configData ? !!configData.shadowDom : false,
              experimentalStyleIsolation: configData ? !!configData.scopedCss : true
            }
          });
          freelog_app = __assign(__assign({}, app), {
            mount: function () {
              return new Promise(function (resolve, reject) {
                app.mount();
                app.mountPromise.then(function () {
                  addWidget(widgetId, freelog_app); // TODO 验证是否是函数

                  resolve && resolve();
                }, function () {
                  reject && reject();
                });
              });
            },
            getApi: function () {
              return api;
            },
            unmount: function (keepLocation) {
              return new Promise(function (resolve, reject) {
                app.unmount();
                app.unmountPromise.then(function () {
                  // 卸载后可以重新注册api
                  once = false;
                  api = {};
                  deactiveWidget(widgetId);
                  !keepLocation && (0,_proxy__WEBPACK_IMPORTED_MODULE_1__/* .setLocation */ .l6)(); // TODO 验证是否是函数

                  resolve && resolve();
                }, function () {
                  reject && reject();
                });
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

/***/ }),

/***/ 4876:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": function() { return /* binding */ defaultWidgetConfigData; }
/* harmony export */ });
// TODO 节点配置数据优于插件传递数据
// TODO 请求子依赖时需要配置数据
// 只有展品解决方案：请求子
var defaultWidgetConfigData = {
  historyFB: true,
  hbfOnlyToTheme: true // 总开关，默认只给主题，只有主题时才判断

};

/***/ }),

/***/ 7248:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8317);

var contract = {
  // exhibitId, result|info|articleInfo|fileStream
  getContractInfo: {
    url: "contracts/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
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
    url: "contracts/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/transitionRecords"),
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contract);

/***/ }),

/***/ 8229:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8317);

var host = location.host.slice(location.host.indexOf(".")).replace(".t.", ".");
var exhibit = {
  // placeHolder: nodeId exhibitId
  getExhibitDetail: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadResourceDetailInfo: "int",
      isLoadContract: "int"
    }
  },
  // placeHolder: nodeId exhibitId
  getTestExhibitDetail: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    method: "GET",
    dataModel: {
      isLoadPolicyInfo: "int",
      isLoadVersionProperty: "int",
      isTranslate: "int",
      isLoadContract: "int"
    }
  },
  getExhibitListById: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/list"),
    method: "GET",
    dataModel: {
      exhibitIds: "string",
      isLoadVersionProperty: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int"
    }
  },
  getTestExhibitListById: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test/list"),
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
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
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
      isLoadResourceDetailInfo: "int",
      isLoadPolicyInfo: "int",
      isTranslate: "int",
      tagQueryType: "int"
    }
  },
  getTestExhibitByPaging: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test"),
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
    url: "auths/exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
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
    url: "auths/exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string"
    }
  },
  // exhibitId  {result|info|fileStream}
  getExhibitById: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    baseURL: location.protocol + "//file".concat(host, "/"),
    method: "GET",
    dataModel: {
      parentNid: "string",
      subArticleIdOrName: "string",
      subArticleType: "string",
      subFilePath: "string" // 主题或插件的压缩包内部子作品,需要带相对路径

    }
  },
  // exhibitId  {result|info|fileStream}
  getTestExhibitById: {
    url: "exhibits/test/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    baseURL: location.protocol + "//file".concat(host, "/"),
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
    url: "auths/exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/batchAuth/results"),
    method: "GET",
    dataModel: {
      authType: "string",
      exhibitIds: "string" // 展品ID,多个逗号分隔

    }
  },
  // nodeId
  getTestExhibitAuthStatus: {
    url: "auths/exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test/batchAuth/results"),
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
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/articles/list"),
    method: "GET",
    dataModel: {
      articleNids: "string"
    }
  },
  getTestExhibitDepInfo: {
    url: "exhibits/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/test/").concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/articles/list"),
    method: "GET",
    dataModel: {
      articleNids: "string"
    }
  },
  getExhibitDepTree: {
    url: "presentables/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/dependencyTree"),
    method: "GET",
    dataModel: {
      maxDeep: "int",
      nid: "string",
      isContainRootNode: "boolean",
      version: "string" // 引用的发行版本号,默认使用锁定的最新版本

    }
  },
  getTestExhibitDepTree: {
    url: "testNodes/testResources/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/dependencyTree"),
    method: "GET"
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (exhibit);

/***/ }),

/***/ 4837:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8317);

var node = {
  getInfoById: {
    url: "nodes/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
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
    url: "storages/buckets/.UserNodeData/objects/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
    method: "PUT",
    dataModel: {
      removeFields: "",
      appendOrReplaceObject: ""
    }
  },
  // storages/buckets/.UserNodeData/objects/{objectIdOrNodeId}/customPick  GET
  getUserData: {
    url: "storages/buckets/.UserNodeData/objects/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/customPick"),
    method: "GET",
    dataModel: {
      fields: "string"
    }
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (node);

/***/ }),

/***/ 1718:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8317);

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
    url: "accounts/individualAccounts/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8),
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
    url: "users/".concat(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, "/resetPassword"),
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (user);

/***/ }),

/***/ 8317:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$8": function() { return /* binding */ placeHolder; },
/* harmony export */   "uN": function() { return /* binding */ baseConfig; }
/* harmony export */ });
/* unused harmony export baseUrl */
window.isTest = window.location.host.split('.')[1] === 't';
var placeHolder = 'urlPlaceHolder';
var baseURL = window.location.protocol + '//qi.freelog.com/v2/';

if (window.location.href.indexOf('testfreelog') > -1) {
  baseURL = window.location.protocol + '//qi.testfreelog.com/v2/';
}

window.baseURL = baseURL;
var baseUrl = (/* unused pure expression or super */ null && (baseURL));
var baseConfig = {
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000
}; // TODO 上传文件进度等需要配置

/***/ }),

/***/ 9812:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ frequest; }
/* harmony export */ });
/* unused harmony export nativeOpen */
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4688);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8317);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7537);
/* harmony import */ var _bridge_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9779);
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





var noAuthCode = [301, 302, 303, 304, 305, 306, 307];
var authCode = (/* unused pure expression or super */ null && ([200, 201, 202, 203]));
var errorAuthCode = [401, 402, 403, 501, 502, 503, 504, 505, 900, 901];
var nativeOpen = XMLHttpRequest.prototype.open;
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


  XMLHttpRequest.prototype.open = nativeOpen; // @ts-ignore

  var caller = this;
  var api = Object.assign({}, action); // type Api2 = Exclude<Api, 'url' | 'before' | 'after'>

  var url = api.url;

  if (url.indexOf(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8) > -1) {
    if (!urlData || !urlData.length) {
      console.error("urlData is required: " + urlData);
      return;
    }

    urlData.forEach(function (item) {
      url = url.replace(_base__WEBPACK_IMPORTED_MODULE_0__/* .placeHolder */ .$8, item + "");
    });
  } // filter data if there is dataModel


  if (api.dataModel && caller) {
    // TODO 需要用deepclone
    data = Object.assign({}, data);
    (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__/* .compareObjects */ .t)(api.dataModel, data, !!api.isDiff);
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

  var _api = Object.assign(_config, _base__WEBPACK_IMPORTED_MODULE_0__/* .baseConfig */ .uN, api);

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
    (0,_request__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(url, _api).then(function (response) {
      return __awaiter(_this, void 0, void 0, function () {
        var resData, exhibitId, exhibitName, articleNid, resourceType, subDep, exhibitProperty;
        return __generator(this, function (_a) {
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
              (0,_bridge_index__WEBPACK_IMPORTED_MODULE_3__/* .setPresentableQueue */ .a9)(exhibitId, __assign({
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
              resolve(__assign({
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
              resolve(__assign({
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

/***/ }),

/***/ 4688:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9669);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

axios__WEBPACK_IMPORTED_MODULE_0___default().interceptors.request.use(function (config) {
  return config;
}, function (error) {
  console.error(error); // for debug 11

  Promise.reject(error);
}); // response 拦截器

axios__WEBPACK_IMPORTED_MODULE_0___default().interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // TODO
  console.error(error); // for debug 11
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((axios__WEBPACK_IMPORTED_MODULE_0___default()));

/***/ }),

/***/ 7537:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ compareObjects; }
/* harmony export */ });
/* unused harmony export isMobile */
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

/***/ }),

/***/ 9638:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NativeCustomEvent = __webpack_require__.g.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}


/***/ }),

/***/ 5746:
/***/ (function(module) {

/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #3 - July 13th, 2017
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain]])
|*|	* docCookies.hasItem(name)
|*|	* docCookies.keys()
|*|
\*/

var docCookies = {
	getItem: function (sKey) {
		if (!sKey) { return null; }
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					/*
					Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
					version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
					the end parameter might not work as expected. A possible solution might be to convert the the
					relative time to an absolute time. For instance, replacing the previous line with:
					*/
					/*
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
					*/
					break;
				case String:
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	},
	removeItem: function (sKey, sPath, sDomain) {
		if (!this.hasItem(sKey)) { return false; }
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function (sKey) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		return aKeys;
	}
};

if ( true && typeof module.exports !== "undefined") {
	module.exports = docCookies;
}


/***/ }),

/***/ 5872:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6092);



/* Built-in method references that are verified to be native. */
var DataView = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_root_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, 'DataView');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataView);


/***/ }),

/***/ 3651:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _hashClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8767);
/* harmony import */ var _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9290);
/* harmony import */ var _hashGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9399);
/* harmony import */ var _hashHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2533);
/* harmony import */ var _hashSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);






/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
Hash.prototype['delete'] = _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z;
Hash.prototype.get = _hashGet_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;
Hash.prototype.has = _hashHas_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z;
Hash.prototype.set = _hashSet_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hash);


/***/ }),

/***/ 591:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6871);
/* harmony import */ var _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9594);
/* harmony import */ var _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1441);
/* harmony import */ var _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2190);
/* harmony import */ var _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3290);






/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
ListCache.prototype['delete'] = _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z;
ListCache.prototype.get = _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;
ListCache.prototype.has = _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z;
ListCache.prototype.set = _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListCache);


/***/ }),

/***/ 6183:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6092);



/* Built-in method references that are verified to be native. */
var Map = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_root_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, 'Map');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);


/***/ }),

/***/ 1062:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8146);
/* harmony import */ var _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3607);
/* harmony import */ var _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9363);
/* harmony import */ var _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8075);
/* harmony import */ var _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4910);






/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
MapCache.prototype['delete'] = _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z;
MapCache.prototype.get = _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;
MapCache.prototype.has = _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z;
MapCache.prototype.set = _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MapCache);


/***/ }),

/***/ 2778:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6092);



/* Built-in method references that are verified to be native. */
var Promise = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_root_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, 'Promise');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Promise);


/***/ }),

/***/ 3203:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6092);



/* Built-in method references that are verified to be native. */
var Set = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_root_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, 'Set');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Set);


/***/ }),

/***/ 277:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(591);
/* harmony import */ var _stackClear_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(457);
/* harmony import */ var _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7262);
/* harmony import */ var _stackGet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2347);
/* harmony import */ var _stackHas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5194);
/* harmony import */ var _stackSet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2340);







/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z;
Stack.prototype['delete'] = _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;
Stack.prototype.get = _stackGet_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z;
Stack.prototype.has = _stackHas_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z;
Stack.prototype.set = _stackSet_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Stack);


/***/ }),

/***/ 7685:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6092);


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Symbol */ .Z.Symbol;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Symbol);


/***/ }),

/***/ 7623:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6092);


/** Built-in value references. */
var Uint8Array = _root_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Uint8Array */ .Z.Uint8Array;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Uint8Array);


/***/ }),

/***/ 3840:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6092);



/* Built-in method references that are verified to be native. */
var WeakMap = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_root_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, 'WeakMap');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WeakMap);


/***/ }),

/***/ 8069:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (apply);


/***/ }),

/***/ 6579:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayEach);


/***/ }),

/***/ 8774:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayFilter);


/***/ }),

/***/ 3771:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseTimes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2889);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1438);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7771);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5763);
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6009);
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8314);







/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value),
      isArg = !isArr && (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value),
      isBuff = !isArr && !isArg && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value),
      isType = !isArr && !isArg && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? (0,_baseTimes_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayLikeKeys);


/***/ }),

/***/ 4073:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayMap);


/***/ }),

/***/ 8694:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayPush);


/***/ }),

/***/ 7709:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (arrayReduce);


/***/ }),

/***/ 3194:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (asciiWords);


/***/ }),

/***/ 3868:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4752);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9651);



/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !(0,_eq_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object[key], value)) ||
      (value === undefined && !(key in object))) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, key, value);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assignMergeValue);


/***/ }),

/***/ 2954:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4752);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9651);



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && (0,_eq_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(objValue, value)) ||
      (value === undefined && !(key in object))) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, key, value);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assignValue);


/***/ }),

/***/ 3900:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9651);


/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if ((0,_eq_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (assocIndexOf);


/***/ }),

/***/ 2364:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1899);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7179);



/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, (0,_keys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(source), object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssign);


/***/ }),

/***/ 5293:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1899);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9987);



/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(source), object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssignIn);


/***/ }),

/***/ 4752:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7904);


/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
    (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseAssignValue);


/***/ }),

/***/ 7376:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(277);
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(6579);
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(2954);
/* harmony import */ var _baseAssign_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2364);
/* harmony import */ var _baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5293);
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1050);
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7215);
/* harmony import */ var _copySymbols_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2260);
/* harmony import */ var _copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5451);
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(1808);
/* harmony import */ var _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(4403);
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6608);
/* harmony import */ var _initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5138);
/* harmony import */ var _initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(4575);
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6539);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7771);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5763);
/* harmony import */ var _isMap_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(6524);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);
/* harmony import */ var _isSet_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(3209);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(7179);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(9987);























/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value)) {
    return value;
  }
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value);
  if (isArr) {
    result = (0,_initCloneArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value);
    if (!isDeep) {
      return (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(value, result);
    }
  } else {
    var tag = (0,_getTag_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(value),
        isFunc = tag == funcTag || tag == genTag;

    if ((0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(value)) {
      return (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(value);
      if (!isDeep) {
        return isFlat
          ? (0,_copySymbolsIn_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(value, (0,_baseAssignIn_js__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(result, value))
          : (0,_copySymbols_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(value, (0,_baseAssign_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = (0,_initCloneByTag_js__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if ((0,_isSet_js__WEBPACK_IMPORTED_MODULE_14__/* ["default"] */ .Z)(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if ((0,_isMap_js__WEBPACK_IMPORTED_MODULE_15__/* ["default"] */ .Z)(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn_js__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .Z : _getAllKeys_js__WEBPACK_IMPORTED_MODULE_17__/* ["default"] */ .Z)
    : (isFlat ? _keysIn_js__WEBPACK_IMPORTED_MODULE_18__/* ["default"] */ .Z : _keys_js__WEBPACK_IMPORTED_MODULE_19__/* ["default"] */ .Z);

  var props = isArr ? undefined : keysFunc(value);
  (0,_arrayEach_js__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .Z)(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .Z)(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseClone);


/***/ }),

/***/ 4705:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);


/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseCreate);


/***/ }),

/***/ 1507:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2693);
/* harmony import */ var _createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4033);



/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = (0,_createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseEach);


/***/ }),

/***/ 9188:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8694);
/* harmony import */ var _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6253);



/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseFlatten);


/***/ }),

/***/ 3242:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8419);


/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = (0,_createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseFor);


/***/ }),

/***/ 2693:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3242);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7179);



/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, iteratee, _keys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseForOwn);


/***/ }),

/***/ 3327:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8694);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7771);



/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object) ? result : (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(result, symbolsFunc(object));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetAllKeys);


/***/ }),

/***/ 4492:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7685);
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9432);
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(699);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].toStringTag */ .Z.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value)
    : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseGetTag);


/***/ }),

/***/ 4160:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4492);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);



/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) == argsTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsArguments);


/***/ }),

/***/ 949:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6608);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);



/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) == mapTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsMap);


/***/ }),

/***/ 9573:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3234);
/* harmony import */ var _isMasked_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4133);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19);





/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) || (0,_isMasked_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value)) {
    return false;
  }
  var pattern = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value) ? reIsNative : reIsHostCtor;
  return pattern.test((0,_toSource_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(value));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsNative);


/***/ }),

/***/ 7926:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6608);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);



/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) && (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) == setTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsSet);


/***/ }),

/***/ 1502:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4492);
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1656);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);




/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) &&
    (0,_isLength_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value.length) && !!typedArrayTags[(0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value)];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseIsTypedArray);


/***/ }),

/***/ 8726:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2764);
/* harmony import */ var _nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7275);



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object)) {
    return (0,_nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseKeys);


/***/ }),

/***/ 7867:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2764);
/* harmony import */ var _nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6805);




/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object)) {
    return (0,_nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object);
  }
  var isProto = (0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseKeysIn);


/***/ }),

/***/ 6318:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(277);
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3868);
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3242);
/* harmony import */ var _baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7168);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7226);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9987);
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6277);








/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, function(srcValue, key) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);
    if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(srcValue)) {
      (0,_baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer((0,_safeGet_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(object, key, newValue);
    }
  }, _keysIn_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseMerge);


/***/ }),

/***/ 7168:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3868);
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1050);
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2701);
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7215);
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(6539);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1438);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7771);
/* harmony import */ var _isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(836);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5763);
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(3234);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(7226);
/* harmony import */ var _isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7514);
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8314);
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6277);
/* harmony import */ var _toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2518);
















/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, key),
      srcValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(srcValue),
        isBuff = !isArr && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(srcValue),
        isTyped = !isArr && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(objValue)) {
        newValue = objValue;
      }
      else if ((0,_isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z)(objValue)) {
        newValue = (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z)(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z)(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if ((0,_isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z)(srcValue) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(srcValue)) {
      newValue = objValue;
      if ((0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z)(objValue)) {
        newValue = (0,_toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(objValue);
      }
      else if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)(objValue) || (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z)(objValue)) {
        newValue = (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__/* ["default"] */ .Z)(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, key, newValue);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseMergeDeep);


/***/ }),

/***/ 3956:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (basePropertyOf);


/***/ }),

/***/ 9581:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9203);
/* harmony import */ var _overRest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5644);
/* harmony import */ var _setToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1229);




/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return (0,_setToString_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)((0,_overRest_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(func, start, _identity_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z), func + '');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseRest);


/***/ }),

/***/ 245:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2002);
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7904);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9203);




/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _identity_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z : function(func, string) {
  return (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(string),
    'writable': true
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseSetToString);


/***/ }),

/***/ 2889:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseTimes);


/***/ }),

/***/ 2845:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7685);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4073);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7771);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2714);





/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].prototype */ .Z.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value, baseToString) + '';
  }
  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseToString);


/***/ }),

/***/ 1162:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (baseUnary);


/***/ }),

/***/ 8882:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9203);


/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : _identity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (castFunction);


/***/ }),

/***/ 1884:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7623);


/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(result).set(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z(arrayBuffer));
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneArrayBuffer);


/***/ }),

/***/ 1050:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6092);


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Buffer */ .Z.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneBuffer);


/***/ }),

/***/ 7325:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1884);


/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneDataView);


/***/ }),

/***/ 9260:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneRegExp);


/***/ }),

/***/ 1477:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7685);


/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].prototype */ .Z.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneSymbol);


/***/ }),

/***/ 2701:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1884);


/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneTypedArray);


/***/ }),

/***/ 7215:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyArray);


/***/ }),

/***/ 1899:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2954);
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4752);



/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, key, newValue);
    } else {
      (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, key, newValue);
    }
  }
  return object;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copyObject);


/***/ }),

/***/ 2260:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1899);
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5695);



/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(source), object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copySymbols);


/***/ }),

/***/ 5451:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1899);
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7502);



/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(source, (0,_getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(source), object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (copySymbolsIn);


/***/ }),

/***/ 1819:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6092);


/** Used to detect overreaching core-js shims. */
var coreJsData = _root_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"]["__core-js_shared__"] */ .Z["__core-js_shared__"];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (coreJsData);


/***/ }),

/***/ 9268:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9581);
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(439);



/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAssigner);


/***/ }),

/***/ 4033:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(585);


/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBaseEach);


/***/ }),

/***/ 8419:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBaseFor);


/***/ }),

/***/ 9561:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayReduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7709);
/* harmony import */ var _deburr_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4327);
/* harmony import */ var _words_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3063);




/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return (0,_arrayReduce_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)((0,_words_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)((0,_deburr_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(string).replace(reApos, '')), callback, '');
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCompounder);


/***/ }),

/***/ 779:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _basePropertyOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3956);


/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = (0,_basePropertyOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(deburredLetters);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deburrLetter);


/***/ }),

/***/ 7904:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);


var defineProperty = (function() {
  try {
    var func = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defineProperty);


/***/ }),

/***/ 3413:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (freeGlobal);


/***/ }),

/***/ 1808:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3327);
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5695);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7179);




/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, _keys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAllKeys);


/***/ }),

/***/ 4403:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3327);
/* harmony import */ var _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7502);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9987);




/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, _keysIn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, _getSymbolsIn_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getAllKeysIn);


/***/ }),

/***/ 1022:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isKeyable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4919);


/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return (0,_isKeyable_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMapData);


/***/ }),

/***/ 9522:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9573);
/* harmony import */ var _getValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1856);



/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = (0,_getValue_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object, key);
  return (0,_baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) ? value : undefined;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getNative);


/***/ }),

/***/ 2513:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1851);


/** Built-in value references. */
var getPrototype = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Object.getPrototypeOf, Object);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getPrototype);


/***/ }),

/***/ 9432:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7685);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].toStringTag */ .Z.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRawTag);


/***/ }),

/***/ 5695:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8774);
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(532);



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return (0,_arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getSymbols);


/***/ }),

/***/ 7502:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8694);
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2513);
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5695);
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(532);





/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z : function(object) {
  var result = [];
  while (object) {
    (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(result, (0,_getSymbols_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object));
    object = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(object);
  }
  return result;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getSymbolsIn);


/***/ }),

/***/ 6608:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _DataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5872);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6183);
/* harmony import */ var _Promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2778);
/* harmony import */ var _Set_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3203);
/* harmony import */ var _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3840);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(4492);
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);








/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_DataView_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z),
    mapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_Map_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z),
    promiseCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_Promise_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z),
    setCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_Set_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z),
    weakMapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_WeakMap_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z && getTag(new _DataView_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z(new ArrayBuffer(1))) != dataViewTag) ||
    (_Map_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z && getTag(new _Map_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z) != mapTag) ||
    (_Promise_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z && getTag(_Promise_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"].resolve */ .Z.resolve()) != promiseTag) ||
    (_Set_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z && getTag(new _Set_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z) != setTag) ||
    (_WeakMap_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z && getTag(new _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z) != weakMapTag)) {
  getTag = function(value) {
    var result = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z)(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getTag);


/***/ }),

/***/ 1856:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getValue);


/***/ }),

/***/ 8734:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hasUnicodeWord);


/***/ }),

/***/ 8767:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? (0,_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(null) : {};
  this.size = 0;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashClear);


/***/ }),

/***/ 9290:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashDelete);


/***/ }),

/***/ 9399:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashGet);


/***/ }),

/***/ 2533:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashHas);


/***/ }),

/***/ 5:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (hashSet);


/***/ }),

/***/ 5138:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneArray);


/***/ }),

/***/ 4575:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1884);
/* harmony import */ var _cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7325);
/* harmony import */ var _cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9260);
/* harmony import */ var _cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1477);
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2701);






/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return (0,_cloneDataView_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return (0,_cloneRegExp_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return (0,_cloneSymbol_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z)(object);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneByTag);


/***/ }),

/***/ 6539:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4705);
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2513);
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2764);




/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object))
    ? (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)((0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object))
    : {};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (initCloneObject);


/***/ }),

/***/ 6253:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7685);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1438);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7771);




/** Built-in value references. */
var spreadableSymbol = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].isConcatSpreadable */ .Z.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFlattenable);


/***/ }),

/***/ 6009:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isIndex);


/***/ }),

/***/ 439:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9651);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(585);
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6009);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);





/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? ((0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object) && (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return (0,_eq_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(object[index], value);
  }
  return false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isIterateeCall);


/***/ }),

/***/ 4919:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isKeyable);


/***/ }),

/***/ 4133:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1819);


/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].keys */ .Z.keys && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].keys.IE_PROTO */ .Z.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isMasked);


/***/ }),

/***/ 2764:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isPrototype);


/***/ }),

/***/ 6871:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheClear);


/***/ }),

/***/ 9594:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3900);


/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheDelete);


/***/ }),

/***/ 1441:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3900);


/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(data, key);

  return index < 0 ? undefined : data[index][1];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheGet);


/***/ }),

/***/ 2190:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3900);


/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this.__data__, key) > -1;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheHas);


/***/ }),

/***/ 3290:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3900);


/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (listCacheSet);


/***/ }),

/***/ 8146:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _Hash_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3651);
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(591);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6183);




/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z,
    'map': new (_Map_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z || _ListCache_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z),
    'string': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheClear);


/***/ }),

/***/ 3607:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1022);


/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheDelete);


/***/ }),

/***/ 9363:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1022);


/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, key).get(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheGet);


/***/ }),

/***/ 8075:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1022);


/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, key).has(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheHas);


/***/ }),

/***/ 4910:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1022);


/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mapCacheSet);


/***/ }),

/***/ 28:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9522);


/* Built-in method references that are verified to be native. */
var nativeCreate = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Object, 'create');

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeCreate);


/***/ }),

/***/ 7275:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1851);


/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(Object.keys, Object);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeKeys);


/***/ }),

/***/ 6805:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nativeKeysIn);


/***/ }),

/***/ 8351:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3413);


/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].process */ .Z.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (nodeUtil);


/***/ }),

/***/ 699:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (objectToString);


/***/ }),

/***/ 1851:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (overArg);


/***/ }),

/***/ 5644:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _apply_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8069);


/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return (0,_apply_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(func, this, otherArgs);
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (overRest);


/***/ }),

/***/ 6092:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3413);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z || freeSelf || Function('return this')();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (root);


/***/ }),

/***/ 6277:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (safeGet);


/***/ }),

/***/ 1229:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(245);
/* harmony import */ var _shortOut_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7581);



/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = (0,_shortOut_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(_baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setToString);


/***/ }),

/***/ 7581:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shortOut);


/***/ }),

/***/ 457:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(591);


/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z;
  this.size = 0;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackClear);


/***/ }),

/***/ 7262:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackDelete);


/***/ }),

/***/ 2347:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackGet);


/***/ }),

/***/ 5194:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackHas);


/***/ }),

/***/ 2340:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(591);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6183);
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1062);




/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
    var pairs = data.__data__;
    if (!_Map_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stackSet);


/***/ }),

/***/ 19:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toSource);


/***/ }),

/***/ 2434:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (unicodeWords);


/***/ }),

/***/ 8652:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseClone_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7376);


/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return (0,_baseClone_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloneDeep);


/***/ }),

/***/ 7895:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8694);
/* harmony import */ var _baseFlatten_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9188);
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7215);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7771);





/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(array) ? (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(array) : [array], (0,_baseFlatten_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(args, 1));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (concat);


/***/ }),

/***/ 2002:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constant);


/***/ }),

/***/ 4327:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _deburrLetter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(779);
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7338);



/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = (0,_toString_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(string);
  return string && string.replace(reLatin, _deburrLetter_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z).replace(reComboMark, '');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (deburr);


/***/ }),

/***/ 9651:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (eq);


/***/ }),

/***/ 870:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6579);
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1507);
/* harmony import */ var _castFunction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8882);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7771);





/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(collection) ? _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z : _baseEach_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;
  return func(collection, (0,_castFunction_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(iteratee));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forEach);


/***/ }),

/***/ 9203:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (identity);


/***/ }),

/***/ 1438:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4160);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8533);



/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = (0,_baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(function() { return arguments; }()) ? _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z : function(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArguments);


/***/ }),

/***/ 7771:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArray);


/***/ }),

/***/ 585:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3234);
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1656);



/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value.length) && !(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArrayLike);


/***/ }),

/***/ 836:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(585);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);



/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) && (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isArrayLikeObject);


/***/ }),

/***/ 5763:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6092);
/* harmony import */ var _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7979);



/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Buffer */ .Z.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isBuffer);


/***/ }),

/***/ 3234:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4492);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7226);



/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isFunction);


/***/ }),

/***/ 1656:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isLength);


/***/ }),

/***/ 6524:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(949);
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1162);
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8351);




/* Node.js helper references. */
var nodeIsMap = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].isMap */ .Z.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(nodeIsMap) : _baseIsMap_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isMap);


/***/ }),

/***/ 7226:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ 8533:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObjectLike);


/***/ }),

/***/ 7514:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4492);
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2513);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) || (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) != objectTag) {
    return false;
  }
  var proto = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isPlainObject);


/***/ }),

/***/ 3209:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7926);
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1162);
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8351);




/* Node.js helper references. */
var nodeIsSet = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].isSet */ .Z.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(nodeIsSet) : _baseIsSet_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSet);


/***/ }),

/***/ 2714:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4492);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8533);



/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    ((0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value) == symbolTag);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSymbol);


/***/ }),

/***/ 8314:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1502);
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1162);
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8351);




/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"].isTypedArray */ .Z.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(nodeIsTypedArray) : _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isTypedArray);


/***/ }),

/***/ 7179:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3771);
/* harmony import */ var _baseKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8726);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(585);




/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object) : (0,_baseKeys_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (keys);


/***/ }),

/***/ 9987:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3771);
/* harmony import */ var _baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7867);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(585);




/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, true) : (0,_baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(object);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (keysIn);


/***/ }),

/***/ 9177:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseMerge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6318);
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9268);



/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = (0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(function(object, source, srcIndex, customizer) {
  (0,_baseMerge_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(object, source, srcIndex, customizer);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergeWith);


/***/ }),

/***/ 2054:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (noop);


/***/ }),

/***/ 6865:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _createCompounder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9561);


/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = (0,_createCompounder_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (snakeCase);


/***/ }),

/***/ 532:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stubArray);


/***/ }),

/***/ 7979:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stubFalse);


/***/ }),

/***/ 2518:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1899);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9987);



/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toPlainObject);


/***/ }),

/***/ 7338:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _baseToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2845);


/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : (0,_baseToString_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(value);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toString);


/***/ }),

/***/ 3063:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
/* harmony import */ var _asciiWords_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3194);
/* harmony import */ var _hasUnicodeWord_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8734);
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7338);
/* harmony import */ var _unicodeWords_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2434);





/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = (0,_toString_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return (0,_hasUnicodeWord_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(string) ? (0,_unicodeWords_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(string) : (0,_asciiWords_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(string);
  }
  return string.match(pattern) || [];
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (words);


/***/ }),

/***/ 8593:
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/* harmony import */ var _platform_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9572);

window.global = window;
(0,_platform_index__WEBPACK_IMPORTED_MODULE_0__/* .run */ .K)();
}();
/******/ })()
;