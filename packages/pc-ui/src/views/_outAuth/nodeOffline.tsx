import nodeOffline from "../../assets/image/nodeOffline.png";
import { freelogAuth } from "freelog-runtime-core";
import FI18n from "@/I18nNext";

export default function OutOf() {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36 "
      style={{
        color: "#666666",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <div className="flex-1"></div>

      <div className="w-360">
        <img src={nodeOffline} alt="" className="w-100x" />
      </div>
      <div
        className="text-breakAll  fs-30 fw-regular lh-36 mt-10 mb-80"
        style={{
          color: "#666666",
        }} 
      >
        {freelogAuth.nodeInfo.nodeSuspendInfo || FI18n.i18nNext.t('nodemgnt_nodesetting_changenotice_default') }
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
