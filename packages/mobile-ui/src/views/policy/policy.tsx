// import PolicyGraph from "./_components/policyGraph";
import PolicyCode from "./_components/policyCode";
import "./policy.scss";
import PolicyContent from "./_components/policyContent";
import { Tabs, Dialog, Button, Checkbox } from "antd-mobile";
import { freelogAuth } from "@/freelog/structure/freelogAuth";

const { getCurrentUser } =  freelogAuth;
interface ItemProps {
  policy: any;
  selectType: boolean;
  policySelect: any;
  disabled: boolean;
  seq: number;
  loginFinished: any;
  setModalType: any;
  isAvailable: boolean;
  getAuth: any;
  children?: any;
}
// const tabs = [
//   { title: <Badge>策略内容</Badge> },
//   { title: <Badge>状态机视图</Badge> },
//   { title: <Badge>策略代码</Badge> },
// ];
export default function Policy(props: ItemProps) {
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
    <div
      style={{
        cursor: props.disabled ? "not-allowed" : "normal",
        opacity: props.disabled ? "40%" : "1",
        pointerEvents: props.disabled ? "none" : "auto",
      }}
      className="flex-column brs-10 b-1 mx-10 mt-15 policy-container"
    >
      {/* 上：策略名称与操作 */}
      <div className="flex-row space-between px-15 py-15">
        <div className="flex-1 text-ellipsis fc-main fs-16 fw-bold lh-33">
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
                    "确定使用策略 " + props.policy.policyName + " 与展品签约？",
                  onConfirm: async () => {
                    confirm(props.policy.policyId);
                  },
                  onCancel: () => cancel(),
                  bodyClassName: "fs-24",
                });
              }, 0);
            }}
            disabled={!getCurrentUser() || !props.isAvailable || props.disabled}
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
          <Tabs.Tab title="策略内容" key="policy">
            <div className="px-15">
              <PolicyContent
                translateInfo={props.policy.translateInfo}
              ></PolicyContent>
            </div>
          </Tabs.Tab>

          {/* <Tabs.Tab title="状态机视图" key="statusDAG">
            <div className="px-15">
              <PolicyGraph policy={props.policy}></PolicyGraph>
            </div>
          </Tabs.Tab> */}
          <Tabs.Tab title="策略代码" key="policyCode">
            <div className="px-15">
              <PolicyCode policyText={props.policy.policyText}></PolicyCode>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
}
