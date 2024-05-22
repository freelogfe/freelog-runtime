import { useState, useEffect } from "react";
import Login from "./user/login";
import Forgot, { LOGIN_PASSWORD, PAY_PASSWORD } from "./user/forgot";
import Register from "./user/register";
import NodeError from "./_statusComponents/nodeError";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import "./auth.scss";

// import getBestTopology from "./topology/data";
import { Dialog, Toast } from "antd-mobile"; // Toast, Button
import PolicyTip from "./_components/policyTip";
import ThemeCancel from "./_statusComponents/themeCancel";
import ExhibitFooter from "./_components/exhibitFooter";
import ContractTip from "./_components/contractTip";
import ExhibitOffLine from "./_statusComponents/exhibitOffLine";
import ExhibitHeader from "./_components/exhibitHeader";
import ExhibitList from "./_components/exhibitList";
import { freelogAuth } from "freelog-runtime-core";


const { SUCCESS, USER_CANCEL } = freelogAuth.resultType;
const { setUserInfo, loginCallback, getUserInfoForAuth, updateEvent, reload } =
  freelogAuth;
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
  const nodeInfo = freelogAuth.nodeInfo;

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
    setModalType(0);
    setTimeout(() => {
      props.loginFinished(type);
    }, 10);
  }

  async function getDetail(id?: string) {
    setSelectedPolicies([]);
    if (!id) {
      const userInfo: any = getUserInfoForAuth();
      const con = await freelogAuth.getContracts({
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
    // setCurrentExhibit({...currentExhibit})
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
    if (!isExist && events[0]) {
      setCurrentExhibit(events[0]);
      if (events[0].isTheme && !events[0].isAvailable) {
        setThemeCancel(true);
      }
    }
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
    let policy = {};
    currentExhibit.policiesActive.forEach((item: any) => {
      if ([...selectedPolicies, id].includes(item.policyId)) {
        policy = item;
        subjects.push({
          subjectId: currentExhibit.exhibitId,
          policyId: item.policyId,
        });
      }
    });
    const userInfo: any = getUserInfoForAuth();
    const res = await freelogAuth.batchSign({
      subjects,
      subjectType: 2,
      licenseeId: userInfo.userId + "",
      licenseeIdentityType: 3,
      isWaitInitial: 1,
    });
    if (res.data.errcode) {
      if (res.data.msg === "subject-policy-check-failed") {
        // @ts-ignore
        policy._disabled = true;
        setCurrentExhibit({ ...currentExhibit });
        Toast.show({
          icon: <i className="iconfont auth-tip">&#xe62f;</i>,
          content: "策略已下线无法签约",
          duration: 1500,
        });
        return;
      }
      Toast.show({
        icon: "fail",
        content: res.data.msg,
        duration: 1500,
      });
      return;
    }
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
          <ExhibitList
            setIsListVisible={setIsListVisible}
            isListVisible={isListVisible}
            events={events}
            setCurrentExhibit={setCurrentExhibit}
            userCancel={userCancel}
            currentExhibit={currentExhibit}
          />
          {props.isAuths && currentExhibit ? (
            <div className="flex-column w-100x h-100x over-h justifffy-end">
              <ExhibitHeader
                currentExhibit={currentExhibit}
                closeCurrent={closeCurrent}
                events={events}
              />
              {currentExhibit.availableData.authCode === 403 ? (
                <div className="flex-row align-center mx-15 py-5 auth-forbidden">
                  {/* <i
                    className="iconfont"
                    
                  >
                    &#xe62f;
                  </i> */}
                  <span>授权异常：此展品因违规授权相关操作已被禁用</span>
                </div>
              ) : null}
              {nodeInfo.ownerUserStatus === 1 ? (
                <div className="flex-row align-center py-5 px-10 mx-15 fs-12 auth-freeze">
                  <div className="w-16 h-16 over-h flex-column-center mr-5 fs-16">
                    <img src="/warn.svg" alt="" className="w-100x" />
                  </div>
                  <span>该展品运营方账号因违规已被冻结，请谨慎处理授权。</span>
                </div>
              ) : null}
              {currentExhibit.onlineStatus === 0 ? (
                <ExhibitOffLine length={events.length} type="offline" />
              ) : currentExhibit.availableData.authCode === 403 ? (
                <ExhibitOffLine length={events.length} type="freezed" />
              ) : (
                <>
                  {currentExhibitId === currentExhibit.exhibitId && (
                    <div className="flex-column flex-1 over-h w-100x">
                      <div className="w-100x h-100x y-auto pb-20">
                        <ContractTip currentExhibit={currentExhibit} />
                        {currentExhibit.contracts.map(
                          (contract: any, index: number) => {
                            return (
                              <Contract
                                policy={contract.policyInfo}
                                isAvailable={currentExhibit.isAvailable}
                                contract={contract}
                                paymentFinish={paymentFinish}
                                setModalType={setModalType}
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
                                loginFinished={loginFinished}
                                setModalType={setModalType}
                                getAuth={getAuth}
                                disabled={policy._disabled}
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
                  )}
                </>
              )}
              {getUserInfoForAuth() ? null : (
                <ExhibitFooter setModalType={setModalType} />
              )}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
