import { css } from "astroturf";
import { Dialog, Popup } from "antd-mobile"; // Toast, Button

interface exhibitListProps {
  currentExhibit: any;
  events: any;
  userCancel: any;
  setCurrentExhibit: any;
  isListVisible: boolean;
  setIsListVisible: any;
  children?: any;
}
export default function exhibitList({
  currentExhibit,
  events,
  setIsListVisible,
  setCurrentExhibit,
  userCancel,
  isListVisible,
}: exhibitListProps) {
  return (
    <Popup
      visible={isListVisible}
      position="left"
      bodyClassName="exhibit-list  h-100x"
      onMaskClick={() => {
        setIsListVisible(!isListVisible);
      }}
      css={css`
        .adm-popup-body {
          width: 335px !important;
          height: 100%;
          border-radius: 0px 10px 10px 0px;
        }
      `}
    >
      <div
        css={css`
          border-bottom: 1px solid #e4e7eb;
        `}
        className="flex-row space-between px-15 py-20"
      >
        <div
          css={css`
            font-size: 16px;
            font-weight: 600;
            color: #222222;
          `}
        >
          展品列表
        </div>
        <div
          css={css`
            font-size: 16px;
            font-weight: 400;
            color: #2784ff;
          `}
          onClick={() => {
            setIsListVisible(!isListVisible);
            // Dialog.confirm({
            //   content: "当前还有展品未获得授权，确定退出？",
            //   onConfirm: async () => {
            //     userCancel();
            //   },
            // });
          }}
        >
          收起
        </div>
      </div>
      {events.length
        ? events.map((item: any, index: number) => {
            return (
              <div
                css={css`
                  padding: 0 15px;
                  ${currentExhibit &&
                  currentExhibit.exhibitId === item.exhibitId
                    ? css``
                    : css``}
                `}
                key={item}
              >
                <div
                  key={index}
                  onClick={() => {
                    setIsListVisible(false);
                    setCurrentExhibit(item);
                  }}
                  css={css`
                    border-bottom: 1px solid #e4e7eb;
                  `}
                  className={" py-15 flex-row space-between algin-center"}
                >
                  <div className="flex-1 flex-column over-h">
                    <div
                      css={css`
                        line-height: 100%;
                        font-size: 16px;
                        font-weight: 600;
                        color: #222222;
                      `}
                      className=" text-ellipsis flex-1 flex-row align-center"
                      title={item.exhibitName}
                    >
                      {item.availableData.authCode === 403 ? (
                        <i
                          className="iconfont ml-5"
                          css={css`
                            color: red;
                            font-size: 16px;
                          `}
                        >
                          &#xe62f;
                        </i>
                      ) : null}
                      <span className="text-ellipsis ml-5">
                        {item.exhibitName}
                      </span>
                    </div>
                    {!item.contracts.length ? (
                      <span
                        css={css`
                          padding-top: 10px;
                          font-size: 14px;
                          font-weight: 600;
                          color: #999999;
                          line-height: 20px;
                        `}
                      >
                        未签约
                      </span>
                    ) : item.availableData.authCode === 403 ? (
                      <span
                        className="iconfont mt-5"
                        css={css`
                          color: red;
                          font-size: 12px;
                          font-weight: 400;
                          color: #ee4040;
                          line-height: 18px;
                        `}
                      >
                        已封禁
                      </span>
                    ) : (
                      <div className="flex-row pt-10">
                        {item.contracts.map((contract: any, index: number) => {
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
                                  " ml-6 " +
                                  (contract.authStatus === 128
                                    ? "bg-auth-none"
                                    : !window.isTest &&
                                      contract.authStatus === 1
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

                  <div
                    className="shrink-0 flex-column-center pl-10 "
                    css={css`
                      color: #666666;
                    `}
                  >
                    <i className="iconfont fs-14">&#xe65b;</i>
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </Popup>
  );
}
