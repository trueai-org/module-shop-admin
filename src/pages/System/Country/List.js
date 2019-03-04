import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Redio, Menu, Dropdown
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';

import router from 'umi/router';
import Link from 'umi/link';

const FormItem = Form.Item;
const Option = Select.Option;

@connect()
@Form.create()
class CountryList extends PureComponent {
    state = {
        loading: false,
        visible: false,
        data: [],
        current: {},
        submitting: false,
        selectLoading: false,
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
    columns = [
        {
            title: '操作',
            align: 'center',
            key: 'operation',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <Dropdown.Button size="small" overlay={<Menu>
                        <Menu.Item onClick={() => this.handleEdit(record.id)}>编辑</Menu.Item>
                        <Menu.Item onClick={() => this.showDeleteModal(record)}>删除</Menu.Item>
                        {/* <Menu.Item>
                            <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteItem(record.id)}>
                                删除
                            </Popconfirm>
                        </Menu.Item> */}
                    </Menu>}>
                        <a onClick={() => this.handleData(text, record)}>省市区</a>
                    </Dropdown.Button>
                </Fragment>
            )
        },
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            sorter: true,
            defaultSortOrder: 'descend',
        },
        {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'ISO',
            dataIndex: 'twoLetterIsoCode',
            width: 120,
            sorter: true,
            render: (text, record) => (
                <Fragment>
                    <span>{text}, </span>
                    <span>{record.threeLetterIsoCode}, </span>
                    <span>{record.numericIsoCode}</span>
                </Fragment>
            )
        },
        {
            title: '已发布',
            dataIndex: 'isPublished',
            width: 110,
            sorter: true,
            render: (val) => this.boolFormat(val)
        },
        {
            title: '省数量',
            dataIndex: 'stateOrProvinceCount',
            width: 110,
            // sorter: true,
        },
        {
            title: '显示顺序',
            dataIndex: 'displayOrder',
            width: 110,
            sorter: true,
        },
        {
            title: '允许账单',
            dataIndex: 'isBillingEnabled',
            width: 110,
            sorter: true,
            render: (val) => this.boolFormat(val)
        },
        {
            title: '允许配送',
            dataIndex: 'isShippingEnabled',
            width: 110,
            sorter: true,
            render: (val) => this.boolFormat(val)
        },
        {
            title: '启用市',
            dataIndex: 'isCityEnabled',
            width: 110,
            sorter: true,
            render: (val) => this.boolFormat(val)
        },
        {
            title: '启用区',
            dataIndex: 'isDistrictEnabled',
            width: 110,
            sorter: true,
            render: (val) => this.boolFormat(val)
        },
    ];

    boolFormat(val) {
        //(val) => <Switch checked={val} disabled />,
        return <Icon style={{ color: val == true ? "#1890ff" : "#f5222d" }} type={val == true ? "check" : "close"} />;
    }

    componentDidMount() {
        // this.handleInit();
        this.handleSearchFirst();
    }

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
            pathname: '/catalog/product-attribute/data',
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

            let bt = 'attribute/addProductAttr';
            if (id) {
                params.id = id;
                bt = 'attribute/editProductAttr';
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
                    // this.handleInit();
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
                type: 'country/delete',
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
            title: '删除国家',
            content: '确定删除该国家吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(item.id),
        });
    };

    handleInit = () => {
        const { dispatch } = this.props;
        // this.setState({ loading: true });
        // new Promise(resolve => {
        //     dispatch({
        //         type: 'attr/queryProductAttr',
        //         payload: { resolve }
        //     });
        // }).then(res => {
        //     this.setState({ loading: false });
        //     if (res.success === true) {
        //         if (res.data != null) {
        //             this.setState({
        //                 data: res.data
        //             });
        //         }
        //     } else {
        //         notification.error({
        //             message: res.message,
        //         });
        //     }
        // });

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
                type: 'country/grid',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.setState({
                    pageData: res.data
                });
            } else {
                notification.error({ message: res.message, });
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
                    onClick={this.handleAdd}
                    type="primary"
                    icon="plus">新增</Button>
            </Fragment>
        );
        return (
            <PageHeaderWrapper title="国家 - 列表">
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
                            scroll={{ x: 1300 }}
                        />
                        {/* <Table bordered
                            rowKey={record => record.id}
                            pagination={false}
                            loading={this.state.loading}
                            dataSource={this.state.data}
                            columns={this.columns}
                        /> */}
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

export default CountryList;
