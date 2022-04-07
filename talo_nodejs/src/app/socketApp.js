const redisUtils = require('../utils/redisUtils');
const MemberService = require('../services/MemberService');
const { On, Emit } = require('../lib/ConstantsSocket');
const { Notification } = require('../lib/Constants');
const chalk = require('chalk');

const socket = (io) => {
    io.on(On.TALO_CONNECTION, (socket) => {
        socket.on('message', (message) => console.log(message));

        socket.on('disconnect', async () => {
            const userId = socket.userId;
            if (userId)
                await redisUtils.updateUserOnline(userId, false, new Date());
        });

        socket.on(On.USER_OFFLINE, async (userId) => {
            if (userId)
                await redisUtils.updateUserOnline(userId, false, new Date());
        });

        socket.on(On.USER_ONLINE, async (userId) => {
            socket.userId = userId;
            socket.join(userId);
            await redisUtils.updateUserOnline(socket.userId, true, null);
        });

        socket.on(On.CONVERSATIONS_JOIN, (conversationIds) => {
            conversationIds.forEach((id) => socket.join(id));
        });

        socket.on(On.CONVERSATION_JOIN, (conversationId) => {
            socket.join(conversationId);
        });

        socket.on(On.CONVERSATION_LEFT, (conversationId) => {
            socket.leave(conversationId);
        });

        socket.on(On.CONVERSATION_USER_TYPING, (conversationId, userId) => {
            socket.broadcast
                .to(conversationId)
                .emit(Emit.CONVERSATION_TYPING, conversationId, userId);
        });

        socket.on(
            On.CONVERSATION_USER_TYPING_FINISH,
            (conversationId, userId) => {
                socket.broadcast
                    .to(conversationId)
                    .emit(
                        Emit.CONVERSATION_TYPING_FINISH,
                        conversationId,
                        userId,
                    );
            },
        );

        socket.on(On.USER_GET_STATUS, async (userId, callback) => {
            const user = await redisUtils.getUserOnline(userId);
            if (user)
                callback({
                    isOnline: user.isOnline,
                    lastLogin: user.lastLogin,
                });
        });

        socket.on(
            On.CONVERSATION_VIDEO_CALL_JOIN,
            ({ conversationId, userId, peerId }) => {
                socket.join(On.TALO_CALL + conversationId);
                socket.broadcast
                    .to(On.TALO_CALL + conversationId)
                    .emit(Emit.CONVERSATION_VIDEO_CALL_JOIN, {
                        conversationId,
                        userId,
                        peerId,
                    });
            },
        );

        socket.on(
            On.CONVERSATIONS_CHANNEL_VIEW_LAST,
            async (conversationId, channelId) => {
                const { userId } = socket;
                try {
                    if (channelId) {
                        await MemberService.updateLastViewByChannelId(
                            conversationId,
                            userId,
                            channelId,
                        );
                        socket.to(conversationId).emit(Emit.MESSAGE_VIEW_LAST, {
                            conversationId,
                            channelId,
                            userId,
                            lastView: new Date(),
                        });
                    } else {
                        await MemberService.updateLastView(
                            conversationId,
                            userId,
                        );
                        socket.to(conversationId).emit(Emit.MESSAGE_VIEW_LAST, {
                            conversationId,
                            userId,
                            lastView: new Date(),
                        });
                    }
                } catch (error) {
                    console.error(
                        chalk.bgRed(Notification.SOCKET_IO_ERROR),
                        error.message,
                    );
                }
            },
        );
    });
};

module.exports = socket;
