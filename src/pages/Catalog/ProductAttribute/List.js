import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import ProductAttributeGroupList from '../ProductAttributeGroup/List';

const FormItem = Form.Item;
const Option = Select.Option;

@connect()
@Form.create()
class ProductAttributeList extends PureComponent {
    state = {
        loading: false,
        visible: false,
        data: [],
        current: {},
        submitting: false,
        selectLoading: false,
        children: []
    };

    columns = [
        {
            title: '操作',
            align: 'center',
            key: 'operation',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.showEditModal(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteItem(record.id)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Fragment>
            )
        },
        {
            title: 'ID',
            dataIndex: 'id',
            width: 120,
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '组',
            dataIndex: 'groupName',
        }
    ];

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

            let bt = 'attr/addProductAttr';
            if (id) {
                params.id = id;
                bt = 'attr/editProductAttr';
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
                type: 'attr/deleteProductAttr',
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
            title: '删除属性',
            content: '确定删除该属性吗？',
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
                type: 'attr/queryProductAttr',
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

        this.setState({
            selectLoading: true
        });
        new Promise(resolve => {
            dispatch({
                type: 'group/queryProductAGS',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                // console.log(res);
                this.setState({
                    selectLoading: false,
                });
                let cs = [];
                let list = [];
                list = res.data;
                list.forEach(c => {
                    cs.push(<Option value={c.id} key={c.id}>{c.name}</Option>);
                });
                this.setState({ children: cs });
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
                            rules: [{ required: true, message: '请输入属性名称' }],
                            initialValue: this.state.current.name || '',
                        })(<Input placeholder="请输入" />)}
                    </FormItem>
                    <FormItem label={<span>组</span>} {...formLayout}>
                        {getFieldDecorator('groupId', {
                            rules: [{ required: true, message: '请选择属性组' }],
                            initialValue: this.state.current.groupId || '', valuePropName: 'value'
                        })(
                            <Select loading={this.state.selectLoading} allowClear={true}>
                                {this.state.children}
                            </Select>)}
                    </FormItem>
                </Form>
            );
        };
        const action = (
            <Fragment>
                <Button
                    onClick={this.showModal}
                    type="primary"
                    icon="plus">新增</Button>
            </Fragment>
        );
        return (
            <PageHeaderWrapper title="商品属性">
                <div>
                    <Card bordered={false}
                    // extra={extraContent}
                    >
                        <div style={{ marginBottom: '20px' }} >
                            {action}
                        </div>
                        <Table bordered
                            rowKey={record => record.id}
                            pagination={false}
                            loading={this.state.loading}
                            dataSource={this.state.data}
                            columns={this.columns}
                        />
                    </Card>
                </div>
                <Modal
                    title={`商品属性 - ${this.state.current.id ? '编辑' : '新增'}`}
                    destroyOnClose
                    visible={this.state.visible}
                    {...modalFooter}>
                    {getModalContent()}
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default ProductAttributeList;
