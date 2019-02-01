import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect()
@Form.create()
class ProductOptionList extends PureComponent {
    state = {
        loading: false,
        visible: false,
        data: [],
        current: {},
        submitting: false
    };

    componentDidMount() {
        this.handleInit();
    }

    showModal = () => {
        this.setState({
            visible: true,
            current: {},
        });
    };

    showEditModal = item => {
        this.setState({
            visible: true,
            current: item,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const id = this.state.current ? this.state.current.id : '';

        form.validateFields((err, values) => {
            if (err) return;

            var params = {
                ...values
            };

            let bt = 'option/addProductOption';
            if (id) {
                params.id = id;
                bt = 'option/editProductOption';
            }

            // console.log(params);

            if (this.state.submitting === true)
                return;
            this.setState({ submitting: true });
            new Promise(resolve => {
                dispatch({
                    type: bt,
                    payload: {
                        resolve,
                        params
                    },
                });
            }).then(res => {
                this.setState({ submitting: false });
                if (res.success === true) {
                    form.resetFields();
                    this.setState({ visible: false });
                    this.handleInit();
                } else {
                    notification.error({
                        message: res.message,
                    });
                }
            });
        });
    };

    deleteItem = id => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params = { id };
        new Promise(resolve => {
            dispatch({
                type: 'option/deleteProductOption',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({
                loading: false,
            });
            if (res.success === true) {
                this.handleInit();
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    showDeleteModal = (item) => {
        Modal.confirm({
            title: '删除选项',
            content: '确定删除该选项吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(item.id),
        });
    };

    handleInit = () => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        new Promise(resolve => {
            dispatch({
                type: 'option/queryProductOption',
                payload: { resolve }
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                if (res.data != null) {
                    this.setState({
                        data: res.data
                    });
                }
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    render() {
        const { form: { getFieldDecorator }, } = this.props;
        const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
        const extraContent = (
            <div>
                <Button
                    onClick={this.showModal}
                    type="primary"
                    icon="plus">
                    新增</Button>
            </div>
        );
        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
        const getModalContent = () => {
            return (
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="名称" {...formLayout}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入选项名称' }],
                            initialValue: this.state.current.name || '',
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                </Form>
            );
        };
        return (
            <PageHeaderWrapper>
                <div>
                    <Card title="商品选项" extra={extraContent}>
                        <List
                            rowKey="id"
                            loading={this.state.loading}
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <a onClick={e => { e.preventDefault(); this.showEditModal(item); }}>编辑</a>,
                                        <a onClick={e => { e.preventDefault(); this.showDeleteModal(item); }}>删除</a>,
                                    ]}>
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
                <Modal
                    title={`商品选项 - ${this.state.current ? '编辑' : '新增'}`}
                    destroyOnClose
                    visible={this.state.visible}
                    {...modalFooter}>
                    {getModalContent()}
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default ProductOptionList;
