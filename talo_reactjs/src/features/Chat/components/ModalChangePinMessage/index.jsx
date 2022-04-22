import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { Alert, Modal, Radio, message as messageNotify } from 'antd';
import { MessageTwoTone } from '@ant-design/icons';
import TypeMessagePin from '../TypeMessagePin';
import pinMessageApi from 'api/pinMessageApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPinMessages } from 'features/Chat/slice/chatSlice';

ModalChangePinMessage.propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.array,
    messageId: PropTypes.string,
    onCloseModal: PropTypes.func,
};

ModalChangePinMessage.defaultProps = {
    visible: false,
    message: [],
    messageId: '',
    onCloseModal: null,
};

function ModalChangePinMessage({ visible, message, onCloseModal, messageId }) {
    const [value, setValue] = useState('');
    const { currentConversation } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const handleOnCancel = () => {
        if (onCloseModal) {
            onCloseModal();
        }
    };

    const handleOnClickItem = (mes) => {
        setValue(mes.id);
    };

    const handleOnOk = async () => {
        await pinMessageApi.deletePinMessage(value);
        await pinMessageApi.pinMessage(messageId);
        messageNotify.success('Ghim tin nhắn thành công');
        dispatch(fetchPinMessages({ conversationId: currentConversation }));
        handleOnCancel();
    };

    return (
        <Modal
            visible={visible}
            title="Cập nhật danh sách ghim"
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ disabled: value ? false : true }}
            onOk={handleOnOk}
            onCancel={handleOnCancel}
        >
            <Alert
                description="Đã đạt tối đa 3 ghim. Hãy thay thế ghim bằng cách chọn vào ghim cũ dưới đây."
                type="warning"
            />
            <div className="modal-change-pin_wapper">
                {message.map((mes, index) => (
                    <div
                        key={index}
                        className="modal-change-pin"
                        onClick={() => handleOnClickItem(mes)}
                    >
                        <div className="modal-change-pin_left">
                            <div className="modal-change-pin_icon">
                                <MessageTwoTone />
                            </div>

                            <div className="modal-change-pin_messsage">
                                <div className="modal-change-pin_title">
                                    Tin nhắn
                                </div>
                                <div className="modal-change-pin_detail">
                                    <TypeMessagePin
                                        name={mes.user.name}
                                        content={mes.content}
                                        type={mes.type}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-change-pin_right">
                            <Radio
                                checked={value === mes.id ? true : false}
                            ></Radio>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

export default ModalChangePinMessage;
