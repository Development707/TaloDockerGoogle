import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, message, Modal } from 'antd';
import meApi from 'api/meApi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import generateCode from 'utils/generateCode';

ModalChangePassword.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onSaveCodeRevoke: PropTypes.func,
};

ModalChangePassword.defaultProps = {
    onCancel: null,
    onSaveCodeRevoke: null,
};
function ModalChangePassword({ visible, onCancel, onSaveCodeRevoke }) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { confirm } = Modal;

    const handleCancel = () => {
        if (onCancel) onCancel();
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const handleOk = () => {
        setConfirmLoading(true);
        form.validateFields()
            .then(async ({ currentPassword, password }) => {
                // console.log('values :', currentPassword, password);
                try {
                    await meApi.changePasswod(currentPassword, password);

                    message.success('Đổi mật khẩu thành công');
                    showPromiseConfirm(password);
                    form.resetFields();
                    handleCancel();
                } catch (error) {
                    message.error('Mật khẩu hiện tại không đúng');
                }
            })
            .catch((info) => {
                // console.log('Validate Failed:', info);
            });
        setConfirmLoading(false);
    };

    function showPromiseConfirm(password) {
        confirm({
            title: 'Bạn có muốn đăng xuất ra khỏi các thiết bị khác? ',
            icon: <ExclamationCircleOutlined />,
            content:
                'Tất cả các thiết bị khác sẽ tự động đăng xuất khi chọn "Đồng ý"',
            onOk: () => handleRevokeToken(password),
            okText: 'Đồng ý',
            cancelText: 'Hủy',
        });
    }

    const handleRevokeToken = async (password) => {
        try {
            const code = generateCode(20);
            if (onSaveCodeRevoke) {
                onSaveCodeRevoke(code);
            }
            const response = await meApi.revokeToken(password, code);
            const { token, refreshToken } = response;
            // console.log('logout-all', token, refreshToken);
            if (token && refreshToken) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);

                message.success('Đăng xuất khỏi các thiết bị thành công');
            }
        } catch (error) {
            message.error('Đã có lỗi xảy ra');
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            visible={visible}
            onCancel={handleCancel}
            onOk={handleOk}
            okText="Thay đổi"
            cancelText="Hủy"
            confirmLoading={confirmLoading}
        >
            <Form
                {...formItemLayout}
                name="changepassword"
                form={form}
                initialValues={{
                    currentPassword: '',
                    password: '',
                    confirmPassword: '',
                }}
                scrollToFirstError
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu cũ',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value.trim().length < 8) {
                                    return Promise.reject(
                                        new Error(
                                            'Mật khẩu phải có ít nhất 8 kí tự'
                                        )
                                    );
                                }
                                if (
                                    value &&
                                    getFieldValue('currentPassword').trim() ===
                                        value
                                ) {
                                    return Promise.reject(
                                        new Error(
                                            'Mật khẩu mới không được trùng với mật khẩu cũ'
                                        )
                                    );
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Mật khẩu không khớp')
                                );
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalChangePassword;
