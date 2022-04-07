const redisApp = require('../app/redisApp');
const chalk = require('chalk');
const { Key, Notification } = require('../lib/Constants');

const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Member = require('../models/Member');
const Channel = require('../models/Channel');
const Sticker = require('../models/Sticker');

const redisUtils = {
    cleanAll: async function () {
        try {
            await redisApp.cleanAll();
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    sizeDb: async function () {
        return await redisApp.sizeDb();
    },

    // USER
    getUserProfile: async function (userId) {
        try {
            if (!(await redisApp.exists(Key.REDIS_PROFILE, userId)))
                await redisApp.add(
                    Key.REDIS_PROFILE,
                    userId + '',
                    await User.findByIdIsActive(userId),
                );
            return await redisApp.get(Key.REDIS_PROFILE, userId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await User.findByIdIsActive(userId);
        }
    },
    updateUserOnline: async function (userId, isOnline, lastLogin) {
        let user = await this.getUserProfile(userId);
        try {
            user.isOnline = isOnline || false;
            user.lastLogin = lastLogin || null;
            await redisApp.add(Key.REDIS_PROFILE, userId + '', user);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    getShortUserInfo: async function (userId) {
        const { name, avatar } = await this.getUserProfile(userId);
        return { id: userId, name, avatar };
    },
    getUserOnline: async function (userId) {
        const {
            username,
            name,
            avatar,
            isOnline = false,
            lastLogin = null,
        } = await this.getUserProfile(userId);
        return { id: userId, username, name, avatar, isOnline, lastLogin };
    },
    removeProfile: async function (userId) {
        try {
            if (await redisApp.exists(Key.REDIS_PROFILE, userId))
                await redisApp.remove(Key.REDIS_PROFILE, userId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    removeAllProfiles: async function () {
        try {
            await redisApp.removeByKey(Key.REDIS_PROFILE);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    getAllUser: async function () {
        try {
            return await redisApp.getAll(Key.REDIS_PROFILE);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return [];
        }
    },

    // CONVERSATION
    getConversation: async function (conversationId) {
        try {
            if (
                !(await redisApp.exists(Key.REDIS_CONVERSATION, conversationId))
            )
                await redisApp.add(
                    Key.REDIS_CONVERSATION,
                    conversationId + '',
                    await Conversation.findById(conversationId).lean(),
                );
            return await redisApp.get(Key.REDIS_CONVERSATION, conversationId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await Conversation.findById(conversationId).lean();
        }
    },
    getShortConversationInfo: async function (conversationId) {
        const conversation = await this.getConversation(conversationId);
        if (!conversation) return conversation;
        let { name, avatar, members } = conversation;
        members = await Promise.all(
            members.map((member) => {
                return this.getShortUserInfo(member);
            }),
        );
        return { id: conversationId, name, avatar, members };
    },
    removeConversation: async function (conversationId) {
        try {
            if (await redisApp.exists(Key.REDIS_CONVERSATION, conversationId))
                await redisApp.remove(Key.REDIS_CONVERSATION, conversationId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    removeAllConversations: async function () {
        try {
            await redisApp.removeByKey(Key.REDIS_CONVERSATION);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    getAllConversations: async function () {
        try {
            return await redisApp.getAll(Key.REDIS_CONVERSATION);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return [];
        }
    },

    // MEMBER
    getMember: async function (memberId) {
        try {
            if (!(await redisApp.exists(Key.REDIS_MEMBER, memberId)))
                await redisApp.add(
                    Key.REDIS_MEMBER,
                    memberId + '',
                    await Member.findById(memberId).lean(),
                );
            return await redisApp.get(Key.REDIS_MEMBER, memberId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await Member.findById(memberId).lean();
        }
    },
    removeMember: async function (memberId) {
        try {
            if (await redisApp.exists(Key.REDIS_MEMBER, memberId))
                await redisApp.remove(Key.REDIS_MEMBER, memberId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    removeAllMembers: async function () {
        try {
            await redisApp.removeByKey(Key.REDIS_MEMBER);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },

    // CHANNEL
    getChannel: async function (channelId) {
        try {
            if (!(await redisApp.exists(Key.REDIS_CHANNEL, channelId)))
                await redisApp.add(
                    Key.REDIS_CHANNEL,
                    channelId + '',
                    await Channel.findById(channelId).lean(),
                );
            return await redisApp.get(Key.REDIS_CHANNEL, channelId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await Channel.findById(channelId).lean();
        }
    },
    removeChannel: async function (channelId) {
        try {
            if (await redisApp.exists(Key.REDIS_CHANNEL, channelId))
                await redisApp.remove(Key.REDIS_CHANNEL, channelId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    removeAllChannels: async function () {
        try {
            await redisApp.removeByKey(Key.REDIS_CHANNEL);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },

    // STICKER
    getAllSticker: async function () {
        try {
            return await redisApp.getAll(Key.REDIS_STICKER);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await Sticker.find().lean();
        }
    },
    addSticker: async function (sticker) {
        try {
            await redisApp.add(Key.REDIS_STICKER, sticker._id + '', sticker);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    getSticker: async function (stickerId) {
        try {
            if (!(await redisApp.exists(Key.REDIS_STICKER, stickerId)))
                await redisApp.add(
                    Key.REDIS_STICKER,
                    stickerId + '',
                    await Sticker.findById(stickerId).lean(),
                );
            return await redisApp.get(Key.REDIS_STICKER, stickerId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
            return await Sticker.findById(stickerId).lean();
        }
    },
    removeSticker: async function (stickerId) {
        try {
            if (await redisApp.exists(Key.REDIS_STICKER, stickerId))
                await redisApp.remove(Key.REDIS_STICKER, stickerId);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
    removeAllSticker: async function () {
        try {
            await redisApp.removeByKey(Key.REDIS_STICKER);
        } catch (error) {
            console.error(chalk.bgRed(Notification.REDIS_ERROR), error.message);
        }
    },
};

module.exports = redisUtils;
