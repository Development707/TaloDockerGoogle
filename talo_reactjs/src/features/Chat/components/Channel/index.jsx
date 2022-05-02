import { CaretDownOutlined, NumberOutlined } from '@ant-design/icons';
import { Form, Input, message, Modal } from 'antd';
import {
    fetchListMessages,
    getLastViewOfMembers,
    setCurrentChannel,
} from 'features/Chat/slice/chatSlice';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChannelItem from '../ChannelItem';
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
    const [form] = Form.useForm();
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

    const handleOkModal = () => {
        form.validateFields()
            .then((values) => {
                const { nameChannel, description } = values;
                channelApi.addChannel(
                    currentConversation,
                    nameChannel,
                    description
                );
                message.success('Tạo kênh thành công');
                form.resetFields();
                setIsVisible(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancelModal = () => {
        setIsVisible(false);
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 19 },
        },
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
                    <button onClick={handleAddChannel}>Thêm kênh</button>
                </div>
                <div className="channel-interact-button">
                    <button onClick={handleViewAll}>Xem tất cả</button>
                </div>
            </div>

            <Modal
                title="Thêm kênh"
                visible={isVisible}
                onOk={handleOkModal}
                onCancel={handleCancelModal}
                okText="Tạo kênh"
                cancelText="Hủy"
                centered
            >
                <Form form={form} {...formItemLayout} scrollToFirstError>
                    <Form.Item
                        name="nameChannel"
                        label="Tên kênh"
                        rules={[
                            {
                                required: true,
                                message: 'Tên kênh không được để trống',
                            },
                            {
                                min: 6,
                                message: 'Tên kênh phải có ít nhất 6 ký tự',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nhập tên kênh" allowClear />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mô tả',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nhập mô tả" allowClear />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Channel;
