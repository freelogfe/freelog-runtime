import { css } from "astroturf";

interface exhibitHeaderProps {
  currentExhibit: any;
  closeCurrent: any;
  events: any;
  children?: any;
}
export default function ExhibitHeader({
  currentExhibit,
  closeCurrent,
  events,
}: exhibitHeaderProps) {
  return (
    <div className="flex-column justify-center bb-1">
      <div className="flex-column-center mt-20 fs-16 fc-main fw-bold">签约</div>
      <div
        className="p-absolute fs-16 mt-20 mr-15 rt-0 fc-blue cur-pointer"
        onClick={() => closeCurrent()}
      >
        {events.length === 1 ? "退出" : "关闭"}
      </div>

      <div className="flex-column-center mt-20 mb-10 fs-20 fc-main fw-bold w-100x">
        <div className="flex-row align-center w-100x px-10 justify-center">
          <div className="flex-1"></div>
          {/* <i
            className="iconfont"
            css={css`
              color: red;
              font-size: 16px;
            `}
          >
            &#xe62f;
          </i> */}
          <span className="text-ellipsis ml-5 ">
            {currentExhibit.exhibitName}
          </span>
          <div className="flex-1"></div>
        </div>
      </div>

      {currentExhibit.isTheme ? (
        <>
          <div
            css={css`
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 20px;
            `}
            className="flex-column-center"
          >
            当前节点主题未开放授权，
          </div>
          <div
            css={css`
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 20px;
            `}
            className="mb-20 flex-column-center"
          >
            {currentExhibit &&
            currentExhibit.contracts &&
            currentExhibit.contracts.length
              ? "继续浏览请获取授权"
              : "继续浏览请选择策略签约并获取授权"}
          </div>
        </>
      ) : null}
      {currentExhibit.availableData.authCode ===
      403 ? null : // <div className="flex-column-center">
      //   <span
      //     className="iconfont"
      //     css={css`
      //       color: red;
      //       font-size: 16px;
      //       font-weight: 400;
      //       color: #ee4040;
      //       line-height: 18px;
      //     `}
      //   >
      //     已封禁
      //   </span>
      // </div>
      !currentExhibit.contracts.length ? null : (
        <div className="flex-row justify-center mb-15">
          {currentExhibit.contracts.map((contract: any, index: number) => {
            return (
              <div
                css={css`
                  padding: 2px 5px;
                  height: 24px;
                  background: #e9f2ff;
                  border-radius: 2px;
                  border: 1px solid #aed0ff;
                `}
                className={"flex-row align-center mr-5"}
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
                    "ml-6 " +
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
