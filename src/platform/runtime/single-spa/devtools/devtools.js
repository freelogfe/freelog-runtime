import { NOT_LOADED } from "../applications/app.helpers";
import { toLoadPromise } from "../lifecycles/load";
import { toBootstrapPromise } from "../lifecycles/bootstrap";

export default {
    NOT_LOADED,
    toLoadPromise,
    toBootstrapPromise,
};