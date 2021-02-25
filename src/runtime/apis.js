import _typeof from "@babel/runtime/helpers/esm/typeof";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _noop from "lodash/noop";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { __awaiter, __rest } from "tslib";
import { mountRootParcel } from './single-spa/single-spa';
import { loadApp } from './loader';
import { getContainer, getXPathForElement } from './utils';

export var frameworkConfiguration = {};

var appConfigPromiseGetterMap = new Map();
export function loadMicroApp(app, configuration, lifeCycles) {
    var _this3 = this;

    var props = app.props,
        name = app.name;

    var getContainerXpath = function getContainerXpath(container) {
        var containerElement = getContainer(container);

        if (containerElement) {
            return getXPathForElement(containerElement, document);
        }

        return undefined;
    };

    var wrapParcelConfigForRemount = function wrapParcelConfigForRemount(config) {
        return Object.assign(Object.assign({}, config), {
            // empty bootstrap hook which should not run twice while it calling from cached micro app
            bootstrap: function bootstrap() {
                return Promise.resolve();
            }
        });
    };
    /**
     * using name + container xpath as the micro app instance id,
     * it means if you rendering a micro app to a dom which have been rendered before,
     * the micro app would not load and evaluate its lifecycles again
     */


    var memorizedLoadingFn = function memorizedLoadingFn() {
        return __awaiter(_this3, void 0, void 0, /*#__PURE__*/ _regeneratorRuntime.mark(function _callee4() {
            var userConfiguration, $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, xpath, _parcelConfigGetterPromise, parcelConfigObjectGetterPromise, _xpath;

            return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            userConfiguration = configuration !== null && configuration !== void 0 ? configuration : Object.assign(Object.assign({}, frameworkConfiguration), {
                                singular: false
                            });
                            $$cacheLifecycleByAppName = userConfiguration.$$cacheLifecycleByAppName;
                            container = 'container' in app ? app.container : undefined;

                            if (!container) {
                                _context4.next = 23;
                                break;
                            }

                            if (!$$cacheLifecycleByAppName) {
                                _context4.next = 13;
                                break;
                            }

                            parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);

                            if (!parcelConfigGetterPromise) {
                                _context4.next = 13;
                                break;
                            }

                            _context4.t0 = wrapParcelConfigForRemount;
                            _context4.next = 10;
                            return parcelConfigGetterPromise;

                        case 10:
                            _context4.t1 = _context4.sent;
                            _context4.t2 = (0, _context4.t1)(container);
                            return _context4.abrupt("return", (0, _context4.t0)(_context4.t2));

                        case 13:
                            xpath = getContainerXpath(container);

                            if (!xpath) {
                                _context4.next = 23;
                                break;
                            }

                            _parcelConfigGetterPromise = appConfigPromiseGetterMap.get("".concat(name, "-").concat(xpath));

                            if (!_parcelConfigGetterPromise) {
                                _context4.next = 23;
                                break;
                            }

                            _context4.t3 = wrapParcelConfigForRemount;
                            _context4.next = 20;
                            return _parcelConfigGetterPromise;

                        case 20:
                            _context4.t4 = _context4.sent;
                            _context4.t5 = (0, _context4.t4)(container);
                            return _context4.abrupt("return", (0, _context4.t3)(_context4.t5));

                        case 23:
                            parcelConfigObjectGetterPromise = loadApp(app, userConfiguration, lifeCycles);

                            if (container) {
                                if ($$cacheLifecycleByAppName) {
                                    appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
                                } else {
                                    _xpath = getContainerXpath(container);
                                    if (_xpath) appConfigPromiseGetterMap.set("".concat(name, "-").concat(_xpath), parcelConfigObjectGetterPromise);
                                }
                            }

                            _context4.next = 27;
                            return parcelConfigObjectGetterPromise;

                        case 27:
                            _context4.t6 = _context4.sent;
                            return _context4.abrupt("return", (0, _context4.t6)(container));

                        case 29:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4);
        }));
    };

    return mountRootParcel(memorizedLoadingFn, Object.assign({
        domElement: document.createElement('div')
    }, props));
}