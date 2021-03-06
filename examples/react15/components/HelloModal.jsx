import React from 'react';
import { Button, Modal } from 'antd';

export default class HelloModal extends React.Component {

  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.setVisible = visible => this.setState({ visible });
  }

  render() {
    const { visible } = this.state;
     return (
      <div>
        <Button onClick={() => {this.setVisible(true); history.pushState(null,null, '/react');console.log(location , document.getElementsByClassName('react15-main'), document.getElementsByClassName('mainapp-sidemenu'));}}>
          CLICK ME
        </Button>
        <Modal
          visible={visible}
          closable={false}
          onOk={() => this.setVisible(false)}
          onCancel={() => this.setVisible(false)}
          title="Install"
        >
          <code>$ yarn add freelog  # or npm i freelog -S</code>
        </Modal>
      </div>
    );
  }
}
