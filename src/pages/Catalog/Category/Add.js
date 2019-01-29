import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
    Checkbox,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { allCategories } from '@/services/api';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const children = [];

@connect(({ category }) => ({
    category,
}))
// @connect(({ loading }) => ({
//     submitting: loading.effects['form/submitRegularForm'],
// }))
@Form.create()
class CategoryAdd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            categories: []
        };
    }

    init() {
        this.setState({
            loading: true,
        });
        const { dispatch } = this.props;
        new Promise(resolve => {
            dispatch({
                type: 'category/allCategories',
                payload: {
                    resolve,
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    loading: false,
                    categories: res.data
                }, () => {
                    this.state.categories.forEach(c => {
                        children.push(<Option key={c.id}>{c.name}</Option>);
                    });
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });
    }

    componentDidMount() {
        this.init();
    }

    handleSubmit = e => {
        const { dispatch, form } = this.props;

        var params = {
            // id: 0,
            slug: "string",
            name: "string",
            description: "string",
            metaTitle: "string",
            metaKeywords: "string",
            metaDescription: "string",
            displayOrder: 0,
            // parentId: 0,
            includeInMenu: true,
            isPublished: true
        };
        new Promise(resolve => {
            dispatch({
                type: 'category/addCategory',
                payload: {
                    resolve,
                    params
                },
            });
        }).then(res => {
            if (res.success === true) {
                this.setState({
                    loading: false,
                },()=>{
                    // 跳转
                });
            } else {
                notification.error({
                    message: res.message,
                });
            }
        });

        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);

                // dispatch({
                //     type: 'form/submitRegularForm',
                //     payload: values,
                // });
            }
        });
    };

    render() {
        const { submitting } = this.props;
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 10 },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 },
            },
        };

        return (
            <PageHeaderWrapper title="新增分类">
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem
                            {...formItemLayout}
                            label={<span>名称</span>}>
                            <Input placeholder="名称" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>父级类别</span>}>
                            <Select loading={this.state.loading} allowClear={true} defaultValue={""}>
                                {children}
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>Slug</span>}>
                            <Input placeholder="Slug" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>Meta Title</span>}>
                            <Input placeholder="Meta Title" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>Meta Keywords</span>}>
                            <TextArea
                                style={{ minHeight: 32 }}
                                placeholder="Meta Keywords"
                                rows={2} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>Meta Description</span>}>
                            <TextArea
                                style={{ minHeight: 32 }}
                                placeholder="Meta Description"
                                rows={2} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>描述</span>}>
                            <TextArea
                                style={{ minHeight: 32 }}
                                placeholder="描述"
                                rows={2} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>显示顺序</span>}>
                            <InputNumber defaultValue="0" placeholder="显示顺序" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>已发布</span>}>
                            <Checkbox defaultChecked={false} />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span>包括在菜单中</span>}>
                            <Checkbox defaultChecked={false} />
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                保存
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default CategoryAdd;
