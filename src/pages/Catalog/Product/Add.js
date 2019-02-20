import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    List, Card, Input, Button, Modal, Form, notification, Table, Popconfirm, Divider, Select, Tag, Icon,
    Redio, Menu, Dropdown, Checkbox, Switch, Tabs, InputNumber, Upload, DatePicker
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
const Option = Select.Option;
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

            // editorState: EditorState.createEmpty()
        };
    }

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

    handleInit = () => {
        const { dispatch } = this.props;

        this.setState({
            brandLoading: true,
            categoryLoading: true,
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
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 18 },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 6 },
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
                                        <InputNumber placeholder="价格" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>原价</span>}>
                                    {getFieldDecorator('oldPrice', { initialValue: '' })(
                                        <InputNumber placeholder="原价" />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={<span>特价</span>}>
                                    {getFieldDecorator('specialPrice', { initialValue: '' })(
                                        <InputNumber placeholder="特价" />
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
                            <TabPane tab="产品选项" key="2">Content of Tab Pane 2</TabPane>
                            <TabPane tab="产品属性" key="3">Content of Tab Pane 3</TabPane>
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
