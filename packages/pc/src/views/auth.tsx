/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import "./auth.scss";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "@/services/handler";
import Confirm from "./_commons/confirm";
import Login from "./login";
import contract from "@/services/api/modules/contract";
// import getBestTopology from "./topology/data";
import NodeError from "./_statusComponents/nodeError";
import Header from "./_components/header";
import ThemeCancel from "./_statusComponents/themeCancel";
import ExhibitList from "./_components/exhibitList";
import Tip, { TipTipes } from "./_commons/tip";
import ExhibitHeader from "./_components/exhibitHeader";
import ExhibitError from "./_statusComponents/exhibitError";
import ExhibitOffLine from "./_statusComponents/exhibitOffLine";
import ExhibitFooter from "./_components/exhibitFooter";
import ContractTip from "./_components/contractTip";
import PolicyTip from "./_components/policyTip";
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;
const nodeInfo = window.freelogApp.nodeInfo;
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
  //
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [themeCancel, setThemeCancel] = useState(false);
  const [exhibitOnline, setExhibitOnline] = useState(false);
  const [tipConfig, setTipConfig] = useState<{
    content: string;
    type: TipTipes["type"];
  }>({
    content: "签约成功",
    type: "success",
  });
  const events = props.events || [];
  const [currentExhibit, setCurrentExhibit] = useState<any>(null);
  const [currentExhibitId, setCurrentExhibitId] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([]);
  // 付款完成
  function paymentFinish() {
    getDetail();
  }
  // 登录逻辑
  useEffect(() => {
    props.isLogin && setIsLoginVisible(true);
  }, [props.isLogin]);

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

  // 数据处理或重新请求合约
  async function getDetail(id?: string) {
    setSelectedPolicies([]);
    // 如果没有传id 就是重新请求合约
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
    // 合约备份
    currentExhibit._contracts = [...currentExhibit.contracts];
    //
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
    // 有效策略
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

  // 监听插件传递过来的展品变化
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
    if (!isExist && events[0]) {
      setCurrentExhibit(events[0]);
      if (events[0].isTheme && !events[0].isAvailable) {
        setThemeCancel(true);
      }
    }
  }, [props.events]);

  // 切换展品
  useEffect(() => {
    if (props.isLogin) return;
    if (currentExhibit) {
      //  && currentExhibit.exhibitId !== currentExhibitId
      getDetail(currentExhibit.exhibitId);
    }
  }, [currentExhibit]);

  // 用户取消签约
  const userCancel = () => {
    if (currentExhibit.isTheme) {
      setThemeCancel(true);
    } else {
      props.contractFinished("", USER_CANCEL);
    }
  };

  // 策略多选逻辑
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

  // 登录或确认签约按钮行为定义
  function act() {
    if (!getCurrentUser()) {
      setIsLoginVisible(true);
      return;
    }
    setIsConfirmVisible(true);
  }

  // 签约发起
  const getAuth = async () => {
    const subjects: any = [];
    let policies: any = [];
    currentExhibit.policiesActive.forEach((item: any) => {
      selectedPolicies.includes(item.policyId) &&
        subjects.push({
          subjectId: currentExhibit.exhibitId,
          policyId: item.policyId,
        }) &&
        policies.push(item);
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
    setSelectedPolicies([]);
    setIsConfirmVisible(false);
    if (res.data.errcode) {
      setIsTipVisible(true);
      if (res.data.msg === "subject-policy-check-failed") {
        let failedPolicies: string[] = [];
        policies.forEach((item: any) => {
          res.data.data.forEach((f: any) => {
            if (f.policyId === item.policyId) {
              item._disabled = true;
              failedPolicies.push(item.policyName);
            }
          });
        });
        setCurrentExhibit({ ...currentExhibit });
        setTipConfig({
          content: `策略 ${failedPolicies.join(",")} 已下线无法签约`,
          type: "notAllow",
        });
        setTimeout(() => {
          setIsTipVisible(false);
        }, 1500);
        return;
      }
      setTipConfig({
        content: res.data.msg,
        type: "error",
      });
      setTimeout(() => {
        setIsTipVisible(false);
      }, 1500);
      return;
    }
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
    }
  };
  return (
    <>
      {themeCancel ? (
        currentExhibit &&
        currentExhibit.isTheme &&
        !currentExhibit.isAvailable ? (
          <NodeError
            currentExhibit={currentExhibit}
            setThemeCancel={setThemeCancel}
          />
        ) : (
          <ThemeCancel
            currentExhibit={currentExhibit}
            setThemeCancel={setThemeCancel}
          />
        )
      ) : (
        <div className="runtime-pc bg-white" id="runtime-pc">
          <>
            {isConfirmVisible && (
              <Confirm
                setIsModalVisible={setIsConfirmVisible}
                isModalVisible={isConfirmVisible}
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
          </>
          {props.isAuths && currentExhibit && (
            <Modal
              zIndex={1200}
              centered
              footer={null}
              visible={props.isAuths}
              onCancel={userCancel}
              className={
                currentExhibit.isTheme || events.length === 1
                  ? "h-620"
                  : "h-620"
              }
              width={currentExhibit.isTheme || events.length === 1 ? 600 : 860}
              keyboard={false}
              maskClosable={false}
              wrapClassName="freelog-contract"
            >
              <Header currentExhibit={currentExhibit} />
              {currentExhibit && (
                <div
                  className={
                    currentExhibit.isTheme
                      ? " w-100x h-551 flex-column "
                      : "w-100x h-551 flex-column"
                  }
                >
                  {/* 左右 */}
                  <div className="w-100x h-100x over-h flex-column">
                    <div className="w-100x h-100x  flex-row over-h">
                      {/* 左：待授权展品列表 */}
                      {!currentExhibit.isTheme && events.length !== 1 && (
                        <ExhibitList
                          setCurrentExhibit={setCurrentExhibit}
                          currentExhibit={currentExhibit}
                          events={events}
                        />
                      )}
                      {/* 右：策略或合约列表 */}
                      {currentExhibitId === currentExhibit.exhibitId ? (
                        <div
                          className={
                            (!currentExhibit.isTheme && events.length !== 1
                              ? "w-516 "
                              : "w-600") +
                            " bg-content h-100x   y-auto px-20 pb-20"
                          }
                        >
                          {events.length === 1 && !currentExhibit.isTheme ? (
                            <ExhibitHeader currentExhibit={currentExhibit} />
                          ) : null}
                          {currentExhibit.availableData.authCode === 403 ? (
                            <div
                              className="flex-row align-center py-5 w-100x"
                              css={css`
                                background: #fdebec;
                                border-radius: 4px;
                                color: #ee4040;
                                padding: 0 10px;
                                font-size: 12px;
                                margin-top: 15px;
                              `}
                            >
                              <i
                                className="iconfont"
                                css={css`
                                  color: red;
                                  font-size: 16px;
                                  margin-right: 5px;
                                `}
                              >
                                &#xe62f;
                              </i>
                              <span>此展品违规，授权相关操作已被禁用</span>
                            </div>
                          ) : null}
                          {nodeInfo.ownerUserStatus === 1 ? (
                            <div
                              className="flex-row align-center py-5 px-10 w-100x"
                              css={css`
                                background: #fbf5ea;
                                border-radius: 4px;
                                color: #e9a923;
                                font-size: 12px;
                                margin-top: 15px;
                              `}
                            >
                              <div
                                className="w-16 h-16 over-h flex-column-center"
                                css={css`
                                  font-size: 16px;
                                  margin-right: 5px;
                                `}
                              >
                                <img
                                  src="/warn.svg"
                                  alt=""
                                  className="w-100x"
                                />
                              </div>
                              <span>
                                该展品运营方账号因违规已被冻结，请谨慎处理授权。
                              </span>
                            </div>
                          ) : null}

                          {currentExhibit.onlineStatus === 0 ? (
                            <ExhibitOffLine
                              length={events.length}
                              type="offline"
                            />
                          ) : currentExhibit.availableData.authCode === 403 ? (
                            <ExhibitOffLine
                              length={events.length}
                              type="freezed"
                            />
                          ) : (
                            <>
                              {!currentExhibit.isAvailable ? (
                                <ExhibitError />
                              ) : null}
                              <ContractTip currentExhibit={currentExhibit} />
                              {currentExhibit.contracts.map(
                                (contract: any, index: number) => {
                                  return (
                                    <Contract
                                      policy={contract.policyInfo}
                                      contract={contract}
                                      isAvailable={currentExhibit.isAvailable}
                                      paymentFinish={paymentFinish}
                                      key={index}
                                    ></Contract>
                                  );
                                }
                              )}
                              <PolicyTip currentExhibit={currentExhibit} />
                              {currentExhibit.policiesActive.map(
                                (policy: any, index: number) => {
                                  return policy.contracted ? null : (
                                    <Policy
                                      policy={policy}
                                      key={index}
                                      seq={index}
                                      disabled={policy._disabled}
                                      getAuth={getAuth}
                                      isAvailable={currentExhibit.isAvailable}
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
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {currentExhibit.contracts.length ? null : (
                    <ExhibitFooter
                      currentExhibit={currentExhibit}
                      getCurrentUser={getCurrentUser}
                      act={act}
                      selectedPolicies={selectedPolicies}
                    />
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
