import { getCurrentUser, getUserInfo, setUserInfo } from './utils'
import {
    reisterUI,
    eventMap,
    failedMap,
    endEvent,
    updateLock,
    updateEvent,
} from '../../bridge/index'
import {
    loginCallback
} from './event'
import { SUCCESS, FAILED, USER_CANCEL } from '../../bridge/event'

export const freelogAuth = {
    reisterUI,
    eventMap,
    failedMap,
    endEvent,
    updateLock,
    updateEvent,
    resultType: {
        SUCCESS, FAILED, USER_CANCEL
    },
    loginCallback,  
    setUserInfo,
    getCurrentUser,
    getUserInfo
}