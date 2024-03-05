
import nodeOffline from "../../assets/image/nodeOffline.png";
import { freelogApp } from "@/freelog/structure/freelogApp";
 

export default function NodeOffline() {
  return (
    <div
      className="flex-column align-center w-100x h-100x fs-30 fw-regular lh-36 text-align-center"
      style={{
        background: "#ffffff",
        color: "#666666",
      }}
    >
      <div className="flex-1"></div>

      <div className="w-280">
        <img src={nodeOffline} alt="" className="w-100x" />
      </div>
      <div
        className="text-breakAll fs-18 fw-regular lh-36 mt-10 mb-80 "
        style={{
          color: "#666666",
        }}
      >
        {freelogApp.nodeInfo.nodeSuspendInfo || "筹备中，敬请期待…"}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
