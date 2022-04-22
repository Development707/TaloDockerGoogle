import { Avatar, Button, Image, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import COVERPHOTO_DEFAULT from 'assets/images/user/talo_coverPhoto_default.png';
import './style.scss';
import USER_AVATAR_DEFAULT from 'assets/images/user/talo_user_default.jpg';
import UserCardStyle from './UserCardStyle';
import getSummaryName from 'utils/nameHelper';
import dateUtils from 'utils/dateUtils';
import {
    ExclamationCircleOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons';
import friendApi from 'api/friendApi';
import {
    fetchContacts,
    fetchFriends,
    fetchListMyRequestFriend,
    fetchListRequestFriend,
    setAmountNotify,
} from 'features/Friend/friendSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchChannels,
    fetchListFriends,
    fetchListMessages,
    getLastViewOfMembers,
    setConversations,
    setCurrentConversation,
} from 'features/Chat/slice/chatSlice';
import conversationApi from 'api/conversationApi';
import { useNavigate } from 'react-router-dom';
import ModalSendAddFriend from 'components/ModalSendAddFriend';

UserCard.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
};

UserCard.defaultProps = {
    title: 'Thông tin',
    onCancel: null,
};

function UserCard({ title, isVisible, user, onCancel }) {
    const {
        coverPhoto,
        avatar,
        status,
        numberMutualGroup,
        numberMutualFriend,
    } = user;

    const dispatch = useDispatch();
    const { amountNotify } = useSelector((state) => state.friend);
    const { conversations } = useSelector((state) => state.chat);
    const navigate = useNavigate();
    const [isVisibleModal, setIsVisibleModal] = useState(false);

    const handleOnCancle = () => {
        if (onCancel) {
            onCancel();
        }
    };

    const handleClickMessage = async () => {
        // console.log('userid', user.id);
        const res = await conversationApi.createConversationIndividual(user.id);
        const { conversationId, isExists } = res;
        // console.log('response', res);

        if (!isExists) {
            const conver = await conversationApi.getConversationById(
                conversationId
            );
            dispatch(setConversations(conver));
        }
        const tempConver = conversations.find(
            (item) => item.id === conversationId
        );

        if (tempConver && tempConver.type) {
            dispatch(fetchChannels({ conversationId: conversationId }));
        }

        dispatch(getLastViewOfMembers({ conversationId: conversationId }));
        dispatch(
            fetchListMessages({ conversationId: conversationId, size: 10 })
        );
        dispatch(setCurrentConversation(conversationId));

        navigate('/chat', { replace: true });
        handleOnCancle();
    };

    const handleCancelRequest = async () => {
        await friendApi.deleteSentRequestFriend(user.id);
        dispatch(fetchListMyRequestFriend());
        dispatch(fetchContacts());
        handleOnCancle();
    };

    const handleOnAcceptFriend = async () => {
        await friendApi.acceptRequestFriend(user.id);
        dispatch(setAmountNotify(amountNotify - 1));
        dispatch(fetchListMyRequestFriend());
        dispatch(fetchListFriends({ name: '' }));
        dispatch(fetchFriends({ name: '' }));
        handleOnCancle();
        message.success('Thêm bạn thành công');
    };

    const handeDenyRequest = async (value) => {
        await friendApi.deleteRequestFriend(value.id);
        dispatch(setAmountNotify(amountNotify - 1));
        dispatch(fetchListRequestFriend());
        dispatch(fetchContacts());
        handleOnCancle();
    };
    const handleDeleteFriend = () => {
        confirm();
    };

    function confirm() {
        Modal.confirm({
            title: 'Xác nhận',
            icon: <ExclamationCircleOutlined />,
            content: (
                <span>
                    Bạn có thực sự muốn xóa <strong>{user.name}</strong> khỏi
                    danh sách bạn bè{' '}
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: handleOkModal,
        });
    }

    const handleOkModal = async () => {
        try {
            await friendApi.deleteFriend(user.id);
            dispatch(fetchFriends({ name: '' }));
            message.success('Hủy kết bạn thành công');
            handleOnCancle();
            dispatch(fetchContacts());
        } catch (error) {
            message.error('Hủy kết bạn thất bại');
        }
    };

    const handleAddFriend = () => {
        setIsVisibleModal(true);
    };

    const handleCancelModalAddFriend = () => {
        if (onCancel) {
            // onCancel();
            setIsVisibleModal(false);
        }
    };
    const handleOkAddFriend = async (value) => {
        try {
            const { userAddFriend, messageInput } = value;
            //userAddFriend == id
            await friendApi.sendRequestFriend(userAddFriend, messageInput);
            dispatch(fetchListMyRequestFriend());
            // if (onCancel) {
            //     setIsVisibleModal(false);
            //     onCancel();
            // }
            handleOnCancle();

            message.success('Gửi lời mời kết bạn thành công');
        } catch (error) {
            message.error('Gửi lời mời kết bạn thất bại');
        }
    };
    return (
        <Modal
            className="modalStyle"
            title={title}
            width={380}
            visible={isVisible}
            footer={null}
            onCancel={handleOnCancle}
        >
            <div id="user-card">
                <div className="user-card_wrapper">
                    <div className="user-card_cover-image">
                        <div className="user-card_cover-photo">
                            {coverPhoto && coverPhoto.url ? (
                                <img
                                    src={user.coverPhoto.url}
                                    alt="coverPhoto"
                                />
                            ) : (
                                <Image
                                    src={COVERPHOTO_DEFAULT}
                                    preview={false}
                                    style={UserCardStyle.CoverPhotoStyle}
                                />
                            )}
                        </div>

                        <div className="user-card_avatar">
                            {avatar && avatar.url ? (
                                <Image
                                    fallback={USER_AVATAR_DEFAULT}
                                    src={user.avatar.url}
                                    style={UserCardStyle.avatarStyle}
                                />
                            ) : (
                                <Avatar
                                    size={96}
                                    style={{
                                        backgroundColor: '#1E90FF',
                                    }}
                                >
                                    <span style={{ fontSize: '3rem' }}>
                                        {getSummaryName(user.name)}
                                    </span>
                                </Avatar>
                            )}
                        </div>
                    </div>
                    <div className="user-card-name">{user.name}</div>

                    <div className="user-card-button">
                        {status === 'NOT_FRIEND' && (
                            <div className="user-card-button--addFriend">
                                <Button
                                    onClick={handleAddFriend}
                                    type="primary"
                                    style={{ width: '126px' }}
                                >
                                    Kết bạn
                                </Button>
                            </div>
                        )}
                        <div
                            className={`user-card-button--message ${
                                status === 'FRIEND'
                                    ? 'user-card-button--no-margin'
                                    : ''
                            }`}
                        >
                            <Button
                                className="user-card-button--message-hover"
                                onClick={handleClickMessage}
                                type="primary"
                                ghost
                                style={
                                    status === 'FOLLOWER'
                                        ? UserCardStyle.buttonStyle_FOLLOWER
                                        : UserCardStyle.buttonStyle_NOT_FOLLOWER
                                }
                            >
                                Nhắn tin
                            </Button>
                        </div>

                        {status === 'FOLLOWING' && (
                            <div className="user-card-button--message">
                                <Button
                                    type="danger"
                                    style={{ width: '126px' }}
                                    onClick={handleCancelRequest}
                                >
                                    Hủy yêu cầu
                                </Button>
                            </div>
                        )}

                        {status === 'FOLLOWER' && (
                            <>
                                <div className="user-card-button--message confirm--friend">
                                    <Button
                                        type="primary"
                                        style={{ maxWidth: '110px' }}
                                        onClick={handleOnAcceptFriend}
                                    >
                                        Đồng ý
                                    </Button>
                                </div>

                                <div className="user-card-button--message confirm-deny--friend">
                                    <Button
                                        type="danger"
                                        style={{ maxWidth: '110px' }}
                                        onClick={handeDenyRequest}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="user-card-infomation">
                        <div className="user-card-infomation--flex">
                            <div className="user-card-infomation__label">
                                Nhóm chung
                            </div>

                            <div className="user-card-infomation__text">
                                {`${numberMutualGroup} nhóm`}
                            </div>
                        </div>

                        <div className="user-card-infomation--flex">
                            <div className="user-card-infomation__label">
                                Ngày sinh
                            </div>

                            <div className="user-card-infomation__text">
                                {dateUtils.transferDateString(
                                    user.dateOfBirth?.day,
                                    user.dateOfBirth?.month,
                                    user.dateOfBirth?.year
                                )}
                            </div>
                        </div>

                        <div className="user-card-infomation--flex">
                            <div className="user-card-infomation__label">
                                Giới tính
                            </div>

                            <div className="user-card-infomation__text">
                                {user.gender ? 'Nữ' : 'Nam'}
                            </div>
                        </div>

                        <div className="user-card-infomation--flex">
                            <div className="user-card-infomation__label">
                                Bạn chung
                            </div>
                            <div className="user-card-infomation__text">
                                {numberMutualFriend}
                            </div>
                        </div>
                    </div>

                    <div
                        className={`user-card-button-optional ${
                            !(status === 'FRIEND')
                                ? 'user-card-button-optional--hidden'
                                : ''
                        }`}
                    >
                        <Button
                            danger
                            icon={<UserDeleteOutlined />}
                            style={UserCardStyle.buttonFullSize}
                            size="large"
                            onClick={handleDeleteFriend}
                        >
                            Hủy kết bạn
                        </Button>
                    </div>
                </div>
            </div>
            <ModalSendAddFriend
                userAddFriend={user}
                isVisible={isVisibleModal}
                onCancel={handleCancelModalAddFriend}
                onOk={handleOkAddFriend}
                onInfo={handleCancelModalAddFriend}
            />
        </Modal>
    );
}

export default UserCard;
