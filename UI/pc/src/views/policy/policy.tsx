/* @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import { useState } from "react";

import PolicyContent from "./_components/policyContent";
import Button from "../_commons/button";

import { Tabs, Checkbox, Popconfirm } from "antd";

const { TabPane } = Tabs;
const { getCurrentUser } = window.freelogAuth;
interface ItemProps {
  policy: any;
  selectType: boolean;
  policySelect: any;
  seq: number;
  isAvailable: boolean;
  getAuth: any;
  children?: any;
}
export default function Policy(props: ItemProps) {
  const [visible, setVisible] = useState(false);
  function callback(key: any) {}
  function onChange(e: any) {
    props.policySelect(props.policy.policyId, e.target.checked);
  }
  async function confirm(e: any) {
    props.getAuth();
    setVisible(false);
  }

  function cancel(e: any) {
    props.policySelect();
    setVisible(false);
  }
  return (
    <div
      className="flex-column policy-card w-100x"
      css={css`
        margin-top: 15px;
        background: #ffffff;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      `}
    >
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-20 pt-15">
        <div
          className="flex-1 policy-name  text-ellipsis"
          css={css`
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
          `}
        >
          {props.policy.policyName}
        </div>
        {props.selectType ? (
          <Popconfirm
            title="确定使用此策略与展品签约？"
            onConfirm={confirm}
            onCancel={cancel}
            visible={visible}
            // icon={<span className="d-none"></span>}
            okText="确定"
            cancelText="取消"
            // @ts-ignore
            zIndex={1400}
          >
            <Button
              className="fs-13"
              click={() => {
                props.policySelect(props.policy.policyId, true, true);
                setVisible(true);
              }}
              disabled={!props.isAvailable}
            >
              签约
            </Button>
          </Popconfirm>
        ) : (
          <Checkbox onChange={onChange} disabled={!getCurrentUser()}></Checkbox>
        )}
      </div>
      {/* 下：tab */}
      <div className="flex-column px-20">
        <Tabs defaultActiveKey="1" onChange={callback} className="select-none">
          <TabPane tab="策略内容" key="1">
            <PolicyContent
              translateInfo={props.policy.translateInfo}
            ></PolicyContent>
          </TabPane>
          {/* <TabPane tab="状态机视图" key="2">
            <PolicyGraph policy={props.policy}></PolicyGraph>
          </TabPane> */}
          <TabPane tab="策略代码" key="3">
            <PolicyCode policyText={props.policy.policyText}></PolicyCode>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
