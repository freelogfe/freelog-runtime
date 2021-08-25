import {
    mountWidget, autoMoutSubWdigets
} from './widget'
import { getSubDep,  getSelfId, getStaticPath, getCurrentUser, setViewport} from './utils'
import { onLogin } from './event'
import {callAuth, addAuth} from '../../bridge/index'
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
    getSubResourceInfoByName
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
    getCurrentUser,
    setViewport
}