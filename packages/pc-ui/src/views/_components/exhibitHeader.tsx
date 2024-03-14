interface exhibitHeaderProps {
  currentExhibit: any;
  children?: any;
}
export default function ExhibitHeader({ currentExhibit }: exhibitHeaderProps) {
  return (
    <div
      className="flex-column py-10 px-20 brs-10 mt-15"
      style={{
        background:
          currentExhibit.availableData.authCode === 403
            ? "#FDEBEC"
            : "rgba(0, 0, 0, 0.02)",
      }}
    >
      <div className="flex-column ">
        {currentExhibit.availableData.authCode === 403 ? (
          <div className="flex-row align-center mb-9">
            <i
              className="iconfont fs-16 fc-red"
              style={{
                color: "#7a869a",
              }}
            >
              &#xe62f;
            </i>
            <span
              className="ml-5 fs-12 fw-regular"
              style={{
                color: "#ee4040",
              }}
            >
              此展品违规，授权相关操作已被禁用
            </span>
          </div>
        ) : null}
        <div
          className="text-ellipsis lh-20 fs-14 fw-bold"
          style={{
            color: "#222222",
          }}
          title={currentExhibit.exhibitName}
        >
          {currentExhibit.exhibitName}
        </div>
      </div>

      {currentExhibit.availableData.authCode === 403 ? null : !currentExhibit
          .contracts.length ? null : (
        <div className="flex-row pt-10">
          {currentExhibit.contracts.map((contract: any, index: number) => {
            return (
              <div
                className={"flex-row align-center mr-5 br-2 h-24 py-3 px-5"}
                style={{
                  background: "#e9f2ff",
                  border: "1px solid #aed0ff",
                }}
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
}
