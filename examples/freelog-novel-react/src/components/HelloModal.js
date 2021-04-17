import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export default function HelloModal() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div onClick={() => setVisible(true)}>CLICK ME</div>
      <Button onClick={() => setVisible(true)}>CLICK ME</Button>
      <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} title="freelog">
        Probably the most complete micro-frontends solution you ever met
      </Modal>
    </>
  );
}
