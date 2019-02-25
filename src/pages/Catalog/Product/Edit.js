import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Redio, Menu, Dropdown, Checkbox, Switch, Tabs, InputNumber, Upload, DatePicker,
    Avatar, Spin
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';

// editor
// import { EditorState, convertToRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

// editor2
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

import styles from './Edit.less';

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
            id: props.location.query.id, //产品id
            current: {}, //产品数据
            loading: false, //产品数据加载中

            submitting: false, //数据保存中

            uploadLoading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],

            categoryLoading: false, //类别加载中
            categories: [],

            brandLoading: false, //品牌加载中
            brands: [],

            optionLoading: false, //选项加载中
            options: [],
            optionCurrent: undefined,

            templateLoading: false, //属性模板加载中
            templates: [],
            templateCurrent: undefined,
            //应用产品属性模板
            applyLoading: false,

            attributeLoading: false, //属性加载中
            attributes: [],
            attributeCurrent: undefined,

            //产品属性列表
            productAttributeLoading: false,
            productAttributeData: [],
            //属性值
            attributeData: [],

            //产品选项列表
            productOptionDataLoading: false,
            productOptionData: [],
            //选项值
            optionData: [],

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
                        // labelInValue
                        onChange={(value) => {
                            if (value) {
                                var vs = [];
                                value.forEach(c => {
                                    // vs.push(c.label);
                                    vs.push({ id: 0, value: c });
                                });
                                let obj = this.state.productAttributeData.find(c => c.id == record.id);
                                if (obj) {
                                    obj.values = vs;
                                }
                                // console.log(this.state.productAttributeData);
                            }
                        }}
                        defaultValue={record.values.map(x => x.value)}
                    >
                        {this.state.attributeData.map(item => {
                            let os = [];
                            if (item.id == record.id) {
                                item.list.forEach(c => {
                                    os.push(<Option key={c.value}>
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
                        // labelInValue
                        onChange={(value) => {
                            // console.log(value);
                            // return;
                            if (value) {
                                var vs = [];
                                value.forEach(c => {
                                    // vs.push(c.label);
                                    // vs.push({ id: 0, value: c.label });
                                    vs.push({ id: 0, value: c });
                                });
                                let obj = this.state.productOptionData.find(c => c.id == record.id);
                                if (obj) {
                                    obj.values = vs;
                                }
                            }
                        }}
                        defaultValue={record.values.map(x => x.value
                            // {
                            //     // return x.value; 
                            //     return { key: x.key }
                            // }
                        )}
                    >
                        {
                            this.state.optionData.map(item => {
                                let os = [];
                                if (item.id == record.id) {
                                    item.list.forEach(c => {
                                        os.push(<Option key={c.value}>
                                            {c.value}
                                        </Option>);
                                    });
                                }
                                return os;
                            })

                            // record.list.map(c => {
                            //     return <Option key={c.value}>{c.value}</Option>;
                            // })
                            // (record.list != undefined && record.list.length > 0) ?
                            //     record.list.map(c => {
                            //         return <Option key={c.value}>{c.value}</Option>;
                            //     }) : {}
                        }
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
            render: (text, record) => (
                <Fragment>
                    <Input
                        onChange={(e) => {
                            // value = e.target.value;
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.sku = e.target.value;
                            }

                            // console.log(value);
                            console.log(this.state.productSku);
                        }}
                        defaultValue={text}></Input>
                </Fragment>
            )
        },
        {
            title: 'GTIN',
            dataIndex: 'gtin',
            width: 150,
            render: (value) => (
                <Fragment>
                    <Input defaultValue={value}></Input>
                </Fragment>
            )
        },
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
        {
            title: '原价',
            dataIndex: 'oldPrice',
            width: 100,
            render: (value) => (
                <Fragment>
                    <InputNumber defaultValue={value}></InputNumber>
                </Fragment>
            )
        },
        {
            title: '图片',
            dataIndex: 'mediaId',
            width: 100,
            render: (text, record) => (
                <Fragment>
                    <Avatar shape="square" size={32} src={record.mediaUrl} />
                </Fragment>
            )
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 120,
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
                id: this.state.id,
                ...values
            };

            //富文本处理
            //draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            params.description = params.description.toHTML(); //draftToHtml(params.description);
            params.shortDescription = params.shortDescription.toHTML(); //draftToHtml(params.shortDescription);
            params.specification = params.specification.toHTML(); //draftToHtml(params.specification);

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
            if (this.state.productAttributeData) {
                this.state.productAttributeData.forEach(x => {
                    if (x && x.values && x.values.length > 0) {
                        let p = { attributeId: x.id, values: x.values.map(p => p.value) };
                        params.attributes.push(p);
                    }
                });
            }

            //产品选项
            params.options = [];
            this.state.productOptionData.forEach(c => {
                if (c.value && c.value.length > 0) {
                    let vs = [];
                    c.value.forEach(x => {
                        vs.push({ key: x, value: x });
                    });
                    params.options.push({
                        id: c.optionId,
                        displayType: 0,
                        values: vs
                    });
                }
            });

            //产品选项组合
            params.variations = [];
            if (this.state.productSku && this.state.productSku.length > 0) {
                params.variations = this.state.productSku
            }

            console.log(params);
            return;

            if (this.state.submitting === true)
                return;

            this.setState({ submitting: true });
            new Promise(resolve => {
                dispatch({
                    type: 'product/edit',
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
        for (j = 0, l = this.state.productOptionData[optionIndex].values.length; j < l; j = j + 1) {
            optionCombinations = arr.slice(0);
            optionValue = {
                optionName: this.state.productOptionData[optionIndex].name,
                optionId: this.state.productOptionData[optionIndex].id,
                value: this.state.productOptionData[optionIndex].values[j].value,
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
        let p = { id, name, values: [], list: [] };
        let any = this.state.productAttributeData.findIndex(c => c.id == p.id) >= 0;
        if (any) return;
        this.setState({
            productAttributeData: [...this.state.productAttributeData, p]
        }, () => {
            this.queryAttributeData(id, name)
        });
    }

    queryAttributeData = (id, name) => {
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
            if (res.success === true) {
                let olds = this.state.attributeData;
                // if (this.state.attributeData.length > 10) {
                //     olds = [];
                // }
                let obj = olds.find(c => c.id == id);
                if (obj) {
                    let index = olds.indexOf(obj);
                    let list = olds.slice();
                    list.splice(index, 1);
                    olds = list;
                }
                this.setState({
                    attributeData: [...olds, {
                        id,
                        name,
                        list: res.data.map(x => { return { id: x.id, value: x.value } }),
                        // list: res.data
                    }]
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    handleAddProductOption = () => {
        if (!this.state.optionCurrent) {
            return;
        }
        this.addProductOption(this.state.optionCurrent.key, this.state.optionCurrent.label);
    }

    addProductOption = (id, name) => {
        let p = { id, name, values: [], list: [] };
        let any = this.state.productOptionData.findIndex(c => c.id == p.id) >= 0;
        if (any) return;
        this.setState({
            productOptionData: [...this.state.productOptionData, p]
        }, () => {
            this.queryOptionData(id, name);
        });
    }

    queryOptionData = (id, name) => {
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
            if (res.success === true) {
                let olds = this.state.optionData;
                let obj = olds.find(c => c.id == id);
                // console.log(res.data);
                if (obj) {
                    // obj.list = res.data;
                    let index = olds.indexOf(obj);
                    let list = olds.slice();
                    list.splice(index, 1);
                    olds = list;
                    // console.log(this.state.productOptionData);
                }
                this.setState({
                    optionData: [...olds, {
                        id, name,
                        list: res.data.map(x => { return { id: x.id, value: x.value } }),
                        // values: obj ? obj.values : []
                    }]
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
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
            loading: true,
            brandLoading: true,
            categoryLoading: true,
            templateLoading: true,
            attributeLoading: true,
            optionLoading: true
        });

        new Promise(resolve => {
            dispatch({
                type: 'product/get',
                payload: {
                    resolve,
                    params: { id: this.state.id }
                },
            });
        }).then(res => {
            this.setState({ loading: false });
            if (res.success === true) {
                this.setState({
                    current: res.data
                }, () => {
                    this.props.form.setFieldsValue({
                        shortDescription: BraftEditor.createEditorState(this.state.current.shortDescription || ''),
                        description: BraftEditor.createEditorState(this.state.current.description || ''),
                        specification: BraftEditor.createEditorState(this.state.current.specification || ''),
                    })
                });

                let imgs = res.data.productImages || [];
                let fs = [];
                imgs.forEach(c => {
                    fs.push({
                        uid: -c.id,
                        name: c.caption || '',
                        status: 'done',
                        url: c.mediaUrl,
                        mediaId: c.mediaId
                    });
                    this.setState({ fileList: fs });
                });

                this.setState({
                    productAttributeData: res.data.attributes,
                    productOptionData: res.data.options,
                    productSku: res.data.variations
                }, () => {
                    //加载属性对应的属性值列表
                    this.state.productAttributeData.forEach(c => {
                        this.queryAttributeData(c.id, c.name);
                    });

                    this.state.productOptionData.forEach(c => {
                        this.queryOptionData(c.id, c.name);
                    });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'catalog/brands',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            this.setState({ brandLoading: false });
            if (res.success === true) {
                this.setState({ brands: res.data });
            } else {
                notification.error({ message: res.message });
            }
        });

        new Promise(resolve => {
            dispatch({
                type: 'catalog/categories',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            this.setState({ categoryLoading: false });
            if (res.success === true) {
                this.setState({ categories: res.data });
            } else {
                notification.error({ message: res.message });
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
                this.setState({ options: res.data });
            } else {
                notification.error({ message: res.message });
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
            this.setState({ optionLoading: false });
            if (res.success === true) {
                this.setState({ templates: res.data });
            } else {
                notification.error({ message: res.message });
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
            this.setState({ optionLoading: false });
            if (res.success === true) {
                this.setState({ attributes: res.data });
            } else {
                notification.error({ message: res.message });
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
                }, () => {
                    console.log(this.state.fileList);
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

        const { previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.uploadLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );

        const controls = [
            'headings', 'font-size', 'separator',
            'bold', 'italic', 'underline', 'text-color', 'strike-through', 'emoji', 'media', 'separator',
            'link', 'separator',
            'text-indent', 'text-align', 'separator',
            'list-ul', 'list-ol', 'blockquote', 'code', 'hr', 'separator',

            'remove-styles', 'fullscreen'
        ];
        const controlsEasy = [
            'bold', 'italic', 'underline', 'text-color', 'media', 'separator',
            'link', 'separator',
            'text-align', 'separator',
            'list-ul', 'list-ol', 'separator',
            'remove-styles'
        ];

        return (
            <PageHeaderWrapper title="新增商品" action={rollback}>
                <Spin spinning={this.state.loading}>
                    <Card bordered={false}>
                        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                            <Tabs type="card">
                                <TabPane tab="基本信息" key="1">
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>名称</span>}>
                                        {getFieldDecorator('name', {
                                            initialValue: this.state.current.name || '',
                                            rules: [{ required: true, message: '请输入产品名称' }],
                                        })(
                                            <Input placeholder="名称" />)}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>Slug</span>}>
                                        {getFieldDecorator('slug',
                                            {
                                                rules: [{
                                                    required: true
                                                }],
                                                initialValue: this.state.current.slug || ''
                                            })(<Input placeholder="Slug" />)}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>品牌</span>}>
                                        {getFieldDecorator('brandId',
                                            { initialValue: this.state.current.brandId || '' })
                                            (<Select loading={this.state.brandLoading} allowClear={true}>
                                                {
                                                    this.state.brands.map(c => {
                                                        return <Option value={c.id} key={c.id}>{c.name}</Option>;
                                                    })
                                                }
                                            </Select>)}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>简短描述</span>}>
                                        {getFieldDecorator('shortDescription',
                                            {
                                                // initialValue: this.state.editorState
                                                // initialValue: '123',//BraftEditor.createEditorState(this.state.current.shortDescription || '')
                                                // valuePropName: 'defaultValue'
                                            })(
                                                <BraftEditor
                                                    className={styles.myEditor}
                                                    controls={controlsEasy}
                                                    placeholder=""
                                                    contentStyle={{ height: 120 }}
                                                />
                                                // <Editor
                                                //     toolbar={{
                                                //         inline: { inDropdown: true },
                                                //         list: { inDropdown: true },
                                                //         textAlign: { inDropdown: true },
                                                //         link: { inDropdown: true },
                                                //         history: { inDropdown: true },
                                                //     }}
                                                //     editorClassName="editor-class"
                                                // // editorStyle={{ border: '1px solid black' }}
                                                // />
                                            )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>描述</span>}>
                                        {getFieldDecorator('description')(
                                            // <Editor />
                                            <BraftEditor
                                                className={styles.myEditor}
                                                controls={controls}
                                                placeholder=""
                                                contentStyle={{ height: 200 }}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>规格</span>}>
                                        {getFieldDecorator('specification')(
                                            // <Editor />
                                            <BraftEditor
                                                className={styles.myEditor}
                                                controls={controls}
                                                placeholder=""
                                                contentStyle={{ height: 120 }}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>SKU</span>}>
                                        {getFieldDecorator('sku', { initialValue: this.state.current.sku || '' })(
                                            <Input placeholder="SKU" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>GTIN</span>}>
                                        {getFieldDecorator('gtin', { initialValue: this.state.current.gtin || '' })(
                                            <Input placeholder="GTIN" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>价格</span>}>
                                        {getFieldDecorator('price', {
                                            rules: [{ required: true, message: '请输入产品价格' }],
                                            initialValue: this.state.current.price || 0
                                        })(
                                            <InputNumber style={{ width: '100%' }} placeholder="价格" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>原价</span>}>
                                        {getFieldDecorator('oldPrice', { initialValue: this.state.current.oldPrice || 0 })(
                                            <InputNumber style={{ width: '100%' }} placeholder="原价" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>特价</span>}>
                                        {getFieldDecorator('specialPrice', { initialValue: this.state.current.specialPrice || 0 })(
                                            <InputNumber style={{ width: '100%' }} placeholder="特价" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>特价时间</span>}>
                                        {getFieldDecorator('specialPriceRangePicker', {
                                            initialValue: [
                                                moment(this.state.current.specialPriceStart || '',
                                                    "YYYY/MM/DD HH:mm:ss"),
                                                moment(this.state.current.specialPriceEnd || '',
                                                    "YYYY/MM/DD HH:mm:ss")]
                                        })(
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
                                            getFieldDecorator('isFeatured', { initialValue: this.state.current.isFeatured || false, valuePropName: 'checked' })(
                                                <Checkbox />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>已发布</span>}>
                                        {
                                            getFieldDecorator('isPublished', { initialValue: this.state.current.isPublished || false, valuePropName: 'checked' })(
                                                <Checkbox />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>允许订购</span>}>
                                        {
                                            getFieldDecorator('isAllowToOrder', { initialValue: this.state.current.isAllowToOrder || false, valuePropName: 'checked' })(
                                                <Checkbox />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>isCallForPricing</span>}>
                                        {
                                            getFieldDecorator('isCallForPricing', { initialValue: this.state.current.isCallForPricing || false, valuePropName: 'checked' })(
                                                <Checkbox />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label='Enable Stock Tracking'>
                                        {
                                            getFieldDecorator('stockTrackingIsEnabled', { initialValue: this.state.current.stockTrackingIsEnabled || false, valuePropName: 'checked' })(
                                                <Checkbox />
                                            )
                                        }
                                    </FormItem>
                                </TabPane>
                                <TabPane tab="产品选项"
                                    disabled={(this.state.current.parentGroupedProductId || 0) > 0}
                                    key="2">
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>可用选项</span>}>
                                        <Select
                                            labelInValue
                                            placeholder="可用选项"
                                            loading={this.state.optionLoading}
                                            allowClear={true}
                                            onChange={(value) => this.setState({ optionCurrent: value })}
                                        >
                                            {this.state.options.map(c => {
                                                return <Option key={c.id}>{c.name}</Option>;
                                            })}
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
                                            scroll={{ x: 900 }}
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
                                            {this.state.templates.map(c => {
                                                return <Option key={c.id}>{c.name}</Option>;
                                            })}
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
                                            {this.state.attributes.map(x => {
                                                if (x.productAttributes) {
                                                    let options = x.productAttributes.map(c => {
                                                        return <Option value={c.id} key={c.id}>{c.name}</Option>;
                                                    })
                                                    return <OptGroup key={x.groupId} label={x.groupName}>
                                                        {options}
                                                    </OptGroup>;
                                                }
                                            })}
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
                                        {getFieldDecorator('categoryIds',
                                            { initialValue: this.state.current.categoryIds || [], valuePropName: 'value' })
                                            (<Select
                                                mode="multiple"
                                                placeholder="请选择产品类别"
                                                allowClear={true}>
                                                {
                                                    this.state.categories.map(c => {
                                                        return <Option value={c.id} key={c.id}>{c.name}</Option>;
                                                    })
                                                }
                                            </Select>)}
                                    </FormItem>
                                </TabPane>
                                <TabPane tab="SEO" key="5">
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>Meta Title</span>}>
                                        {getFieldDecorator('metaTitle', { initialValue: this.state.current.metaTitle || '' })(
                                            <Input placeholder="Meta Title" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>Meta Keywords</span>}>
                                        {getFieldDecorator('metaKeywords', { initialValue: this.state.current.metaKeywords || '' })(
                                            <TextArea
                                                style={{ minHeight: 32 }}
                                                placeholder="Meta Keywords"
                                                rows={2} />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>Meta Description</span>}>
                                        {getFieldDecorator('metaDescription', { initialValue: this.state.current.metaDescription || '' })(
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
                </Spin>
            </PageHeaderWrapper>
        );
    }
}

export default ProductAdd;
