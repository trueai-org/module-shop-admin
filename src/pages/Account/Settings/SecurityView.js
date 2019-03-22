import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List } from 'antd';
import { connect } from 'dva';
import { Popconfirm } from 'antd';
import { message, Modal, Select, Input, Form, Row, Col, Button } from 'antd';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const { Option } = Select;
const InputGroup = Input.Group;
const FormItem = Form.Item;

const notVerify = <font style={{ marginLeft: 5, }} className="weak">未验证</font>;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class SecurityView extends Component {

  handleRemoveEmail = () => {
    const { dispatch } = this.props;
    new Promise(resolve => {
      dispatch({
        type: 'user/removeEmail',
        payload: {
          resolve,
          params: {}
        },
      });
    }).then(res => {
      if (res.success === true) {
        message.info("移除绑定成功");
      } else {
        message.error(res.message);
      }
    });
  };

  handleRemovePhone = () => {
    const { dispatch } = this.props;
    new Promise(resolve => {
      dispatch({
        type: 'user/removePhone',
        payload: {
          resolve,
          params: {}
        },
      });
    }).then(res => {
      if (res.success === true) {
        message.info("移除绑定成功");
      } else {
        message.error(res.message);
      }
    });
  };

  getData = () => {
    const { currentUser } = this.props;
    return [{
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: '已设置',
      actions: [
        <a>修改</a>
      ],
    },
    {
      // 注意，绑定的手机一定是已验证的
      // title: formatMessage({ id: 'app.settings.security.phone' }, {}),
      // description: `${formatMessage({ id: 'app.settings.security.phone-description' }, {})}${currentUser.phone}`,
      title: '绑定手机',
      description: (
        <Fragment>
          {
            currentUser.phone ?
              formatMessage({ id: 'app.settings.security.phone-description' }, {}) : '无'
          }
          {currentUser.phone}
        </Fragment>
      ),
      actions: this.getPhoneArray()
    },
    {
      title: `绑定邮箱`,
      description: (
        <Fragment>
          {
            currentUser.email ?
              formatMessage({ id: 'app.settings.security.email-description' }, {}) : '无'
          }
          {currentUser.email}
          {currentUser.emailConfirmed || !currentUser.email ? null : notVerify}
        </Fragment>
      ),
      actions: this.getEmailArray()
    },
    ]
  };

  getPhoneArray = () => {
    const { currentUser } = this.props;
    let acs = [];
    if (currentUser.phone) {
      acs.push(<Popconfirm title="确定要移除此绑定吗?" onConfirm={() => this.handleRemovePhone()}>
        <a>删除</a>
      </Popconfirm>);
    } else {
      acs.push(<a>设置</a>);
    }
    return acs;
  }

  getEmailArray = () => {
    const { currentUser } = this.props;
    let acs = [];
    if (currentUser.email) {
      if (!currentUser.emailConfirmed) {
        acs.push(<a>立即验证</a>);
      }
      acs.push(<Popconfirm title="确定要移除此绑定吗?" onConfirm={() => this.handleRemoveEmail()}>
        <a>删除</a>
      </Popconfirm>);
    } else {
      acs.push(<a>设置</a>);
    }
    return acs;
  }

  render() {
    return (
      <div>
        <Fragment>
          <List
            itemLayout="horizontal"
            dataSource={this.getData()}
            renderItem={item => (
              <List.Item actions={item.actions}>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        </Fragment>

        <Modal
          title={`进一步验证`}
          destroyOnClose
          centered
          visible={true}
        // visible={login.requiresTwoFactor}
        // onCancel={() => { this.changeFactor(false) }}
        // onOk={this.handleSubmitTwoFactor}
        >
          <Form onSubmit={this.handleSubmitTwoFactor}>
            <FormItem>
              <InputGroup compact>
                <Select
                  size="large"
                  // value={prefix}
                  // onChange={this.changePrefix}
                  style={{ width: '25%' }}
                  placeholder="验证方式"
                >
                  {/* {providers.map(x => <Option value={x.key} key={x.key}>{x.key}</Option>)} */}
                </Select>
                <Input
                  disabled
                  size="large"
                  style={{ width: '75%' }}
                // value={
                //   providers && prefix && providers.find(c => c.key == prefix) ?
                //     providers.find(c => c.key == prefix).value : null
                // }
                />
              </InputGroup>
            </FormItem>
            {/* <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'validation.verification-code.required' }),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    size="large"
                    disabled={count}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha2}
                  >
                    {count
                      ? `${count} s`
                      : formatMessage({ id: 'app.register.get-verification-code' })}
                  </Button>
                </Col>
              </Row>
            </FormItem> */}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default SecurityView;
