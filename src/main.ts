import {run} from './platform/index'
window.isTest =  window.location.host.split('.')[1] === 't';

window.global = window
run()