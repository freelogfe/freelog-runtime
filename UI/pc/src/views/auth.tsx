import { Modal } from "antd";
import { useState, useEffect } from "react";
import Button from "./_components/button";
import "./auth.scss";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "@/services/handler";
import presentable from "@/services/api/modules/presentable";
import Confirm from "./_components/confirm";
import Login from "./login";
import contract from "@/services/api/modules/contract";
import getBestTopology from "./topology/data";
import Tip from "./_components/tip";
const { SUCCESS, USER_CANCEL } = window.freelogAuth.resultType;
const { setUserInfo, loginCallback, getCurrentUser } = window.freelogAuth;
/**
 * 展品授权窗口：
 *     左：展品列表
 *         上：展品名称
 *         下：已签约合同：绿色：已授权，黄色：未授权，红色：异常
 *     右：合约与策略列表：合约列表在上面，策略在下面
 *         合约：上：策略名称
 *               中： 上：策略内容：当前状态---->是否授权，当前时间--->状态内容，事件需要可点击
 *                    下：合约流转记录：可显示隐藏
 *               下：合约编号，签约时间
 *         策略：上：整行：名称 复选框（没有合约时，复选框变成签约按钮）
 *               中：tab页：策略内容，状态机视图，策略代码
 * 组件化：不过分考虑细腻度
 *     最外层：
 *         待获取授权展品组件
 *         合约组件：授权状态组件（全局），按钮组件（全局），流转记录组件（有可能需要放大，所以提出来）
 *         策略组件(策略组件需要放大或点击合约的策略内容单独显示)：状态机视图组件，策略内容组件，策略代码组件
 *
 * 最外面拦截到errCode === 30 时需要跳转登录
 *
 */

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
  const [contracts, setContracts] = useState([]);
  const events = props.events || [];
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([]);
  function paymentFinish() {
    getDetail();
  }
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
    setIsLoginVisible(false);
    props.loginFinished(type);
  }
  async function getDetail(id?: string) {
    setSelectedPolicies([]);
    // userInfo 如果不存在就是未登录
    const userInfo: any = getCurrentUser();
    const con =
      userInfo &&
      (await frequest(contract.getContracts, "", {
        subjectIds: currentPresentable.presentableId,
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
        return false;
      });
      if (!isAuth) {
        props.updateEvents({ ...currentPresentable, contracts: con.data.data });
      }
      return;
    }
    const res = await frequest(
      presentable.getPresentableDetail,
      [id || currentPresentable.presentableId],
      {
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      }
    );
    /**
     * 获取
     */

    res.data.data.policies = res.data.data.policies.filter((i: any) => {
      return i.status === 1;
    });
    res.data.data.policies.forEach((item: any) => {
      const {
        policyMaps,
        bestPyramid,
        betterPyramids,
        nodesMap,
      } = getBestTopology(item.fsmDescriptionInfo);
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
            return false;
          });
          return true;
        }
        return false;
      });
      setContracts(contracts);
    }
  }
  useEffect(() => {
    setThemeCancel(false);
    const isExist = events.some((item: any) => {
      if (item.presentableId === currentPresentable.presentableId) {
        setCurrentPresentable(item);
        return true;
      }
      return false;
    });
    !isExist && setCurrentPresentable(events[0]);
  }, [props.events]);
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.presentableId);
  }, [currentPresentable]);
  useEffect(() => {
    props.isLogin && setIsLoginVisible(true);
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
  function act() {
    if (!getCurrentUser()) {
      setIsLoginVisible(true);
      return;
    }
    setIsModalVisible(true);
  }
  const getAuth = async () => {
    const subjects: any = [];
    policies.forEach((item: any) => {
      selectedPolicies.includes(item.policyId) &&
        subjects.push({
          subjectId: currentPresentable.presentableId,
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
          props.contractFinished(currentPresentable.eventId, SUCCESS);
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
        setIsTipVisible(false);
      }, 1500);
      setTimeout(() => {
        props.updateEvents({ ...currentPresentable, contracts: res.data.data });
      }, 1600);
    }
  };
  return (
    <>
      {themeCancel ? (
        <div className="w-100x h-100x text-center">
          <div className="theme-tip mb-30">
            当前节点主题未开放授权，继续浏览请签约并获取授权
          </div>
          <Button
            click={() => {
              setThemeCancel(false);
            }}
            className="px-50 py-15"
          >
            签约
          </Button>
        </div>
      ) : (
        <div className="runtime-pc bg-white" id="runtime-pc">
          {isModalVisible && (
            <Confirm
              setIsModalVisible={setIsModalVisible}
              isModalVisible={isModalVisible}
              getAuth={getAuth}
              policies={policies}
              currentPresentable={currentPresentable}
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
          {props.isAuths && (
            <Modal
              zIndex={1200}
              centered
              footer={null}
              visible={props.isAuths}
              onCancel={userCancel}
              className={currentPresentable.isTheme ? "theme-height" : "h-620"}
              width={currentPresentable.isTheme ? 600 : 860}
              keyboard={false}
              maskClosable={false}
              wrapClassName="freelog-contract"
            >
              <div className="flex-column py-20 align-center bb-1">
                <div className="auth-title ">
                  {currentPresentable.isTheme ? "节点授权" : "展品授权"}
                </div>
                {currentPresentable.isTheme ? (
                  <div className="auth-des mt-15">
                    当前节点主题未开放授权，继续浏览请选择策略签约并获取授权
                  </div>
                ) : null}
              </div>
              <div
                className={
                  currentPresentable.isTheme
                    ? " w-100x  flex-column "
                    : "w-100x h-551 flex-column"
                }
              >
                {/* 左右 */}
                <div className="w-100x flex-1 flex-row over-h">
                  <div className="w-100x h-100x  flex-row">
                    {/* 左：待授权展品列表 */}
                    {!currentPresentable.isTheme && (
                      <div className="flex-column w-344 h-100x  y-auto">
                        {events.length
                          ? events.map((item: any, index: number) => {
                              return (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setCurrentPresentable(item);
                                  }}
                                  className={
                                    (currentPresentable === item
                                      ? "presentable-selected "
                                      : "") +
                                    " px-20 py-15 w-100x b-box x-auto  cur-pointer presentable-item select-none flex-column"
                                  }
                                >
                                  <div
                                    className="presentable-name w-100x text-ellipsis flex-1 flex-row align-center"
                                    title={item.presentableName}
                                  >
                                    <span>{item.presentableName}</span>
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
                              );
                            })
                          : null}
                        {/* <Presentables></Presentables> */}
                      </div>
                    )}
                    {/* 右：策略或合约列表 */}
                    <div
                      className={
                        (!currentPresentable.isTheme ? "w-516 " : "w-600") +
                        " bg-content h-100x   y-auto px-20 pb-20"
                      }
                    >
                      {contracts.length &&
                      policies.length - contracts.length ? (
                        <div className="policy-tip flex-row align-center mt-15 px-10">
                          <div className="tip">最下方有可签约的策略</div>
                        </div>
                      ) : null}
                      {contracts.map((contract: any, index: number) => {
                        return (
                          <Contract
                            policy={contract.policyInfo}
                            contract={contract}
                            paymentFinish={paymentFinish}
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
                            getAuth={getAuth}
                            policySelect={policySelect}
                            selectType={contracts.length ? true : false}
                          ></Policy>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {contracts.length ? (
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
                      {getCurrentUser() ? "立即签约" : "立即登陆"}
                    </Button>
                  </div>
                )}
              </div>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}
