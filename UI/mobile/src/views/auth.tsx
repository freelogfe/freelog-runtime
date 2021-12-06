import React, { useState, useEffect } from "react";
import "@/assets/mobile/index.scss";
import "./auth.scss";
import Login from "./user/login";
import Forgot, { LOGIN_PASSWORD, PAY_PASSWORD } from "./user/forgot";

import Register from "./user/register";

import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "@/services/handler";
import contract from "@/services/api/modules/contract";
import getBestTopology from "./topology/data";
import { Dialog, Popup, Button, Toast } from "antd-mobile"; // Toast, Button
const { SUCCESS, USER_CANCEL, FAILED } = window.freelogAuth.resultType;
const { setUserInfo, loginCallback, getCurrentUser } = window.freelogAuth;
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
export default function (props: contractProps) {
  const [isListVisible, setIsListVisible] = useState(false);
  // 1 登陆  2 注册   3 忘记登录密码  4 忘记支付密码
  const [modalType, setModalType] = useState(0);

  const [contracts, setContracts] = useState([]);
  const events = props.events || [];
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [policies, setPolicies] = useState([]);
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
      loginCallback.forEach((func: any) => {
        func && func();
      });
    }
    if (type === USER_CANCEL) {
    }
    // TODO 重载插件需要把授权的也一并清除
    setModalType(0);
    props.loginFinished(type);
  }

  async function getDetail(id?: string) {
    setSelectedPolicies([]);
    // userInfo 如果不存在就是未登录
    const userInfo: any = getCurrentUser();
    const con =
      userInfo &&
      (await frequest(contract.getContracts, "", {
        subjectIds: currentPresentable.exhibitId,
        subjectType: 2,
        licenseeIdentityType: 3,
        licenseeId: userInfo.userId,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      }));
    if (!id) {
      const isAuth = con.data.data.some((item: any) => {
        if ((window.isTest && item.authStatus === 2) || item.authStatus === 1) {
          props.contractFinished(currentPresentable.eventId, SUCCESS);
          return true;
        }
      });
      if (!isAuth) {
        props.updateEvents({ ...currentPresentable, contracts: con.data.data });
      }
      return;
    }
    const res = await window.freelogApp.getExhibitInfo(
      id || currentPresentable.exhibitId,
      {
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      }
    );
    /**
     * 获取
     */
    console.log(res)
    res.data.data.policies = res.data.data.policies.filter((i: any) => {
      return i.status === 1;
    });
    res.data.data.policies.forEach((item: any) => {
      const { policyMaps, bestPyramid, betterPyramids, nodesMap } =
        getBestTopology(item.fsmDescriptionInfo);
      item.policyMaps = policyMaps;
      item.bestPyramid = bestPyramid;
      item.betterPyramids = betterPyramids;
      item.nodesMap = nodesMap;
    });
    setPolicies(res.data.data.policies);
    if (con) {
      const contracts = con.data.data.filter((item: any) => {
        if (item.status === 0) {
          res.data.data.policies.some((i: any) => {
            if (item.policyId === i.policyId) {
              item.policyInfo = i;
              i.contracted = true;
              return true;
            }
          });
          return true;
        }
      });
      setContracts(contracts);
    }
  }
  useEffect(() => {
    setThemeCancel(false);
    const isExist = events.some((item: any) => {
      if (item.exhibitId === currentPresentable.exhibitId) {
        setCurrentPresentable(item);
        return true;
      }
    });
    !isExist && setCurrentPresentable(events[0]);
  }, [props.events]);
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.exhibitId);
  }, [currentPresentable]);
  useEffect(() => {
    props.isLogin && setModalType(1);
  }, [props.isLogin]);

  const userCancel = () => {
    if (currentPresentable.isTheme) {
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
    policies.forEach((item: any) => {
      [...selectedPolicies, id].includes(item.policyId) &&
        subjects.push({
          subjectId: currentPresentable.exhibitId,
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
    }
    const isAuth = res.data.data.some((item: any) => {
      if ((window.isTest && item.authStatus === 2) || item.authStatus === 1) {
        Toast.show({
          icon: "success",
          content: "获得授权",
          duration: 1500,
        });
        setTimeout(() => {
          props.contractFinished(currentPresentable.eventId, SUCCESS);
        }, 1600);
        return true;
      }
    });
    if (!isAuth) {
      Toast.show({
        icon: "success",
        content: "签约成功",
        duration: 1500,
      });
      setTimeout(() => {
        props.updateEvents({ ...currentPresentable, contracts: res.data.data });
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
            继续浏览请签约并获取授权
          </div>
          <Button
            color="primary"
            onClick={() => {
              setThemeCancel(false);
            }}
            size="small"
            className="theme-tip-button text-center"
          >
            签约
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
                        setCurrentPresentable(item);
                      }}
                      className={
                        (currentPresentable === item
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
          {props.isAuths ? (
            <div className="flex-column w-100x h-100x over-h">
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
                  {currentPresentable.exhibitName}
                </div>
                {currentPresentable.isTheme ? (
                  <>
                    <div className="auth-des  text-center">
                      当前节点主题未开放授权，
                    </div>
                    <div className="auth-des mb-20 text-center">
                      继续浏览请选择策略签约并获取授权
                    </div>
                  </>
                ) : null}
                {!currentPresentable.contracts.length ? null : (
                  <div className="flex-row justify-center mb-15">
                    {currentPresentable.contracts.map(
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
              <div className="flex-column flex-1 over-h">
                <div className="w-100x h-100x y-auto pb-20">
                  {contracts.map((contract: any, index: number) => {
                    return (
                      <Contract
                        policy={contract.policyInfo}
                        contract={contract}
                        paymentFinish={paymentFinish}
                        setModalType={setModalType}
                        key={index}
                      ></Contract>
                    );
                  })}
                  {policies.map((policy: any, index: number) => {
                    return policy.contracted ? null : (
                      <Policy
                        policy={policy}
                        key={index}
                        seq={index}
                        loginFinished={loginFinished}
                        setModalType={setModalType}
                        getAuth={getAuth}
                        policySelect={policySelect}
                        selectType={contracts.length ? true : true}
                      ></Policy>
                    );
                  })}
                </div>
              </div>

              {getCurrentUser() ? null : (
                <div className="h-74 w-100x flex-row justify-center align-center bt-1">
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
                    登陆
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
