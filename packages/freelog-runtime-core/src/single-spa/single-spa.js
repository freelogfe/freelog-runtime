
import devtools from "./devtools/devtools";
import { isInBrowser } from "./utils/runtime-environment.js";
export { ensureJQuerySupport }
from "./jquery-support.js";
export {
    setBootstrapMaxTime,
    setMountMaxTime,
    setUnmountMaxTime,
    setUnloadMaxTime,
}
from "./applications/timeouts.js";
window.__DEV__ = false;

export {
    addErrorHandler,
    removeErrorHandler,
}
from "./applications/app-errors.js";
export { mountRootParcel }
from "./parcels/mount-parcel.js";

export {
    NOT_LOADED,
    LOADING_SOURCE_CODE,
    NOT_BOOTSTRAPPED,
    BOOTSTRAPPING,
    NOT_MOUNTED,
    MOUNTING,
    UPDATING,
    LOAD_ERROR,
    MOUNTED,
    UNMOUNTING,
    SKIP_BECAUSE_BROKEN,
}
from "./applications/app.helpers.js";


if (isInBrowser && window.__SINGLE_SPA_DEVTOOLS__) {
    window.__SINGLE_SPA_DEVTOOLS__.exposedMethods = devtools;
}