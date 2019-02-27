import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Redio, Menu, Dropdown, Switch
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';

import router from 'umi/router';
import Link from 'umi/link';

const FormItem = Form.Item;
const Option = Select.Option;

//queryProductGrid, addProduct, editProduct, deleteProduct

@connect()
@Form.create()
class ProductList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            data: [],
            current: {},
            submitting: false,

            children: [],

            pageNum: 1,
            pageSize: 5,
            predicate: 'id',
            reverse: true,
            pageData: {
                list: [],
                pagination: {}
            },
        };
    }

    columns = [
        {
            title: '操作',
            key: 'operation',
            fixed: 'left',
            align: 'center',
            width: 180,
            render: (text, record) => (
                <Fragment>
                    <Button.Group>
                        {/* //#f5222d */}
                        <Button icon="edit" size="small" onClick={() => this.handleEdit(record.id)}></Button>
                        <Button style={{ color: record.isPublished == true ? "#1890ff" : "" }} icon={record.isPublished == true ? "pause-circle" : "play-circle"} size="small"
                            onClick={() => this.handlePublish(record.id, !record.isPublished)}></Button>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteItem(record.id)}>
                            <Button icon="delete" type="danger" size="small"></Button>
                            {/* <a href="javascript:;">删除</a> */}
                        </Popconfirm>
                    </Button.Group>
                </Fragment>
            )
        },
        {
            title: 'ID',
            dataIndex: 'id',
            // fixed: 'left',
            sorter: true,
            defaultSortOrder: 'descend',
            width: 100,
        },
        {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
            // width: 260,
        },
        {
            title: '价格',
            dataIndex: 'price',
            sorter: true,
            width: 120,
        },
        {
            title: '是否发布',
            dataIndex: 'isPublished',
            sorter: true,
            width: 120,
            align: 'center',
            // render: (val) => <Switch checked={val} disabled />
            render: (val) => <Icon style={{ color: val == true ? "#1890ff" : "#f5222d" }} type={val == true ? "check" : "close"} />
            // render: (val) => <Icon type={val == true ? "check-square" : "close-square"} />
        },
        {
            title: '有选项',
            dataIndex: 'hasOptions',
            sorter: true,
            width: 120,
            align: 'center',
            render: (val) => <Switch checked={val} disabled />,
        },
        {
            title: '单独可见',
            dataIndex: 'isVisibleIndividually',
            sorter: true,
            width: 120,
            render: (val) => <Switch checked={val} disabled />,
        },
        {
            title: '精品',
            dataIndex: 'isFeatured',
            sorter: true,
            width: 120,
            render: (val) => <Switch checked={val} disabled />,
        },
        {
            title: '允许订购',
            dataIndex: 'isAllowToOrder',
            sorter: true,
            width: 120,
            render: (val) => <Switch checked={val} disabled />,
        },
        {
            title: '库存',
            dataIndex: 'stockQuantity',
            sorter: true,
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'createdOn',
            sorter: true,
            width: 120,
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedOn',
            sorter: true,
            width: 120,
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        }
    ];

    componentDidMount() {
        this.handleSearchFirst();
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

    handleData = (text, record) => {
        router.push({
            pathname: './data',
            query: {
                id: record.id,
            },
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const id = this.state.current ? this.state.current.id : '';

        form.validateFields((err, values) => {
            if (err) return;

            var params = {
                ...values
            };

            let bt = 'product/addProductOption';
            if (id) {
                params.id = id;
                bt = 'product/editProductOption';
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
                    this.handleSearch();
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
                type: 'product/delete',
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
                this.handleSearch();
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handlePublish = (id, isPublish) => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params = { id };
        new Promise(resolve => {
            dispatch({
                type: isPublish ? 'product/publish' : 'product/unpublish',
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
                this.handleSearch();
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

    handleSearch = () => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params =
        {
            pagination: {
                current: this.state.pageNum,
                pageSize: this.state.pageSize
            },
            sort: {
                predicate: this.state.predicate,
                reverse: this.state.reverse
            }
        };

        new Promise(resolve => {
            dispatch({
                type: 'product/grid',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    loading: false,
                    pageData: res.data
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handleSearchFirst = () => {
        this.setState({
            pageNum: 1
        }, () => {
            this.handleSearch();
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        var firstPage = sorter.field != this.state.predicate;
        this.setState({
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }, () => {
            if (sorter.field) {
                this.setState({
                    predicate: sorter.field,
                    reverse: sorter.order == 'descend'
                }, () => {
                    if (firstPage)
                        this.handleSearchFirst();
                    else
                        this.handleSearch();
                });
            } else {
                if (firstPage)
                    this.handleSearchFirst();
                else
                    this.handleSearch();
            }
        });
    };

    handleAdd = () => {
        router.push('./add');
    }

    handleEdit = (id) => {
        router.push({
            pathname: './edit',
            query: {
                id: id,
            },
        });
    }

    render() {
        const { form: { getFieldDecorator }, } = this.props;
        const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
        const extraContent = (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    icon="plus">
                    新增</Button>
            </div>
        );
        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 },
        };
        const pagination = {
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '50', '100'],
            defaultPageSize: this.state.pageSize,
            defaultCurrent: this.state.pageNum,
            current: this.state.pageNum,
            pageSize: this.state.pageSize,
            total: this.state.pageData.pagination.total || 0,
            showTotal: (total, range) => {
                return `${range[0]}-${range[1]} 条 , 共 ${total} 条`;
            }
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
        const action = (
            <Fragment>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    icon="plus">新增</Button>
            </Fragment>
        );
        return (
            <PageHeaderWrapper title="商品 - 列表">
                <div>
                    <Card bordered={false}
                    // extra={extraContent}
                    >
                        <div style={{ marginBottom: '20px' }} >
                            {action}
                        </div>
                        <StandardTable
                            pagination={pagination}
                            loading={this.state.loading}
                            data={this.state.pageData}
                            rowKey={record => record.id}
                            columns={this.columns}
                            bordered
                            onChange={this.handleStandardTableChange}
                            scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
                <Modal
                    title={`商品选项 - ${this.state.current.id ? '编辑' : '新增'}`}
                    destroyOnClose
                    visible={this.state.visible}
                    {...modalFooter}>
                    {getModalContent()}
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default ProductList;