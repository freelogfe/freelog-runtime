// 需要导出 user.getCurrent   node.putUserData  node.getUserData  三个

import {
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitInfoByAuth,
  getExhibitDepInfo,
  getExhibitDepTree,
  getSignStatistics,
  getExhibitAvailalbe,
  pushMessage4Task,
} from "./api";
export { init } from "./api";
export const freelogApp: any = {
  pushMessage4Task,
  getExhibitListById,
  getExhibitListByPaging,
  getExhibitInfo,
  getExhibitSignCount,
  getExhibitAuthStatus,
  getExhibitFileStream,
  getExhibitDepFileStream,
  getExhibitInfoByAuth,
  getExhibitDepInfo,
  getExhibitDepTree,
  getSignStatistics,
  getExhibitAvailalbe,
};
