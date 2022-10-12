import { css } from "astroturf";

import { Button, Space, Toast } from 'antd-mobile'
import copy from 'copy-to-clipboard'; 

interface OutOfProps {
  outData: any;
  children?: any;
}
export default function OutOf({ outData }: OutOfProps) {

  return (
    <div
      className="flex-column align-center mx-20"
      css={css`
        width: calc(100% - 40px);
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
      <div>
        <i
          className="iconfont"
          css={css`
            color: red;
            font-size: 100px !important;
          `}
        >
          &#xe62f;
        </i>
      </div>
      <div
        css={css`
          font-size: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 36px;
          margin-top: 34px;
        `}
      >
        你的账号已经被冻结
      </div>
      <div
        css={css`
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-top: 80px;
        `}
      >
        经核实，你的账号{outData.username}，严重违反平台规范&nbsp;<br/>
        <a
          className="link cur-pointer shrink-0"
          target="_blank"
          rel="noreferrer"
          href="https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2"
        >
          查看服务协议
        </a>{" "}
        ，涉嫌
        {outData.userDetail.reason}，已经被冻结。
      </div>
      <div css={css`
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-top: 20px;
        `}>如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。</div>
      <div css={css`
          font-size: 14px;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          margin-top: 20px;
        `}>联系邮箱：service@freelog.com <span className="link cur-pointer" onClick={()=>{
          copy('service@freelog.com');
          Toast.show({
            icon: 'success',
            content: '复制成功！',
          })
        }}>复制</span></div>
      <div className="flex-1"></div>
    </div>
  );
}
