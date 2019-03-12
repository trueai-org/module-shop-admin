import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Form, Input, Button, Card, InputNumber, Icon, Checkbox, notification, Select, Spin,
    Table, Tabs, Cascader, Radio
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import Link from 'umi/link';

const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const ShippingMethod = [{ key: 0, value: '免费' }, { key: 1, value: '标准' }];

@connect()
@Form.create()
class AddOrder extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            submitting: false,
            id: props.location.query.id,
            current: {},

            users: [],
            usersLoading: false,

            products: [],
            productsLoading: false,

            countries: [],
            countriesLoading: false,

            provinces: [],
            provincesLoading: false,

            userAddresses: {
                addresses: []
            },
            userAddressesLoading: false,

            defaultShippingAddressId: -1, //客户默认配送地址
            shippingMethod: 0,
        };
    }


    columnsProduct = [
        {
            title: '商品名称',
            dataIndex: 'name',
            // width: 150,
            // render: (text, record) => (
            //     <Fragment>
            //         <Input
            //             onChange={(e) => {
            //                 // let obj = this.state.productSku.find(c => c.id == record.id);
            //                 // if (obj) {
            //                 //     obj.name = e.target.value;
            //                 // }

            //                 let index = this.state.productSku.indexOf(record);
            //                 if (index >= 0) {
            //                     let list = this.state.productSku.slice();
            //                     list.splice(index, 1);

            //                     record.name = e.target.value;
            //                     list.splice(index, 0, record);
            //                     this.setState({ productSku: list });
            //                 }
            //             }}
            //             defaultValue={text}></Input>
            //     </Fragment>
            // )
        },
        {
            title: '价格',
            dataIndex: 'price',
            // width: 150,
            // render: (text, record) => (
            //     <Fragment>
            //         <Input
            //             onChange={(e) => {
            //                 // let obj = this.state.productSku.find(c => c.id == record.id);
            //                 // if (obj) {
            //                 //     obj.name = e.target.value;
            //                 // }

            //                 let index = this.state.productSku.indexOf(record);
            //                 if (index >= 0) {
            //                     let list = this.state.productSku.slice();
            //                     list.splice(index, 1);

            //                     record.name = e.target.value;
            //                     list.splice(index, 0, record);
            //                     this.setState({ productSku: list });
            //                 }
            //             }}
            //             defaultValue={text}></Input>
            //     </Fragment>
            // )
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            // width: 150,
            // render: (text, record) => (
            //     <Fragment>
            //         <Input
            //             onChange={(e) => {
            //                 // let obj = this.state.productSku.find(c => c.id == record.id);
            //                 // if (obj) {
            //                 //     obj.name = e.target.value;
            //                 // }

            //                 let index = this.state.productSku.indexOf(record);
            //                 if (index >= 0) {
            //                     let list = this.state.productSku.slice();
            //                     list.splice(index, 1);

            //                     record.name = e.target.value;
            //                     list.splice(index, 0, record);
            //                     this.setState({ productSku: list });
            //                 }
            //             }}
            //             defaultValue={text}></Input>
            //     </Fragment>
            // )
        },
        // {
        //     title: 'SKU',
        //     dataIndex: 'sku',
        //     width: 150,
        //     render: (text, record) => (
        //         <Fragment>
        //             <Input
        //                 onChange={(e) => {
        //                     // let obj = this.state.productSku.find(c => c.id == record.id);
        //                     // if (obj) {
        //                     //     obj.sku = e.target.value;
        //                     // }

        //                     let index = this.state.productSku.indexOf(record);
        //                     if (index >= 0) {
        //                         let list = this.state.productSku.slice();
        //                         list.splice(index, 1);

        //                         record.sku = e.target.value;
        //                         list.splice(index, 0, record);
        //                         this.setState({ productSku: list });
        //                     }
        //                 }}
        //                 defaultValue={text}></Input>
        //         </Fragment>
        //     )
        // },
        // {
        //     title: 'GTIN',
        //     dataIndex: 'gtin',
        //     width: 150,
        //     render: (text, record) => (
        //         <Fragment>
        //             <Input
        //                 onChange={(e) => {
        //                     // let obj = this.state.productSku.find(c => c.id == record.id);
        //                     // if (obj) {
        //                     //     obj.gtin = e.target.value;
        //                     // }
        //                     let index = this.state.productSku.indexOf(record);
        //                     if (index >= 0) {
        //                         let list = this.state.productSku.slice();
        //                         list.splice(index, 1);

        //                         record.gtin = e.target.value;
        //                         list.splice(index, 0, record);
        //                         this.setState({ productSku: list });
        //                     }
        //                 }}
        //                 defaultValue={text}></Input>
        //         </Fragment>
        //     )
        // },
        // {
        //     title: '价格',
        //     dataIndex: 'price',
        //     width: 100,
        //     render: (value, record) => (
        //         <Fragment>
        //             <InputNumber
        //                 onChange={(e) => {
        //                     // let obj = this.state.productSku.find(c => c.id == record.id);
        //                     // if (obj) {
        //                     //     obj.price = e;
        //                     // }
        //                     let index = this.state.productSku.indexOf(record);
        //                     if (index >= 0) {
        //                         let list = this.state.productSku.slice();
        //                         list.splice(index, 1);

        //                         record.price = e;
        //                         list.splice(index, 0, record);
        //                         this.setState({ productSku: list });
        //                     }
        //                 }}
        //                 defaultValue={value}></InputNumber>
        //         </Fragment>
        //     )
        // },
        // {
        //     title: '原价',
        //     dataIndex: 'oldPrice',
        //     width: 100,
        //     render: (value, record) => (
        //         <Fragment>
        //             <InputNumber
        //                 onChange={(e) => {
        //                     // let obj = this.state.productSku.find(c => c.id == record.id);
        //                     // if (obj) {
        //                     //     obj.oldPrice = e;
        //                     // }
        //                     let index = this.state.productSku.indexOf(record);
        //                     if (index >= 0) {
        //                         let list = this.state.productSku.slice();
        //                         list.splice(index, 1);

        //                         record.oldPrice = e;
        //                         list.splice(index, 0, record);
        //                         this.setState({ productSku: list });
        //                     }
        //                 }}
        //                 defaultValue={value}></InputNumber>
        //         </Fragment>
        //     )
        // },
        // {
        //     title: '库存',
        //     dataIndex: 'stockQuantity',
        //     width: 100,
        //     render: (value, record) => (
        //         <Fragment>
        //             <InputNumber
        //                 min={0}
        //                 precision={0}
        //                 onChange={(e) => {
        //                     // let obj = this.state.productSku.find(c => c.name == record.name);
        //                     // if (obj) {
        //                     //     obj.stockQuantity = e;
        //                     // }

        //                     let index = this.state.productSku.indexOf(record);
        //                     if (index >= 0) {
        //                         let list = this.state.productSku.slice();
        //                         list.splice(index, 1);

        //                         record.stockQuantity = e;
        //                         list.splice(index, 0, record);
        //                         this.setState({ productSku: list });
        //                     }
        //                 }}
        //                 defaultValue={value}></InputNumber>
        //         </Fragment>
        //     )
        // },
        // {
        //     title: '图片',
        //     dataIndex: 'mediaId',
        //     align: 'center',
        //     width: 64,
        //     fixed: 'right',
        //     render: (text, record) => (
        //         <Fragment>
        //             <Avatar
        //                 onClick={
        //                     () => {
        //                         Modal.info({
        //                             title: '选择图片',
        //                             content: (
        //                                 <Radio.Group
        //                                     defaultValue={record.mediaId || ''}
        //                                     onChange={(e) => {
        //                                         let index = this.state.productSku.indexOf(record);
        //                                         let list = this.state.productSku.slice();
        //                                         list.splice(index, 1);
        //                                         record.mediaId = '';
        //                                         record.mediaUrl = '';
        //                                         if (e.target.value) {
        //                                             let first = this.state.fileList.find(c => c.mediaId == e.target.value);
        //                                             if (first) {
        //                                                 record.mediaId = first.mediaId;
        //                                                 record.mediaUrl = first.url;
        //                                             }
        //                                         }
        //                                         // list.push(record);
        //                                         list.splice(index, 0, record);
        //                                         this.setState({ productSku: list });
        //                                     }}
        //                                 >
        //                                     <Radio
        //                                         style={{
        //                                             width: 80
        //                                         }}
        //                                         value={''}>无</Radio>
        //                                     {
        //                                         this.state.fileList.map(x => {
        //                                             return <Radio
        //                                                 style={{
        //                                                     width: 80
        //                                                 }}
        //                                                 key={x.mediaId} value={x.mediaId}>
        //                                                 <Avatar shape="square" size={48} src={x.url} />
        //                                             </Radio>;
        //                                         })
        //                                     }
        //                                 </Radio.Group>
        //                             ),
        //                             okText: '关闭'
        //                         })
        //                     }
        //                 }
        //                 shape="square" size={32} src={record.mediaUrl} />
        //         </Fragment>
        //     )
        // },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 64,
            fixed: 'right',
            render: (text, record) => (
                <Fragment>
                    <Button.Group>
                        <Button onClick={() => this.handleRemoveSku(record)} icon="close" type="danger" size="small"></Button>
                    </Button.Group>
                </Fragment>
            )
        },
    ];


    componentDidMount() {
        this.handleInitCountries();
        // this.handleInit();
    }

    handleAddProduct = () => {

    }

    handleChange = (value) => {
        var first = this.state.users.find(c => c.id == value);
        if (first) {
            this.props.form.setFieldsValue({
                contactName: first.fullName || '',
                phone: first.phone || ''
            })

            this.handleQueryUserAddresses(value);
        }
    }

    handleChangeShippingAddress = (e) => {
        this.setState({ defaultShippingAddressId: e.target.value });
    }

    handleChangeShippingMethod = (e) => {
        this.setState({ shippingMethod: e.target.value });
    }

    handleQueryUserAddresses = (userId) => {
        const { dispatch } = this.props;
        this.setState({ userAddressesLoading: true });
        new Promise(resolve => {
            dispatch({
                type: 'system/userAddresses',
                payload: {
                    resolve,
                    params: { userId }
                },
            });
        }).then(res => {
            this.setState({ userAddressesLoading: false });
            if (res.success === true) {
                this.setState({
                    userAddresses: res.data,
                    // shippingAddressId: res.data.defaultShippingAddressId || -1,
                    defaultShippingAddressId: res.data.defaultShippingAddressId || -1
                }, () => {
                    this.props.form.setFieldsValue({
                        shippingAddressId: this.state.defaultShippingAddressId
                    })
                });
            } else {
                notification.error({ message: res.message });
            }
        });
    }

    handleChangeCountry = (value) => {
        this.handleInitProvinces(value);
    }

    handleQueryUsers = (nameOrPhone) => {
        const { dispatch } = this.props;
        this.setState({ usersLoading: true });
        new Promise(resolve => {
            dispatch({
                type: 'system/users',
                payload: {
                    resolve,
                    params: { nameOrPhone }
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
    }

    handleInitCountries = () => {
        const { dispatch } = this.props;
        this.setState({ countriesLoading: true });
        new Promise(resolve => {
            dispatch({
                type: 'system/countries',
                payload: {
                    resolve
                },
            });
        }).then(res => {
            this.setState({ countriesLoading: false });
            if (res.success === true) {
                this.setState({ countries: res.data });
            } else {
                notification.error({ message: res.message, });
            }
        });
    }

    handleInitProvinces = (countryId) => {
        const { dispatch } = this.props;
        this.setState({ provincesLoading: true });
        new Promise(resolve => {
            dispatch({
                type: 'system/provinces',
                payload: {
                    resolve,
                    params: { countryId: countryId },
                },
            });
        }).then(res => {
            this.setState({ provincesLoading: false });
            if (res.success === true) {
                this.setState({ provinces: res.data });
            } else {
                notification.error({ message: res.message, });
            }
        });
    }

    handleSubmit = e => {
        const { dispatch, form } = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.submitting)
                    return;
                this.setState({ submitting: true });
                var params = {
                    id: this.state.id,
                    ...values
                };
                new Promise(resolve => {
                    dispatch({
                        type: 'country/add',
                        payload: {
                            resolve,
                            params
                        },
                    });
                }).then(res => {
                    this.setState({
                        submitting: false,
                    }, () => {
                        if (res.success === true) {
                            router.push('./list');
                        } else {
                            notification.error({ message: res.message, });
                        }
                    });
                });
            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 20 },
            },
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 4 },
            },
        };
        const action = (
            <Fragment>
                <Button type="primary" icon="save" htmlType="submit" loading={this.state.submitting}>
                    保存</Button>
                <Link to="./list">
                    <Button>
                        <Icon type="rollback" />
                    </Button>
                </Link>
            </Fragment>
        );
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <PageHeaderWrapper title="订单 - 添加" action={action}>
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit}>
                        <Tabs type="card" onChange={this.handleTabChange}>
                            <TabPane tab="基本信息" key="1">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>客户</span>}>
                                    {getFieldDecorator('customerId', {
                                        initialValue: this.state.current.customerId,
                                        rules: [{ required: true, message: '请选择客户' }],
                                    })(<Select
                                        // mode="multiple"
                                        // style={{ width: '100%' }}
                                        // labelInValue
                                        allowClear
                                        showSearch
                                        placeholder="请输入客户名称或联系方式"
                                        notFoundContent={this.state.usersLoading ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSearch={this.handleQueryUsers}
                                        onChange={this.handleChange}
                                    >
                                        {this.state.users.map(d =>
                                            <Option key={d.id} value={d.id}>{d.fullName}</Option>)}
                                    </Select>)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>联系人</span>}>
                                    {getFieldDecorator('contactName', {
                                        initialValue: this.state.current.contactName,
                                        rules: [{ required: true, message: '请输入联系人' }],
                                    })(<Input allowClear placeholder="客户名称" />)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>联系方式</span>}>
                                    {getFieldDecorator('phone', {
                                        initialValue: this.state.current.phone,
                                        rules: [{ required: true, message: '请输入联系方式' }],
                                    })(<Input allowClear placeholder="电话/手机" />)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>配送</span>}>
                                    <Card >
                                        <FormItem>
                                            {getFieldDecorator('shippingAddressId',
                                                { initialValue: this.state.defaultShippingAddressId })(
                                                    <RadioGroup onChange={this.handleChangeShippingAddress}>
                                                        <Radio style={radioStyle} value={-1}>无</Radio>
                                                        {
                                                            this.state.userAddresses.addresses.map(x =>
                                                                <Radio key={x.userAddressId} style={radioStyle} value={x.userAddressId}>{
                                                                    `${x.countryName}, ${x.stateOrProvinceName}, ${x.cityName || ''}, ${x.addressLine1 || ''} (${x.contactName}, ${x.phone || ''})`
                                                                }</Radio>)
                                                        }
                                                        <Radio style={radioStyle} value={0}>添加地址</Radio>
                                                    </RadioGroup>)
                                            }
                                        </FormItem>
                                        {
                                            this.state.defaultShippingAddressId == 0 ?
                                                <div>
                                                    <FormItem
                                                        {...formItemLayout}
                                                        label={<span>国家</span>}>
                                                        {getFieldDecorator('countryId', {
                                                            initialValue: this.state.current.countryId,
                                                            rules: [{ required: true, message: '请选择国家' }],
                                                        })(<Select
                                                            showSearch
                                                            placeholder="Select a country"
                                                            optionFilterProp="children"
                                                            onChange={this.handleChangeCountry}
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                        >
                                                            {this.state.countries.map(d =>
                                                                <Option key={d.id} value={d.id}>{d.name}</Option>)}
                                                        </Select>)}
                                                    </FormItem>
                                                    <FormItem
                                                        {...formItemLayout}
                                                        label={<span>省市区</span>}>
                                                        {getFieldDecorator('stateOrProvinceId', {
                                                            initialValue: this.state.current.stateOrProvinceId,
                                                            rules: [{ required: true, message: '请选择省市区' }],
                                                        })(<Cascader options={this.state.provinces} placeholder="Please select" />)}
                                                    </FormItem>
                                                    <FormItem
                                                        {...formItemLayout}
                                                        label={<span>配送地址</span>}>
                                                        {getFieldDecorator('address', {
                                                            initialValue: this.state.current.address,
                                                            rules: [{ required: true, message: '请输入地址' }],
                                                        })(<Input placeholder="地址" />)}
                                                    </FormItem></div> : null
                                        }
                                    </Card>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>下单备注</span>}>
                                    {getFieldDecorator('orderNote', { initialValue: this.state.current.orderNote || '' })(
                                        <TextArea
                                            style={{ minHeight: 32 }}
                                            placeholder=""
                                            rows={2} />)
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>管理员备注</span>}>
                                    {getFieldDecorator('adminNote', { initialValue: this.state.current.adminNote || '' })(
                                        <TextArea
                                            style={{ minHeight: 32 }}
                                            placeholder=""
                                            rows={2} />)
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>运费</span>}>
                                    {getFieldDecorator('shippingMethod',
                                        { initialValue: this.state.current.shippingMethod || 0 })(
                                            <RadioGroup onChange={this.handleChangeShippingMethod}>
                                                {
                                                    ShippingMethod.map(x =>
                                                        <Radio key={x.key} value={x.key}>{x.value}</Radio>)
                                                }
                                            </RadioGroup>)
                                    }
                                    {
                                        this.state.shippingMethod == 1 ? <FormItem>
                                            {getFieldDecorator('shippingFeeAmount', {
                                                initialValue: this.state.current.shippingFeeAmount,
                                                rules: [{ required: true, message: '请输入运费' }],
                                            })(<InputNumber style={{ width: '100%' }} min={0} allowClear placeholder="运费" />)}
                                        </FormItem> : null
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>折扣</span>}>
                                    {getFieldDecorator('discountAmount', {
                                        initialValue: this.state.current.discountAmount,
                                        rules: [{ required: true, message: '请输入折扣金额' }],
                                    })(<InputNumber style={{ width: '100%' }} min={0} allowClear placeholder="折扣金额" />)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>订单总额</span>}>
                                    {getFieldDecorator('orderTotal', {
                                        initialValue: this.state.current.orderTotal,
                                        rules: [{ required: true, message: '请输入订单总额' }],
                                    })(<InputNumber style={{ width: '100%' }} min={0} allowClear placeholder="订单总额" />)}
                                </FormItem>
                            </TabPane>
                            <TabPane tab="商品信息" key="2">
                                <Button icon="plus" type="primary" style={{ marginBottom: 16 }} onClick={this.handleAddProduct}>添加商品</Button>
                                <Table bordered={false}
                                    rowKey={(record, index) => `product_${record.id}_i_${index}`} //{record => record.id}
                                    pagination={false}
                                    loading={this.state.productsLoading}
                                    dataSource={this.state.products}
                                    columns={this.columnsProduct}
                                // scroll={{ x: 960 }}
                                />
                            </TabPane>
                            {/* <FormItem {...submitFormLayout}>
                                <Button type="primary" htmlType="submit" loading={this.state.submitting}>
                                    保存</Button>
                            </FormItem> */}
                        </Tabs>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default AddOrder;
