import {
    ExclamationCircleOutlined,
    LeftOutlined,
    NumberOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import conversationApi from 'api/conversationApi';
import {
    createGroup,
    fetchListMessages,
    getLastViewOfMembers,
    setCurrentChannel,
    setCurrentConversation,
} from 'features/Chat/slice/chatSlice';
import useWindowSize from 'hooks/useWindowSize';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dateUtils from 'utils/dateUtils';
import ConversationAvatar from '../ConversationAvatar';
import ModalAddMember from '../ModalAddMember';
import { RiArrowGoBackFill } from 'react-icons/ri';
import './style.scss';
import { BiArrowBack } from 'react-icons/bi';

HeaderOptional.propTypes = {
    avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    totalMembers: PropTypes.number,
    members: PropTypes.array,
    name: PropTypes.string,
    typeConver: PropTypes.string.isRequired,
    isLogin: PropTypes.bool,
    lastLogin: PropTypes.object,
    isOpenInfo: PropTypes.bool,
    onPopUpInfo: PropTypes.func,
    onOpenDrawer: PropTypes.func,
};

HeaderOptional.defaultProps = {
    totalMembers: 0,
    name: '',
    isLogin: false,
    lastLogin: null,
    onPopUpInfo: null,
    onOpenDrawer: null,
};

function HeaderOptional(props) {
    const {
        avatar,
        totalMembers,
        members,
        name,
        typeConver,
        isLogin,
        lastLogin,
        isOpenInfo,
        onPopUpInfo,
        onOpenDrawer,
    } = props;
    const { currentConversation, currentChannel, channels } = useSelector(
        (state) => state.chat
    );
    const dispatch = useDispatch();
    const [isVisible, setIsvisible] = useState(false);
    const [typeModal, setTypeModal] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const { width } = useWindowSize();
    const handleCutText = (text) => {
        if (width < 577) {
            return text.slice(0, 14) + '...';
        }
        return text;
    };
    const checkTime = () => {
        if (lastLogin) {
            const time = dateUtils.toTime(lastLogin);
            if (
                time.indexOf('ngày') ||
                time.indexOf('giờ') ||
                time.indexOf('phút')
            ) {
                return true;
            }
            return false;
        }
    };

    const handleBackToListConver = () => {
        dispatch(setCurrentConversation(''));
    };
    const handleViewGeneralChannel = () => {
        dispatch(setCurrentChannel(''));
        dispatch(
            fetchListMessages({ conversationId: currentConversation, size: 10 })
        );
        dispatch(getLastViewOfMembers({ conversationId: currentConversation }));
    };

    const handleAddMemberToGroup = () => {
        setIsvisible(true);
        if (typeConver === 'GROUP') {
            setTypeModal('GROUP');
        } else {
            setTypeModal('DUAL');
        }
    };

    const handlePopUpInfo = () => {
        if (onPopUpInfo) {
            onPopUpInfo();
        }
    };
    const handleOpenDrawer = () => {
        if (onOpenDrawer) {
            onOpenDrawer();
        }
    };

    const hanleOnCancel = () => {
        setIsvisible(false);
    };

    const handleOk = async (userIds, name) => {
        if (typeModal === 'DUAL') {
            setConfirmLoading(true);

            dispatch(
                createGroup({
                    name,
                    userIds,
                })
            );

            setConfirmLoading(false);
        } else {
            setConfirmLoading(true);
            await conversationApi.addMembersToConver(
                userIds,
                currentConversation
            );
            setConfirmLoading(false);
        }
        setIsvisible(false);
    };
    return (
        <div id="header-optional">
            <div className="header_wrapper">
                <div className="header_leftside">
                    <div
                        className="icon-header back-list"
                        onClick={handleBackToListConver}
                    >
                        <LeftOutlined />
                    </div>

                    <div className="icon_user">
                        {
                            <ConversationAvatar
                                avatar={avatar}
                                totalMembers={totalMembers}
                                members={members}
                                type={typeConver}
                                name={name}
                                isActived={isLogin}
                            />
                        }
                    </div>

                    <div className="info_user">
                        <div className="info_user-name">
                            <span>{handleCutText(name)}</span>
                        </div>

                        {currentChannel ? (
                            <div className="channel_info">
                                <div className="channel-icon">
                                    <NumberOutlined />
                                </div>

                                <div className="channel-name">
                                    {
                                        channels.find(
                                            (ele) => ele.id === currentChannel
                                        ).name
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="lasttime-access">
                                {typeConver === 'GROUP' ? (
                                    <div className="member-hover">
                                        <UserOutlined />
                                        &nbsp;{totalMembers}
                                        <span>&nbsp;Thành viên</span>
                                    </div>
                                ) : (
                                    <>
                                        {isLogin ? (
                                            <span>Đang hoạt động</span>
                                        ) : (
                                            <>
                                                {lastLogin && (
                                                    <span>
                                                        {`Truy cập ${dateUtils
                                                            .toTime(lastLogin)
                                                            .toLowerCase()}`}{' '}
                                                        {`${
                                                            checkTime()
                                                                ? 'trước'
                                                                : ''
                                                        }`}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="header_rightside">
                    {currentChannel ? (
                        <div
                            title="Trở lại kênh chính"
                            className="icon-header back-channel"
                            onClick={handleViewGeneralChannel}
                        >
                            <BiArrowBack />
                        </div>
                    ) : (
                        <>
                            <div
                                className="icon-header create-group"
                                onClick={handleAddMemberToGroup}
                            >
                                <UsergroupAddOutlined />
                            </div>
                        </>
                    )}

                    <div
                        className={`icon-header pop-up-layout ${
                            isOpenInfo ? 'show' : ''
                        }`}
                        onClick={handlePopUpInfo}
                    >
                        <Tooltip
                            title="Thông tin về cuộc trò chuyện"
                            placement={'bottomRight'}
                        >
                            <ExclamationCircleOutlined />
                        </Tooltip>
                    </div>

                    <div
                        className="icon-header pop-up-responsive"
                        onClick={handleOpenDrawer}
                    >
                        <ExclamationCircleOutlined />
                    </div>
                </div>
            </div>
            <ModalAddMember
                isVisible={isVisible}
                onCancel={hanleOnCancel}
                onOk={handleOk}
                loading={confirmLoading}
                typeModal={typeModal}
            />
        </div>
    );
}

export default HeaderOptional;
