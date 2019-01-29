import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Row, Col, Card, Form, Input, Button, Table, notification,
    Popconfirm, Switch, Tag, Select, Divider
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CategoryComponent from './CategoryComponent';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ category }) => ({
    category,
}))
@Form.create()
class TableList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            loading: false,
            keyword: '',
            pageNum: 1,
            pageSize: 10,
            name: '',
            desc: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '序号',
            dataIndex: 'displayOrder',
            sorter: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createdOn',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedOn',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '包括在菜单中',
            dataIndex: 'includeInMenu',
            render: (val, record) => <Switch checked={val} onChange={checked => this.onSwitch(checked, record)} />
        },

        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleUpdateModalVisible(text, record)}>修改</a>
                    <Divider type="vertical" />
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </Fragment>
            )
        },
    ];

    onSwitch = (checked, record) => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params = {
            id: record.id,
        };

        // 提交之前修改
        record.includeInMenu = !record.includeInMenu;

        new Promise(resolve => {
            dispatch({
                type: 'category/switchCategory',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({
                loading: false,
            });
            // console.log(res);
            if (res.success === true) {
                this.handleSearch(this.state.pageNum, this.state.pageSize);
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handleUpdateModalVisible = (text, record) => {
        console.log(text);
    };

    componentDidMount() {
        this.handleSearch(this.state.pageNum, this.state.pageSize);
    }

    handleChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    handleDescChange(event) {
        this.setState({
            desc: event.target.value,
        });
    }


    handleChangeKeyword(event) {
        this.setState({
            keyword: event.target.value,
        });
    }

    handleChangePageParam(pageNum, pageSize) {
        this.setState(
            {
                pageNum,
                pageSize,
            },
            () => {
                this.handleSearch();
            },
        );
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
  
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params =
        {
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize
            },
            search: {
                predicateObject: {
                    name: this.state.keyword
                }
            },
            sort: {
                predicate: "",
                reverse: false
            }
        };
        if (sorter.field) {
            params.sort.predicate = sorter.field;
            params.sort.reverse = sorter.order == 'descend';
        }

        new Promise(resolve => {
            dispatch({
                type: 'category/queryCategory',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            // console.log('res :', res);
            if (res.success === true) {
                this.setState({
                    loading: false,
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        // console.log(params);

        // dispatch({
        //   type: 'rule/fetch',
        //   payload: params,
        // });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        const { dispatch } = this.props;
        const params = {
            name: this.state.name,
            desc: this.state.desc,
        };
        this.setState({
            loading: true,
        });
        new Promise(resolve => {
            dispatch({
                type: 'category/addCategory',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    visible: false,
                    name: '',
                    desc: '',
                });
                this.handleSearch(this.state.pageNum, this.state.pageSize);
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
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
            search: {
                predicateObject: {
                    name: this.state.keyword
                }
            },
            sort: {
                predicate: "",
                reverse: false
            }
        };

        new Promise(resolve => {
            dispatch({
                type: 'category/queryCategory',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            // console.log('res :', res);
            if (res.success === true) {
                this.setState({
                    loading: false,
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handleDelete = (text, record) => {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        const params = {
            id: record.id,
        };
        new Promise(resolve => {
            dispatch({
                type: 'category/delCategory',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({
                loading: false,
            });
            // 字符串无法识别，再次转换一下，原因未知？？
            var result = JSON.parse(res);
            if (result.success === true) {
                this.handleSearch(this.state.pageNum, this.state.pageSize);
            } else {
                notification.error({
                    message: result.message,
                });
            }
        });
    };

    renderSimpleForm() {
        return (
            <Form layout="inline" style={{ marginBottom: '20px' }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={24} sm={24}>
                        <FormItem>
                            <Input
                                placeholder="名称"
                                value={this.state.keyword}
                                onChange={this.handleChangeKeyword} />
                        </FormItem>

                        <span>
                            <Button
                                onClick={this.handleSearch}
                                style={{ marginTop: '3px' }}
                                type="primary"
                                icon="search">
                                查询</Button>
                        </span>
                        <span>
                            <Button
                                style={{ marginTop: '3px', marginLeft: '20px' }}
                                onClick={this.showModal}
                                type="primary"
                                icon="plus">
                                新增</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const { list, total } = this.props.category;
        const { pageNum, pageSize } = this.state;
        const pagination = {
            total,
            defaultCurrent: pageNum,
            pageSize,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
                this.handleChangePageParam(current, pageSize);
            },
            onChange: (current, pageSize) => {
                this.handleChangePageParam(current, pageSize);
            },
        };

        return (
            <PageHeaderWrapper title="商品分类">
                <Card bordered={false}>
                    <div className="">
                        <div className="">{this.renderSimpleForm()}</div>
                        <Table
                            pagination={pagination}
                            loading={this.state.loading}
                            rowKey={record => record.id}
                            columns={this.columns}
                            bordered
                            dataSource={list}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CategoryComponent
                    name={this.state.name}
                    desc={this.state.desc}
                    visible={this.state.visible}
                    showModal={this.showModal}
                    handleChange={this.handleChange}
                    handleDescChange={this.handleDescChange}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                />
            </PageHeaderWrapper>
        );
    }
}

export default TableList;
