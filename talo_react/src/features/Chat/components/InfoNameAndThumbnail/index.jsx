import { EditOutlined } from '@ant-design/icons';
import { Input, message, Modal } from 'antd';
import conversationApi from 'api/conversationApi';
import UploadAvatar from 'components/UploadAvatar';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConversationAvatar from '../ConversationAvatar';
import './style.scss';

const InfoNameAndThumbnail = ({ conversation }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [value, setValue] = useState('');
    const [file, setFile] = useState(null);
    const [isClear, setIsClear] = useState(false);
    const { currentConversation } = useSelector((state) => state.chat);

    const dispatch = useDispatch();

    const refInitValue = useRef();

    useEffect(() => {
        if (conversation.type) {
            setValue(conversation.name);
            refInitValue.current = conversation.name;
        }

        if (isModalVisible) {
            setIsClear(false);
        }
    }, [currentConversation, isModalVisible]);

    async function handleOnOk() {
        setConfirmLoading(true);
        try {
            if (refInitValue.current !== value) {
                await conversationApi.changeNameConversation(
                    currentConversation,
                    value
                );
            }

            if (file) {
                const frmData = new FormData();
                frmData.append('file', file);
                await conversationApi.changeAvatarGroup(
                    currentConversation,
                    frmData
                );
            }
        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
        }
        setConfirmLoading(false);
        setIsModalVisible(false);
    }

    const handleOnCancel = () => {
        setIsModalVisible(false);
        setFile(null);
        setIsClear(true);
    };
    const handleOnClick = () => {
        setIsModalVisible(true);
    };

    const handleGetfile = (file) => {
        setFile(file);
    };
    const handleInputChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <div className="info_name-and-thumbnail">
            <div className="info-thumbnail">
                <ConversationAvatar
                    isGroupCard={true}
                    totalMembers={conversation.totalMembers}
                    members={conversation.members}
                    type={conversation.type}
                    avatar={conversation.avatar?.url}
                    name={conversation.name}
                />
            </div>

            <div className="info-name-and-button">
                <div className="info-name">
                    <span>{conversation.name}</span>
                </div>

                {conversation.type === 'GROUP' && (
                    <div className="info-button">
                        <EditOutlined onClick={handleOnClick} />
                    </div>
                )}
            </div>

            <Modal
                title="Cập nhật cuộc trò chuyện"
                visible={isModalVisible}
                onOk={handleOnOk}
                onCancel={handleOnCancel}
                okText="Thay đổi"
                cancelText="Hủy"
                closable={false}
                confirmLoading={confirmLoading}
                okButtonProps={{
                    disabled:
                        (refInitValue.current === value && !file) ||
                        value.trim().length === 0,
                }}
            >
                <div className="update-profile_wrapper">
                    <div className="update-profile_upload">
                        <UploadAvatar
                            avatar={
                                typeof conversation.avatar?.url === 'string'
                                    ? conversation.avatar?.url
                                    : ''
                            }
                            getFile={handleGetfile}
                            isClear={isClear}
                        />
                    </div>
                    <div className="update-profile_input">
                        <Input
                            placeholder="Nhập tên mới"
                            onChange={handleInputChange}
                            value={value}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InfoNameAndThumbnail;
