import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import { useState, useEffect } from "react";
import { SUCCESS } from "../../../bridge/event";

import PolicyContent from "./_components/policyContent";
import { getCurrentUser } from "../../../platform/structure/utils";
import user from "../../../services/api/modules/user";
import frequest from "../../../services/handler";
import { Checkbox } from "antd";
import { Tabs, Badge, Modal, Button } from "antd-mobile";

const alert = Modal.alert;
const prompt = Modal.prompt;

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
  const [visible, setVisible] = useState(false);
  function callback(key: any) {}
  function onChange(e: any) {
    console.log(e);
    props.policySelect(props.policy.policyId, e.target.checked);
  }
  async function confirm(id: any) {
    props.getAuth(id);
  }

  function cancel() {
    props.policySelect();
  }
  const login = async (loginName: string, password: string) => {
    const values: any = {
      loginName,
      password,
      isRemember: 1,
    }
    // loginName: "string",
    //   password: "string",
    //   isRemember: "string",
    //   returnUrl: "string",
    //   jwtType: "string",

    values.isRemember = values.isRemember ? 1 : 0;
    const res = await frequest(user.login, "", values);
    if (res.data.errCode === 0) {
      props.loginFinished(SUCCESS, res.data.data);
    }
  };
  return (
    <div className="flex-column brs-10 b-1 mx-10 mt-15">
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-15 py-15">
        <div className="flex-1 text-ellipsis fc-main fs-16 fw-bold">
          {props.policy.policyName}
        </div>
        {props.selectType ? (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if(!getCurrentUser()){
                props.setModalType(1)
                return
                prompt(
                  '登录',
                  '',
                  (name, password) => {name && password && login(name, password)},
                  'login-password',
                  '',
                  ['输入用户名', '输入密码'],
                );
                return
              }
              props.policySelect(props.policy.policyId, true, true);
              setTimeout(() => {
                alert("签约","确定使用策略 " + props.policy.policyName + " 与资源签约？", [
                  { text: "取消", onPress: () => cancel() },
                  {
                    text: "确定",
                    onPress: () => confirm(props.policy.policyId),
                  },
                ]);
              }, 0);
            }}
          >
            {getCurrentUser() ? "签约" : "请登录"}
          </Button>
        ) : (
          <Checkbox onChange={onChange}></Checkbox>
        )}
      </div>
      {/* 下：tab */}
      <div className="flex-column">
        <Tabs
          tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => {
            console.log("onChange", index, tab);
          }}
          onTabClick={(tab, index) => {
            console.log("onTabClick", index, tab);
          }}
        >
          <div className="px-15">
            <PolicyContent
              translateInfo={props.policy.translateInfo}
            ></PolicyContent>
          </div>
          <div>
            <PolicyGraph policy={props.policy}></PolicyGraph>
          </div>
          <div className="px-15">
            <PolicyCode policyText={props.policy.policyText}></PolicyCode>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
