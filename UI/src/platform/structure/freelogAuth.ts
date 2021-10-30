import { getSelfConfig, setUserData, getUserData, getSubDep, getSelfId, getStaticPath, getCurrentUser, setViewport, callLogin } from './utils'
import { onLogin } from './event'
import { callAuth, addAuth } from '../../bridge/index'
export const freelogAuth = {
    getStaticPath,
    getSubDep,
    getSelfId,
    callAuth,
    addAuth,
    onLogin,
    callLogin,
    getCurrentUser,
    setViewport, 
    setUserData, 
    getUserData,
    getSelfConfig,
    resultType: {
        
    }
}