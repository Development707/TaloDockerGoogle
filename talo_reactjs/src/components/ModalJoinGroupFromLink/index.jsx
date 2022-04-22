import React from 'react';
import PropTypes from 'prop-types';
import { Col, Divider, message, Modal, Row } from 'antd';
import ConversationAvatar from 'features/Chat/components/ConversationAvatar';
import PersonalIcon from 'features/Chat/components/PersonalIcon';

import './style.scss';
import conversationApi from 'api/conversationApi';
ModalJoinGroupFromLink.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    info: PropTypes.object,
};

ModalJoinGroupFromLink.defaultProps = {
    info: {},
};

function ModalJoinGroupFromLink({ isVisible, info, onCancel }) {
    const { id, name, members, avatar } = info;

    const handleOk = async () => {
        try {
            await conversationApi.joinGroupFromLink(id);
            handleCancel();
            message.success('Tham gia nhóm thành công');
        } catch (error) {
            message.error('Tham gia nhóm thất bại');
        }
    };
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };
    return (
        <Modal
            title="Thông tin nhóm"
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Tham gia"
            cancelText="Hủy"
            width={400}
            bodyStyle={{ padding: '0' }}
            style={{ top: '20' }}
        >
            <div className="modal-join-link">
                <div className="modal-join-link_info">
                    <div className="modal-join-link_avatar">
                        <ConversationAvatar
                            totalMembers={members.length}
                            members={members}
                            avatar={avatar.url}
                            type={true}
                            isGroupCard={true}
                        />
                    </div>

                    <div className="modal-join-link_name">{name}</div>

                    <div className="modal-join-link_members">
                        {`${members.length} thành viên`}
                    </div>
                </div>

                <Divider />

                <div className="modal-join-link_list-member">
                    <Row gutter={[8, 8]}>
                        {members.map((member, index) => (
                            <Col span={8} key={index}>
                                <div className="member-item">
                                    <div className="member-item_avartar">
                                        <PersonalIcon
                                            avatar={member.avatar.url}
                                            name={member.name}
                                        />
                                    </div>

                                    <div className="member-item_name">
                                        {`${member.name}`}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </Modal>
    );
}

export default ModalJoinGroupFromLink;
