/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface exhibitHeaderProps {
  currentExhibit: any;
  children?: any;
}
export default function ExhibitHeader({ currentExhibit }: exhibitHeaderProps) {
  return (
    <div
      className="flex-column py-10 px-20 brs-10 mt-15"
      css={css`
        background: ${currentExhibit.availableData.authCode === 403
          ? "#FDEBEC"
          : "rgba(0, 0, 0, 0.02)"};
      `}
    >
      <div className="flex-column ">
        {currentExhibit.availableData.authCode === 403 ? (
          <div className="flex-row align-center mb-9">
            <i
              className="iconfont"
              css={css`
                color: red;
                font-size: 16px !important;
              `}
            >
              &#xe62f;
            </i>
            <span
              className="ml-5 "
              css={css`
                font-size: 12px;
                font-weight: 400;
                color: #ee4040;
              `}
            >
              此展品违规，授权相关操作已被禁用
            </span>
          </div>
        ) : null}
        <div
          className="text-ellipsis lh-20 fs-14 "
          css={css`
            font-weight: 600;
            color: #222222;
          `}
          title={currentExhibit.exhibitName}
        >
          {currentExhibit.exhibitName}
        </div>
      </div>

      {currentExhibit.availableData.authCode ===
      403 ? null : //   className="iconfont" // <span
      //   css={css`
      //     color: red;
      //     font-size: 12px;
      //     font-weight: 400;
      //     color: #ee4040;
      //     line-height: 18px;
      //   `}
      // >
      //   已封禁
      // </span>
      !currentExhibit.contracts.length ? null : (
        <div className="flex-row pt-10">
          {currentExhibit.contracts.map((contract: any, index: number) => {
            return (
              <div
                className={"flex-row align-center mr-5"}
                css={css`
                  padding: 3px 5px;
                  height: 24px;
                  background: #e9f2ff;
                  border-radius: 2px;
                  border: 1px solid #aed0ff;
                `}
                key={index}
              >
                <div
                  css={css`
                    font-size: 12px;
                    font-weight: 400;
                    color: #2784ff;
                    line-height: 18px;
                  `}
                >
                  {contract.contractName}
                </div>
                <div
                  css={css`
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                  `}
                  className={
                    " ml-6 " +
                    (contract.authStatus === 128
                      ? "bg-auth-none"
                      : !window.isTest && contract.authStatus === 1
                      ? "bg-auth"
                      : "bg-auth-none")
                  }
                ></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
