import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import InfoTitle from '../InfoTitle';
import Scrollbars from 'react-custom-scrollbars';
import { Button, Dropdown, Menu, message, Modal, Tag } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import PersonalIcon from '../PersonalIcon';
import ModalSendAddFriend from 'components/ModalSendAddFriend';
import { useState } from 'react';
import UserCard from 'components/UserCard';
import userApi from 'api/userApi';
import friendApi from 'api/friendApi';
import { fetchListMyRequestFriend } from 'features/Friend/friendSlice';
import conversationApi from 'api/conversationApi';
InfoMembersGroup.propTypes = {
    onBack: PropTypes.func,
    members: PropTypes.array,
};

InfoMembersGroup.defaultProps = {
    onBack: null,
    members: [],
};

function InfoMembersGroup({ onBack, members }) {
    const { user } = useSelector((state) => state.global);
    const { currentConversation, conversations } = useSelector(
        (state) => state.chat
    );

    const converDataCurrent = conversations.find(
        (ele) => ele.id === currentConversation
    );
    console.log('membersinConversation', members);
    console.log('converDataCurrent', converDataCurrent);
    const { leaderId, managerIds } = converDataCurrent;
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleUserCard, setIsVisibleUserCard] = useState(false);
    const [userAddFriend, setUserAddFriend] = useState({});
    const dispatch = useDispatch();
    const { confirm } = Modal;

    const handleOnBack = (value) => {
        if (onBack) {
            onBack(value);
        }
    };
    const handleClickMember = async ({ key }, value) => {
        if (key === '1') {
            handleAddLeader(value.id);
        }
        if (key === '2') {
            handleDeleteLeader(value.id);
        }
        if (key === '3') {
            showConfirmRemove(value);
        }
    };

    const handleAddLeader = async (idUser) => {
        try {
            await conversationApi.addManagerInGroup(currentConversation, [
                idUser,
            ]);
            message.success('Thêm thành công');
        } catch (error) {
            message.error('Thêm thất bại');
        }
    };
    const handleDeleteLeader = async (idUser) => {
        try {
            await conversationApi.deleteManager(currentConversation, [idUser]);
            message.success('Gỡ thành công');
        } catch (error) {
            message.error('Gỡ thất bại');
        }
    };

    function showConfirmRemove(value) {
        confirm({
            title: 'Cảnh báo',
            content: (
                <span>
                    Bạn muốn xóa thành viên <b>{value.name}</b> ra khỏi nhóm?{' '}
                </span>
            ),
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            onOk() {
                removeMember(value.id);
            },
        });
    }

    async function removeMember(idMember) {
        try {
            await conversationApi.deleteMember(currentConversation, idMember);
        } catch (error) {
            message.error('Xóa thất bại');
        }
    }

    const handleFindUser = async (value) => {
        try {
            const user = await userApi.findId(value);
            setUserAddFriend(user);
            setIsVisible(true);
        } catch (error) {
            message.error('Không tìm thấy người dùng');
        }
    };
    const handleFindUserProfile = async (value) => {
        try {
            const user = await userApi.findId(value);
            setUserAddFriend(user);
            setIsVisibleUserCard(true);
        } catch (error) {
            message.error('Không tìm thấy người dùng');
        }
    };
    const onCancel = () => {
        setIsVisible(false);
    };

    const handleOkAddFriend = async (value) => {
        try {
            const { userAddFriend, messageInput } = value;
            console.log(userAddFriend);
            await friendApi.sendRequestFriend(userAddFriend, messageInput);
            dispatch(fetchListMyRequestFriend());
            onCancel();

            message.success('Gửi lời mời kết bạn thành công');
        } catch (error) {
            message.error('Gửi lời mời kết bạn thất bại');
        }
    };
    const handleCancelModalUserCard = () => {
        setIsVisibleUserCard(false);
    };
    const handleOnInfo = () => {
        setIsVisible(false);
        setIsVisibleUserCard(true);
    };
    const menu = (value) => (
        <Menu onClick={(e) => handleClickMember(e, value)}>
            {value.id !== user.id && (
                <>
                    {leaderId === user.id &&
                        !managerIds.find((ele) => ele === value.id) &&
                        value.isFriend && (
                            <Menu.Item key="1">
                                <span className="menu-icon">
                                    Thêm phó nhóm{' '}
                                </span>
                            </Menu.Item>
                        )}

                    {leaderId === user.id &&
                        managerIds.find((ele) => ele === value.id) && (
                            <Menu.Item key="2">
                                <span className="menu-icon">
                                    Gỡ quyền phó nhóm{' '}
                                </span>
                            </Menu.Item>
                        )}

                    {(leaderId === user.id ||
                        managerIds.find((ele) => ele === user.id)) && (
                        <Menu.Item key="3" danger>
                            <span className="menu-icon">Mời ra khỏi nhóm</span>
                        </Menu.Item>
                    )}
                </>
            )}
        </Menu>
    );

    const buttonMenu = (member) => (
        <div className="info_members-item-interact">
            <Dropdown overlay={() => menu(member)} trigger={['click']}>
                <Button
                    type="text"
                    icon={
                        <MoreOutlined
                            rotate={90}
                            style={{
                                fontSize: '20px',
                            }}
                        />
                    }
                    style={{
                        background: 'eeeff2',
                    }}
                />
            </Dropdown>
        </div>
    );
    return (
        <div id="info_members-group">
            <div className="info_members-group-title">
                <InfoTitle
                    isBack={true}
                    text="Thành viên"
                    onBack={handleOnBack}
                    isSelect={false}
                />
            </div>
            <Scrollbars
                autoHide={true}
                autoHideTimeout={1000}
                autoHideDuration={200}
                style={{ width: '100%' }}
            >
                <div className="info_members-content">
                    <div className="info_members-content-title">
                        <strong>{`Danh sách thành viên (${members.length})`}</strong>
                    </div>

                    <div className="info_members-content-list">
                        {members.map((ele, index) => (
                            <Dropdown
                                key={index}
                                overlay={() => menu(ele)}
                                trigger={['contextMenu']}
                            >
                                <div className="info_members-content-item">
                                    <div
                                        className="info_members-content-item-leftside"
                                        onClick={() =>
                                            handleFindUserProfile(ele.id)
                                        }
                                    >
                                        <div className="info_members-content-item-leftside-avatar">
                                            <PersonalIcon
                                                avatar={ele.avatar?.url}
                                                demention={40}
                                                name={ele.name}
                                                isHost={ele.id === leaderId}
                                                isManager={managerIds.find(
                                                    (managerId) =>
                                                        managerId === ele.id
                                                )}
                                            />
                                        </div>
                                        <div className="info_members-content-item-leftside-name">
                                            <div className="info_members-content-item-leftside-name-above">
                                                <strong>{ele.name}</strong>
                                            </div>
                                            <div className="info_members-content-item-leftside-name-below">
                                                {ele.id === leaderId ? (
                                                    <span>Trưởng nhóm</span>
                                                ) : managerIds.find(
                                                      (managerId) =>
                                                          managerId === ele.id
                                                  ) ? (
                                                    <span>Phó nhóm</span>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`info_members-content-item-rightside ${
                                            ele.id === user.id && 'hidden'
                                        }`}
                                    >
                                        {ele.isFriend ? (
                                            <>{buttonMenu(ele)}</>
                                        ) : (
                                            <div className="info_members-content-item-interact">
                                                <>{buttonMenu(ele)}</>

                                                <Button
                                                    type="primary"
                                                    onClick={() =>
                                                        handleFindUser(ele.id)
                                                    }
                                                >
                                                    Kết bạn
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dropdown>
                        ))}
                    </div>
                </div>
            </Scrollbars>
            {userAddFriend && (
                <ModalSendAddFriend
                    isVisible={isVisible}
                    onCancel={onCancel}
                    onOk={handleOkAddFriend}
                    userAddFriend={userAddFriend}
                    onInfo={handleOnInfo}
                />
            )}

            {userAddFriend && (
                <UserCard
                    user={userAddFriend}
                    isVisible={isVisibleUserCard}
                    onCancel={handleCancelModalUserCard}
                />
            )}
        </div>
    );
}

export default InfoMembersGroup;
