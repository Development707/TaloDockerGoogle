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
                message.success('T???o k??nh th??nh c??ng');
                form.resetFields();
                setIsVisible(false);
            })
            .catch((info) => {});
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
                    k??nh
                    {totalChannelNotify > 0 && (
                        <span className="total-channel-notify">
                            ({totalChannelNotify} k??nh c?? tin nh???n)
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
                        <span>K??nh chung</span>
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
                    <button onClick={handleAddChannel}>Th??m k??nh</button>
                </div>
                <div className="channel-interact-button">
                    <button onClick={handleViewAll}>Xem t???t c???</button>
                </div>
            </div>

            <Modal
                title="Th??m k??nh"
                visible={isVisible}
                onOk={handleOkModal}
                onCancel={handleCancelModal}
                okText="T???o k??nh"
                cancelText="H???y"
                centered
            >
                <Form form={form} {...formItemLayout} scrollToFirstError>
                    <Form.Item
                        name="nameChannel"
                        label="T??n k??nh"
                        rules={[
                            {
                                required: true,
                                message: 'T??n k??nh kh??ng ???????c ????? tr???ng',
                            },
                            {
                                min: 6,
                                message: 'T??n k??nh ph???i c?? ??t nh???t 6 k?? t???',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nh???p t??n k??nh" allowClear />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="M?? t???"
                        rules={[
                            {
                                required: true,
                                message: 'Vui l??ng nh???p m?? t???',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Nh???p m?? t???" allowClear />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Channel;
