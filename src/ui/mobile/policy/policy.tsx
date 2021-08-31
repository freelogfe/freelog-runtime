import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import { useState, useEffect } from "react";

import PolicyContent from "./_components/policyContent";
import Button from "../_components/button";

import { Checkbox, } from "antd";
import { Tabs, WhiteSpace, Badge } from 'antd-mobile';

import { Modal, WingBlank, Toast } from 'antd-mobile';
const alert = Modal.alert;

interface ItemProps {
  policy: any;
  selectType: boolean;
  policySelect: any;
  seq: number;
  getAuth: any;
  children?: any;
}
const tabs = [
  { title: <Badge>策略内容</Badge> },
  { title: <Badge>状态机视图</Badge> },
  { title: <Badge>策略代码</Badge> },
];
export default function (props: ItemProps) {
  const [visible, setVisible] = useState(false);
  function callback(key: any) { }
  function onChange(e: any) {
    console.log(e)
    props.policySelect(props.policy.policyId, e.target.checked);
  }
  async function confirm(id: any) {
    props.getAuth(id)
  }

  function cancel() {
    props.policySelect();
  }
  return (
    <div className="flex-column policy-card">
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-20 py-15">
        <div className="flex-1 policy-name  text-ellipsis">
          {props.policy.policyName}
        </div>
        {props.selectType ? (

          <Button
            className="fs-13"
            click={() => {
              props.policySelect(props.policy.policyId, true, true);
              setTimeout(() => {
                alert('签约', "确定使用此策略与资源签约？", [
                  { text: '取消', onPress: () => cancel() },
                  { text: '确定', onPress: () => confirm(props.policy.policyId) },
                ])
              }, 1000)
            }}
          >
            签约
          </Button>
        ) : (
          <Checkbox onChange={onChange}></Checkbox>
        )}
      </div>
      {/* 下：tab */}
      <div className="flex-column px-20">
        <Tabs tabs={tabs}
          initialPage={1}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            <PolicyContent
              translateInfo={props.policy.translateInfo}
            ></PolicyContent>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            <PolicyGraph policy={props.policy}></PolicyGraph>

          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
            <PolicyCode policyText={props.policy.policyText}></PolicyCode>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
