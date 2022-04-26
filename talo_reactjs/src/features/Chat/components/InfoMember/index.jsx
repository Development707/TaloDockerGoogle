import {
    CaretDownOutlined,
    CopyOutlined,
    LinkOutlined,
} from '@ant-design/icons';
import { message, Modal, Switch } from 'antd';
import conversationApi from 'api/conversationApi';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { GrGroup } from 'react-icons/gr';
import { useSelector } from 'react-redux';
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
    const [isStatus, setIsSatus] = useState(false);
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
        setIsSatus(tempStatus);
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

    const handleChangeApi = async (checked) => {
        try {
            await conversationApi.changeStatusForGroup(
                currentConversation,
                checked
            );
            message.success('Cập nhật thành công');
        } catch (error) {
            message.error('Cập nhật thất bại');
        }
    };

    const handleChangeStatus = (checked) => {
        if (checked) {
            handleChangeApi(checked);
        } else {
            showConfirm(checked);
        }
        setIsSatus(!isStatus);
    };

    function showConfirm(checked) {
        confirm({
            title: 'Cảnh báo',
            content:
                'Link hiện tại sẽ không sử dụng được nữa. Tắt link tham gia nhóm?',
            onOk: () => handleChangeApi(checked),
            okText: 'Xác nhận',
            cancelText: 'Hủy',
        });
    }

    const onChange = (checked) => {
        handleChangeStatus(checked);
    };
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
                {checkLeader && (
                    <div className="info_member-interact-item">
                        <div className="info_member-interact-item-icon">
                            <LinkOutlined />
                        </div>
                        <div className="info_member-interact-item-text">
                            <span>Cho phép dùng link tham gia nhóm</span>
                        </div>
                        <div className={`info_member-interact_button`}>
                            <Switch
                                className="switch-toggle"
                                defaultChecked
                                onChange={onChange}
                            />
                        </div>
                    </div>
                )}

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
                    <div className={'info_member-interact_button flex-end'}>
                        <div
                            className="copy-link cirle-button"
                            onClick={handleCopyLink}
                        >
                            <CopyOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoMember;
