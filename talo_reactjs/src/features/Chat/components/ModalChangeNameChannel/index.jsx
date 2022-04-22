import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';

ModalChangeNameChannel.propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    nameValue: PropTypes.string,
    descriptionValue: PropTypes.string,
};

ModalChangeNameChannel.defaultProps = {
    visible: false,
    onOk: null,
    onCancel: null,
    nameValue: '',
    descriptionValue: '',
};

function ModalChangeNameChannel({
    visible,
    onOk,
    onCancel,
    nameValue,
    descriptionValue,
}) {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();
    const handleOnCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    const handleOnOk = () => {
        setConfirmLoading(true);
        if (onOk) {
            form.validateFields().then(
                async ({ nameChannel, descripChannel }) => {
                    try {
                        onOk(nameChannel, descripChannel);
                    } catch (error) {}
                }
            );
        }
        setConfirmLoading(false);
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };

    return (
        <Modal
            title="Đổi tên channel"
            visible={visible}
            onCancel={handleOnCancel}
            onOk={handleOnOk}
            onText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={confirmLoading}
        >
            <Form
                {...formItemLayout}
                form={form}
                name="changechannel"
                initialValues={{
                    nameChannel: nameValue,
                    descripChannel: descriptionValue,
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="nameChannel"
                    label="Tên kênh"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên kênh!',
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên kênh mới" allowClear />
                </Form.Item>

                <Form.Item name="descripChannel" label="Mô tả">
                    <Input placeholder="Nhập mô tả mới" allowClear />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ModalChangeNameChannel;
