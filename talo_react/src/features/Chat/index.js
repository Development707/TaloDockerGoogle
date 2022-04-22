import {
    Col,
    Row,
    Spin,
    Drawer,
    notification,
    message as messageNotify,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import FilterContainer from './components/FilterContainer';
import ConversationContainer from './containers/ConversationContainer';
import FooterChatContainer from './containers/FooterChatContainer';
import HeaderChatContainer from './containers/HeaderChatContainer';
import SearchContainer from './containers/SearchContainer';
import conversationApi from 'api/conversationApi';
import {
    addManagers,
    addMessage,
    deleteChannel,
    deleteConversation,
    deleteManager,
    fetchConversationById,
    fetchListFriends,
    fetchListMessages,
    fetchPinMessages,
    getLastViewOfMembers,
    getMembersConversation,
    isDeletedFromGroup,
    setCurrentChannel,
    setCurrentConversation,
    setReactionMessage,
    setTotalChannelNotify,
    setUndoMessage,
    updateAvavarConver,
    updateChannel,
    updateInfoChannel,
    updateMemberInConver,
    updateMessageViewLast,
    updateNameOfConver,
    updatePollMessage,
    updateTimeForConver,
} from './slice/chatSlice';
import { useLocation } from 'react-router-dom';
import useWindowSize from 'hooks/useWindowSize';
import BodyChatContainer from './containers/BodyChatContainer';
import renderWidthDrawer from 'utils/DrawerResponsive';
import GroupNews from './components/GroupNews';
import InfoContainer from './containers/InfoContainer';
import { DoubleLeftOutlined, DownOutlined } from '@ant-design/icons';
import DrawerPinMessage from './components/DrawerPinMessage';
import SummedPinMessage from './components/SummedPinMessage';
import './style.scss';
import ModalJoinGroupFromLink from 'components/ModalJoinGroupFromLink';
import { setJoinChatLayout } from 'app/globalSlice';

Chat.propTypes = {
    socket: PropTypes.object,
    idNewMessage: PropTypes.string,
};

Chat.defaultProps = {
    socket: {},
    idNewMessage: '',
};

function Chat({ socket, idNewMessage }) {
    const dispatch = useDispatch();

    //store
    const {
        conversations,
        isLoading,
        currentConversation,
        currentChannel,
        channels,
        pinMessages,
    } = useSelector((state) => state.chat);
    const { isJoinChatLayout, isJoinFriendLayout, user } = useSelector(
        (state) => state.global
    );
    //=========================================
    const location = useLocation();
    const [isOpenInfo, setIsOpenInfo] = useState(true);
    const [openDrawerInfo, setOpenDrawerInfo] = useState(false);

    const refCurrentConversation = useRef();
    const refConversations = useRef();
    const refCurrentChannel = useRef();
    const { width } = useWindowSize();
    const [hasMessage, setHasMessage] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isScroll, setIsScroll] = useState(false);
    const [scrollId, setScrollId] = useState('');
    const [replyMessage, setReplyMessage] = useState({});
    const [userMention, setUserMention] = useState({});
    const [usersTyping, setUsersTyping] = useState([]);
    const [visibleNews, setVisibleNews] = useState(false);
    const [tabActiveInNews, setTabActiveNews] = useState(0);
    const [isOpenDrawerPin, setIsOpenDrawerPin] = useState(false);
    const [infoGroup, setInfoGroup] = useState({});
    const [isVisibleModalJoinGroup, setIsVisibleJoinGroup] = useState(false);

    // filter search=====================================
    const [visibleFilter, setVisbleFilter] = useState(false);
    const [valueClassify, setValueClassify] = useState('0');
    const [valueInput, setValueInput] = useState('');
    const [allConverFilter, setAllConverFilter] = useState([]);
    const [dualConverFilter, setDualConverFilter] = useState([]);
    const [groupConverFilter, setGroupConverFilter] = useState([]);

    //=========================================

    //=============
    useEffect(() => {
        if (width > 1199) {
            setOpenDrawerInfo(false);
        }
    }, [width]);

    //Get Clientwidth

    useEffect(() => {
        refConversations.current = conversations;
    }, [conversations]);

    useEffect(() => {
        refCurrentConversation.current = currentConversation;
    }, [currentConversation]);

    useEffect(() => {
        refCurrentChannel.current = currentChannel;
    }, [currentChannel]);

    useEffect(() => {
        if (currentConversation) {
            dispatch(setTotalChannelNotify());
        }
    }, [currentConversation, channels, conversations]);

    useEffect(() => {
        setUsersTyping([]);
        setReplyMessage(null);
        setUserMention({});
    }, [currentConversation]);

    const handleOnVisibleFilter = (value) => {
        if (value.trim().length > 0) {
            setVisbleFilter(true);
        } else {
            setVisbleFilter(false);
        }
    };
    const handleOnSearchChange = (value) => {
        setValueInput(value);
        handleOnVisibleFilter(value);
    };
    const handleOnSubmitSearch = async () => {
        try {
            // const all = await searchApi.searchConversations(valueInput);

            const all = await conversationApi.fetchListConversations(
                valueInput
            );
            // console.log(all);
            setAllConverFilter(all);

            const dual = await conversationApi.fetchListConversations(
                valueInput,
                'DUAL'
            );
            setDualConverFilter(dual);

            const group = await conversationApi.fetchListConversations(
                valueInput,
                'GROUP'
            );

            setGroupConverFilter(group);
        } catch (error) {
            console.log(error);
        }
    };
    //fetch friends
    useEffect(() => {
        dispatch(
            fetchListFriends({
                name: '',
            })
        );
        //eslint-disable-next-line
    }, []);

    //fetch pinMessages
    useEffect(() => {
        if (
            currentConversation &&
            conversations.find((conver) => conver.id === currentConversation)
                .type === 'GROUP'
        ) {
            dispatch(fetchPinMessages({ conversationId: currentConversation }));
        }
        //eslint-disable-next-line
    }, [currentConversation]);

    const handleBackToBottom = (value, message) => {
        if (message) {
            setHasMessage(message);
        } else {
            setHasMessage('');
        }
        setIsShow(value);
    };

    const hanldeResetScrollButton = (value) => {
        setIsScroll(value);
    };
    const hanldeOnClickScroll = () => {
        setIsScroll(true);
    };
    const handleOnFilterClassfiy = (value) => {
        setValueClassify(value);
    };

    const handleScrollWhenSent = (value) => {
        setScrollId(value);
    };

    const handleOnRemoveMention = () => {
        setUserMention({});
    };

    useEffect(() => {
        setUsersTyping([]);
        setReplyMessage(null);
        setUserMention({});
    }, [currentConversation]);

    const handleOnMention = (userMent) => {
        if (user.id !== userMent.id) {
            setUserMention(userMent);
        }
    };
    const handleViewPolls = () => {
        if (width <= 1199) {
            setOpenDrawerInfo(true);
        }
        setVisibleNews(true);
        setTabActiveNews(1);
    };
    // Reply message ==============
    const handleOnReply = (mes) => {
        setReplyMessage(mes);
    };
    const handleCloseReply = () => {
        setReplyMessage({});
    };
    //Info Group====================
    const handleOnBack = () => {
        setVisibleNews(false);
    };
    const handleChangeActiveKey = (key) => {
        setTabActiveNews(key);
    };

    //Info container================
    const handleChangeViewChannel = () => {
        setVisibleNews(true);
        setTabActiveNews(2);
    };
    // Pin message====
    const handleViewNews = () => {
        setVisibleNews(true);
        setTabActiveNews(0);
    };
    //===================================
    const emitUserOnline = (currentConver) => {
        if (currentConver) {
            const conver = conversations.find(
                (conver) => conver.id === currentConver
            );

            if (conver.type === 'DUAL') {
                const userId = conver.members[0].id;
                socket.emit(
                    'UserGetStatus',
                    userId,
                    ({ isOnline, lastLogin }) => {
                        dispatch(
                            updateTimeForConver({
                                id: currentConver,
                                isOnline,
                                lastLogin,
                            })
                        );
                    }
                );
            }
        }
    };

    useEffect(() => {
        emitUserOnline(currentConversation);
        //eslint-disable-next-line
    }, [currentConversation]);

    useEffect(() => {
        const intervalCall = setInterval(() => {
            emitUserOnline(currentConversation);
        }, 90000);

        return () => {
            clearInterval(intervalCall);
        };
        //eslint-disable-next-line
    }, [currentConversation]);

    //===================
    useEffect(() => {
        const openModalJoinFromLink = async () => {
            if (location.state && location.state.conversationId) {
                const listConver =
                    await conversationApi.fetchListConversations();

                const tempId = location.state.conversationId;

                if (
                    listConver.findIndex((conver) => conver.id === tempId) < 0
                ) {
                    try {
                        const infoGroup =
                            await conversationApi.getSortInfoGroup(tempId);
                        setInfoGroup(infoGroup);
                        setIsVisibleJoinGroup(true);
                    } catch (error) {
                        messageNotify.warning(
                            'Trưởng nhóm đã tắt tính năng tham gia nhóm bằng liên kết'
                        );
                    }
                } else {
                    dispatch(
                        fetchListMessages({ conversationId: tempId, size: 10 })
                    );
                    dispatch(
                        getMembersConversation({ conversationId: tempId })
                    );

                    dispatch(getLastViewOfMembers({ conversationId: tempId }));
                }
            }
        };
        openModalJoinFromLink();
        //eslint-disable-next-line
    }, []);

    //Socket
    useEffect(() => {
        console.log('isJoinChatLayout', isJoinChatLayout);
        if (!isJoinChatLayout) {
            socket.on('ConversationDelete', (conversationId) => {
                const conver = refConversations.current.find(
                    (ele) => ele.id === conversationId
                );

                if (conver.leaderId !== user.id) {
                    notification.info({
                        placement: 'topRight',
                        bottom: 50,
                        duration: 3,
                        rtl: true,
                        message: (
                            <span>
                                Nhóm <strong>{conver.name}</strong> đã bị giải
                                tán
                            </span>
                        ),
                    });
                }
                dispatch(deleteConversation(conversationId));
            });
            socket.on('ConsersationRemoveYou', (conversationId) => {
                const conversation = refConversations.current.find(
                    (ele) => ele.id === conversationId
                );
                notification.info({
                    placement: 'topRight',
                    bottom: 50,
                    duration: 3,
                    rlt: true,
                    message: (
                        <span>
                            Bạn đã bị xóa khỏi nhóm{' '}
                            <strong>{conversation.name}</strong>
                        </span>
                    ),
                });

                if (conversationId === refCurrentConversation.current) {
                    dispatch(setCurrentConversation(''));
                }
                dispatch(isDeletedFromGroup(conversationId));
                socket.emit('ConversationLeft', conversationId);
            });
            socket.on(
                'MessageViewLast',
                ({ conversationId, userId, lastView, channelId }) => {
                    if (userId !== user.id) {
                        dispatch(
                            updateMessageViewLast({
                                conversationId,
                                userId,
                                lastView,
                                channelId,
                            })
                        );
                    }
                }
            );
            socket.on(
                'ConversationChangeName',
                (conversationId, name, message) => {
                    dispatch(updateNameOfConver({ conversationId, name }));
                    dispatch(addMessage({ conversationId, message }));
                }
            );

            socket.on('ConversationMemberUpdate', async (conversationId) => {
                if (conversationId === refCurrentConversation.current) {
                    dispatch(getLastViewOfMembers({ conversationId }));
                    const newMember =
                        await conversationApi.getMemberInConversation(
                            refCurrentConversation.current
                        );
                    dispatch(
                        updateMemberInConver({ conversationId, newMember })
                    );
                }
            });
            socket.on(
                'ChannelCreate',
                ({ id, name, description, conversationId, createdAt }) => {
                    if (conversationId === refCurrentConversation.current) {
                        dispatch(
                            updateChannel({ id, name, description, createdAt })
                        );
                    }
                }
            );

            socket.on(
                'ChannelUpdate',
                ({ id, name, description, conversationId }) => {
                    if (refCurrentConversation.current === conversationId) {
                        dispatch(
                            updateInfoChannel({
                                channelId: id,
                                name,
                                description,
                            })
                        );
                    }
                }
            );

            socket.on(
                'ChannelDelete',
                async ({ conversationId, channelId }) => {
                    const actionAfterDelete = async () => {
                        dispatch(setCurrentChannel(''));
                        dispatch(
                            fetchListMessages({
                                conversationId: refCurrentConversation.current,
                                size: 20,
                            })
                        );
                        dispatch(
                            getLastViewOfMembers({
                                conversationId: refCurrentConversation.current,
                            })
                        );
                    };

                    await actionAfterDelete();

                    if (refCurrentConversation.current === conversationId) {
                        dispatch(deleteChannel({ channelId }));
                    }
                }
            );

            socket.on(
                'ConversationChangeAvatar',
                (conversationId, conversationAvatar) => {
                    if (refCurrentConversation.current === conversationId) {
                        dispatch(
                            updateAvavarConver({
                                conversationId,
                                conversationAvatar,
                            })
                        );
                    }
                }
            );

            socket.on(
                'ConversationManagerAdd',
                (conversationId, managerIds) => {
                    dispatch(addManagers({ conversationId, managerIds }));
                }
            );
            socket.on(
                'ConversationManagerDelete',
                (conversationId, managerIds) => {
                    dispatch(
                        deleteManager({
                            conversationId,
                            managerIds,
                        })
                    );
                }
            );
            socket.on('ConversationTyping', (conversationId, user) => {
                if (conversationId === refCurrentConversation.current) {
                    const index = usersTyping.findIndex(
                        (item) => item.id === user.id
                    );

                    if (usersTyping.length === 0 || index < 0) {
                        setUsersTyping([...usersTyping, user]);
                    }
                }
            });
            socket.on('ConversationTypingFinish', (conversationId, user) => {
                if (conversationId === refCurrentConversation.current) {
                    const newUserTyping = usersTyping.filter(
                        (item) => item.id !== user.id
                    );
                    setUsersTyping(newUserTyping);
                }
            });

            socket.on('ConversationMemberAdd', (conversationId) => {
                dispatch(fetchConversationById({ conversationId }));
            });

            socket.on(
                'MessageReactAdd',
                ({ conversationId, channelId, messageId, user, type }) => {
                    if (
                        refCurrentConversation.current === conversationId &&
                        refCurrentChannel.current === channelId
                    ) {
                        dispatch(setReactionMessage({ messageId, user, type }));
                    }

                    if (
                        !channelId &&
                        refCurrentConversation.current === conversationId
                    ) {
                        dispatch(setReactionMessage({ messageId, user, type }));
                    }
                }
            );

            socket.on(
                'MessageDelete',
                ({ conversationId, channelId, messageId }) => {
                    if (
                        refCurrentConversation.current === conversationId &&
                        refCurrentChannel.current === channelId
                    ) {
                        dispatch(setUndoMessage({ messageId }));
                    }
                    if (
                        !channelId &&
                        refCurrentConversation.current === conversationId
                    ) {
                        dispatch(setUndoMessage({ messageId, conversationId }));
                    }
                }
            );

            socket.on('MessagePinAdd', (conversationId) => {
                if (conversationId === refCurrentConversation.current) {
                    dispatch(fetchPinMessages({ conversationId }));
                }
            });
            socket.on('MessagePinDelete', (conversationId) => {
                if (conversationId === refCurrentConversation.current) {
                    dispatch(fetchPinMessages({ conversationId }));
                }
            });
            socket.on('PollChooseUpdate', (conversationId, pollMessage) => {
                if (refCurrentConversation.current === conversationId) {
                    dispatch(
                        updatePollMessage({
                            pollMessage,
                        })
                    );
                }
            });
            socket.on('PollOptionUpdate', (conversationId, pollMessage) => {
                if (refCurrentConversation.current === conversationId) {
                    dispatch(
                        updatePollMessage({
                            pollMessage,
                        })
                    );
                }
            });
        }

        dispatch(setJoinChatLayout(true));
    }, []);

    const handleCancelModalJoinGroup = () => {
        setIsVisibleJoinGroup(false);
    };

    return (
        <Spin spinning={isLoading}>
            {Object.keys(infoGroup).length > 0 && (
                <ModalJoinGroupFromLink
                    isVisible={isVisibleModalJoinGroup}
                    info={infoGroup}
                    onCancel={handleCancelModalJoinGroup}
                />
            )}
            <div id="main-chat-wrapper">
                <Row gutter={[0, 0]}>
                    <Col
                        span={5}
                        xl={{ span: 5 }}
                        lg={{ span: 6 }}
                        md={{ span: 7 }}
                        sm={{ span: currentConversation ? 0 : 24 }}
                        xs={{ span: currentConversation ? 0 : 24 }}
                    >
                        <div className="main-conversation">
                            <div
                                className={`main-conversation_search-bar ${
                                    visibleFilter ? 'fillter' : ''
                                }`}
                            >
                                <SearchContainer
                                    onSearchChange={handleOnSearchChange}
                                    valueText={valueInput}
                                    onSubmitSearch={handleOnSubmitSearch}
                                    onFilterClasify={handleOnFilterClassfiy}
                                    valueClassify={valueClassify}
                                />
                            </div>

                            {visibleFilter ? (
                                <FilterContainer
                                    dataAll={allConverFilter}
                                    dataDual={dualConverFilter}
                                    dataGroup={groupConverFilter}
                                />
                            ) : (
                                <>
                                    <div className="divider-layout">
                                        <div />
                                    </div>

                                    <div className="main-conversation_list-conversation">
                                        <ConversationContainer
                                            valueClassify={valueClassify}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                    {location.pathname === '/chat' && currentConversation ? (
                        <>
                            <Col
                                span={isOpenInfo ? 13 : 19}
                                xl={{ span: isOpenInfo ? 13 : 19 }}
                                lg={{ span: 18 }}
                                md={{ span: 17 }}
                                sm={{ span: currentConversation ? 24 : 0 }}
                                xs={{ span: currentConversation ? 24 : 0 }}
                            >
                                <div className="main_chat">
                                    <div className="main_chat-header">
                                        <HeaderChatContainer
                                            isOpenInfo={isOpenInfo}
                                            onPopUpInfo={() =>
                                                setIsOpenInfo(!isOpenInfo)
                                            }
                                            onOpenDrawer={() =>
                                                setOpenDrawerInfo(true)
                                            }
                                        />
                                    </div>
                                    <div className="main_chat-body">
                                        <div id="main_chat-body--view">
                                            <BodyChatContainer
                                                scrollId={scrollId}
                                                onBackToBottom={
                                                    handleBackToBottom
                                                }
                                                onResetScrollButton={
                                                    hanldeResetScrollButton
                                                }
                                                turnOnScrollButoon={isScroll}
                                                onSCrollDown={idNewMessage}
                                                onReply={handleOnReply}
                                                onMention={handleOnMention}
                                            />

                                            {pinMessages.length > 1 &&
                                                conversations.find(
                                                    (conver) =>
                                                        conver.id ===
                                                        currentConversation
                                                ).type === 'GROUP' &&
                                                !currentChannel && (
                                                    <div className="pin-message">
                                                        <DrawerPinMessage
                                                            isOpen={
                                                                isOpenDrawerPin
                                                            }
                                                            onClose={() =>
                                                                setIsOpenDrawerPin(
                                                                    false
                                                                )
                                                            }
                                                            message={
                                                                pinMessages
                                                            }
                                                        />
                                                    </div>
                                                )}

                                            {pinMessages.length > 0 &&
                                                conversations.find(
                                                    (conver) =>
                                                        conver.id ===
                                                        currentConversation
                                                ).type === 'GROUP' &&
                                                !currentChannel && (
                                                    <div className="summed-pin-message">
                                                        <SummedPinMessage
                                                            isHover={false}
                                                            isItem={
                                                                pinMessages.length >
                                                                1
                                                                    ? false
                                                                    : true
                                                            }
                                                            message={
                                                                pinMessages[0]
                                                            }
                                                            quantity={
                                                                pinMessages.length
                                                            }
                                                            onOpenDrawer={() =>
                                                                setIsOpenDrawerPin(
                                                                    true
                                                                )
                                                            }
                                                            onViewNews={
                                                                handleViewNews
                                                            }
                                                        />
                                                    </div>
                                                )}

                                            <div
                                                id="back-top-button"
                                                className={`${
                                                    isShow ? 'show' : 'hide'
                                                } ${
                                                    hasMessage
                                                        ? 'new-message'
                                                        : ''
                                                }`}
                                                onClick={hanldeOnClickScroll}
                                            >
                                                {hasMessage ? (
                                                    <div className="db-arrow-new-message">
                                                        <span className="arrow">
                                                            <DoubleLeftOutlined />
                                                        </span>
                                                        <span>
                                                            &nbsp;{hasMessage}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <DownOutlined />
                                                )}
                                            </div>

                                            {usersTyping.length > 0 &&
                                                !refCurrentChannel.current && (
                                                    <div className="typing-message">
                                                        {usersTyping.map(
                                                            (item, index) => (
                                                                <span>
                                                                    {index <
                                                                        3 && (
                                                                        <>
                                                                            {index ===
                                                                            usersTyping.length -
                                                                                1
                                                                                ? `${item.name} `
                                                                                : `${item.name}, `}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            )
                                                        )}

                                                        {usersTyping.length > 3
                                                            ? `và ${
                                                                  usersTyping.length -
                                                                  3
                                                              } người khác`
                                                            : ''}

                                                        <span>
                                                            &nbsp;đang nhập
                                                        </span>

                                                        <div className="dynamic-dot">
                                                            <div className="dot"></div>
                                                            <div className="dot"></div>
                                                            <div className="dot"></div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="main_chat-body--input">
                                            <FooterChatContainer
                                                onScrollWhenSentText={
                                                    handleScrollWhenSent
                                                }
                                                onRemoveMention={
                                                    handleOnRemoveMention
                                                }
                                                onViewPolls={handleViewPolls}
                                                onOpenInfoBlock={() =>
                                                    setIsOpenInfo(true)
                                                }
                                                userMention={userMention}
                                                replyMessage={replyMessage}
                                                onCloseReply={handleCloseReply}
                                                socket={socket}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col
                                span={isOpenInfo ? 6 : 0}
                                xl={{ span: isOpenInfo ? 6 : 0 }}
                                lg={{ span: 0 }}
                                md={{ span: 0 }}
                                sm={{ span: 0 }}
                                xs={{ span: 0 }}
                            >
                                <div className="main-info">
                                    <Drawer
                                        key="right"
                                        className="drawer-responsive"
                                        placement="right"
                                        closable={false}
                                        visible={openDrawerInfo}
                                        bodyStyle={{ padding: 0 }}
                                        width={`${renderWidthDrawer(width)}%`}
                                        onClose={() => setOpenDrawerInfo(false)}
                                    >
                                        <>
                                            {visibleNews ? (
                                                <GroupNews
                                                    tabActive={tabActiveInNews}
                                                    onBack={handleOnBack}
                                                    onChange={
                                                        handleChangeActiveKey
                                                    }
                                                />
                                            ) : (
                                                <InfoContainer
                                                    onViewChannel={
                                                        handleChangeViewChannel
                                                    }
                                                    socket={socket}
                                                />
                                            )}
                                        </>
                                    </Drawer>

                                    {visibleNews ? (
                                        <GroupNews
                                            tabActive={tabActiveInNews}
                                            onBack={handleOnBack}
                                            onChange={handleChangeActiveKey}
                                        />
                                    ) : (
                                        <InfoContainer
                                            onViewChannel={
                                                handleChangeViewChannel
                                            }
                                            socket={socket}
                                        />
                                    )}
                                </div>
                            </Col>
                        </>
                    ) : (
                        <Col
                            span={18}
                            xl={{ span: 18 }}
                            lg={{ span: 18 }}
                            md={{ span: 17 }}
                            sm={{ span: 0 }}
                            xs={{ span: 0 }}
                        >
                            <div className="landing-app">
                                <div className="title-welcome">
                                    <div className="title-welcome-heading">
                                        <span>
                                            Chào mừng đến với <b>Talo</b>
                                        </span>
                                    </div>

                                    <div className="title-welcome-detail">
                                        <span>
                                            Khám phá những tiện ích hỗ trợ làm
                                            việc và trò chuyện cùng người thân,
                                            bạn bè được tối ưu hoá cho máy tính
                                            của bạn.
                                        </span>
                                    </div>
                                </div>

                                <div className="carousel-slider">
                                    {/* <Slider /> */}
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </div>
        </Spin>
    );
}

export default Chat;
