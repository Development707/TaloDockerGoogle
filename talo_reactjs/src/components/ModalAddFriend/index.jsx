import { UserOutlined } from '@ant-design/icons';
import { Input, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import './style.scss';
ModalAddFriend.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
};

ModalAddFriend.defaultProps = {
    onCancel: null,
    onSearch: null,
};

function ModalAddFriend({ isVisible, onCancel, onSearch, onEnter }) {
    const [value, setValue] = useState('');

    const handleOk = () => {
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // console.log(value);
        setValue(value);
    };
    const handleOnPressEnter = () => {
        if (onEnter) {
            onEnter(value);
        }
    };
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    return (
        <Modal
            title="Thêm bạn"
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={360}
            okText="Tìm kiếm"
            cancelText="Hủy"
            okButtonProps={{ disabled: !(value.trim().length > 0) }}
        >
            <div className="input-add-friend_wrapper">
                <Input
                    placeholder="Nhập số điện thoại hoặc email"
                    allowClear
                    prefix={<UserOutlined />}
                    value={value}
                    onChange={handleInputChange}
                    onPressEnter={handleOnPressEnter}
                />
            </div>
        </Modal>
    );
}

export default ModalAddFriend;
