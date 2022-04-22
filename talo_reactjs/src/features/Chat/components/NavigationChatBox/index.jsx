import {
    DashOutlined,
    FileImageOutlined,
    FontColorsOutlined,
    LinkOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu, Popover } from 'antd';
import React, { useState } from 'react';
import { BsNewspaper } from 'react-icons/bs';
import { FcBarChart } from 'react-icons/fc';

import './style.scss';
import { useSelector } from 'react-redux';
import UploadFile from 'customfield/UploadFile';
import Sticker from '../Sticker';
import ModalCreatePoll from '../ModalCreatePoll';

NavigationChatBox.propTypes = {
    onClickTextFormat: PropTypes.func,
    isFocus: PropTypes.bool,
    onScroll: PropTypes.func,
    onViewPolls: PropTypes.func,
    onOpenInfoBlock: PropTypes.func,
};

NavigationChatBox.defaultProps = {
    onClickTextFormat: null,
    isFocus: false,
    onScroll: null,
    onViewPolls: null,
    onOpenInfoBlock: null,
};

const styleButton = {
    background: 'none',
    outline: 'none',
    border: 'red',
    padding: '0px',
    borderRadius: '50%',
    fontSize: '2.2rem',
};
const styleBorder = {
    borderColor: '#396edd',
};
function NavigationChatBox(props) {
    const {
        onClickTextFormat,
        isFocus,
        onScroll,
        onViewPolls,
        onOpenInfoBlock,
    } = props;
    const { stickers, currentConversation, conversations } = useSelector(
        (state) => state.chat
    );
    const [visiblePop, setVisiblePop] = useState(false);
    const [isVisiblePoll, setIsVisiblePoll] = useState(false);
    const checkIsGroup = conversations.find(
        (conver) => conver.id === currentConversation
    ).type;

    const handleOnClick = ({ key }) => {
        if (key === 'POLL') {
            setIsVisiblePoll(true);
        }
        if (key === 'VIEW_NEWS') {
            if (onViewPolls) {
                onViewPolls();
            }
            if (onOpenInfoBlock) {
                onOpenInfoBlock();
            }
        }
    };

    const menu = (
        <Menu onClick={handleOnClick}>
            <Menu.Item key="POLL" icon={<FcBarChart />}>
                <span className="item-menu-poll">Tạo cuộc bình chọn</span>
            </Menu.Item>
            <Menu.Item key="VIEW_NEWS" icon={<BsNewspaper />}>
                <span className="item-menu-poll"> Xem bảng tin nhóm</span>
            </Menu.Item>
        </Menu>
    );
    const handleOnClose = () => {
        setVisiblePop(false);
    };

    const handleVisibleChange = (visible) => {
        setVisiblePop(visible);
    };
    const handleCloseModalPoll = () => {
        setIsVisiblePoll(false);
    };
    const handleOnClickTextFormat = () => {
        if (onClickTextFormat) {
            onClickTextFormat();
        }
    };
    return (
        <div style={isFocus ? styleBorder : {}} id="navigation-chat-box">
            <ul>
                <Popover
                    content={
                        <Sticker
                            onClose={handleOnClose}
                            data={stickers}
                            onScroll={onScroll}
                        />
                    }
                    trigger="click"
                    visible={visiblePop}
                    onVisibleChange={handleVisibleChange}
                    placement="topLeft"
                >
                    <li className="item-chat-box">
                        <div title="Gửi sticker">
                            <SmileOutlined />
                        </div>
                    </li>
                </Popover>
                <li className="item-chat-box">
                    <UploadFile typeOfFile="media">
                        <Button
                            title="Gửi hình ảnh"
                            type="text"
                            style={styleButton}
                        >
                            <FileImageOutlined />
                        </Button>
                    </UploadFile>
                </li>

                <li className="item-chat-box">
                    <UploadFile typeOfFile="File">
                        <Button
                            title="Gửi file"
                            type="text"
                            style={styleButton}
                        >
                            <LinkOutlined />
                        </Button>
                    </UploadFile>
                </li>
                <li className="item-chat-box">
                    <div
                        title="Định dạng tin nhắn"
                        onClick={handleOnClickTextFormat}
                    >
                        <FontColorsOutlined />
                    </div>
                </li>
                {checkIsGroup === 'GROUP' && (
                    <li className="item-chat-box">
                        <Dropdown
                            overlay={menu}
                            placement="topLeft"
                            trigger={['click']}
                            arrow
                        >
                            <Button
                                title="Vote"
                                type="text"
                                style={styleButton}
                            >
                                <DashOutlined />
                            </Button>
                        </Dropdown>
                    </li>
                )}
            </ul>

            <ModalCreatePoll
                visible={isVisiblePoll}
                onCancel={handleCloseModalPoll}
            />
        </div>
    );
}

export default NavigationChatBox;
