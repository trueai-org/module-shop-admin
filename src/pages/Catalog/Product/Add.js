import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Menu, Dropdown, Checkbox, Switch, Tabs, InputNumber, Upload, DatePicker,
    Avatar, Spin, Radio
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';

import { SketchPicker } from 'react-color'

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
            id: '',//props.location.query.id, //产品id
            current: {}, //产品数据
            loading: false, //产品数据加载中

            submitting: false, //数据保存中

            uploadLoading: false,
            uploadMainLoading: false,
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

            //选项配置
            visibleOptionSetting: false,
            currentColor: '',

            optionSettingCurrent: {}
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
                            if (value) {
                                let obj = this.state.productOptionData.find(c => c.id == record.id);
                                if (obj) {
                                    let ops = [];
                                    value.forEach(x => {
                                        var v = obj.values.find(c => c.value == x);
                                        if (v) {
                                            v.value = x;
                                            ops.push(v);
                                        } else {
                                            let p = { id: 0, value: x, display: '', displayOrder: 0, mediaUrl: '', mediaId: '' };
                                            let opValues = this.state.optionData.find(c => c.id == record.id);
                                            if (opValues && opValues.values.length > 0) {
                                                let ov = opValues.values.find(c => c.value == x);
                                                if (ov) {
                                                    p.id = ov.id;
                                                    p.display = ov.display;
                                                }
                                            }
                                            ops.push(p);
                                        }
                                    });
                                    obj.values = ops;
                                }
                            }
                        }}
                        defaultValue={record.values.map(x => {
                            // return { key: x.value }
                            return x.value;
                        })}
                    >
                        {
                            this.state.optionData.map(item => {
                                let os = [];
                                if (item.id == record.id) {
                                    item.values.forEach(c => {
                                        os.push(<Option key={c.value}>
                                            {c.value}
                                        </Option>);
                                    });
                                }
                                return os;
                            })
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
                        <Button onClick={() => this.showOptionSettingModal(record)} icon="setting" type="" size="small"></Button>
                        <Button onClick={() => this.handleRemoveProductOption(record)} icon="close" type="danger" size="small"></Button>
                    </Button.Group>
                </Fragment>
            )
        },
    ];

    columnsOptionSetting = [
        {
            title: '选项值',
            dataIndex: 'value'
        },
        {
            title: '显示',
            dataIndex: 'display',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <Input
                        onChange={(e) => {
                            let obj = this.state.optionSettingCurrent.values.find(c => c.value == record.value);
                            if (obj) {
                                obj.display = e.target.value;
                            }
                        }}
                        defaultValue={text}
                        style={
                            this.state.optionSettingCurrent.displayType == 1 ? {
                                backgroundColor: record.display || ''
                            } : {}
                        }
                        // value={text}
                        onClick={() => {
                            this.state.optionSettingCurrent.displayType == 1 ?
                                this.setState({ currentColor: record.display || '' }, () => {
                                    Modal.info({
                                        title: '选择颜色',
                                        content: (
                                            <SketchPicker
                                                color={this.state.currentColor || ''}
                                                onChange={(color) => {
                                                    let olds = this.state.optionSettingCurrent.values;
                                                    let obj = olds.find(c => c.value == record.value);
                                                    if (obj) {
                                                        let index = olds.indexOf(obj);
                                                        let list = olds.slice();
                                                        list.splice(index, 1);
                                                        olds = list;

                                                        obj.display = color.hex;
                                                        olds.push(obj);
                                                    }
                                                    this.setState({
                                                        'optionSettingCurrent.values': olds
                                                    });
                                                    this.setState({ currentColor: color.hex });
                                                }}
                                            />
                                        ),
                                        okText: '关闭',
                                    });
                                }) : {}
                        }}
                    ></Input>

                </Fragment>
            )
        },
        {
            title: '显示顺序',
            dataIndex: 'displayOrder',
            width: 120,
            render: (text, record) => <InputNumber width={110}
                onChange={(v) => {
                    let obj = this.state.optionSettingCurrent.values.find(c => c.value == record.value);
                    if (obj) {
                        obj.displayOrder = v;
                    }
                }}
                defaultValue={text}></InputNumber>
        },
        {
            title: '默认',
            dataIndex: 'isDefault',
            width: 80,
            render: (val, record) => <Switch
                onChange={(e) => {
                    let obj = this.state.optionSettingCurrent.values.find(c => c.value == record.value);
                    if (obj) {
                        obj.isDefault = e;
                    }
                }}
                defaultChecked={val} />
        },
        {
            title: '图片',
            dataIndex: 'mediaId',
            width: 80,
            // align: 'center',
            render: (text, record) => (
                <Fragment>
                    <Avatar
                        onClick={
                            () => {
                                Modal.info({
                                    title: '选择图片',
                                    content: (
                                        <Radio.Group
                                            defaultValue={record.mediaId || ''}
                                            onChange={(e) => {
                                                let olds = this.state.optionSettingCurrent.values;
                                                let obj = olds.find(c => c.value == record.value);
                                                if (obj) {
                                                    let index = olds.indexOf(obj);
                                                    let list = olds.slice();
                                                    list.splice(index, 1);
                                                    olds = list;

                                                    obj.mediaId = '';
                                                    obj.mediaUrl = '';
                                                    if (e.target.value) {
                                                        let first = this.state.fileList.find(c => c.mediaId == e.target.value);
                                                        if (first) {
                                                            obj.mediaId = first.mediaId;
                                                            obj.mediaUrl = first.url;
                                                        }
                                                    }
                                                    olds.push(obj);
                                                    this.setState({
                                                        'optionSettingCurrent.values': olds
                                                    });
                                                }
                                            }}
                                        >
                                            <Radio
                                                style={{
                                                    width: 80
                                                }}
                                                value={''}>无</Radio>
                                            {
                                                this.state.fileList.map(x => {
                                                    return <Radio
                                                        style={{
                                                            width: 80
                                                        }}
                                                        key={x.mediaId} value={x.mediaId}>
                                                        <Avatar shape="square" size={48} src={x.url} />
                                                    </Radio>;
                                                })
                                            }
                                        </Radio.Group>
                                    ),
                                    okText: '关闭'
                                })
                            }
                        }
                        shape="square"
                        size={32}
                        src={record.mediaUrl} />
                </Fragment>
            )
        },
    ];

    columnsSku = [
        {
            title: '名称',
            dataIndex: 'name',
            // width: 150,
            render: (text, record) => (
                <Fragment>
                    <Input
                        onChange={(e) => {
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.name = e.target.value;
                            }
                        }}
                        defaultValue={text}></Input>
                </Fragment>
            )
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            width: 150,
            render: (text, record) => (
                <Fragment>
                    <Input
                        onChange={(e) => {
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.sku = e.target.value;
                            }
                        }}
                        defaultValue={text}></Input>
                </Fragment>
            )
        },
        {
            title: 'GTIN',
            dataIndex: 'gtin',
            width: 150,
            render: (text, record) => (
                <Fragment>
                    <Input
                        onChange={(e) => {
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.gtin = e.target.value;
                            }
                        }}
                        defaultValue={text}></Input>
                </Fragment>
            )
        },
        {
            title: '价格',
            dataIndex: 'price',
            width: 100,
            render: (value, record) => (
                <Fragment>
                    <InputNumber
                        onChange={(e) => {
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.price = e;
                            }
                        }}
                        defaultValue={value}></InputNumber>
                </Fragment>
            )
        },
        {
            title: '原价',
            dataIndex: 'oldPrice',
            width: 100,
            render: (value, record) => (
                <Fragment>
                    <InputNumber
                        onChange={(e) => {
                            let obj = this.state.productSku.find(c => c.id == record.id);
                            if (obj) {
                                obj.oldPrice = e;
                            }
                        }}
                        defaultValue={value}></InputNumber>
                </Fragment>
            )
        },
        {
            title: '图片',
            dataIndex: 'mediaId',
            align: 'center',
            width: 64,
            fixed: 'right',
            render: (text, record) => (
                <Fragment>
                    <Avatar
                        onClick={
                            () => {
                                Modal.info({
                                    title: '选择图片',
                                    content: (
                                        <Radio.Group
                                            defaultValue={record.mediaId || ''}
                                            onChange={(e) => {
                                                let index = this.state.productSku.indexOf(record);
                                                let list = this.state.productSku.slice();
                                                list.splice(index, 1);
                                                record.mediaId = '';
                                                record.mediaUrl = '';
                                                if (e.target.value) {
                                                    let first = this.state.fileList.find(c => c.mediaId == e.target.value);
                                                    if (first) {
                                                        record.mediaId = first.mediaId;
                                                        record.mediaUrl = first.url;
                                                    }
                                                }
                                                // list.push(record);
                                                list.splice(index, 0, record);
                                                this.setState({ productSku: list });
                                            }}
                                        >
                                            <Radio
                                                style={{
                                                    width: 80
                                                }}
                                                value={''}>无</Radio>
                                            {
                                                this.state.fileList.map(x => {
                                                    return <Radio
                                                        style={{
                                                            width: 80
                                                        }}
                                                        key={x.mediaId} value={x.mediaId}>
                                                        <Avatar shape="square" size={48} src={x.url} />
                                                    </Radio>;
                                                })
                                            }
                                        </Radio.Group>
                                    ),
                                    okText: '关闭'
                                })
                            }
                        }
                        shape="square" size={32} src={record.mediaUrl} />
                </Fragment>
            )
        },
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
        this.handleInit();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;

        form.validateFields((err, values) => {
            if (err) return;

            var params = {
                // id: this.state.id,
                thumbnailImageUrlId: this.state.current.mediaId || '',
                ...values
            };

            //富文本处理
            //draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            params.description = params.description.toHTML(); //draftToHtml(params.description);
            params.shortDescription = params.shortDescription.toHTML(); //draftToHtml(params.shortDescription);
            params.specification = params.specification.toHTML(); //draftToHtml(params.specification);

            //特价时间处理
            if (params.specialPriceRangePicker && params.specialPriceRangePicker.length == 2) {
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
                if (c.values && c.values.length > 0) {
                    params.options.push({
                        id: c.id,
                        values: c.values
                    });
                }
            });

            //产品选项组合
            params.variations = [];
            if (this.state.productSku && this.state.productSku.length > 0) {
                params.variations = this.state.productSku
            }

            // console.log(params);
            // return;

            if (this.state.submitting === true)
                return;

            this.setState({ submitting: true, loading: true });
            new Promise(resolve => {
                dispatch({
                    type: 'product/add',
                    payload: {
                        resolve,
                        params
                    },
                });
            }).then(res => {
                this.setState({ submitting: false, loading: false });
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

    showOptionSettingModal = item => {
        this.setState({
            visibleOptionSetting: true,
            optionSettingCurrent: item
        });
    };

    handleOptionSettingCancel = () => {
        this.setState({
            visibleOptionSetting: false,
            optionSettingCurrent: {}
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
                displayOrder: optionIndex,
                mediaId: this.state.productOptionData[optionIndex].values[j].mediaId,
                mediaUrl: this.state.productOptionData[optionIndex].values[j].mediaUrl
            };
            optionCombinations.push(optionValue);

            if (optionIndex === maxIndexOption) {
                let firstImage = optionCombinations.find(c => c.mediaId && c.mediaId != '');
                variation = {
                    id: 0,
                    sku: '',
                    gtin: this.state.current.gtin || '',
                    mediaId: firstImage ? firstImage.mediaId : '',
                    mediaUrl: firstImage ? firstImage.mediaUrl : '',
                    name: (this.state.current.name || '') + ' ' + optionCombinations.map(this.getItemValue).join(' '),
                    normalizedName: optionCombinations.map(this.getItemValue).join('-'),
                    optionCombinations: optionCombinations,
                    price: this.state.current.price || 0,
                    oldPrice: this.state.current.oldPrice || 0
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
        let obj = this.state.options.find(c => c.id == id);
        if (obj == undefined) {
            return;
        }
        let p = { id, name, displayType: obj.displayType, values: [] };
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
                if (obj) {
                    let index = olds.indexOf(obj);
                    let list = olds.slice();
                    list.splice(index, 1);
                    olds = list;
                }
                this.setState({
                    optionData: [...olds, {
                        id, name, values: res.data
                    }]
                });
            } else {
                notification.error({ message: res.message });
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
            // loading: true,
            brandLoading: true,
            categoryLoading: true,
            templateLoading: true,
            attributeLoading: true,
            optionLoading: true
        });

        // new Promise(resolve => {
        //     dispatch({
        //         type: 'product/get',
        //         payload: {
        //             resolve,
        //             params: { id: this.state.id }
        //         },
        //     });
        // }).then(res => {
        //     this.setState({ loading: false });
        //     if (res.success === true) {
        //         this.setState({
        //             current: res.data
        //         }, () => {
        //             this.props.form.setFieldsValue({
        //                 shortDescription: BraftEditor.createEditorState(this.state.current.shortDescription || ''),
        //                 description: BraftEditor.createEditorState(this.state.current.description || ''),
        //                 specification: BraftEditor.createEditorState(this.state.current.specification || ''),
        //             })
        //         });

        //         let imgs = res.data.productImages || [];
        //         let fs = [];
        //         imgs.forEach(c => {
        //             fs.push({
        //                 uid: -c.id,
        //                 name: c.caption || '',
        //                 status: 'done',
        //                 url: c.mediaUrl,
        //                 mediaId: c.mediaId
        //             });
        //             this.setState({ fileList: fs });
        //         });

        //         this.setState({
        //             productAttributeData: res.data.attributes,
        //             productOptionData: res.data.options,
        //             productSku: res.data.variations
        //         }, () => {
        //             //加载属性对应的属性值列表
        //             this.state.productAttributeData.forEach(c => {
        //                 this.queryAttributeData(c.id, c.name);
        //             });

        //             this.state.productOptionData.forEach(c => {
        //                 this.queryOptionData(c.id, c.name);
        //             });
        //         });
        //     } else {
        //         notification.error({
        //             message: res.message,
        //         });
        //     }
        // });

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
            this.setState({ templateLoading: false });
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
            this.setState({ attributeLoading: false });
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
                let obj = this.state.fileList.find(c => c.mediaId == res.data.id);
                if (obj) {
                    notification.warning({
                        message: '图片已存在',
                    });
                    return;
                }

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

    handleUploadMain = file => {
        this.setState({ uploadMainLoading: true });
        const { dispatch } = this.props;
        const formData = new FormData();
        formData.append('file', file);
        new Promise(resolve => {
            dispatch({
                type: 'upload/uploadImage',
                payload: {
                    resolve,
                    params: formData
                },
            });
        }).then(res => {
            this.setState({ uploadMainLoading: false });
            if (res.success === true) {
                this.setState({
                    current: Object.assign({},
                        this.state.current,
                        { mediaId: res.data.id, mediaUrl: res.data.url })
                });
            } else {
                notification.error({ message: res.message });
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
            previewImage: file.url || file.thumbUrl || file.mediaUrl,
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
            <PageHeaderWrapper title="添加商品" action={rollback}>
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
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({
                                                        current: Object.assign({},
                                                            this.state.current,
                                                            { name: e.target.value })
                                                    });
                                                }}
                                                placeholder="名称" />)}
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
                                        {getFieldDecorator('shortDescription')(
                                            <BraftEditor
                                                className={styles.myEditor}
                                                controls={controlsEasy}
                                                placeholder=""
                                                contentStyle={{ height: 120 }}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>描述</span>}>
                                        {getFieldDecorator('description')(
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
                                            <Input
                                                onChange={(e) => {
                                                    this.setState({
                                                        current: Object.assign({},
                                                            this.state.current,
                                                            { gtin: e.target.value })
                                                    });
                                                }}
                                                placeholder="GTIN" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>价格</span>}>
                                        {getFieldDecorator('price', {
                                            rules: [{ required: true, message: '请输入产品价格' }],
                                            initialValue: this.state.current.price || 0
                                        })(
                                            <InputNumber
                                                onChange={(e) => {
                                                    this.setState({
                                                        current: Object.assign({},
                                                            this.state.current,
                                                            { price: e })
                                                    });
                                                }}
                                                style={{ width: '100%' }} placeholder="价格" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>原价</span>}>
                                        {getFieldDecorator('oldPrice', { initialValue: this.state.current.oldPrice || 0 })(
                                            <InputNumber
                                                onChange={(e) => {
                                                    this.setState({
                                                        current: Object.assign({},
                                                            this.state.current,
                                                            { oldPrice: e })
                                                    });
                                                }}
                                                style={{ width: '100%' }} placeholder="原价" />
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
                                            initialValue: this.state.current.specialPriceStart && this.state.current.specialPriceEnd ? [
                                                moment(this.state.current.specialPriceStart, "YYYY/MM/DD HH:mm:ss"),
                                                moment(this.state.current.specialPriceEnd, "YYYY/MM/DD HH:mm:ss")
                                            ] : []
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
                                        label={<span>产品主图</span>}>
                                        <Upload
                                            action={this.handleUploadMain}
                                            listType="picture-card"
                                            showUploadList={false}
                                        // onChange={this.handleChange}
                                        // onPreview={this.handlePreview}
                                        >
                                            <Spin spinning={this.state.uploadMainLoading}>
                                                {this.state.current.mediaId ? <img height={102} src={this.state.current.mediaUrl} />
                                                    :
                                                    <div>
                                                        <Icon type={this.state.uploadMainLoading ? 'loading' : 'plus'} />
                                                        <div className="ant-upload-text">上传</div>
                                                    </div>
                                                }
                                            </Spin>
                                        </Upload>
                                        {this.state.current.mediaId ? <Button onClick={
                                            () => {
                                                this.setState({
                                                    current: Object.assign({},
                                                        this.state.current,
                                                        { mediaId: '', mediaUrl: '' })
                                                });
                                            }
                                        } icon="close" size="small"></Button>
                                            : null
                                        }
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
                                            <img alt="image" style={{ width: '100%' }} src={previewImage} />
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
                                        label={<span>产品组合</span>}>
                                        <Table bordered={false}
                                            rowKey={(record, index) => `sku_${record.id}_i_${index}`} //{record => record.id}
                                            pagination={false}
                                            loading={this.state.productSkuLoading}
                                            dataSource={this.state.productSku}
                                            columns={this.columnsSku}
                                            scroll={{ x: 960 }}
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
                <Modal
                    width={600}
                    title={`选项配置 - ${this.state.optionSettingCurrent.name}`}
                    destroyOnClose
                    visible={this.state.visibleOptionSetting}
                    footer={null}
                    onCancel={this.handleOptionSettingCancel}
                >
                    <Table bordered={false}
                        rowKey={(record, index) => `option_${record.id}_v_${index}`} //{record => record.id}
                        pagination={false}
                        dataSource={this.state.optionSettingCurrent.values}
                        columns={this.columnsOptionSetting}
                    />
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default ProductAdd;
