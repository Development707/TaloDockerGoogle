import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import {
    CaretDownOutlined,
    DashOutlined,
    MessageTwoTone,
} from '@ant-design/icons';
import TypeMessagePin from '../TypeMessagePin';
import { Button, Dropdown, Menu, Modal, message as MessageNotify } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ModalDetailMessagePin from '../ModalDetailMessagePin';
import pinMessageApi from 'api/pinMessageApi';
import { fetchPinMessages } from 'features/Chat/slice/chatSlice';
SummedPinMessage.propTypes = {
    message: PropTypes.object,
    isItem: PropTypes.bool,
    onOpenDrawer: PropTypes.func,
    quantity: PropTypes.number,
    isCheckbox: PropTypes.bool,
    isHover: PropTypes.bool,
};

SummedPinMessage.defaultProps = {
    message: {},
    isItem: false,
    onOpenDrawer: null,
    quantity: 0,
    isCheckbox: false,
    isHover: true,
};

function SummedPinMessage({
    isItem,
    onOpenDrawer,
    message,
    quantity,
    isHover,
}) {
    const { currentConversation } = useSelector((state) => state.chat);

    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    const handleOnClick = () => {
        setVisible(true);
    };
    const handleOnClickVisibleList = () => {
        if (onOpenDrawer) {
            onOpenDrawer();
        }
    };

    function confirm() {
        Modal.confirm({
            title: 'Bỏ ghim',
            content: 'Bạn có chắc muốn bỏ ghim nội dung này không ?',
            okText: 'Bỏ ghim',
            cancelText: 'Không',
            onOk: async () => {
                await pinMessageApi.deletePinMessage(message.id);
                MessageNotify.success('Xóa thành công');
                dispatch(
                    fetchPinMessages({ conversationId: currentConversation })
                );
            },
            okButtonProps: { type: 'danger' },
        });
    }

    const handleOnClickMenu = ({ key }) => {
        if (key === '1') {
            confirm();
        }
    };

    const handleCloseModal = () => {
        setVisible(false);
    };
    const BUTTON_LIST = {
        fontSize: '1.3rem',
        borderRadius: '6px',
        padding: '0.2rem 1rem',
        height: 'unset',
    };
    const MENU_ITEM = {
        fontSize: '1.3rem',
        fontWeight: '600',
    };
    const menu = (
        <Menu onClick={handleOnClickMenu}>
            <Menu.Item key="1" danger>
                <span style={MENU_ITEM}>Bỏ ghim</span>
            </Menu.Item>
        </Menu>
    );
    return (
        <>
            <div
                className={`summed-pin-container ${isItem ? 'select' : ''} ${
                    isHover ? '' : 'no-hover'
                }`}
            >
                <div
                    className="summed-pin-container_left"
                    onClick={handleOnClick}
                >
                    <div className="summed-pin-container_icon">
                        <MessageTwoTone />
                    </div>

                    <div className="summed-pin-container_message">
                        <div className="summed-pin-container_title">
                            Tin nhắn
                        </div>
                        <div className="summed-pin-container_detail">
                            <TypeMessagePin
                                name={message.user.name}
                                content={message.content}
                                type={message.type}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className={`summed-pin-container_right ${
                        isItem ? 'no-display' : ''
                    }`}
                >
                    {isItem ? (
                        <Dropdown
                            overlay={menu}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <button className="summed-pin-container_button-interact">
                                <DashOutlined />
                            </button>
                        </Dropdown>
                    ) : (
                        <Button
                            style={BUTTON_LIST}
                            type="primary"
                            ghost
                            onClick={handleOnClickVisibleList}
                        >
                            {`${quantity} ghim khác`}
                            <CaretDownOutlined />
                        </Button>
                    )}
                </div>
            </div>

            <ModalDetailMessagePin
                visible={visible}
                message={message}
                onClose={handleCloseModal}
            />
        </>
    );
}

export default SummedPinMessage;
