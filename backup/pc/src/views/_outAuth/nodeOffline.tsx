/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import nodeOffline from "../../assets/image/nodeOffline.png";
//@ts-ignore
const props = window.$wujie?.props;
interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {
  return (
    <div
      className="flex-column align-center"
      css={css`
        width: 100%;
        height: 100%;
        font-size: 30px;
        font-weight: 400;
        color: #666666;
        line-height: 36px;
        text-align: center;
        background: #ffffff;
      `}
    >
      <div className="flex-1"></div>

      <div className="w-360">
        <img src={nodeOffline} alt="" className="w-100x" />
      </div>
      <div
        className="text-breakAll"
        css={css`
          font-size: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 36px;
          margin-top: 10px;
          margin-bottom: 80px;
        `}
      >
        {props.freelogApp.nodeInfo.nodeSuspendInfo || "筹备中，敬请期待…"}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}