
import {  Popup } from "antd-mobile"; // Toast, Button

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
  events,
  setIsListVisible,
  setCurrentExhibit,
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
      // css={css`
      //   .adm-popup-body {
      //     width: 335px !important;
      //     height: 100%;
      //     border-radius: 0px 10px 10px 0px;
      //   }
      // `}
    >
      <div
        style={{
          borderBottom: "1px solid #e4e7eb",
        }}
        className="flex-row space-between px-15 py-20"
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#222222",
          }}
        >
          展品列表
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "400",
            color: "#2784ff",
          }}
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
                // {css`
                //   padding: 0 15px;
                //   ${currentExhibit &&
                //   currentExhibit.exhibitId === item.exhibitId
                //     ? css``
                //     : css``}
                // `}
                className="px-15"
                key={item}
              >
                <div
                  key={index}
                  onClick={() => {
                    setIsListVisible(false);
                    setCurrentExhibit(item);
                  }}
                  style={{
                    borderBottom: "1px solid #e4e7eb",
                  }}
                  className={" py-15 flex-row space-between algin-center"}
                >
                  <div className="flex-1 flex-column over-h">
                    <div
                      style={{
                        lineHeight: "100%",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#222222",
                      }}
                      className=" text-ellipsis flex-1 flex-row align-center"
                      title={item.exhibitName}
                    >
                      {item.availableData.authCode === 403 ? (
                        <i className="iconfont ml-5 fc-red fs-16">&#xe62f;</i>
                      ) : null}
                      <span className="text-ellipsis ml-5">
                        {item.exhibitName}
                      </span>
                    </div>
                    {!item.contracts.length ? (
                      <span className="fc-less fw-bold lh-20 pt-10 fs-14">
                        未签约
                      </span>
                    ) : item.availableData.authCode === 403 ? (
                      <span className="iconfont mt-5 fc-error fw-regular lh-18  fs-12 ">
                        已封禁
                      </span>
                    ) : (
                      <div className="flex-row pt-10">
                        {item.contracts.map((contract: any, index: number) => {
                          return (
                            <div
                              style={{
                                padding: "2px 5px",
                                height: "24px",
                                background: "#e9f2ff",
                                border: "1px solid #aed0ff",
                                borderRadius: "2px",
                              }}
                              className={"flex-row align-center mr-5"}
                              key={index}
                            >
                              <div
                                style={{
                                  lineHeight: "18px",
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  color: "#2784ff",
                                }}
                              >
                                {contract.contractName}
                              </div>
                              <div
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                }}
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
                    style={{
                      color: "#666666",
                    }}
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
