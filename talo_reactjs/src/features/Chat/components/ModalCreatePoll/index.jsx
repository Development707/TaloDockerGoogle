import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, message, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import pollApi from 'api/pollApi';
import { useSelector } from 'react-redux';
import './style.scss';

ModalCreatePoll.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
};

ModalCreatePoll.defaultProps = {
    visible: false,
    onCancel: null,
};

function ModalCreatePoll({ visible, onCancel }) {
    const [form] = Form.useForm();
    const { currentConversation } = useSelector((state) => state.chat);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log(currentConversation);
                const { question, options } = values;
                pollApi
                    .createPoll(currentConversation, question, options)
                    .then(() => {
                        form.resetFields();
                        handleCancel();
                        message.success('Tạo cuộc bình chọn thành công');
                    })
                    .catch(() => {
                        message.error('Đã có lỗi xảy ra');
                    });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
            form.resetFields();
        }
    };

    const DynamicFieldSet = () => {
        return (
            <Form
                name="dynamic_form_item"
                layout="vertical"
                initialValues={{ options: ['', ''] }}
                form={form}
            >
                <Form.Item
                    label="Chủ đề bình chọn"
                    name="question"
                    rules={[
                        { required: true, message: 'Đặt câu hỏi bình chọn' },
                    ]}
                    spellCheck={false}
                >
                    <Input />
                </Form.Item>

                <Form.List name="options">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    label={index === 0 ? 'Các lựa chọn' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message:
                                                    'Nhập thông tin lựa chọn',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const tempValue = value
                                                        ? value.toLowerCase()
                                                        : value;

                                                    let count = 0;
                                                    getFieldValue(
                                                        'options'
                                                    ).forEach((ele) => {
                                                        if (
                                                            ele &&
                                                            ele.toLowerCase() ===
                                                                tempValue
                                                        ) {
                                                            count += 1;
                                                        }
                                                    });

                                                    if (value && count > 1) {
                                                        return Promise.reject(
                                                            new Error(
                                                                'Các lựa chọn không được trùng nhau'
                                                            )
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                        noStyle
                                    >
                                        <Input
                                            spellCheck={false}
                                            placeholder={`Lựa chọn ${
                                                index + 1
                                            }`}
                                            style={{ width: '100%' }}
                                            suffix={
                                                fields.length > 2 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() =>
                                                            remove(field.name)
                                                        }
                                                    />
                                                ) : null
                                            }
                                        />
                                    </Form.Item>
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="default"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                >
                                    Thêm lựa chọn
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        );
    };
    return (
        <Modal
            title="Tạo bình chọn"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Tạo bình chọn"
            cancelText="Hủy"
            centered
        >
            <div id="modal-create-vote">
                <DynamicFieldSet />
            </div>
        </Modal>
    );
}

export default ModalCreatePoll;
