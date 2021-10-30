import {
    mountWidget, autoMoutSubWdigets
} from './widget'
import { getSelfConfig, setUserData, getUserData, getSubDep, getSelfId, getStaticPath, getCurrentUser, setViewport, callLogin } from './utils'
import { callAuth, addAuth, onLogin } from '../../bridge/index'
import { freelogAuth } from './freelogAuth'
import {
    getPresentables,
    getPresentablesPaging,
    getPresentablesSearch,
    getInfoById,
    getInfoByName,
    getResultById,
    getResultByName,
    getFileStreamById,
    getFileStreamByName,
    getSubInfoById,
    getSubInfoByName,
    getSubResultById,
    getSubResultByName,
    getSubFileStreamById,
    getSubFileStreamByName,
    getResourceInfoById,
    getResourceInfoByName,
    getSubResourceInfoById,
    getSubResourceInfoByName,
    getResourceInfoByVersion,
    getPresentableDetailById
} from './api'
let devData = ''
export const freelogApp = {
    mountWidget,
    getPresentables,
    getPresentablesPaging,
    getPresentablesSearch,
    getInfoById,
    getInfoByName,
    getResultById,
    getResultByName,
    getFileStreamById,
    getFileStreamByName,
    getSubInfoById,
    getSubInfoByName,
    getSubResultById,
    getSubResultByName,
    getSubFileStreamById,
    getSubFileStreamByName,
    getResourceInfoById,
    getResourceInfoByName,
    getSubResourceInfoById,
    getSubResourceInfoByName,
    devData,
    getStaticPath,
    autoMoutSubWdigets,
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
    getResourceInfoByVersion,
    getPresentableDetailById,
    getSelfConfig,
    freelogAuth
}