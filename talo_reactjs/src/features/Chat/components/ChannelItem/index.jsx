import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { Dropdown, Menu, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, NumberOutlined } from '@ant-design/icons';
import ModalChangeNameChannel from '../ModalChangeNameChannel';
import channelApi from 'api/channelApi';
import {
    fetchMessageInChannel,
    getLastViewChannel,
    setCurrentChannel,
} from 'features/Chat/slice/chatSlice';

ChannelItem.propTypes = {
    isActive: PropTypes.bool,
    channel: PropTypes.object,
};

ChannelItem.defaultProps = {
    isActive: false,
    channel: {},
};

function ChannelItem({ isActive, channel }) {
    const { conversations } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.global);

    const [visible, setVisible] = useState(false);

    const { confirm } = Modal;
    const dispatch = useDispatch();

    const handleOnClick = ({ _, key }) => {
        if (key === '1') {
            setVisible(true);
        }

        if (key === '2') {
            showConfirm();
        }
    };

    function showConfirm() {
        confirm({
            title: 'Cảnh báo',
            content: 'Bạn có thực sự muốn xóa Channel',
            async onOk() {
                try {
                    await channelApi.deleteChannel(channel.id);
                    message.success('Xóa channel thành công');
                } catch (error) {
                    message.error('Xóa channel thất bại');
                }
            },
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
        });
    }

    const menu = (
        <Menu onClick={handleOnClick}>
            <Menu.Item key="1">
                <span className="menu-item">Đổi tên Channel</span>
            </Menu.Item>
            {conversations.find((ele) => ele.leaderId === user.id) && (
                <Menu.Item key="2" danger icon={<DeleteOutlined />}>
                    <span className="menu-item">Xóa Channel</span>
                </Menu.Item>
            )}
        </Menu>
    );

    const handleViewChannel = () => {
        dispatch(setCurrentChannel(channel.id));
        dispatch(fetchMessageInChannel({ channelId: channel.id, size: 10 }));
        dispatch(getLastViewChannel({ channelId: channel.id }));
    };
    const handleOnOk = async (nameNew, descriptionNew) => {
        try {
            await channelApi.renameChannel(channel.id, nameNew, descriptionNew);
            setVisible(false);
            message.success('Đổi tên channel thành công');
        } catch (error) {
            message.error('Đổi tên channel không thành công');
        }
    };
    return (
        <>
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                <div
                    className={`channel-item ${isActive ? 'active' : ''}`}
                    onClick={handleViewChannel}
                >
                    <div className="channel-item-icon">
                        <NumberOutlined />
                    </div>

                    <div className="channel-item-text">
                        <span>{channel.name}</span>
                    </div>

                    <div className="channel-item-descrip">
                        <span>{channel.description}</span>
                    </div>

                    {channel.numberUnread > 0 && (
                        <div className="notify-amount">
                            {channel.numberUnread}
                        </div>
                    )}
                </div>
            </Dropdown>

            <ModalChangeNameChannel
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleOnOk}
                nameValue={channel.name}
                descriptionValue={channel.description}
            />
        </>
    );
}

export default ChannelItem;
