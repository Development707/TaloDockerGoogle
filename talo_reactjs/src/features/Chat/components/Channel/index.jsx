import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownOutlined, NumberOutlined } from '@ant-design/icons';
import ChannelItem from '../ChannelItem';
import { Input, message, Modal } from 'antd';
import {
    fetchListMessages,
    getLastViewOfMembers,
    setCurrentChannel,
} from 'features/Chat/slice/chatSlice';
import './style.scss';

import channelApi from 'api/channelApi';

Channel.propTypes = {
    onViewChannel: PropTypes.func,
    channels: PropTypes.array,
    onOpenInfoBlock: PropTypes.func,
};

Channel.defaultProps = {
    onViewChannel: null,
    channels: [],
    onOpenInfoBlock: null,
};
const styleIconDrop = {
    transform: 'rotate(-90deg)',
};

const styleInteract = {
    maxHeight: '0px',
};

function Channel({ onViewChannel, channels, onOpenInfoBlock }) {
    const {
        currentConversation,
        currentChannel,
        conversations,
        totalChannelNotify,
    } = useSelector((state) => state.chat);

    const [isDrop, setIsDrop] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [valueInputName, setValueInputName] = useState('');
    const [valueInputDescrip, setValueInputDescrip] = useState('');
    const dispatch = useDispatch();

    const numberUnread = conversations.find(
        (ele) => ele.id === currentConversation
    ).numberUnread;

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };

    const handleViewGeneralChannel = () => {
        dispatch(setCurrentChannel(''));
        dispatch(
            fetchListMessages({ conversationId: currentConversation, size: 10 })
        );
        dispatch(getLastViewOfMembers({ conversationId: currentConversation }));
    };

    const handleAddChannel = () => {
        setIsVisible(true);
    };

    const handleViewAll = () => {
        if (onViewChannel) {
            onViewChannel();
        }
        if (onOpenInfoBlock) {
            onOpenInfoBlock();
        }
    };

    const handleOkModal = async () => {
        try {
            await channelApi.addChannel(
                currentConversation,
                valueInputName,
                valueInputDescrip
            );
            message.success('Tạo channel thành công');
            setValueInputName('');
            setValueInputDescrip('');
            setIsVisible(false);
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo channel');
        }
    };

    const handleCancelModal = () => {
        setIsVisible(false);
        setValueInputName('');
        setValueInputDescrip('');
    };

    const handleInputChangeName = (e) => {
        setValueInputName(e.target.value);
    };
    const handleInputChangeDescrip = (e) => {
        setValueInputDescrip(e.target.value);
    };

    const modalStyle = {
        width: '80%',
        margin: '1rem 4rem',
    };

    return (
        <div className="channel">
            <div className="channel-header" onClick={handleOnClick}>
                <div className="channel-header-title">
                    kênh
                    {totalChannelNotify > 0 && (
                        <span className="total-channel-notify">
                            ({totalChannelNotify} kênh có tin nhắn)
                        </span>
                    )}
                </div>
                <div
                    className="channel-header-icon"
                    style={isDrop ? {} : styleIconDrop}
                >
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className="channel-interact"
                style={isDrop ? {} : styleInteract}
            >
                <div
                    className={`channel-interact-item ${
                        currentChannel ? '' : 'active'
                    }`}
                    onClick={handleViewGeneralChannel}
                >
                    <div className="channel-interact-item-icon">
                        <NumberOutlined />
                    </div>
                    <div className="channel-interact-item-text">
                        <span>Kênh chung</span>
                    </div>
                    {numberUnread > 0 && (
                        <div className="notify-item">{numberUnread}</div>
                    )}
                </div>

                {channels.map((channel, index) => {
                    if (index < 3) {
                        return (
                            <ChannelItem
                                key={index}
                                channel={channel}
                                isActive={
                                    currentChannel === channel.id ? true : false
                                }
                            />
                        );
                    }
                })}

                <div className="channel-interact-button">
                    <button onClick={handleAddChannel}>Thêm channel</button>
                </div>
                <div className="channel-interact-button">
                    <button onClick={handleViewAll}>Xem tất cả</button>
                </div>
            </div>

            <Modal
                title="Thêm Channel"
                visible={isVisible}
                onOk={handleOkModal}
                onCancel={handleCancelModal}
                okText="Tạo"
                cancelText="Hủy"
                okButtonProps={{ disabled: valueInputName.trim().length === 0 }}
            >
                <Input
                    placeholder="Nhập tên channel"
                    allowClear
                    value={valueInputName}
                    onChange={handleInputChangeName}
                    onEnter={handleOkModal}
                    style={modalStyle}
                />

                <Input
                    placeholder="Nhập mô tả"
                    allowClear
                    value={valueInputDescrip}
                    onChange={handleInputChangeDescrip}
                    onEnter={handleOkModal}
                    style={modalStyle}
                />
            </Modal>
        </div>
    );
}

export default Channel;
