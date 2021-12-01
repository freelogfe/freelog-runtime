import { getCurrentUser, getUserInfo, setUserInfo } from './utils'
import {
    reisterUI,
    eventMap,
    failedMap,
    endEvent,
    updateLock,
    updateEvent,
    lowerUI,
    upperUI,
    loginCallback,
    reload
} from '../../bridge/index'
 
import { SUCCESS, FAILED, USER_CANCEL } from '../../bridge/event'
/**
 * contract.getContracts
 * contract.contracts
 * exhibit.getPresentableDetail
 * contract.getTransitionRecords
 * 
 * user.getAccount
 * event.pay
 * transaction.getRecord
 * 
 * 授权UI分离后如何更合理安排责任的分析
 * 授权UI责任：使用work表示一个从插件通过运行时调UI再到运行时再到插件的一个过程
 *     1.负责获取展品授权的操作过程（单个work和整体work）
 *     2.负责登录、登出、注册、忘记登录密码、忘记支付密码（登录work，登录work）
 *     3.针对1、2中的可定义为结束的work状态传递给运行时
 * 运行时责任：
 *     1.提供给插件调取授权UI的Api 
 *     2.当work结束时，执行插件对应订阅的回调函数
 */
export const freelogAuth = {
    reisterUI,
    eventMap,
    failedMap,
    endEvent,
    updateLock,
    updateEvent,
    lowerUI,
    upperUI,
    resultType: {
        SUCCESS, FAILED, USER_CANCEL
    },
    loginCallback,  
    setUserInfo,
    getCurrentUser,
    getUserInfo,
    reload
}