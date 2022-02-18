import { useState, useEffect } from "react";
import "@/assets/mobile/index.scss";
import "./auth.scss";
import Login from "./user/login";
import Forgot, { LOGIN_PASSWORD, PAY_PASSWORD } from "./user/forgot";

import Register from "./user/register";

import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "@/services/handler";
import contract from "@/services/api/modules/contract";
// import getBestTopology from "./topology/data";
import { Dialog, Popup, Button, Toast } from "antd-mobile"; // Toast, Button
import { isCallable } from '../../../../src/platform/runtime/utils';
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;
const { setUserInfo, loginCallback, getCurrentUser, updateEvent, reload } =
  window.freelogAuth;
// const alert = Modal.alert;

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
  const [isListVisible, setIsListVisible] = useState(false);
  // 1 登录  2 注册   3 忘记登录密码  4 忘记支付密码
  const [modalType, setModalType] = useState(0);
  const events = props.events || [];
  const [currentExhibit, setCurrentExhibit] = useState<any>(null);
  const [currentExhibitId, setCurrentExhibitId] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([]);
  const [themeCancel, setThemeCancel] = useState(false);

  function closeCurrent() {
    if (events.length === 1) {
      Dialog.confirm({
        content: "当前还有展品未获得授权，确定退出？",
        onConfirm: async () => {
          userCancel();
        },
      });
    } else {
      // 否则弹出展品列表
      setIsListVisible(true);
    }
  }
  function paymentFinish() {
    getDetail();
  }
  // 0 成功  1 失败  2 用户取消
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
    setModalType(0);
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
        return false;
      });
      if (!isAuth) {
        props.updateEvents({ ...currentExhibit, contracts: con.data.data });
      }
      return;
    }
    currentExhibit._contracts = currentExhibit.contracts;
    currentExhibit.contracts = currentExhibit.contracts.filter((item: any) => {
      if ([0, 2].includes(item.status)) {
        currentExhibit.policies.some((i: any) => {
          if (item.policyId === i.policyId) {
            item.policyInfo = i;
            i.contracted = true;
            return true;
          }
          return false;
        });
        return true;
      }
      return false;
    });
    currentExhibit.policiesActive = currentExhibit.policies.filter((i: any) => {
      return i.status === 1;
    });
    // if (!currentExhibit.isDAG) {
    //   currentExhibit.policiesActive.forEach((item: any) => {
    //     const { policyMaps, bestPyramid, betterPyramids, nodesMap } =
    //       getBestTopology(item.fsmDescriptionInfo);
    //     item.policyMaps = policyMaps;
    //     item.bestPyramid = bestPyramid;
    //     item.betterPyramids = betterPyramids;
    //     item.nodesMap = nodesMap;
    //   });
    //   currentExhibit.isDAG = true;
    // }
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
      // && currentExhibit.exhibitId !== currentExhibitId
      getDetail(currentExhibit.exhibitId);
    }
  }, [currentExhibit]);
  useEffect(() => {
    props.isLogin && setModalType(1);
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
  const getAuth = async (id: any) => {
    const subjects: any = [];
    currentExhibit.policiesActive.forEach((item: any) => {
      [...selectedPolicies, id].includes(item.policyId) &&
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
    const isAuth = res.data.data.some((item: any) => {
      if ((window.isTest && item.authStatus === 2) || item.authStatus === 1) {
        Toast.show({
          icon: "success",
          content: "获得授权",
          duration: 1500,
        });
        setTimeout(() => {
          props.contractFinished(currentExhibit.eventId, SUCCESS);
        }, 1600);
        return true;
      }
      return false;
    });
    if (!isAuth) {
      Toast.show({
        icon: "success",
        content: "签约成功",
        duration: 1500,
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
      }, 1600);
    }
  };
  return (
    <>
      {themeCancel ? (
        <div className=" h-100x text-center ">
          <div className="theme-tip mb-15 text-center">
            当前节点主题未开放授权
          </div>
          <div className="theme-tip mb-30 text-center">
            {currentExhibit &&
            currentExhibit.contracts &&
            currentExhibit.contracts.length
              ? "继续浏览请获取授权"
              : "继续浏览请签约并获取授权"}
          </div>
          <Button
            color="primary"
            onClick={() => {
              setThemeCancel(false);
            }}
            size="small"
            className="theme-tip-button "
          >
            {currentExhibit &&
            currentExhibit.contracts &&
            currentExhibit.contracts.length
              ? "获取收取"
              : "签约"}
          </Button>
        </div>
      ) : (
        <div id="runtime-mobile" className="w-100x h-100x over-h">
          {modalType === 1 ? (
            <Login
              loginFinished={loginFinished}
              visible={modalType === 1}
              setModalType={setModalType}
            />
          ) : modalType === 2 ? (
            <Register visible={modalType === 2} setModalType={setModalType} />
          ) : modalType === 3 ? (
            <Forgot
              type={LOGIN_PASSWORD}
              visible={modalType === 3}
              setModalType={setModalType}
            />
          ) : modalType === 4 ? (
            <Forgot
              type={PAY_PASSWORD}
              visible={modalType === 4}
              setModalType={setModalType}
            />
          ) : null}
          <Popup
            visible={isListVisible}
            position="left"
            bodyClassName="exhibit-list w-100x h-100x"
          >
            <div className="flex-row space-between px-15 py-20 list-title">
              <div className="list-title-name">展品列表</div>
              <div
                className="list-exit"
                onClick={() => {
                  Dialog.confirm({
                    content: "当前还有展品未获得授权，确定退出？",
                    onConfirm: async () => {
                      userCancel();
                    },
                  });
                }}
              >
                退出
              </div>
            </div>
            {events.length
              ? events.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setIsListVisible(false);
                        setCurrentExhibit(item);
                      }}
                      className={
                        (currentExhibit &&
                        currentExhibit.exhibitId === item.exhibitId
                          ? "exhibit-selected "
                          : "") +
                        " px-15 py-15 exhibit-item  flex-row space-between algin-center"
                      }
                    >
                      <div className="flex-1 flex-column over-h">
                        <div
                          className="exhibit-name text-ellipsis flex-1 flex-row align-center"
                          title={item.exhibitName}
                        >
                          <span className="text-ellipsis">
                            {item.exhibitName}
                          </span>
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
                      <div className="shrink-0 text-center pl-10 fs-24">
                        &gt;
                      </div>
                    </div>
                  );
                })
              : null}
          </Popup>
          {props.isAuths && currentExhibit ? (
            <div className="flex-column w-100x h-100x over-h justify-end">
              <div className="flex-column justify-center bb-1">
                <div className="text-center mt-20 fs-16 fc-main fw-bold">
                  签约
                </div>
                <div
                  className="p-absolute fs-16 mt-20 mr-15 rt-0 fc-blue cur-pointer"
                  onClick={() => closeCurrent()}
                >
                  {events.length === 1 ? "退出" : "关闭"}
                </div>
                <div className="text-center mt-20 mb-10 fs-20 fc-main fw-bold">
                  {currentExhibit.exhibitName}
                </div>
                {currentExhibit.isTheme ? (
                  <>
                    <div className="auth-des  text-center">
                      当前节点主题未开放授权，
                    </div>
                    <div className="auth-des mb-20 text-center">
                      {currentExhibit &&
                      currentExhibit.contracts &&
                      currentExhibit.contracts.length
                        ? "继续浏览请获取授权"
                        : "继续浏览请选择策略签约并获取授权"}
                    </div>
                  </>
                ) : null}
                {!currentExhibit.contracts.length ? null : (
                  <div className="flex-row justify-center mb-15">
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
                                  : !window.isTest && contract.authStatus === 1
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
              <div className="flex-column flex-1 over-h w-100x">
                <div className="w-100x h-100x y-auto pb-20">
                  {currentExhibitId === currentExhibit.exhibitId &&
                  !currentExhibit.isAvailable ? (
                    <div className="error-tip flex-row align-center mt-15 mx-15 px-10 bg-error-minor">
                      <i className="iconfont mr-5 fs-14 fc-error">&#xe62e;</i>
                      <div className="fs-12 fc-error ">
                        当前展品授权存在异常，请联系节点运营商！
                      </div>
                    </div>
                  ) : null}
                  <div className="flex-row ml-15 mr-5 space-between align-center mt-15">
                    {currentExhibitId === currentExhibit.exhibitId &&
                    currentExhibit.contracts.length ? (
                      <div className="kind-tip flex-1 fw-bold shrink-0">
                        当前合约
                      </div>
                    ) : null}
                    {currentExhibitId === currentExhibit.exhibitId &&
                    currentExhibit.contracts.length &&
                    (currentExhibit.policiesActive.some((item:any)=>!item.contracted)) ? (
                      <div className="policy-tip flex-row align-center  px-10">
                        <i className="iconfont mr-5 fs-14">&#xe641;</i>
                        <div className="tip fs-12">最下方有可签约的策略</div>
                      </div>
                    ) : null}
                  </div>
                  {currentExhibitId === currentExhibit.exhibitId &&
                    currentExhibit.contracts.map(
                      (contract: any, index: number) => {
                        return (
                          <Contract
                            policy={contract.policyInfo}
                            contract={contract}
                            paymentFinish={paymentFinish}
                            setModalType={setModalType}
                            key={index}
                          ></Contract>
                        );
                      }
                    )}
                  {currentExhibitId === currentExhibit.exhibitId &&
                    currentExhibit._contracts.length >
                      currentExhibit.contracts.length && (
                      <div className="flex-row mt-10 ml-15 ">
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
                  currentExhibit.policiesActive.some(
                    (item: any) => !item.contracted
                  ) ? (
                    <div className="kind-tip flex-1 fw-bold mt-20 ml-15">
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
                            loginFinished={loginFinished}
                            setModalType={setModalType}
                            getAuth={getAuth}
                            isAvailable={currentExhibit.isAvailable}
                            policySelect={policySelect}
                            selectType={
                              currentExhibit.contracts.length ? true : true
                            }
                          ></Policy>
                        );
                      }
                    )}
                </div>
              </div>

              {getCurrentUser() ? null : (
                <div className="h-74 w-100x flex-row justify-center align-center jself-end bt-1  ">
                  <span className="please-login mr-20">
                    进行签约及授权管理，请先登录
                  </span>
                  <Button
                    onClick={() => {
                      setModalType(1);
                    }}
                    color="primary"
                    size="small"
                    className=" text-center"
                  >
                    登录
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
