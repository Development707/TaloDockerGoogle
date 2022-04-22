import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import PersonalIcon from '../PersonalIcon';
import './style.scss';

ModalDetailPoll.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    data: PropTypes.array,
};

ModalDetailPoll.defaultProps = {
    onCancel: null,
    data: [],
    onShowDetail: null,
};

function ModalDetailPoll({ visible, onCancel, data }) {
    const { memberInConversation } = useSelector((state) => state.chat);

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    return (
        <Modal
            title="Chi tiết bình chọn"
            visible={visible}
            footer={null}
            onCancel={handleCancel}
        >
            <div className="detail-vote-wrapper">
                {data.map((ele, index) => {
                    if (ele.userIds.length > 0) {
                        return (
                            <div className="detail-vote_item" key={index}>
                                <span className="detail-vote_option">
                                    {ele.name} ({ele.userIds.length})
                                </span>
                                <div className="detail-vote_list-user">
                                    {ele.userIds.map((ele, index) => {
                                        const user = memberInConversation.find(
                                            (member) => member.id === ele.id
                                        );

                                        if (user) {
                                            return (
                                                <div
                                                    className="detail-vote_user-item"
                                                    key={index}
                                                >
                                                    <div className="detail-vote_avatar">
                                                        <PersonalIcon
                                                            name={user?.name}
                                                            avatar={
                                                                user?.avatar.url
                                                            }
                                                        />
                                                    </div>

                                                    <div className="detail-vote_name">
                                                        {user?.name}
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    className="detail-vote_user-item"
                                                    key={index}
                                                >
                                                    <div className="detail-vote_avatar">
                                                        <PersonalIcon
                                                            noneUser={true}
                                                        />
                                                    </div>

                                                    <div className="detail-vote_name leave">
                                                        Đã rời nhóm
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </Modal>
    );
}

export default ModalDetailPoll;
