import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select,
    Tag, Icon, Redio, Menu, Dropdown, Switch, Row, Col, InputNumber, DatePicker, Checkbox, Spin,
    Tooltip
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';

import router from 'umi/router';
import Link from 'umi/link';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const ShippingStatus = [
    { key: 0, value: '无需配送', color: '' },
    { key: 20, value: '未发货', color: '#f50' },
    { key: 25, value: '部分发货', color: '#2db7f5' },
    { key: 30, value: '已发货', color: '#108ee9' },
    { key: 40, value: '已收货', color: '#87d068' },
];

const OrderStatus = [
    { key: 0, value: '新订单', color: 'purple' },
    { key: 10, value: '挂起', color: 'red' },
    { key: 20, value: '待付款', color: 'orange' },
    { key: 25, value: '付款失败', color: 'red' },
    { key: 30, value: '已付款', color: 'lime' },
    { key: 40, value: '发货中', color: 'cyan' },
    { key: 50, value: '已发货', color: 'blue' },
    { key: 60, value: '交易成功', color: 'green' },
    { key: 70, value: '交易取消', color: '' },
];

@connect()
@Form.create()
class ShipmentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            pageNum: 1,
            pageSize: 10,
            predicate: '',
            reverse: true,
            pageData: {
                list: [],
                pagination: {},
            },

            expandForm: false,
            queryParam: {},

            users: [],
            usersLoading: false,

            onHoldReason: '',
            cancelReason: '',
        };
    }

    columns = [
        {
            title: '操作',
            key: 'operation',
            fixed: 'left',
            align: 'center',
            width: 60,
            render: (text, record) => (
                <Fragment>
                    <Button.Group>
                        <Tooltip title="详情">
                            <Button icon="eye" size="small" onClick={() => this.handleEdit(record.id)} />
                        </Tooltip>
                    </Button.Group>
                </Fragment>
            ),
        },
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     // fixed: 'left',
        //     sorter: true,
        //     defaultSortOrder: 'descend',
        //     width: 100,
        // },
        {
            title: '配送单号',
            dataIndex: 'trackingNumber',
            sorter: true,
            width: 180,
        },
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            width: 180,
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            width: 120,
            render: val => {
                if (val || val === 0) {
                    let first = OrderStatus.find(c => c.key == val);
                    if (first) {
                        return <Tag color={first.color}>{first.value}</Tag>;
                    }
                }
                return <Tag>无</Tag>;
            },
        },
        {
            title: '配送状态',
            dataIndex: 'shippingStatus',
            width: 120,
            render: val => {
                if (val || val === 0) {
                    let first = ShippingStatus.find(c => c.key == val);
                    if (first) {
                        return <Tag color={first.color}>{first.value}</Tag>;
                    }
                }
                return '-';
            },
        },
        {
            title: '重量/kg',
            dataIndex: 'totalWeight',
            sorter: true,
        },
        {
            title: '操作人',
            dataIndex: 'createdBy',
        },
        {
            title: '发货时间',
            dataIndex: 'shippedOn',
            sorter: true,
            width: 120,
            render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : null,
        },
        {
            title: '收货时间',
            dataIndex: 'deliveredOn',
            sorter: true,
            width: 120,
            render: val => val ? <span>{moment(val).format('YYYY-MM-DD')}</span> : null,
        }
    ];

    componentDidMount() {
        this.queryData(this.state.queryParam);
    }

    handleQueryUsers = nameOrPhone => {
        const { dispatch } = this.props;
        this.setState({ usersLoading: true });
        new Promise(resolve => {
            dispatch({
                type: 'system/users',
                payload: {
                    resolve,
                    params: { nameOrPhone },
                },
            });
        }).then(res => {
            this.setState({ usersLoading: false });
            if (res.success === true) {
                this.setState({ users: res.data });
            } else {
                notification.error({ message: res.message });
            }
        });
    };

    deleteItem = id => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        const params = { id };
        new Promise(resolve => {
            dispatch({
                type: 'order/delete',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.queryData();
            } else {
                notification.error({ message: res.message });
            }
        });
    };

    paymentItem = id => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        const params = { id };
        new Promise(resolve => {
            dispatch({
                type: 'order/payment',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.queryData();
            } else {
                notification.error({ message: res.message });
            }
        });
    };

    handleDelivery = no => {
        router.push({
            pathname: './shipment',
            query: {
                no: no,
            },
        });
    };

    cancelItem = id => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        const params = { id, reason: this.state.cancelReason };
        new Promise(resolve => {
            dispatch({
                type: 'order/cancel',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.queryData();
            } else {
                notification.error({ message: res.message });
            }
        });
    };

    onHoldItem = id => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        const params = { id };
        new Promise(resolve => {
            dispatch({
                type: 'order/onHold',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.queryData();
            } else {
                notification.error({ message: res.message });
            }
        });
    };

    queryDataFirst = () => {
        this.setState(
            {
                pageNum: 1,
            },
            () => {
                this.queryData();
            }
        );
    };

    queryData = () => {
        this.setState({ loading: true });
        const { dispatch, form } = this.props;

        let search = this.state.queryParam;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            search = {
                ...fieldsValue,
            };

            //特价时间处理
            if (search.createdOn && search.createdOn.length == 2) {
                search.createdOnStart = search.createdOn[0].format('YYYY-MM-DD');
                search.createdOnEnd = search.createdOn[1].format('YYYY-MM-DD');
                search.createdOn = {};
            }
            this.setState({ queryParam: search });
        });

        let params = {
            search: search,
            pagination: {
                current: this.state.pageNum,
                pageSize: this.state.pageSize,
            },
            sort: {
                predicate: this.state.predicate,
                reverse: this.state.reverse,
            },
        };

        new Promise(resolve => {
            dispatch({
                type: 'shipment/grid',
                payload: {
                    resolve,
                    params,
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.setState({
                    pageData: res.data,
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    };

    handleSearch = e => {
        const { form } = this.props;
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            let search = {
                ...fieldsValue,
            };

            this.setState({ queryParam: search }, () => {
                this.queryData();
            });
        });
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        var firstPage = sorter.field != this.state.predicate;
        this.setState(
            {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
            },
            () => {
                if (sorter.field) {
                    this.setState(
                        {
                            predicate: sorter.field,
                            reverse: sorter.order == 'descend',
                        },
                        () => {
                            if (firstPage) this.queryDataFirst();
                            else this.queryData();
                        }
                    );
                } else {
                    if (firstPage) this.queryDataFirst();
                    else this.queryData();
                }
            }
        );
    };

    handleAdd = () => {
        router.push('./add');
    };

    handleEdit = id => {
        router.push({
            pathname: './edit',
            query: {
                id: id,
            },
        });
    };

    renderForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24}>
                        <FormItem label="配送单号">
                            {getFieldDecorator('trackingNumber')(
                                <Input style={{ width: '100%' }} allowClear placeholder="配送单号" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={12} sm={24}>
                        <FormItem label="订单编号">
                            {getFieldDecorator('orderNo')(
                                <Input style={{ width: '100%' }} allowClear placeholder="订单编号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col >
                        <FormItem label="发货时间">{getFieldDecorator('createdOn')(<RangePicker />)}</FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <span style={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            marginBottom: 24,
                        }}>
                            <Button type="primary" htmlType="submit" icon="search">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} icon="undo">重置</Button>
                        </span>
                    </Col>
                </Row>
            </Form >
        );
    }


    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
    };

    render() {
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
            },
        };
        return (
            <PageHeaderWrapper title="发货记录"  >
                <div>
                    <Card bordered={false}>
                        <div>{this.renderForm()}</div>
                        <StandardTable
                            pagination={pagination}
                            loading={this.state.loading}
                            data={this.state.pageData}
                            rowKey={record => record.id}
                            columns={this.columns}
                            bordered
                            onChange={this.handleStandardTableChange}
                            scroll={{ x: 1260 }}
                        />
                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default ShipmentList;
