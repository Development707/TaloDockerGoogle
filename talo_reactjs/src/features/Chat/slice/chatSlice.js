import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import channelApi from 'api/channelApi';
import classifyApi from 'api/ClassifyApi';
import conversationApi from 'api/conversationApi';
import friendApi from 'api/friendApi';
import messageApi from 'api/messageApi';
import pinMessageApi from 'api/pinMessageApi';
import pollApi from 'api/pollApi';
import stickerApi from 'api/stickerApi';

const KEY = 'chat';

// Conversation
export const fetchListConversations = createAsyncThunk(
    `${KEY}/fetchListConversations`,
    async (params, thunkApi) => {
        const { name, type } = params;
        const conversations = await conversationApi.fetchListConversations(
            name,
            type
        );
        return conversations;
    }
);

export const getLastViewOfMembers = createAsyncThunk(
    `${KEY}/getLastViewOfMembers`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const lastViews = await conversationApi.getLastViewOfMembers(
            conversationId
        );

        return lastViews;
    }
);

export const fetchConversationById = createAsyncThunk(
    `${KEY}/fetchConversationById`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const conversation = await conversationApi.getConversationById(
            conversationId
        );

        return conversation;
    }
);

// Classify
export const fetchListClassify = createAsyncThunk(
    `${KEY}/fetchListClassify`,
    async (params, thunkApi) => {
        const classifies = await classifyApi.getClassifies();
        return classifies;
    }
);
// Message
export const fetchListMessages = createAsyncThunk(
    `${KEY}/fetchListMessages`,
    async (params, thunkApi) => {
        const { conversationId, page, size } = params;

        const messages = await messageApi.fetchListMessages(
            conversationId,
            page,
            size
        );

        return {
            messages,
            conversationId,
        };
    }
);

export const fetchNextPageMessage = createAsyncThunk(
    `${KEY}/fetchNextPageMessage`,
    async (params, thunkApi) => {
        const { conversationId, page, size } = params;
        const messages = await messageApi.fetchListMessages(
            conversationId,
            page,
            size
        );

        return messages;
    }
);

// FRIEND API

export const fetchListFriends = createAsyncThunk(
    `${KEY}/fetchListFriends`,
    async (params, thunkApi) => {
        const { name } = params;
        const friends = await friendApi.fetchFriends(name);
        return friends;
    }
);

// Create a group chat
export const createGroup = createAsyncThunk(
    `${KEY}/createGroup`,
    async (params, thunkApi) => {
        const { name, userIds } = params;
        const idNewGroup = await conversationApi.createGroup(name, userIds);
        return idNewGroup;
    }
);

export const getMembersConversation = createAsyncThunk(
    `${KEY}/getMembersConversation`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const members = await conversationApi.getMemberInConversation(
            conversationId
        );
        return members;
    }
);

// =============== Channel ===============

export const fetchChannels = createAsyncThunk(
    `${KEY}/fetchChannels`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const data = await channelApi.fetchChannel(conversationId);
        return data;
    }
);
export const fetchMessageInChannel = createAsyncThunk(
    `${KEY}/fetchMessageInChannel`,
    async (params, thunkApi) => {
        const { channelId, page, size } = params;
        const data = await messageApi.getMessageInChannel(
            channelId,
            page,
            size
        );

        return {
            messages: data,
            channelId,
        };
    }
);

export const fetchNextPageOfChannel = createAsyncThunk(
    `${KEY}/fetchNextPageOfChannel`,
    async (params, thunkApi) => {
        const { channelId, page, size } = params;
        const messages = await messageApi.getMessageInChannel(
            channelId,
            page,
            size
        );

        return messages;
    }
);

export const getLastViewChannel = createAsyncThunk(
    `${KEY}/getLastViewChannel`,
    async (params, thunkApi) => {
        const { channelId } = params;
        const lastViews = await channelApi.getLastViewChannel(channelId);

        return lastViews;
    }
);
//============== Sticker ===========
export const fetchAllSticker = createAsyncThunk(
    `${KEY}/fetchAllSticker`,
    async () => {
        const data = await stickerApi.fetchAllSticker();
        return data;
    }
);
//========= Poll ==========
export const fetchPolls = createAsyncThunk(
    `${KEY}/fetchPolls`,
    async (params, thunkApi) => {
        const { conversationId, page, size } = params;
        const data = await pollApi.getVotes(conversationId, page, size);
        return data;
    }
);
// ============ PIN MESSAGE ==============

export const fetchPinMessages = createAsyncThunk(
    `${KEY}/fetchPinMessages`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const pinMessages = await pinMessageApi.getPinMessages(conversationId);
        return pinMessages;
    }
);

const chatSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
        conversations: [],
        currentConversation: '',
        classifies: [],
        friends: [],
        lastViewOfMember: [],
        messages: [],
        currentPage: '',
        totalPages: '',
        toTalUnread: 0,
        memberInConversation: [],
        currentChannel: '',
        channels: [],
        type: '',
        stickers: [],
        polls: [],
        totalPagesPoll: 0,
        totalChannelNotify: 0,
        pinMessages: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = true;
        },
        setConversations: (state, action) => {
            const conversation = action.payload;
            state.conversations = [conversation, ...state.conversations];
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload;
        },
        setTypeOfConversation: (state, action) => {
            const conversationId = action.payload;
            const conversation = state.conversations.find(
                (ele) => ele.id === conversationId
            );
            if (conversation) {
                state.type = conversation.type;
            }
            console.log('state.type', state.type);
        },
        updatePoll: (state, action) => {
            state.polls = action.payload;
        },
        setTotalChannelNotify: (state, action) => {
            let notify = state.conversations.find(
                (ele) => ele.id === state.currentConversation
            ).numberUnread;

            if (state.channels.length > 0) {
                state.channels.forEach((ele) => {
                    if (ele.numberUnread && ele.numberUnread > 0) {
                        notify += 1;
                    }
                });
            }

            state.totalChannelNotify = notify;
        },
        leaveGroup: (state, action) => {
            const conversationId = action.payload;
            const newConvers = state.conversations.filter(
                (ele) => ele.id !== conversationId
            );
            state.conversations = newConvers;
            state.currentConversation = '';
        },
        setRollUpPage: (state, action) => {
            if (state.currentPage < state.totalPages - 1) {
                state.currentPage = state.currentPage + 1;
            }
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            const indexConver = state.conversations.findIndex(
                (converEle) => converEle.id === conversationId
            );

            const searchConver = state.conversations[indexConver];

            searchConver.numberUnread = searchConver.numberUnread + 1;
            searchConver.lastMessage = {
                ...message,
                createdAt: message.createdAt,
            };
            // xóa conversation đó ra khỏi conversations hiện tại
            const conversationTempt = state.conversations.filter(
                (conversationEle) => conversationEle.id !== conversationId
            );

            if (
                conversationId === state.currentConversation &&
                !state.currentChannel
            ) {
                state.messages.push(message);
                searchConver.numberUnread = 0;
            }

            state.conversations = [searchConver, ...conversationTempt];
        },
        updateAvatarWhenUpdateMember: (state, action) => {
            const { conversationId, avatar, totalMembers } = action.payload;
            const index = state.conversations.findIndex(
                (converEle) => converEle.id === conversationId
            );
            state.conversations[index].totalMembers = totalMembers;

            if (
                index > -1 &&
                typeof state.conversations[index].avatar?.url === 'string'
            ) {
                state.conversations[index].avatar.url = avatar;
            }
        },
        addMessageInChannel: (state, action) => {
            const { conversationId, channelId, message } = action.payload;

            const index = state.channels.findIndex(
                (channel) => channel.id === channelId
            );
            const searchChannelByIndex = state.channels[index];

            const channelTemps = state.channels.filter(
                (channel) => channel.id !== channelId
            );
            if ('numberUnread' in searchChannelByIndex) {
                searchChannelByIndex.numberUnread =
                    searchChannelByIndex.numberUnread + 1;
            } else {
                searchChannelByIndex.numberUnread = 1;
            }

            if (
                state.currentConversation === conversationId &&
                state.currentChannel === channelId
            ) {
                state.messages.push(message);
                searchChannelByIndex.numberUnread = 0;
            }

            state.channels = [searchChannelByIndex, ...channelTemps];
        },
        updateFriendChat: (state, action) => {
            const id = action.payload;
            state.friends = state.friends.filter((item) => item.id !== id);
        },
        deleteConversation: (state, action) => {
            const converId = action.payload;
            state.conversations = state.conversations.filter(
                (item) => item.id !== converId
            );
            state.currentConversation = '';
        },
        isDeletedFromGroup: (state, action) => {
            const converId = action.payload;
            const newConver = state.conversations.filter(
                (item) => item.id !== converId
            );
            state.conversations = newConver;
        },
        updateNameOfConver: (state, action) => {
            const { conversationId, name } = action.payload;
            const index = state.conversations.findIndex(
                (ele) => ele.id === conversationId
            );

            state.conversations[index] = {
                ...state.conversations[index],
                name: name,
            };
        },
        updateMessageViewLast: (state, action) => {
            const { conversationId, userId, lastView, channelId } =
                action.payload;
            if (channelId) {
                if (state.currentChannel === channelId) {
                    const index = state.lastViewOfMember.findIndex(
                        (item) => item.user.id === userId
                    );
                    state.lastViewOfMember[index].lastView = lastView;
                }
            } else {
                if (
                    conversationId === state.currentConversation &&
                    !state.currentChannel
                ) {
                    const index = state.lastViewOfMember.findIndex(
                        (item) => item.user.id === userId
                    );
                    state.lastViewOfMember[index].lastView = lastView;
                }
            }
        },
        updateMemberInConver: (state, action) => {
            const { conversationId, newMember } = action.payload;
            // state.memberInConversation = newMember;
            const tempMembers = newMember;
            const temp = [];

            tempMembers.forEach((member) => {
                state.friends.forEach((friend) => {
                    if (member.id === friend.id) {
                        member = { ...member, isFriend: true };
                        return;
                    }
                });
                temp.push(member);
            });
            state.memberInConversation = temp;
            const index = state.conversations.findIndex(
                (ele) => ele.id === conversationId
            );
            if (index > -1) {
                state.conversations[index].totalMembers = newMember.length;
                state.conversations[index].members = newMember;
            }
        },
        updateChannel: (state, action) => {
            const { id, name, description, createdAt } = action.payload;
            state.channels = [
                { id, name, description, createdAt },
                ...state.channels,
            ];
        },
        updateInfoChannel: (state, action) => {
            const { channelId, name, description } = action.payload;

            const index = state.channels.findIndex(
                (item) => item.id === channelId
            );

            state.channels[index] = {
                ...state.channels[index],
                name,
                description,
            };
        },
        deleteChannel: (state, action) => {
            const { channelId } = action.payload;
            const newchannels = state.channels.filter(
                (item) => item.id !== channelId
            );
            state.channels = newchannels;
        },
        updateAvavarConver: (state, action) => {
            const { conversationId, conversationAvatar } = action.payload;
            const index = state.conversations.findIndex(
                (item) => item.id === conversationId
            );

            state.conversations[index] = {
                ...state.conversations[index],
                avatar: conversationAvatar,
            };
        },
        addManagers: (state, action) => {
            const { conversationId, managerIds } = action.payload;
            if (conversationId === state.currentConversation) {
                const index = state.conversations.findIndex(
                    (item) => item.id === conversationId
                );

                const tempManagerIds =
                    state.conversations[index].managerIds.concat(managerIds);
                if (index > -1) {
                    state.conversations[index] = {
                        ...state.conversations[index],
                        managerIds: tempManagerIds,
                    };
                }
            }
        },
        deleteManager: (state, action) => {
            const { conversationId, managerIds } = action.payload;
            if (conversationId === state.currentConversation) {
                const index = state.conversations.findIndex(
                    (item) => item.id === conversationId
                );

                const tempManagerIds = state.conversations[
                    index
                ].managerIds.filter((item) => item !== managerIds[0]);
                if (index > -1) {
                    state.conversations[index] = {
                        ...state.conversations[index],
                        managerIds: tempManagerIds,
                    };
                }
            }
        },
        setReactionMessage: (state, action) => {
            const { messageId, user, type } = action.payload;
            const index = state.messages.findIndex(
                (item) => item.id === messageId
            );

            const currentMessage = state.messages.find(
                (item) => item.id === messageId
            );

            const checkIsExist = currentMessage.reacts.findIndex(
                (react) => react.userId.id === user.id
            );

            if (checkIsExist >= 0) {
                state.messages[index].reacts[checkIsExist] = {
                    ...state.messages[index].reacts[checkIsExist],
                    type,
                };
            } else {
                let reacts = [...currentMessage.reacts, { userId: user, type }];
                state.messages[index].reacts = reacts;
            }
        },
        //deleteMessage
        deleteMessageClient: (state, action) => {
            const idMessage = action.payload;
            const newMessages = state.messages.filter(
                (message) => message.id !== idMessage
            );
            state.messages = newMessages;
        },
        setUndoMessage: (state, action) => {
            const { messageId, conversationId } = action.payload;
            const oldMessage = state.messages.find(
                (message) => message.id === messageId
            );

            const { id, user, createdAt } = oldMessage;
            const index = state.messages.findIndex(
                (message) => message.id === messageId
            );

            const newMessage = {
                id,
                user,
                createdAt,
                isDeleted: 'true',
            };

            state.messages[index] = newMessage;

            if (conversationId) {
                const indexConver = state.conversations.findIndex(
                    (conver) => conver.id === conversationId
                );
                state.conversations[indexConver].lastMessage.isDeleted = true;
            }
        },
        updateTimeForConver: (state, action) => {
            const { id, isOnline, lastLogin } = action.payload;
            const index = state.conversations.findIndex(
                (conver) => conver.id === id
            );

            const newConver = {
                ...state.conversations[index],
                isOnline,
                lastLogin,
            };
            state.conversations[index] = newConver;
        },
        updatePollMessage: (state, action) => {
            const { pollMessage } = action.payload;

            const index = state.messages.findIndex(
                (message) => message.id === pollMessage.id
            );
            if (index > -1) {
                state.messages[index] = pollMessage;
            }
        },
        setTotalUnread: (state, action) => {
            let tempCount = 0;
            state.conversations.forEach((conver, index) => {
                if (conver.numberUnread > 0) tempCount += 1;
            });
            state.toTalUnread = tempCount;
        },
    },
    extraReducers: {
        // conversation
        [fetchListConversations.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListConversations.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.conversations = action.payload;
        },
        [fetchConversationById.fulfilled]: (state, action) => {
            const conversations = action.payload;
            state.conversations = [conversations, ...state.conversations];
        },
        [getLastViewOfMembers.fulfilled]: (state, action) => {
            state.lastViewOfMember = action.payload;
        },
        // messages
        [fetchListMessages.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListMessages.fulfilled]: (state, action) => {
            state.isLoading = false;

            // xét currentConversation
            const conversationId = action.payload.conversationId;
            const conversationIndex = state.conversations.findIndex(
                (conversationEle) => conversationEle.id === conversationId
            );

            state.conversations[conversationIndex] = {
                ...state.conversations[conversationIndex],
                numberUnread: 0,
            };

            state.currentConversation = conversationId;

            state.messages = action.payload.messages.data;
            state.currentPage = action.payload.messages.page;
            state.totalPages = action.payload.messages.totalPages;
        },
        [getMembersConversation.fulfilled]: (state, action) => {
            const tempMembers = [...action.payload];
            const temp = [];

            tempMembers.forEach((member) => {
                state.friends.forEach((friend) => {
                    if (member.id === friend.id) {
                        member = { ...member, isFriend: true };
                        return;
                    }
                });
                temp.push(member);
            });

            state.memberInConversation = temp;
        },

        [fetchNextPageMessage.fulfilled]: (state, action) => {
            state.messages = [...action.payload.data, ...state.messages];
            state.currentPage = action.payload.page;
        },
        // classify
        [fetchListClassify.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListClassify.fulfilled]: (state, action) => {
            state.classifies = action.payload;
            state.isLoading = false;
        },
        [fetchListClassify.rejected]: (state, action) => {
            state.classifies = action.payload;
            state.isLoading = false;
        },
        // Friend
        [fetchListFriends.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListFriends.fulfilled]: (state, action) => {
            state.friends = action.payload;
            state.isLoading = false;
        },
        [fetchListFriends.rejected]: (state, action) => {
            state.isLoading = false;
        },
        // Channel
        [fetchChannels.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchChannels.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.channels = action.payload;
        },
        [fetchChannels.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchMessageInChannel.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchMessageInChannel.fulfilled]: (state, action) => {
            state.isLoading = false;
            const { messages, channelId } = action.payload;

            const channelIndex = state.channels.findIndex(
                (channel) => channel.id === channelId
            );

            state.channels[channelIndex] = {
                ...state.channels[channelIndex],
                numberUnread: 0,
            };

            state.currentChannel = channelId;

            state.messages = messages.data;
            state.currentPage = messages.page;
            state.totalPages = messages.totalPages;
        },

        [fetchMessageInChannel.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchNextPageOfChannel.fulfilled]: (state, action) => {
            state.messages = [...action.payload.data, ...action.messages];
            state.currentPage = action.payload.page;
        },

        [getLastViewChannel.fulfilled]: (state, action) => {
            state.lastViewOfMember = action.payload;
        },

        // Sticker
        [fetchAllSticker.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchAllSticker.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.stickers = action.payload;
        },
        [fetchAllSticker.rejected]: (state, action) => {
            state.isLoading = false;
        },
        // Poll
        [fetchPolls.fulfilled]: (state, action) => {
            state.polls = action.payload.data;
            state.totalPagesPoll = action.payload.totalPages;
        },
        // PinMessage
        [fetchPinMessages.fulfilled]: (state, action) => {
            state.pinMessages = action.payload.reverse();
        },
    },
});

const { reducer, actions } = chatSlice;
export const {
    setLoading,
    setConversations,
    setCurrentConversation,
    setCurrentChannel,
    setTypeOfConversation,
    updatePoll,
    setTotalChannelNotify,
    leaveGroup,
    setRollUpPage,
    addMessage,
    updateAvatarWhenUpdateMember,
    addMessageInChannel,
    updateFriendChat,
    deleteConversation,
    isDeletedFromGroup,
    updateNameOfConver,
    updateMessageViewLast,
    updateMemberInConver,
    updateChannel,
    updateInfoChannel,
    deleteChannel,
    updateAvavarConver,
    addManagers,
    deleteManager,
    setReactionMessage,
    deleteMessageClient,
    setUndoMessage,
    updateTimeForConver,
    updatePollMessage,
    setTotalUnread,
} = actions;

export default reducer;
