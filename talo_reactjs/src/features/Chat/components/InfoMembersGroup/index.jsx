import PropTypes from 'prop-types';

import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import conversationApi from 'api/conversationApi';
import friendApi from 'api/friendApi';
import userApi from 'api/userApi';
import ModalSendAddFriend from 'components/ModalSendAddFriend';
import UserCard from 'components/UserCard';
import { fetchListMyRequestFriend } from 'features/Friend/friendSlice';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import InfoTitle from '../InfoTitle';
import PersonalIcon from '../PersonalIcon';
import './style.scss';
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
            message.success('Th??m th??nh c??ng');
        } catch (error) {
            message.error('Th??m th???t b???i');
        }
    };
    const handleDeleteLeader = async (idUser) => {
        try {
            await conversationApi.deleteManager(currentConversation, [idUser]);
            message.success('G??? th??nh c??ng');
        } catch (error) {
            message.error('G??? th???t b???i');
        }
    };

    function showConfirmRemove(value) {
        confirm({
            title: 'C???nh b??o',
            content: (
                <span>
                    B???n mu???n x??a th??nh vi??n <b>{value.name}</b> ra kh???i nh??m?{' '}
                </span>
            ),
            okText: '?????ng ??',
            cancelText: 'H???y',
            onOk() {
                removeMember(value.id);
            },
        });
    }

    async function removeMember(idMember) {
        try {
            await conversationApi.deleteMember(currentConversation, idMember);
        } catch (error) {
            message.error('X??a th???t b???i');
        }
    }

    const handleFindUser = async (value) => {
        try {
            const user = await userApi.findId(value);
            setUserAddFriend(user);
            setIsVisible(true);
        } catch (error) {
            message.error('Kh??ng t??m th???y ng?????i d??ng');
        }
    };
    const handleFindUserProfile = async (value) => {
        try {
            const user = await userApi.findId(value);
            setUserAddFriend(user);
            setIsVisibleUserCard(true);
        } catch (error) {
            message.error('Kh??ng t??m th???y ng?????i d??ng');
        }
    };
    const onCancel = () => {
        setIsVisible(false);
    };

    const handleOkAddFriend = async (value) => {
        try {
            const { idUserAddFriend, messageInput } = value;
            await friendApi.sendRequestFriend(idUserAddFriend, messageInput);
            dispatch(fetchListMyRequestFriend());

            onCancel();

            message.success('G???i l???i m???i k???t b???n th??nh c??ng');
        } catch (error) {
            message.error('G???i l???i m???i k???t b???n th???t b???i');
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
                                    Th??m ph?? nh??m{' '}
                                </span>
                            </Menu.Item>
                        )}

                    {leaderId === user.id &&
                        managerIds.find((ele) => ele === value.id) && (
                            <Menu.Item key="2">
                                <span className="menu-icon">
                                    G??? quy???n ph?? nh??m{' '}
                                </span>
                            </Menu.Item>
                        )}

                    {(leaderId === user.id ||
                        managerIds.find((ele) => ele === user.id)) && (
                        <Menu.Item key="3" danger>
                            <span className="menu-icon">M???i ra kh???i nh??m</span>
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
                    text="Th??nh vi??n"
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
                        <strong>{`Danh s??ch th??nh vi??n (${members.length})`}</strong>
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
                                                    <span>Tr?????ng nh??m</span>
                                                ) : managerIds.find(
                                                      (managerId) =>
                                                          managerId === ele.id
                                                  ) ? (
                                                    <span>Ph?? nh??m</span>
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
                                                    K???t b???n
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
