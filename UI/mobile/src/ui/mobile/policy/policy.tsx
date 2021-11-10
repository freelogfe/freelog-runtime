import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import { useState } from "react";

import PolicyContent from "./_components/policyContent";
import user from "../../../services/api/modules/user";
import frequest from "../../../services/handler";
import { Tabs, Badge, Dialog, Button, Checkbox } from "antd-mobile";
const { SUCCESS, USER_CANCEL, FAILED } = window.freelogAuth.resultType;

const { getCurrentUser } = window.freelogAuth;
interface ItemProps {
  policy: any;
  selectType: boolean;
  policySelect: any;
  seq: number;
  loginFinished: any;
  setModalType: any;
  getAuth: any;
  children?: any;
}
const tabs = [
  { title: <Badge>策略内容</Badge> },
  { title: <Badge>状态机视图</Badge> },
  { title: <Badge>策略代码</Badge> },
];
export default function (props: ItemProps) {
  function onChange(e: any) {
    props.policySelect(props.policy.policyId, e.target.checked);
  }
  async function confirm(id: any) {
    props.getAuth(id);
  }

  function cancel() {
    props.policySelect();
  }

  return (
    <div className="flex-column brs-10 b-1 mx-10 mt-15">
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-15 py-15">
        <div className="flex-1 text-ellipsis fc-main fs-16 fw-bold">
          {props.policy.policyName}
        </div>
        {props.selectType ? (
          <Button
            color="primary"
            size="small"
            onClick={() => {
              if (!getCurrentUser()) {
                props.setModalType(1);
                return;
              }
              props.policySelect(props.policy.policyId, true, true);
              setTimeout(() => {
                Dialog.confirm({
                  content:
                    "确定使用策略 " + props.policy.policyName + " 与资源签约？",
                  onConfirm: async () => {
                    confirm(props.policy.policyId);
                  },
                  onCancel: () => cancel(),
                });
              }, 0);
            }}
            disabled={!getCurrentUser()}
          >
            签约
          </Button>
        ) : (
          <Checkbox onChange={onChange}></Checkbox>
        )}
      </div>
      {/* 下：tab */}
      <div className="flex-column">
        <Tabs defaultActiveKey="policy">
          <Tabs.TabPane title="策略内容" key="policy">
            <div className="px-15">
              <PolicyContent
                translateInfo={props.policy.translateInfo}
              ></PolicyContent>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane title="状态机视图" key="statusDAG">
            <div className="px-15">
              <PolicyGraph policy={props.policy}></PolicyGraph>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane title="策略代码" key="policyCode">
            <div className="px-15">
              <PolicyCode policyText={props.policy.policyText}></PolicyCode>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
