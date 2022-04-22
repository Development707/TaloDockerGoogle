import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    CaretDownOutlined,
    CopyOutlined,
    LinkOutlined,
    LockOutlined,
    UnlockOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { message, Modal } from 'antd';
import { GrGroup } from 'react-icons/gr';
import conversationApi from 'api/conversationApi';
import './style.scss';

InfoMember.propTypes = {
    viewMemberClick: PropTypes.func,
    quantity: PropTypes.number.isRequired,
};

InfoMember.defaultProps = {
    viewMemberClick: null,
};
const styleIconDrop = {
    transform: 'rotate(-90deg)',
};
const styleInteract = {
    maxHeight: '0px',
};

function InfoMember({ viewMemberClick, quantity }) {
    const { user } = useSelector((state) => state.global);
    const { currentConversation, conversations } = useSelector(
        (state) => state.chat
    );
    const [isDrop, setIsDrop] = useState(true);
    const [status, setSatus] = useState(false);
    const [checkLeader, setCheckLeader] = useState(false);
    const { confirm } = Modal;

    useEffect(() => {
        const tempStatus = conversations.find(
            (ele) => ele.id === currentConversation
        ).isJoinFromLink;
        const tempCheck =
            conversations.find((ele) => ele.id === currentConversation)
                .leaderId === user.id;
        setCheckLeader(tempCheck);
        setSatus(tempStatus);
    }, [currentConversation]);

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };
    const handleViewAll = () => {
        if (viewMemberClick) {
            viewMemberClick(1);
        }
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(
            `${process.env.REACT_APP_URL}/tl-link/${currentConversation}`
        );
        message.info('Đã sao chép link');
    };
    const handleChangeStatus = async () => {
        try {
            await conversationApi.changeStatusForGroup(
                currentConversation,
                status ? false : true
            );

            setSatus(!status);
            message.success('Cập nhật thành công');
        } catch (error) {
            message.error('Cập nhật thất bại');
        }
    };

    function showConfirm() {
        confirm({
            title: 'Cảnh báo',
            content: status
                ? 'Link hiện tại sẽ không sử dụng được nữa. Tắt link tham gia nhóm?'
                : 'Bật tham gia nhóm bằng link',
            onOk: handleChangeStatus,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
        });
    }
    return (
        <div className="info_member">
            <div className="info_member-header" onClick={handleOnClick}>
                <div className="info_member-header-title">Thành viên nhóm</div>

                <div
                    className="info_member-header-icon"
                    style={isDrop ? {} : styleIconDrop}
                >
                    <CaretDownOutlined />
                </div>
            </div>

            <div
                className="info_member-interact"
                style={isDrop ? {} : styleInteract}
            >
                <div
                    className="info_member-interact-item"
                    onClick={handleViewAll}
                >
                    <div className="info_member-interact-item-icon">
                        <GrGroup />
                    </div>

                    <div className="info_member-interact-item-text">
                        <span>{quantity} thành viên</span>
                    </div>
                </div>

                <div className="info_member-interact-item">
                    <div className="info_member-interact-item-icon">
                        <LinkOutlined />
                    </div>

                    <div className="info_member-interact-item-text">
                        <div className="info_member-interact_link-title">
                            Link tham gia nhóm
                        </div>

                        <div className="info_member-interact_link-join">
                            {`${process.env.REACT_APP_URL}/tl-link/${currentConversation}`}
                        </div>
                    </div>

                    <div
                        className={`info_member-interact_button ${
                            checkLeader ? '' : 'flex-end'
                        }`}
                    >
                        <div
                            className="copy-link cirle-button"
                            onClick={handleCopyLink}
                        >
                            <CopyOutlined />
                        </div>

                        {checkLeader && (
                            <>
                                {status ? (
                                    <div
                                        className="authorize-toggle cirle-button green"
                                        onClick={showConfirm}
                                    >
                                        <UnlockOutlined />
                                    </div>
                                ) : (
                                    <div
                                        className="authorize-toggle cirle-button red"
                                        onClick={showConfirm}
                                    >
                                        <LockOutlined />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoMember;
