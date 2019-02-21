import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Redio, Menu, Dropdown, Checkbox, Switch, Tabs, InputNumber, Upload, DatePicker,
    Avatar
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';

// editor
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const rollback = (
    <Fragment>
        <Link to="./list">
            <Button>
                <Icon type="rollback" />
            </Button>
        </Link>
    </Fragment>
);


@connect()
@Form.create()
class ProductAdd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,

            uploadLoading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],

            categoryLoading: false,
            categoryOptions: [],
            categories: [],

            brandLoading: false,
            brandOptions: [],
            brands: [],

            attributeLoading: false,
            attributeOptions: [],
            attributes: [],
            attributeCurrent: undefined,

            templateLoading: false,
            templateOptions: [],
            templates: [],
            templateCurrent: undefined,

            //产品属性列表
            productAttributeLoading: false,
            productAttributeData: [],

            applyLoading: false,

            attributeDatas: [],

            optionLoading: false,
            optionOptions: [],
            options: [],
            optionCurrent: undefined,

            //产品选项列表
            productOptionDataLoading: false,
            productOptionData: [],

            //产品规格列表
            productSkuLoading: false,
            productSku: [],
        };
    }

    columnsAttribute = [
        {
            title: '属性名称',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '属性值',
            dataIndex: 'value',
            render: (text, record) => (
                <Fragment>
                    <Select
                        // loading={record.loading}
                        mode="tags"
                        placeholder="Please select"
                        allowClear={true}
                        labelInValue
                        onChange={(value) => {
                            if (value) {
                                var vs = [];
                                value.forEach(c => {
                                    vs.push(c.label);
                                });
                                let obj = this.state.attributeDatas.find(c => c.attributeId == record.attributeId);
                                if (obj) {
                                    obj.value = vs;
                                }
                            }
                        }}
                    // onSearch={() => this.handleQueryAttributeData(record)}
                    >
                        {this.state.attributeDatas.map(item => {
                            // console.log(item);
                            let os = [];
                            if (item.attributeId == record.attributeId) {
                                item.list.forEach(c => {
                                    os.push(<Option key={c.id}>
                                        {c.value}
                                    </Option>);
                                });
                            }
                            return os;
                        })}
                    </Select>
                </Fragment>
            )
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <Fragment>
                    <Button onClick={() => this.handleRemoveProductAttribute(record)} icon="close" type="danger" size="small"></Button>
                </Fragment>
            )
        },
    ];

    columnsOption = [
        {
            title: '选项名称',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '选项值',
            dataIndex: 'value',
            render: (text, record) => (
                <Fragment>
                    <Select
                        // loading={record.loading}
                        mode="tags"
                        placeholder="Please select"
                        allowClear={true}
                        labelInValue
                        onChange={(value) => {
                            if (value) {
                                var vs = [];
                                value.forEach(c => {
                                    vs.push(c.label);
                                });
                                let obj = this.state.productOptionData.find(c => c.optionId == record.optionId);
                                if (obj) {
                                    obj.value = vs;
                                }
                            }
                        }}
                    // onSearch={() => this.handleQueryAttributeData(record)}
                    >
                        {this.state.productOptionData.map(item => {
                            // console.log(item);
                            let os = [];
                            if (item.optionId == record.optionId) {
                                item.list.forEach(c => {
                                    os.push(<Option key={c.id}>
                                        {c.value}
                                    </Option>);
                                });
                            }
                            return os;
                        })}
                    </Select>
                </Fragment>
            )
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <Fragment>
                    <Button.Group>
                        <Button icon="setting" type="" size="small"></Button>
                        <Button onClick={() => this.handleRemoveProductOption(record)} icon="close" type="danger" size="small"></Button>
                    </Button.Group>
                </Fragment>
            )
        },
    ];

    columnsSku = [
        {
            title: '名称',
            dataIndex: 'name',
            // width: 150,
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            width: 150,
            render: (value) => (
                <Fragment>
                    <Input
                        // onChange={(e) => {
                        //     value = e.target.value;
                        //     console.log(value);
                        //     console.log(this.state.productSku);
                        // }}
                        defaultValue={value}></Input>
                </Fragment>
            )
        },
        // {
        //     title: 'GTIN',
        //     dataIndex: 'gtin',
        //     width: 150,
        //     render: (value) => (
        //         <Fragment>
        //             <Input defaultValue={value}></Input>
        //         </Fragment>
        //     )
        // },
        {
            title: '价格',
            dataIndex: 'price',
            width: 100,
            render: (value) => (
                <Fragment>
                    <InputNumber defaultValue={value}></InputNumber>
                </Fragment>
            )
        },
        // {
        //     title: '原价',
        //     dataIndex: 'oldPrice',
        //     width: 100,
        //     render: (value) => (
        //         <Fragment>
        //             <InputNumber defaultValue={value}></InputNumber>
        //         </Fragment>
        //     )
        // },
        {
            title: '图片',
            dataIndex: 'mediaId',
            width: 100,
            render: (text, record) => (
                <Fragment>
                    <Avatar shape="square" size={64} src={record.mediaUrl} />
                </Fragment>
            )
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <Fragment>
                    <Button.Group>
                        <Button icon="upload" type="" size="small"></Button>
                        <Button onClick={() => this.handleRemoveSku(record)} icon="close" type="danger" size="small"></Button>
                    </Button.Group>
                </Fragment>
            )
        },
    ];

    componentDidMount() {
        this.handleInit();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;

        form.validateFields((err, values) => {
            if (err) return;

            var params = {
                ...values
            };

            //富文本处理
            //draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            params.description = draftToHtml(params.description);
            params.shortDescription = draftToHtml(params.shortDescription);
            params.specification = draftToHtml(params.specification);

            //特价时间处理
            if (params.specialPriceRangePicker) {
                params.specialPriceStart = params.specialPriceRangePicker[0].format('YYYY-MM-DD HH:mm:ss');
                params.specialPriceEnd = params.specialPriceRangePicker[1].format('YYYY-MM-DD HH:mm:ss');
                params.specialPriceRangePicker = {};
            }

            //图片处理
            params.mediaIds = [];
            this.state.fileList.forEach(c => {
                if (c.mediaId) {
                    params.mediaIds.push(c.mediaId);
                }
            });

            //产品属性
            params.attributes = [];
            if (this.state.attributeDatas) {
                this.state.attributeDatas.forEach(c => {
                    if (c.value) {
                        params.attributes.push({
                            attributeId: c.attributeId,
                            value: c.value
                        });
                    }
                });
            }

            //产品选项组合
            params.variations = [];
            if (this.state.productSku && this.state.productSku.length > 0) {
                params.variations = this.state.productSku
            }

            // console.log(params);
            // return;

            if (this.state.submitting === true)
                return;

            this.setState({ submitting: true });
            new Promise(resolve => {
                dispatch({
                    type: 'product/addProduct',
                    payload: {
                        resolve,
                        params
                    },
                });
            }).then(res => {
                this.setState({ submitting: false });
                if (res.success === true) {
                    router.push('./list');
                } else {
                    notification.error({
                        message: res.message,
                    });
                }
            });
        });
    };

    handleGenerateOptionCombination = () => {
        var optionDatas = this.state.productOptionData;
        if (!optionDatas || optionDatas.length <= 0)
            return;
        // console.log(optionDatas);

        let maxIndexOption = this.state.productOptionData.length - 1;
        let skus = [];
        this.helper([], 0, maxIndexOption, skus);
        this.setState({ productSku: skus });
    }

    helper = (arr, optionIndex, maxIndexOption, skus) => {
        let j, l, variation, optionCombinations, optionValue;
        for (j = 0, l = this.state.productOptionData[optionIndex].value.length; j < l; j = j + 1) {
            optionCombinations = arr.slice(0);
            optionValue = {
                optionName: this.state.productOptionData[optionIndex].name,
                optionId: this.state.productOptionData[optionIndex].id,
                value: this.state.productOptionData[optionIndex].value[j],
                displayOrder: optionIndex
            };
            optionCombinations.push(optionValue);

            if (optionIndex === maxIndexOption) {
                variation = {
                    id: optionCombinations.map(this.getItemValue).join('-'),
                    // name: 'red s',
                    sku: '',
                    gtin: '',
                    // price: '50.1',
                    // oldPrice: '100.22',
                    mediaId: '1',
                    mediaUrl: 'https://raw.githubusercontent.com/trueai-org/data/master/images/a1/6e/e5/a16ee588de2b28f2a6d6148991cfbcbd636855803382322009.jpg',

                    name: 'vm.product.name' + ' ' + optionCombinations.map(this.getItemValue).join(' '),
                    normalizedName: optionCombinations.map(this.getItemValue).join('-'),
                    optionCombinations: optionCombinations,
                    price: '0', //vm.product.price,
                    oldPrice: '0' //vm.product.oldPrice
                };
                skus.push(variation);
            } else {
                this.helper(optionCombinations, optionIndex + 1, maxIndexOption, skus);
            }
        }
    }

    getItemValue = (item) => {
        return item.value;
    }

    handleApplyProductAttrTemplate = () => {
        if (!this.state.templateCurrent || this.state.applyLoading) {
            return;
        }

        this.setState({ applyLoading: true });
        const { dispatch } = this.props;
        new Promise(resolve => {
            dispatch({
                type: 'catalog/templateFirst',
                payload: {
                    resolve,
                    params: { id: this.state.templateCurrent }
                },
            });
        }).then(res => {
            this.setState({ applyLoading: false });
            if (res.success === true) {
                let list = [];
                let listIds = [];
                list = res.data.attributes;
                listIds = res.data.attributesIds;
                list.forEach(c => {
                    this.addProductAttribute(c.id, c.name);
                });
                this.state.productAttributeData.forEach(c => {
                    if (listIds.indexOf(c.id) < 0) {
                        this.handleRemoveProductAttribute(c);
                    }
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    handleAddProductAttribute = () => {
        if (!this.state.attributeCurrent) {
            return;
        }
        this.addProductAttribute(this.state.attributeCurrent.key, this.state.attributeCurrent.label);
    }

    addProductAttribute = (id, name) => {
        if (!id) {
            return;
        }
        let p = { id, attributeId: id, name, value: [], list: [] };
        var any = false;
        this.state.productAttributeData.forEach(c => {
            if (any === false && c.attributeId == p.attributeId) {
                any = true;
            }
        });
        if (any)
            return;
        this.queryAttributeData(id, name);
        this.setState({
            productAttributeData: [...this.state.productAttributeData, p]
        });
    }

    queryAttributeData = (id, name) => {
        if (!id)
            return;
        // if (record.id && record.loading)
        //     return;
        // record.loading = true;
        const { dispatch } = this.props;
        new Promise(resolve => {
            dispatch({
                type: 'catalog/attributeData',
                payload: {
                    resolve,
                    params: { attributeId: id }
                },
            });
        }).then(res => {
            // record.loading = false;
            if (res.success === true) {
                let olds = this.state.attributeDatas;
                // if (this.state.attributeDatas.length > 10) {
                //     olds = [];
                // }
                let obj = olds.find(c => c.attributeId == id);
                if (obj) {
                    let index = olds.indexOf(obj);
                    let list = olds.slice();
                    list.splice(index, 1);
                    olds = list;
                }
                this.setState({
                    attributeDatas: [...olds, {
                        id, name, attributeId: id, list: res.data, value: []
                    }]
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    addProductOption = (id, name) => {
        if (!id) {
            return;
        }
        let p = { id, optionId: id, name, value: [], list: [] };
        var any = false;
        this.state.productOptionData.forEach(c => {
            if (any === false && c.optionId == p.optionId) {
                any = true;
            }
        });
        if (any)
            return;
        this.queryOptionData(id, name);
        this.setState({
            productOptionData: [...this.state.productOptionData, p]
        });
    }

    handleAddProductOption = () => {
        if (!this.state.optionCurrent) {
            return;
        }
        this.addProductOption(this.state.optionCurrent.key, this.state.optionCurrent.label);
    }

    queryOptionData = (id, name) => {
        if (!id)
            return;
        // if (record.id && record.loading)
        //     return;
        // record.loading = true;
        const { dispatch } = this.props;
        new Promise(resolve => {
            dispatch({
                type: 'catalog/optionData',
                payload: {
                    resolve,
                    params: { optionId: id }
                },
            });
        }).then(res => {
            // record.loading = false;
            if (res.success === true) {
                let olds = this.state.productOptionData;
                // if (this.state.productOptionData.length > 10) {
                //     olds = [];
                // }
                let obj = olds.find(c => c.optionId == id);
                if (obj) {
                    let index = olds.indexOf(obj);
                    let list = olds.slice();
                    list.splice(index, 1);
                    olds = list;
                }
                this.setState({
                    productOptionData: [...olds, {
                        id, name, optionId: id, list: res.data, value: []
                    }]
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    handleQueryAttributeData = (record) => {
        // if (record.id && record.loading)
        //     return;
        // record.loading = true;

        //搜索
    }

    handleRemoveProductAttribute = (record) => {
        this.setState(({ productAttributeData }) => {
            const index = productAttributeData.indexOf(record);
            const list = productAttributeData.slice();
            list.splice(index, 1);
            return {
                productAttributeData: list,
            };
        });
    }

    handleRemoveProductOption = (record) => {
        this.setState(({ productOptionData }) => {
            const index = productOptionData.indexOf(record);
            const list = productOptionData.slice();
            list.splice(index, 1);
            return {
                productOptionData: list,
            };
        });
    }

    handleRemoveSku = (record) => {
        this.setState(({ productSku }) => {
            const index = productSku.indexOf(record);
            const list = productSku.slice();
            list.splice(index, 1);
            return {
                productSku: list,
            };
        });
    }

    handleInit = () => {
        const { dispatch } = this.props;

        this.setState({
            brandLoading: true,
            categoryLoading: true,
            templateLoading: true,
            attributeLoading: true,
            optionLoading: true
        });

        new Promise(resolve => {
            dispatch({
                type: 'globalBrand/queryBrandAll',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    brandLoading: false,
                    brands: res.data
                }, () => {
                    let options = [];
                    this.state.brands.forEach(c => {
                        options.push(<Option key={c.id}>{c.name}</Option>);
                    });
                    this.setState({ brandOptions: options });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'globalCategory/all',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    categoryLoading: false,
                    categories: res.data
                }, () => {
                    let options = [];
                    this.state.categories.forEach(c => {
                        options.push(<Option key={c.id}>{c.name}</Option>);
                    });
                    this.setState({ categoryOptions: options });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'catalog/options',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            this.setState({ optionLoading: false });
            if (res.success === true) {
                this.setState({
                    options: res.data
                }, () => {
                    let options = [];
                    this.state.options.forEach(c => {
                        options.push(<Option key={c.id}>{c.name}</Option>);
                    });
                    this.setState({ optionOptions: options });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'catalog/attributesGroupArray',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    attributeLoading: false,
                    attributes: res.data
                });
                let groups = [];
                let list = [];
                list = res.data;
                list.forEach(x => {
                    let options = [];
                    x.productAttributes.forEach(c => {
                        options.push(<Option value={c.id} key={c.id}>{c.name}</Option>);
                    });
                    groups.push(
                        <OptGroup key={x.groupId} label={x.groupName}>
                            {options}
                        </OptGroup>
                    );
                });
                this.setState({ attributeOptions: groups });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'catalog/templates',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    templateLoading: false,
                    templates: res.data
                }, () => {
                    let options = [];
                    this.state.templates.forEach(c => {
                        options.push(<Option key={c.id}>{c.name}</Option>);
                    });
                    this.setState({ templateOptions: options });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    handleUpload = file => {
        this.setState({ uploadLoading: true });

        const { dispatch } = this.props;

        const formData = new FormData();
        formData.append('file', file);

        // dispatch({
        //     type: 'upload/uploadImage',
        //     payload: {
        //         params: formData
        //     },
        // });
        // console.log(upload);
        // console.log(uploadLoading);
        // return;

        new Promise(resolve => {
            dispatch({
                type: 'upload/uploadImage',
                payload: {
                    resolve,
                    params: formData
                },
            });
        }).then(res => {
            this.setState({ uploadLoading: false });
            if (res.success === true) {
                file.url = res.data.url;
                file.mediaId = res.data.id;
                this.setState({
                    fileList: [...this.state.fileList, file]
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    handleRemove = (file) => {
        this.setState(({ fileList }) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        });
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    // handleUploadChange = info => {
    //     const status = info.file.status;
    //     if (status !== 'uploading') {
    //         console.log(info.file, info.fileList);
    //     }
    //     if (status === 'done') {
    //         console.log(`${info.file.name} file uploaded successfully.`);
    //     } else if (status === 'error') {
    //         console.log(`${info.file.name} file upload failed.`);
    //     }
    // }

    render() {
        const {
            editorState,
            form: { getFieldDecorator, getFieldValue }
        } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 19 },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 5 },
            },
        };

        const { previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );

        return (
            <PageHeaderWrapper title="新增商品" action={rollback}>
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                        <Tabs type="card">
                            <TabPane tab="基本信息" key="1">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>名称</span>}>
                                    {getFieldDecorator('name', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请输入产品名称' }],
                                    })(
                                        <Input placeholder="名称" />)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>Slug</span>}>
                                    {getFieldDecorator('slug', {
                                        rules: [{
                                            required: true
                                        }],
                                        initialValue: ''
                                    })(
                                        <Input placeholder="Slug" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>品牌</span>}>
                                    {getFieldDecorator('brandId', { initialValue: '' })(
                                        <Select loading={this.state.brandLoading} allowClear={true}>
                                            {this.state.brandOptions}
                                        </Select>)}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>简短描述</span>}>
                                    {getFieldDecorator('shortDescription')(
                                        <Editor
                                            toolbar={{
                                                inline: { inDropdown: true },
                                                list: { inDropdown: true },
                                                textAlign: { inDropdown: true },
                                                link: { inDropdown: true },
                                                history: { inDropdown: true },
                                            }}
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>描述</span>}>
                                    {getFieldDecorator('description')(
                                        <Editor />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>规格</span>}>
                                    {getFieldDecorator('specification')(
                                        <Editor />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>SKU</span>}>
                                    {getFieldDecorator('sku', { initialValue: '' })(
                                        <Input placeholder="SKU" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>GTIN</span>}>
                                    {getFieldDecorator('gtin', { initialValue: '' })(
                                        <Input placeholder="GTIN" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>价格</span>}>
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: '请输入产品价格' }],
                                        initialValue: ''
                                    })(
                                        <InputNumber style={{ width: '100%' }} placeholder="价格" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>原价</span>}>
                                    {getFieldDecorator('oldPrice', { initialValue: '' })(
                                        <InputNumber style={{ width: '100%' }} placeholder="原价" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>特价</span>}>
                                    {getFieldDecorator('specialPrice', { initialValue: '' })(
                                        <InputNumber style={{ width: '100%' }} placeholder="特价" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>特价时间</span>}>
                                    {getFieldDecorator('specialPriceRangePicker', { initialValue: '' })(
                                        <RangePicker
                                            ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
                                            showTime
                                            format="YYYY/MM/DD HH:mm:ss"
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>产品图片</span>}>
                                    <Upload action={this.handleUpload}
                                        listType="picture-card"
                                        fileList={this.state.fileList}
                                        onRemove={this.handleRemove}
                                        onPreview={this.handlePreview}
                                    // onChange={this.handleUploadChange}
                                    >
                                        {uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>精品</span>}>
                                    {
                                        getFieldDecorator('isFeatured', { initialValue: false })(
                                            <Checkbox defaultChecked={false} />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>已发布</span>}>
                                    {
                                        getFieldDecorator('isPublished', { initialValue: false })(
                                            <Checkbox defaultChecked={false} />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>允许订购</span>}>
                                    {
                                        getFieldDecorator('isAllowToOrder', { initialValue: false })(
                                            <Checkbox defaultChecked={false} />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>isCallForPricing</span>}>
                                    {
                                        getFieldDecorator('isCallForPricing', { initialValue: false })(
                                            <Checkbox defaultChecked={false} />
                                        )
                                    }
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>Enable Stock Tracking</span>}>
                                    {
                                        getFieldDecorator('stockTrackingIsEnabled', { initialValue: false })(
                                            <Checkbox defaultChecked={false} />
                                        )
                                    }
                                </FormItem>
                            </TabPane>
                            <TabPane tab="产品选项" key="2">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>可用选项</span>}>
                                    <Select labelInValue
                                        placeholder="可用选项"
                                        loading={this.state.optionLoading}
                                        allowClear={true}
                                        onChange={(value) => this.setState({ optionCurrent: value })}
                                    >
                                        {this.state.optionOptions}
                                    </Select>
                                    <Button onClick={this.handleAddProductOption}>添加选项</Button>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>产品选项</span>}>
                                    <Table bordered={false}
                                        rowKey={record => record.id}
                                        pagination={false}
                                        loading={this.state.productOptionDataLoading}
                                        dataSource={this.state.productOptionData}
                                        columns={this.columnsOption}
                                    />
                                    <Button onClick={this.handleGenerateOptionCombination}>生成组合</Button>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>产品规格</span>}>
                                    <Table bordered={false}
                                        rowKey={record => record.id}
                                        pagination={false}
                                        loading={this.state.productSkuLoading}
                                        dataSource={this.state.productSku}
                                        columns={this.columnsSku}
                                        scroll={{ x: 600 }}
                                    />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="产品属性" key="3">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>属性模板</span>}>
                                    <Select
                                        placeholder="属性模板"
                                        loading={this.state.templateLoading}
                                        allowClear={true}
                                        onChange={(value) => this.setState({ templateCurrent: value })}
                                    >
                                        {this.state.templateOptions}
                                    </Select>
                                    <Button loading={this.state.applyLoading} onClick={this.handleApplyProductAttrTemplate}>应用</Button>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>可用属性</span>}>
                                    <Select labelInValue
                                        placeholder="可用属性"
                                        loading={this.state.attributeLoading}
                                        allowClear={true}
                                        onChange={(value) => this.setState({ attributeCurrent: value })}
                                    >
                                        {this.state.attributeOptions}
                                    </Select>
                                    <Button onClick={this.handleAddProductAttribute}>添加属性</Button>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>产品属性</span>}>
                                    <Table bordered={false}
                                        rowKey={record => record.id}
                                        pagination={false}
                                        loading={this.state.productAttributeLoading}
                                        dataSource={this.state.productAttributeData}
                                        columns={this.columnsAttribute}
                                    />
                                </FormItem>
                            </TabPane>
                            <TabPane tab="产品类别" key="4">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>产品类别映射</span>}>
                                    {
                                        getFieldDecorator('categoryIds', {})(
                                            <Select
                                                mode="multiple"
                                                // style={{ width: '100%' }}
                                                placeholder="请选择产品类别"
                                                allowClear={true}
                                            // defaultValue={[]}
                                            // onChange={handleChange}
                                            >
                                                {this.state.categoryOptions}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </TabPane>
                            <TabPane tab="SEO" key="5">
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>Meta Title</span>}>
                                    {getFieldDecorator('metaTitle', { initialValue: '' })(
                                        <Input placeholder="Meta Title" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>Meta Keywords</span>}>
                                    {getFieldDecorator('metaKeywords', { initialValue: '' })(
                                        <TextArea
                                            style={{ minHeight: 32 }}
                                            placeholder="Meta Keywords"
                                            rows={2} />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>Meta Description</span>}>
                                    {getFieldDecorator('metaDescription', { initialValue: '' })(
                                        <TextArea
                                            style={{ minHeight: 32 }}
                                            placeholder="Meta Description"
                                            rows={2} />)
                                    }
                                </FormItem>
                            </TabPane>
                        </Tabs>
                        <FormItem {...submitFormLayout}>
                            <Button type="primary" htmlType="submit" loading={this.state.submitting}>保存</Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default ProductAdd;
