import { freelogAuth } from "freelog-runtime-core";

const nodeInfo = freelogAuth.nodeInfo;

interface exhibitListProps {
  currentExhibit: any;
  events: any;
  setCurrentExhibit: any;
  children?: any;
}
export default function exhibitList({
  currentExhibit,
  events,
  setCurrentExhibit,
}: exhibitListProps) {
  return (
    <div className="flex-column w-344 h-100x  y-auto">
      {events.length
        ? events.map((item: any, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setCurrentExhibit(item);
                }}
                style={
                  currentExhibit.exhibitId === item.exhibitId
                    ? { background: "#fafbfc" }
                    : {}
                }
                className={
                  "w-344 h-84 px-20 py-15 w-100x b-box x-auto  cur-pointer select-none flex-column"
                }
              >
                <div className="flex-row align-center">
                  {item.availableData.authCode === 403 ? (
                    <i className="iconfont fs-16 fc-red">&#xe62f;</i>
                  ) : null}
                  {nodeInfo.ownerUserStatus === 1 ? (
                    <div className="w-16 h-16 over-h flex-column-center mr-5 fs-16">
                      <img src="/warn.svg" alt="" className="w-100x" />
                    </div>
                  ) : null}
                  <div
                    className="fs-14 lh-20 w-304 text-ellipsis flex-1 flex-row align-center fw-bold"
                    style={{
                      color: "#222222",
                    }}
                    title={item.exhibitName}
                  >
                    {item.exhibitName}
                  </div>
                </div>
                {item.availableData.authCode === 403 ? (
                  <span
                    className="iconfont fc-red fs-12 fw-regular lh-18"
                    style={{
                      color: "#ee4040",
                    }}
                  >
                    已封禁
                  </span>
                ) : !item.contracts.length ? null : (
                  <div className="flex-row pt-10">
                    {item.contracts.map((contract: any, index: number) => {
                      return (
                        <div
                          style={{
                            border: "1px solid #aed0ff",
                          }}
                          className={
                            " flex-row align-center mr-5 h-24 brs-2 py-3 px-5"
                          }
                          key={index}
                        >
                          <div
                            className="lh-18 fw-regular fs-12"
                            style={{
                              color: "#2784ff",
                            }}
                          >
                            {contract.contractName}
                          </div>
                          <div
                            style={{
                              borderRadius: "50%",
                            }}
                            className={
                              "w-6 h-6 ml-6 " +
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
          })
        : null}
      {/* <Presentables></Presentables> */}
    </div>
  );
}
