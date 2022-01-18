import { Modal } from "antd";
import { useState, useEffect } from "react";
import Button from "./_components/button";
import "./auth.scss";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "@/services/handler";
import Confirm from "./_components/confirm";
import Login from "./login";
import contract from "@/services/api/modules/contract";
import getBestTopology from "./topology/data";
import Tip from "./_components/tip";
import exhibit from '../../../../.history/src/services/api/modules/exhibit_20220114103208';
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;
const { setUserInfo, loginCallback, getCurrentUser, updateEvent, reload } =
  window.freelogAuth;

interface contractProps {
  events: Array<any>;
  contractFinished(eventId: any, type: number, data?: any): any;
  loginFinished: any;
  children?: any;
  updateEvents: any;
  isLogin?: boolean;
  isAuths?: boolean;
}
export default function Auth(props: contractProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [themeCancel, setThemeCancel] = useState(false);
  const [tipConfig, setTipConfig] = useState({
    content: "签约成功",
    type: "success",
  });
  const events = props.events || [];
  const [currentExhibit, setCurrentExhibit] = useState<any>(null);
  const [currentExhibitId, setCurrentExhibitId] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([]);
  function paymentFinish() {
    getDetail();
  }
  function loginFinished(type: number, data?: any) {
    if (type === SUCCESS) {
      setUserInfo(data);
      if (loginCallback.length === 0) {
        reload();
      }
      loginCallback.forEach((func: any) => {
        func && func();
      });
    }
    // TODO 重载插件需要把授权的也一并清除
    setIsLoginVisible(false);
    setTimeout(() => {
      props.loginFinished(type);
    }, 10);
  }
  async function getDetail(id?: string) {
    setSelectedPolicies([]);
    if (!id) {
      const userInfo: any = getCurrentUser();
      const con = await frequest(contract.getContracts, "", {
        subjectIds: currentExhibit.exhibitId,
        subjectType: 2,
        licenseeIdentityType: 3,
        licenseeId: userInfo.userId,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      });
      const isAuth = con.data.data.some((item: any) => {
        if ((window.isTest && item.authStatus === 2) || item.authStatus === 1) {
          props.contractFinished(currentExhibit.eventId, SUCCESS);
          return true;
        }
      });
      if (!isAuth) {
        props.updateEvents({ ...currentExhibit, contracts: con.data.data });
      }
      return;
    }

    currentExhibit.contracts = currentExhibit.contracts.filter((item: any) => {
      if ([0, 2].includes(item.status)) {
        currentExhibit.policies.some((i: any) => {
          if (item.policyId === i.policyId) {
            item.policyInfo = i;
            i.contracted = true;
            return true;
          }
        });
        return true;
      }
    });
    currentExhibit.policiesActive = currentExhibit.policies.filter((i: any) => {
      return i.status === 1;
    });
    if (!currentExhibit.isDAG) {
      currentExhibit.policiesActive.forEach((item: any) => {
        const { policyMaps, bestPyramid, betterPyramids, nodesMap } =
          getBestTopology(item.fsmDescriptionInfo);
        item.policyMaps = policyMaps;
        item.bestPyramid = bestPyramid;
        item.betterPyramids = betterPyramids;
        item.nodesMap = nodesMap;
      });
      currentExhibit.isDAG = true;
    }
    setCurrentExhibitId(currentExhibit.exhibitId);
  }
  useEffect(() => {
    if (props.isLogin) return;
    setThemeCancel(false);
    const isExist =
      currentExhibit &&
      events.some((item: any) => {
        if (item.exhibitId === currentExhibit.exhibitId) {
          setCurrentExhibit(item);
          return true;
        }
        return false;
      });
    !isExist && events[0] && setCurrentExhibit(events[0]);
  }, [props.events]);
  useEffect(() => {
    if (props.isLogin) return;
    if (currentExhibit) {
      //  && currentExhibit.exhibitId !== currentExhibitId
      getDetail(currentExhibit.exhibitId);
    }
  }, [currentExhibit]);
  useEffect(() => {
    props.isLogin && setIsLoginVisible(true);
  }, [props.isLogin]);

  const userCancel = () => {
    if (currentExhibit.isTheme) {
      setThemeCancel(true);
    } else {
      props.contractFinished("", USER_CANCEL);
    }
  };
  function policySelect(policyId: number, checked?: boolean, single?: boolean) {
    if (policyId) {
      if (checked) {
        if (single) {
          setSelectedPolicies([policyId]);
        } else {
          setSelectedPolicies([...selectedPolicies, policyId]);
        }
      } else {
        setSelectedPolicies(
          [...selectedPolicies].filter((item: any) => item !== policyId)
        );
      }
    } else {
      setSelectedPolicies([]);
    }
  }
  function act() {
    if (!getCurrentUser()) {
      setIsLoginVisible(true);
      return;
    }
    setIsModalVisible(true);
  }
  const getAuth = async () => {
    const subjects: any = [];
    currentExhibit.policiesActive.forEach((item: any) => {
      selectedPolicies.includes(item.policyId) &&
        subjects.push({
          subjectId: currentExhibit.exhibitId,
          policyId: item.policyId,
        });
    });
    const userInfo: any = getCurrentUser();
    const res = await frequest(contract.contracts, [], {
      subjects,
      subjectType: 2,
      licenseeId: userInfo.userId + "",
      licenseeIdentityType: 3,
      isWaitInitial: 1,
    });
    if (res.data.isAuth) {
      // `付款到${seller}${amount}块钱就可以达到${status}状态`
    }
    setIsModalVisible(false);
    const isAuth = res.data.data.some((item: any) => {
      if ((window.isTest && item.authStatus === 2) || item.authStatus === 1) {
        setIsTipVisible(true);
        setTipConfig({
          content: "获得授权",
          type: "success",
        });
        setTimeout(() => {
          setIsTipVisible(false);
        }, 1500);
        setTimeout(() => {
          props.contractFinished(currentExhibit.eventId, SUCCESS);
        }, 1600);
        return true;
      }
      return false;
    });
    if (!isAuth) {
      setIsTipVisible(true);
      setTipConfig({
        content: "签约成功",
        type: "success",
      });

      setTimeout(() => {
        updateEvent({
          ...currentExhibit,
          contracts: [...res.data.data, ...currentExhibit.contracts],
        });
        setCurrentExhibitId("");
        setCurrentExhibit({
          ...currentExhibit,
          contracts: [...res.data.data, ...currentExhibit.contracts],
        });
        setIsTipVisible(false);
      }, 1500);

      // setTimeout(() => {
      //   props.updateEvents({ ...currentExhibit, contracts: [...currentExhibit.contracts, ...res.data.data] });
      // }, 1600);
    }
  };
  return (
    <>
      {themeCancel ? (
        <div className="w-100x h-100x text-center">
          <div className="theme-tip mb-30">
            {currentExhibit &&
            currentExhibit.contracts &&
            currentExhibit.contracts.length
              ? "节点主题授权未完成，继续浏览请获取授权"
              : "当前节点主题未开放授权，继续浏览请签约并获取授权"}
          </div>
          <Button
            click={() => {
              setThemeCancel(false);
            }}
            className="px-50 py-15"
          >
            {currentExhibit &&
            currentExhibit.contracts &&
            currentExhibit.contracts.length
              ? "获取收取"
              : "签约"}
          </Button>
        </div>
      ) : (
        <div className="runtime-pc bg-white" id="runtime-pc">
          {isModalVisible && (
            <Confirm
              setIsModalVisible={setIsModalVisible}
              isModalVisible={isModalVisible}
              getAuth={getAuth}
              selectedPolicies={selectedPolicies}
              policies={currentExhibit.policiesActive}
              currentExhibit={currentExhibit}
            />
          )}
          {isLoginVisible && (
            <Login
              loginFinished={loginFinished}
              setIsLoginVisible={setIsLoginVisible}
            ></Login>
          )}
          <Tip
            content={tipConfig.content}
            isModalVisible={isTipVisible}
            type={tipConfig.type}
            setIsModalVisible={setIsTipVisible}
          />
          {props.isAuths && currentExhibit && (
            <Modal
              zIndex={1200}
              centered
              footer={null}
              visible={props.isAuths}
              onCancel={userCancel}
              className={currentExhibit.isTheme || events.length === 1 ? "theme-height" : "h-620"}
              width={currentExhibit.isTheme || events.length === 1 ? 600 : 860}
              keyboard={false}
              maskClosable={false}
              wrapClassName="freelog-contract"
            >
              <div className="flex-column py-20 align-center bb-1">
                <div className="auth-title ">
                  {currentExhibit.isTheme ? "节点主题授权" : "展品授权"}
                </div>
                {currentExhibit.isTheme ? (
                  <div className="auth-des mt-15">
                    {currentExhibit &&
                    currentExhibit.contracts &&
                    currentExhibit.contracts.length
                      ? "节点主题授权未完成，继续浏览请获取授权"
                      : "当前节点主题未开放授权，继续浏览请选择策略签约并获取授权"}
                  </div>
                ) : null}
              </div>
              {currentExhibit && (
                <div
                  className={
                    currentExhibit.isTheme
                      ? " w-100x  flex-column "
                      : "w-100x h-551 flex-column"
                  }
                >
                  {/* 左右 */}
                  <div className="w-100x flex-1 flex-row over-h">
                    <div className="w-100x h-100x  flex-row">
                      {/* 左：待授权展品列表 */}
                      {!currentExhibit.isTheme && events.length !== 1 && (
                        <div className="flex-column w-344 h-100x  y-auto">
                          {events.length
                            ? events.map((item: any, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      setCurrentExhibit(item);
                                    }}
                                    className={
                                      (currentExhibit.exhibitId ===
                                      item.exhibitId
                                        ? "exhibit-selected "
                                        : "") +
                                      " px-20 py-15 w-100x b-box x-auto  cur-pointer exhibit-item select-none flex-column"
                                    }
                                  >
                                    <div
                                      className="exhibit-name w-100x text-ellipsis flex-1 flex-row align-center"
                                      title={item.exhibitName}
                                    >
                                      <span>{item.exhibitName}</span>
                                    </div>
                                    {!item.contracts.length ? null : (
                                      <div className="flex-row pt-10">
                                        {item.contracts.map(
                                          (contract: any, index: number) => {
                                            return (
                                              <div
                                                className={
                                                  "contract-tag flex-row align-center mr-5"
                                                }
                                                key={index}
                                              >
                                                <div className="contract-name">
                                                  {contract.contractName}
                                                </div>
                                                <div
                                                  className={
                                                    "contract-dot ml-6 " +
                                                    (contract.authStatus === 128
                                                      ? "bg-auth-none"
                                                      : !window.isTest &&
                                                        contract.authStatus ===
                                                          1
                                                      ? "bg-auth"
                                                      : "bg-auth-none")
                                                  }
                                                ></div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            : null}
                          {/* <Presentables></Presentables> */}
                        </div>
                      )}
                      {/* 右：策略或合约列表 */}
                      <div
                        className={
                          (!currentExhibit.isTheme  && events.length !== 1 ? "w-516 " : "w-600") +
                          " bg-content h-100x   y-auto px-20 pb-20"
                        }
                      >
                        {events.length === 1 &&
                        !currentExhibit.isTheme  &&
                        currentExhibitId === currentExhibit.exhibitId ? (
                          <div className="flex-column py-10 px-20 single-exhibit mt-15">
                            <div className="single-exhibit-name text-ellipsis" title={currentExhibit.exhibitName}>{currentExhibit.exhibitName}</div>
                            {!currentExhibit.contracts.length ? null : (
                              <div className="flex-row pt-10">
                                {currentExhibit.contracts.map(
                                  (contract: any, index: number) => {
                                    return (
                                      <div
                                        className={
                                          "contract-tag flex-row align-center mr-5"
                                        }
                                        key={index}
                                      >
                                        <div className="contract-name">
                                          {contract.contractName}
                                        </div>
                                        <div
                                          className={
                                            "contract-dot ml-6 " +
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
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        ) : null}
                        {currentExhibitId === currentExhibit.exhibitId &&
                        currentExhibit.defaulterIdentityType !== 4 ? (
                          <div className="error-tip flex-row align-center mt-15 px-10 bg-error-minor">
                            <i className="iconfont mr-5 fs-14 fc-error">
                              &#xe62e;
                            </i>
                            <div className=" fw-regular fs-12 fc-error ">
                              当前展品授权存在异常，请联系节点运营商！
                            </div>
                          </div>
                        ) : null}
                        {currentExhibitId === currentExhibit.exhibitId &&
                        currentExhibit.contracts.length &&
                        currentExhibit.policiesActive.length -
                          currentExhibit.contracts.length ? (
                          <div className="policy-tip flex-row align-center mt-15 px-10">
                            <i className="iconfont mr-5 fs-14">&#xe641;</i>
                            <div className="tip fs-12">
                              最下方有可签约的策略
                            </div>
                          </div>
                        ) : null}
                        {currentExhibitId === currentExhibit.exhibitId &&
                        currentExhibit.contracts.length ? (
                          <div className="fs-12 fc-grey flex-1 fw-bold shrink-0 mt-15">
                            当前合约
                          </div>
                        ) : null}
                        {currentExhibitId === currentExhibit.exhibitId &&
                          currentExhibit.contracts.map(
                            (contract: any, index: number) => {
                              return (
                                <Contract
                                  policy={contract.policyInfo}
                                  contract={contract}
                                  paymentFinish={paymentFinish}
                                  key={index}
                                ></Contract>
                              );
                            }
                          )}
                        {currentExhibitId === currentExhibit.exhibitId &&
                          !!currentExhibit.contracts.length && (
                            <div className="flex-row mt-10 ">
                              <div className="fs-14 fc-less">
                                查看已终止的合约请移至
                              </div>
                              <div
                                onClick={() => {
                                  window.open(
                                    "http://user.testfreelog.com/logged/contract"
                                  );
                                }}
                                className="ml-10 fs-14 fc-blue cur-pointer hover-light"
                              >
                                合约管理
                              </div>
                            </div>
                          )}
                        {currentExhibitId === currentExhibit.exhibitId &&
                        currentExhibit.policiesActive.length -
                          currentExhibit.contracts.length ? (
                          <div className="fs-12 fc-grey flex-1 fw-bold mt-20 ">
                            可签约的策略
                          </div>
                        ) : null}
                        {currentExhibitId === currentExhibit.exhibitId &&
                          currentExhibit.policiesActive.map(
                            (policy: any, index: number) => {
                              return policy.contracted ? null : (
                                <Policy
                                  policy={policy}
                                  key={index}
                                  seq={index}
                                  getAuth={getAuth}
                                  policySelect={policySelect}
                                  selectType={
                                    currentExhibit.contracts.length
                                      ? true
                                      : false
                                  }
                                ></Policy>
                              );
                            }
                          )}
                      </div>
                    </div>
                  </div>
                  {currentExhibit.contracts.length ? (
                    ""
                  ) : (
                    <div className="h-74 w-100x flex-row justify-center align-center">
                      {!getCurrentUser() ? (
                        <span className="please-login mr-20">
                          进行签约及授权管理，请先登录
                        </span>
                      ) : null}
                      <Button
                        disabled={
                          selectedPolicies.length === 0 && getCurrentUser()
                        }
                        click={act}
                        className={
                          (getCurrentUser() ? "w-300" : "") +
                          " px-20 h-38 fs-14 text-center"
                        }
                      >
                        {getCurrentUser() ? "立即签约" : "立即登录"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          )}
        </div>
      )}
    </>
  );
}
