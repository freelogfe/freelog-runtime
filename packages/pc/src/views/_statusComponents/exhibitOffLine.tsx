/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
interface exhibitOffLineProps {
  length: number;
  children?: any;
}
export default function ExhibitOffLine(props: exhibitOffLineProps) {
  return (
    <div
      className="flex-column-center w-100x "
      css={css`height: ${props.length > 1 ? '531px' : '441px'} `}
    >
      <i
        className="iconfont"
        css={css`
          color: rgb(208 208 209 / 70%);
          font-size: 128px;
        `}
      >
        &#xe62f;
      </i>
      <div
        css={css`
          font-size: 30px;
          margin-top: 30px;
          font-weight: 400;
          color: #666666;
          line-height: 42px;
        `}
      >
        展品已下线，无法签约
      </div>
    </div>
  );
}
