import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import { useState, useEffect } from "react";

import PolicyContent from "./_components/policyContent";
import Button from "../_components/button";

import { Tabs, Checkbox, Popconfirm } from "antd";

const { TabPane } = Tabs;

interface ItemProps {
  policy: any;
  selectType: boolean;
  policySelect: any;
  seq: number;
  getAuth: any;
  children?: any;
}
export default function (props: ItemProps) {
  const [visible, setVisible] = useState(false);
  function callback(key: any) {}
  function onChange(e: any) {
    console.log(e)
    props.policySelect(props.policy.policyId, e.target.checked);
  }
  async function confirm(e: any) {
    props.getAuth()
    setVisible(false);
  }

  function cancel(e: any) {
    props.policySelect();
    setVisible(false);
  }
  return (
    <div className="flex-column policy-card">
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-20 py-15">
        <div className="flex-1 policy-name  text-ellipsis">
          {props.policy.policyName}
        </div>
        {props.selectType ? (
          <Popconfirm
            title="确定使用此策略与资源签约？"
            onConfirm={confirm}
            onCancel={cancel}
            zIndex={1202}
            visible={visible}
            // @ts-ignore
            getPopupContainer={() => document.getElementById("runtime-root")}
            okText="确定"
            cancelText="取消"
          >
            <Button
              className="fs-13"
              click={() => {
                props.policySelect(props.policy.policyId);
                setVisible(true);
              }}
            >
              签约
            </Button>
          </Popconfirm>
        ) : (
          <Checkbox onChange={onChange}></Checkbox>
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
          <TabPane tab="状态机视图" key="2">
            <PolicyGraph policy={props.policy}></PolicyGraph>
          </TabPane>
          <TabPane tab="策略代码" key="3">
            <PolicyCode policyText={props.policy.policyText}></PolicyCode>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
