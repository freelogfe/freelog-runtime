/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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
                css={css`
                  width: 344px;
                  height: 84px;
                  ${currentExhibit.exhibitId === item.exhibitId
                    ? "background: #fafbfc;"
                    : ""}
                `}
                className={
                  " px-20 py-15 w-100x b-box x-auto  cur-pointer select-none flex-column"
                }
              >
                <div
                  className="fs-14 lh-20 w-304 text-ellipsis flex-1 flex-row align-center"
                  css={css`
                    font-weight: 600;
                    color: #222222;
                  `}
                  title={item.exhibitName}
                >
                  <span>{item.exhibitName}</span>
                </div>
                {!item.contracts.length ? null : (
                  <div className="flex-row pt-10">
                    {item.contracts.map((contract: any, index: number) => {
                      return (
                        <div
                          css={css`
                            padding: 3px 5px;
                            height: 24px;
                            background: #e9f2ff;
                            border-radius: 2px;
                            border: 1px solid #aed0ff;
                          `}
                          className={" flex-row align-center mr-5"}
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
          })
        : null}
      {/* <Presentables></Presentables> */}
    </div>
  );
}