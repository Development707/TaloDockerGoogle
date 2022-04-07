const On = {
    // Talo
    TALO_CONNECTION: 'connection',
    // TALO_CALL + conversationId
    TALO_CALL: 'TaloCall',
    // User (userId)
    USER_ONLINE: 'UserOnline',
    USER_OFFLINE: 'UserOffline',
    // Get status online & login (userId, callback({ isOnline, lastLogin }) )
    USER_GET_STATUS: 'UserGetStatus',
    // Conversations (conversationIds)
    CONVERSATIONS_JOIN: 'ConversationsJoin',
    // Conversation - channel (conversationId, channelId)
    CONVERSATIONS_CHANNEL_VIEW_LAST: 'ConversationsChannelViewLast',
    // Conversation (conversationId)
    CONVERSATION_JOIN: 'ConversationJoin',
    CONVERSATION_LEFT: 'ConversationLeft',
    // Consersation - user (conversation, userId)
    CONVERSATION_USER_TYPING: 'ConversationUserTyping',
    CONVERSATION_USER_TYPING_FINISH: 'ConversationUserTypingFinish',
    // Conversation video call (conversationId, userId, peerId)
    CONVERSATION_VIDEO_CALL_JOIN: 'ConversationVideoCallJoin',
};

const Emit = {
    USER_LOGOUT_ALL: 'LogoutAll',

    // Friend
    FRIEND_ACCEPT: 'FriendAccept',
    FRIEND_DELETE: 'FriendDelete',
    FRIEND_REQUEST_SEND: 'FriendRequestSend',
    FRIEND_REQUEST_DELETE: 'FriendRequestDelete',
    FRIEND_REQUEST_BY_ME_DELETE: 'FriendRequestByMeDelete',
    // Channel
    CHANNEL_CREATE: 'ChannelCreate',
    CHANNEL_UPDATE: 'ChannelUpdate',
    CHANNEL_DELETE: 'ChannelDelete',
    // Conversation
    CONVERSATION_DUA_CREATE: 'ConversationDuaCreate',
    CONVERSATION_GROUP_CREATE: 'ConversationGroupCreate',
    CONVERSATION_CHANGE_NAME: 'ConversationChangeName',
    CONVERSATION_CHANGE_AVATAR: 'ConversationChangeAvatar',
    CONVERSATION_DELETE: 'ConversationDelete',
    CONVERSATION_TYPING: 'ConversationTyping',
    CONVERSATION_TYPING_FINISH: 'ConversationTypingFinish',
    CONVERSATION_VIDEO_CALL_JOIN: 'ConversationVideoCallJoin',
    // Conversation member
    CONVERSATION_MEMBER_ADD: 'ConversationMemberAdd',
    CONVERSATION_MEMBER_UPDATE: 'ConversationMemberUpdate',
    // Conversation manager
    CONVERSATION_MANAGER_ADD: 'ConversationManagerAdd',
    CONVERSATION_MANAGER_DELETE: 'ConversationManagerDelete',
    // Message
    MESSAGE_NEW: 'MessageNew',
    MESSAGE_NEW_CHANNEL: 'MessageNewChannel',
    MESSAGE_DELETE: 'MessageDelete',
    MESSAGE_REACT_ADD: 'MessageReactAdd',
    MESSAGE_VIEW_LAST: 'MessageViewLast',
    // Pin messsage
    MESSAGE_PIN_ADD: 'MessagePinAdd',
    MESSAGE_PIN_DELETE: 'MessagePinDelete',
    // Poll
    POLL_OPTION_UPDATE: 'PollOptionUpdate',
    POLL_CHOOSE_UPDATE: 'PollChooseUpdate',
};

module.exports = {
    On,
    Emit,
};
