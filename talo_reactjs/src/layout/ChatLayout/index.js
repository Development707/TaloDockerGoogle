import { Col, Row } from 'antd';
import NotFoundPage from 'components/NotFoundPage';
import NavbarContainer from 'features/Chat/containers/NavbarContainer';
import Chat from 'features/Chat';
import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Friend from 'features/Friend';
import { useDispatch, useSelector } from 'react-redux';
import {
    addMessage,
    addMessageInChannel,
    fetchAllSticker,
    fetchConversationById,
    fetchListClassify,
    fetchListConversations,
    updateAvatarWhenUpdateMember,
    updateFriendChat,
} from 'features/Chat/slice/chatSlice';
import {
    fetchFriends,
    fetchListGroup,
    fetchListMyRequestFriend,
    fetchListRequestFriend,
    setAmountNotify,
    setMyRequestFriend,
    setNewFriend,
    setSendNewRequestFriend,
    updateFriend,
    updateMyRequestFriend,
    updateRequestFriends,
} from 'features/Friend/friendSlice';
import { setTabActive } from 'app/globalSlice';
import { init, socket } from 'utils/socketClient';
import conversationApi from 'api/conversationApi';
import useUnload from 'hooks/useUnload';
init();

const ChatLayout = () => {
    const codeRevokeRef = useRef();
    const [idNewMessage, setIdNewMessage] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.global);
    const { conversations } = useSelector((state) => state.chat);
    const { amountNotify } = useSelector((state) => state.friend);

    useEffect(() => {
        dispatch(fetchListRequestFriend());
        dispatch(fetchListMyRequestFriend());
        dispatch(
            fetchFriends({
                name: '',
            })
        );
        dispatch(
            fetchListGroup({
                name: '',
                type: 'GROUP',
            })
        );
        dispatch(fetchListClassify());
        dispatch(fetchListConversations({}));
        dispatch(fetchAllSticker());
        dispatch(setTabActive(1));
    }, []);

    // socket =======================
    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    // isOnline - lastLogin
    useEffect(() => {
        const userId = user.id;
        if (userId) socket.emit('UserOnline', userId);
    }, [user]);

    useEffect(() => {
        if (conversations.length === 0) return;

        const conversationIds = conversations.map(
            (conversationEle) => conversationEle.id
        );
        socket.emit('ConversationsJoin', conversationIds);
    }, [conversations]);

    useEffect(() => {
        socket.on('ConversationDuaCreate', (converId) => {
            socket.emit('ConversationJoin', converId);
            dispatch(fetchConversationById({ conversationId: converId }));
        });
    }, []);

    useEffect(() => {
        socket.on('ConversationDuaCreate', (conversationId) => {
            dispatch(fetchConversationById({ conversationId }));
        });
    }, []);

    useEffect(() => {
        socket.on('MessageNew', (conversationId, message) => {
            dispatch(addMessage({ conversationId, message }));
            setIdNewMessage(message.id);
        });

        socket.on('ConversationMemberUpdate', async (conversationId) => {
            const data = await conversationApi.getConversationById(
                conversationId
            );
            const { avatar, totalMembers } = data;
            dispatch(
                updateAvatarWhenUpdateMember({
                    conversationId,
                    avatar: avatar.url,
                    totalMembers,
                })
            );
        });

        socket.on('MessageNewChannel', (conversationId, channelId, message) => {
            dispatch(
                addMessageInChannel({ conversationId, channelId, message })
            );
            setIdNewMessage(message.id);
        });

        socket.on('ConversationGroupCreate', (conversationId) => {
            dispatch(fetchConversationById({ conversationId }));
        });
    }, []);

    const handleSetCodeRevoke = (code) => {
        codeRevokeRef.current = code;
    };

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    useUnload(async (e) => {
        e.preventDefault();
        async function leaveApp() {
            socket.emit('ConversationLeft', user.id);
            await sleep(1000);
        }

        await leaveApp();
    });

    useEffect(() => {
        // bạn bè đồng ý kết bạn
        socket.on('FriendAccept', (value) => {
            dispatch(setNewFriend(value));
            dispatch(setMyRequestFriend(value.id));
        });
        // bạn bè gửi lời mời cho mình
        socket.on('FriendRequestSend', (value) => {
            dispatch(setSendNewRequestFriend(value));
            dispatch(setAmountNotify(amountNotify + 1));
        });

        // bị người dùng bỏ qua lời mời kết bạn
        socket.on('FriendRequestDelete', (id) => {
            dispatch(updateMyRequestFriend(id));
        });

        //  xóa đã gửi yêu cầu kết bạn cho người khác
        socket.on('FriendRequestByMeDelete', (id) => {
            dispatch(updateRequestFriends(id));
        });

        // xóa kết bạn
        socket.on('FriendDelete', (id) => {
            dispatch(updateFriend(id));
            dispatch(updateFriendChat(id));
        });

        // revokeToken
        socket.on('LogoutAll', ({ key }) => {
            if (codeRevokeRef.current !== key) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.reload();
            }
        });
    }, []);
    return (
        <div>
            <Row gutter={[0, 0]}>
                <Col
                    span={1}
                    xl={{ span: 1 }}
                    lg={{ span: 1 }}
                    md={{ span: 2 }}
                    sm={{ span: 3 }}
                    xs={{ span: 4 }}
                >
                    <NavbarContainer onSaveCodeRevoke={handleSetCodeRevoke} />
                </Col>

                <Col
                    span={23}
                    xl={{ span: 23 }}
                    lg={{ span: 23 }}
                    md={{ span: 22 }}
                    sm={{ span: 21 }}
                    xs={{ span: 20 }}
                >
                    <Routes>
                        <Route
                            index
                            path=""
                            element={
                                <Chat
                                    socket={socket}
                                    authed={true}
                                    idNewMessage={idNewMessage}
                                />
                            }
                        />
                        <Route
                            path="friends"
                            element={<Friend authed={true} />}
                        />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Col>
            </Row>
        </div>
    );
};

export default ChatLayout;
