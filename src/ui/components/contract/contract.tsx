import { Radio, Input, Space } from 'antd';
import { useState, useEffect } from "react";
import './contract.scss'
var moment = require('moment');

interface ItemProps {
  contract: any;
  children?: any;
}
export default function (props: ItemProps) {
  const [value, setValue] = useState(1);
  console.log(props.contract)
  function onChange(e:any){

  }
  return (
    <div className="contract-card px-20 py-15 mt-15 w-100x">
      <div className="flex-row w-100x">
        <div className="contract-name  text-ellipsis">{props.contract.contractName}</div>
        <div className="policy-button cur-pointer  shrink-0">策略内容</div>
      </div>
      {/* 状态整体 */}
      <div className="status-card p-15 mt-15">
        <div className="flex-row">
          <div className="bg-auth-none auth-status text-center">未授权</div>
          <div className="auth-time">{moment(props.contract.updateDate).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div className="flex-row py-10">
          <div>当前无授权，请选择执行事件</div>
          <div>支付</div>
        </div>
        {/* 可选事件 */}
        <div>
          <div className="flex-row">
            <Radio.Group onChange={onChange} value={value}>
              <div className="flex-column">
                <Radio value={1}>
                  <div className="flex-column">支付10fetch获取授权</div>
                </Radio>
                <Radio value={2}>Option B</Radio>
                <Radio value={3}>Option C</Radio>
                <Radio value={4}>
                  More...
                  {value === 4 ? <Input style={{ width: 100, marginLeft: 10 }} /> : null}
                </Radio>
              </div>
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
