import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import AvatarCustom from 'components/AvatarCustom';
import { Avatar, Tooltip } from 'antd';
import {
    EditTwoTone,
    KeyOutlined,
    NumberOutlined,
    PushpinTwoTone,
} from '@ant-design/icons';
import parse from 'html-react-parser';
import './style.scss';

NotifyMessage.propTypes = {
    message: PropTypes.object,
};

NotifyMessage.propTypes = {
    message: {},
};

function NotifyMessage({ message }) {
    const global = useSelector((state) => state.global);
    const { content, manipulatedUserIds, user } = message;
    const { name, avatar } = user;
    const isMyActive = user.id === global.user.id ? 'Bạn' : user.name;

    const transferTextToValue = (text) => {
        if (text === 'Đã thêm vào nhóm') {
            return 1;
        }

        if (text === 'Đã xóa thành viên ra khỏi nhóm') {
            return 2;
        }

        if (text === 'Đã là nhóm') {
            return 3;
        }
        if (text === 'Đã tham gia nhóm') {
            return 4;
        }

        if (text === 'Đã rời khỏi nhóm') {
            return 5;
        }
        if (text === 'Đã là bạn bè') {
            return 6;
        }
        if (text === 'Đã ghim 1 tin nhắn') {
            return 7;
        }
        if (text === 'Gỡ ghim 1 tin nhắn') {
            return 8;
        }
        if (text.startsWith('Đã đổi tên nhóm thành: ')) {
            return 9;
        }
        if (text === 'Đã vào nhóm từ link') {
            return 10;
        }

        if (text === 'Thay đổi 1 channel') {
            return 11;
        }

        if (text === 'Xóa 1 channel') {
            return 12;
        }

        if (text === 'Đã tạo 1 channel') {
            return 13;
        }

        if (text === 'Ảnh đại diện nhóm đã thay đổi') {
            return 14;
        }
        if (text === 'Đã thêm vào quản lý nhóm') {
            return 15;
        }

        if (text === 'Đã xóa quyền quản lý') {
            return 16;
        }
    };
    const renderGroupAvatars = (
        <>
            {manipulatedUserIds &&
                manipulatedUserIds.length > 0 &&
                manipulatedUserIds.map((ele, index) => {
                    if (index < 3) {
                        return (
                            <div
                                key={index}
                                className="notify-message-content_per-avatar"
                            >
                                <AvatarCustom
                                    size="small"
                                    src={ele.avatar.url}
                                    name={ele.name}
                                    color={ele.avatarColor}
                                />
                            </div>
                        );
                    }
                    if (index > 3) {
                        return (
                            <Tooltip placement="top" key={index}>
                                <Avatar
                                    style={{
                                        backgroundColor: '#7562d8',
                                        color: '#fff',
                                    }}
                                    size="small"
                                >
                                    {`+${manipulatedUserIds.length - 3}`}
                                </Avatar>
                            </Tooltip>
                        );
                    }
                })}
        </>
    );
    const renderUser = (
        <>
            {manipulatedUserIds &&
                manipulatedUserIds.length > 0 &&
                manipulatedUserIds.map((ele, index) => {
                    if (index < 3) {
                        if (index === 0) {
                            return (
                                <span className="user-name-strong">
                                    {` ${
                                        ele.id === global.user.id
                                            ? 'Bạn'
                                            : ele.name
                                    }`}
                                </span>
                            );
                        } else {
                            return (
                                <span className="user-name-strong">
                                    {`, ${
                                        ele.id === global.user.id
                                            ? 'Bạn'
                                            : ele.name
                                    }`}
                                </span>
                            );
                        }
                    } else {
                        return (
                            <span className="user-name-strong">
                                {` và`}{' '}
                                <span>{`${
                                    manipulatedUserIds.length - 3
                                } người khác`}</span>
                            </span>
                        );
                    }
                })}
        </>
    );

    return (
        <div className="notify-message-wrapper">
            <div className="notify-message-content">
                {transferTextToValue(content) === 1 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            {renderGroupAvatars}
                        </div>

                        <div className="notify-message-content-title">
                            {renderUser}
                            &nbsp;
                            <span>được</span>
                            &nbsp;
                            <span className="user-name-strong">
                                {isMyActive}
                            </span>
                            &nbsp;
                            <span>thêm vào nhóm</span>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 2 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            {renderGroupAvatars}
                        </div>

                        <div className="notify-message-content-title">
                            {renderUser}
                            <span>&nbsp;được&nbsp;</span>
                            <span className="user-name-strong">
                                {isMyActive}
                            </span>
                            <span> mời ra khỏi nhóm</span>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 3 && (
                    <div className="notify-message-content_group-avatar">
                        <div className="notify-message-content_per-avatar">
                            <AvatarCustom
                                size="small"
                                src={avatar.url}
                                name={name}
                            />
                        </div>
                        <div className="notify-message-content-title">
                            <span className="user-name-strong">
                                {isMyActive}
                            </span>
                            <span>&nbsp;đã tạo nhóm</span>
                        </div>
                    </div>
                )}

                {(transferTextToValue(content) === 4 ||
                    transferTextToValue(content) === 10) && (
                    <div className="notify-message-content_group-avatar">
                        <div className="notify-message-content_per-avatar">
                            <AvatarCustom
                                size="small"
                                src={avatar.url}
                                name={name}
                            />
                        </div>

                        <div className="notify-message-content-title">
                            <span className="user-name-strong">
                                {isMyActive}
                            </span>
                            &nbsp;đã tham gia nhóm
                        </div>
                    </div>
                )}

                {transferTextToValue(content) === 5 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>

                            <div className="notify-message-content-title">
                                <span className="user-name-strong">{name}</span>
                                <span>&nbsp;đã rời khỏi nhóm</span>
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 7 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content-title">
                                <PushpinTwoTone />
                                &nbsp;
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                {`đã ghim một tin nhắn`}.
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 6 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content-title">
                                <span className="user-name-strong">
                                    Đã trờ thành bạn bè của nhau
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 8 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content-title">
                                <PushpinTwoTone twoToneColor="#de433e" />
                                &nbsp;
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                {`đã xóa ghim một tin nhắn`}.
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 9 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>
                            <div className="notify-message-content-title">
                                <EditTwoTone />
                                &nbsp;
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                {parse(content)}
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 11 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>
                            <div className="notify-message-content-title">
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                đã đổi tên một channel &nbsp;
                                <NumberOutlined />
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 12 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>
                            <div className="notify-message-content-title">
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                đã xóa một channel &nbsp;
                                <NumberOutlined />
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 13 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>
                            <div className="notify-message-content-title">
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                đã tạo một channel &nbsp;
                                <NumberOutlined />
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 14 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            <div className="notify-message-content_per-avatar">
                                <AvatarCustom
                                    size="small"
                                    src={avatar.url}
                                    name={name}
                                />
                            </div>
                            <div className="notify-message-content-title">
                                <EditTwoTone />
                                &nbsp;
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                đã thay đổi ảnh đại diện nhóm
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 15 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            {renderGroupAvatars}

                            <div className="notify-message-content-title">
                                <KeyOutlined rotate="180" />
                                {renderUser}
                                &nbsp;đã được&nbsp;
                                <span className="user-name-strong">
                                    {`${isMyActive} `}
                                </span>
                                bổ nhiệm thành phó nhóm
                            </div>
                        </div>
                    </>
                )}

                {transferTextToValue(content) === 16 && (
                    <>
                        <div className="notify-message-content_group-avatar">
                            {renderGroupAvatars}

                            <div className="notify-message-content-title">
                                <KeyOutlined rotate="180" />
                                {renderUser}
                                &nbsp;đã không còn là phó nhóm
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default NotifyMessage;
