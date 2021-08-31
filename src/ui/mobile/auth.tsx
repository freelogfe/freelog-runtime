import { SUCCESS, USER_CANCEL } from "../../bridge/event";
import React, { useState, useEffect } from "react";
import { LOGIN } from "../../bridge/event";
import Contract from "./contract/contract";
import Policy from "./policy/policy";
import frequest from "../../services/handler";
import presentable from "../../services/api/modules/presentable";
import Confirm from "./_components/confirm";
import Login from "./login";
import { setUserInfo } from "../../platform/structure/utils";
import { loginCallback } from "../../platform/structure/event";
import contract from "../../services/api/modules/contract";
import { getCurrentUser } from "../../platform/structure/utils";
import getBestTopology from "./topology/data";
import { Modal, Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
const alert = Modal.alert;

 

interface contractProps {
  events: Array<any>;
  contractFinished(eventId: any, type: number, data?: any): any;
  loginFinished: any;
  children?: any;
  updateEvents: any;
}
export default function (props: contractProps) {
  /**
   * 对象形式authDatas：
   *   key: subjectId
   *   value: { policies: {policyId: }, contracts: {contractId: }，}
   * 在合约里面通过策略拿翻译
   * 流程：
   *     未授权过来需要整合数据
  *       widget: caller.name,
          errCode: response.data.errCode,
          authCode: response.data.data.authCode,
          contracts: response.data.data.data.contracts,
          policies: response.data.data.data.policies,
          presentableName,
          presentableId,
          info: response.data,
   *     点击展品：
   *         1.如果有合约则请求合约
   *         2.请求策略
   *     签约：
   *         签约后判断有无授权：
   *             1.授权：直接清除events
   *             2.未授权：更新events对应的数据
   *     执行事件：
   *             
   */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const [contracts, setContracts] = useState([]);
  const events = props.events || [];
  const [currentPresentable, setCurrentPresentable] = useState(events[0]);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState<Array<any>>([]);
  function paymentFinish() {
    getDetail();
  }
  function loginFinished(type: number, data?: any) {
    setUserInfo(data);
    loginCallback.forEach((func: any) => {
      func && func();
    });
    // TODO 重载插件需要把授权的也一并清除
    console.log("login finish");
    props.loginFinished()
    setIsLoginVisible(false);
  }
  function showPolicy() { }
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
    const isExist = events.some((item: any) => {
      if (item.presentableId === currentPresentable.presentableId) {
        setCurrentPresentable(item);
        return true;
      }
    });
    !isExist && setCurrentPresentable(events[0]);
  }, [props.events]);
  useEffect(() => {
    currentPresentable && getDetail(currentPresentable.presentableId);
  }, [currentPresentable]);

  const userCancel = () => {
    props.contractFinished("", USER_CANCEL);
  };
  function policySelect(policyId: number, checked?: boolean, single?:boolean) {
    if (policyId) {
      if(checked){
        if(single){
          setSelectedPolicies([policyId]);
        }else{
          setSelectedPolicies([...selectedPolicies, policyId]);
        }
      }else{
        setSelectedPolicies([...selectedPolicies].filter((item:any)=> item !== policyId))
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
        props.contractFinished(currentPresentable.eventId, SUCCESS);
        return true;
      }
    });
    if (!isAuth) {
      props.updateEvents({ ...currentPresentable, contracts: res.data.data });
    }
  };
  return (
    <React.Fragment>
      {contracts.length && policies.length - contracts.length ? (
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
            selectType={contracts.length ? true : true}
          ></Policy>
        );
      })}
    </React.Fragment>
  );
}
