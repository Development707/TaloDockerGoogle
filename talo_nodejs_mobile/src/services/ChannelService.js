const Channel = require('../models/Channel');
const Member = require('../models/Member');
const Message = require('../models/Message');
const ObjectId = require('mongoose').Types.ObjectId;
const MessageService = require('../services/MessageService');

const redisUtils = require('../utils/redisUtils');
const ConversationValidate = require('../validate/ConversationValidate');
const ChannelValidate = require('../validate/ChannelValidate');
const { Notification } = require('../lib/Constants');

class ChannelService {
    async findByConversationId(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);

        let channels = await Channel.find({ conversationId }).lean();

        for (let i in channels) {
            channels[i] = await this.findChannelById(channels[i]._id);
            channels[i].numberUnread = await this.getNumberUnread(
                conversationId,
                channels[i].id,
                userId,
            );
        }

        return channels;
    }

    async getNumberUnread(conversationId, channelId, userId) {
        const member = await Member.findOne({
            conversationId,
            userId,
        });

        const { lastViewOfChannels } = member;
        const index = lastViewOfChannels.indexOf(channelId + '');

        if (index !== -1) {
            const { lastView } = lastViewOfChannels[index];

            return await Message.countDocuments({
                createdAt: { $gt: lastView },
                channelId,
            });
        } else return await Message.countDocuments({ channelId });
    }

    // Return message, channel
    async addChannel(conversationId, body, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateIsGroup(conversation.type);
        ConversationValidate.validateConversation(conversation, userId);
        const { name, description = '' } = body;
        ChannelValidate.validateAddChannel(name, description);
        // Create channel
        const channel = await new Channel({
            name,
            description,
            conversationId,
        }).save();
        await Member.updateMany(
            { conversationId },
            {
                $push: {
                    lastViewOfChannels: {
                        channelId: channel._id,
                        lastView: new Date(),
                    },
                },
            },
        );
        // New message
        const message = await MessageService.addText(userId, {
            userId,
            content: Notification.ADD_CHANNEL,
            type: 'NOTIFY',
            conversationId,
        });

        return {
            channel: await this.findChannelById(channel._id),
            message,
        };
    }

    // Return message, channel
    async updateChannel(channelId, body, userId) {
        // Check channel
        ChannelValidate.validateId(channelId);
        const channel = await redisUtils.getChannel(channelId);
        ChannelValidate.validateExistChannel(channel);
        // Check conversation
        const conversation = await redisUtils.getConversation(
            channel.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);
        // Check body
        const { name, description = '' } = body;
        ChannelValidate.validateAddChannel(name, description);
        // Update channel
        if (description.length > 0)
            await Channel.updateOne({ _id: channelId }, { name, description });
        else await Channel.updateOne({ _id: channelId }, { name });
        redisUtils.removeChannel(channelId);
        // New message
        const message = await MessageService.addText(userId, {
            userId,
            content: Notification.CHANGE_CHANNEL,
            type: 'NOTIFY',
            conversationId: channel.conversationId,
        });

        return {
            channel: await this.findChannelById(channel._id),
            message,
        };
    }

    // Return conversationId, message
    async deleteChannel(channelId, userId) {
        // Check channel
        ChannelValidate.validateId(channelId);
        const channel = await redisUtils.getChannel(channelId);
        ChannelValidate.validateExistChannel(channel);
        // Check conversation
        const conversation = await redisUtils.getConversation(
            channel.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);
        // Update channel
        await Channel.deleteOne({ _id: channelId });
        await Member.updateMany(
            { conversationId: channel.conversationId },
            { $pull: { lastViewOfChannels: { channelId } } },
        );
        redisUtils.removeChannel(channelId);
        redisUtils.removeAllMembers();
        // New message
        const message = await MessageService.addText(userId, {
            userId,
            content: Notification.REMOVE_CHANNEL,
            type: 'NOTIFY',
            conversationId: channel.conversationId,
        });

        return { conversationId: channel.conversationId, message };
    }

    async findChannelById(channelId) {
        let channel = await redisUtils.getChannel(channelId);
        channel.id = channel._id;
        delete channel._id;
        delete channel.updatedAt;
        delete channel.__v;
        return channel;
    }

    async deleteByConversationId(conversationId) {
        redisUtils.removeAllChannels().then();
        return await Channel.deleteMany({ conversationId });
    }

    // Return userInfo, lastView
    async getViewLast(channelId, userId) {
        ChannelValidate.validateId(channelId);
        const channel = await redisUtils.getChannel(channelId);
        ChannelValidate.validateExistChannel(channel);
        // Check conversation
        const conversation = await redisUtils.getConversation(
            channel.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);

        let members = await Member.aggregate([
            {
                $match: {
                    conversationId: ObjectId(channel.conversationId),
                },
            },
            {
                $unwind: '$lastViewOfChannels',
            },
            {
                $match: {
                    'lastViewOfChannels.channelId': ObjectId(channelId),
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    lastView: '$lastViewOfChannels.lastView',
                },
            },
        ]);

        return await Promise.all(
            members.map(async (member) => {
                const user = await redisUtils.getShortUserInfo(member.userId);
                return { user, lastView: member.lastView };
            }),
        );
    }
}

module.exports = new ChannelService();
