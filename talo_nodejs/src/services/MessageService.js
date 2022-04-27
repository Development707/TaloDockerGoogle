const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Poll = require('../models/Poll');
const MemberService = require('../services/MemberService');

const { uploadFileToCloud } = require('../middlewares/uploadFile');
const MessageValidate = require('../validate/MessageValidate');
const ConversationValidate = require('../validate/ConversationValidate');
const redisUtils = require('../utils/redisUtils');
const messageUtils = require('../utils/messageUtils');
const commonUtils = require('../utils/commonUtils');
const dateUtils = require('../utils/dateUtils');
const ObjectId = require('mongoose').Types.ObjectId;

class MessageService {
    async countUnread(time, conversationId) {
        return await Message.countDocuments({
            createdAt: { $gt: time },
            conversationId,
        });
    }

    // ipnut message = { content, type, conversationId, userId, manipulatedUserIds,... }
    // Return message
    async addText(userId, message, autoUpdate = true) {
        await MessageValidate.validateTextMessage(userId, message);

        const { channelId, conversationId } = message;
        if (channelId) delete message.conversationId;

        const saveMessage = await new Message({
            ...message,
            userId,
        }).save();
        if (autoUpdate)
            return this.updateNewMessage(saveMessage, conversationId, userId);
        return saveMessage;
    }

    async updateNewMessage(saveMessage, conversationId, userId) {
        const { _id, channelId } = saveMessage;

        if (channelId) {
            await MemberService.updateLastViewByChannelId(
                conversationId,
                userId,
                channelId,
            );
        } else {
            await this.updateLastMessage(conversationId, _id);

            await MemberService.updateLastView(conversationId, userId);
        }

        const { type } = await redisUtils.getConversation(conversationId + '');

        return await this.getById(_id, type);
    }

    async updateLastMessage(_id, lastMessageId) {
        await Conversation.updateOne({ _id }, { lastMessageId });
        await redisUtils.removeConversation(_id);
    }

    async getById(id, type) {
        const message = await Message.findById(id).lean();
        return this.getByMessage(message, type);
    }

    async getByMessage(message, type) {
        MessageValidate.validateMessage(message);

        message.reacts = await Promise.all(
            message.reacts.map(async (react) => {
                return {
                    userId: await redisUtils.getShortUserInfo(react.userId),
                    type: react.type,
                };
            }),
        );

        message.tags = await Promise.all(
            message.tags.map(async (tag) => {
                return await redisUtils.getShortUserInfo(tag);
            }),
        );

        switch (type) {
            case 'GROUP':
                // _id, manipulatedUserIds, content, tags, type, deletedUserIds, reacts, options, createdAt, user
                // UserId
                message.userId = await redisUtils.getShortUserInfo(
                    message.userId,
                );
                // Reply
                if (message.replyMessageId) {
                    message.replyMessageId = await Message.findById(
                        message.replyMessageId,
                    ).lean();
                    message.replyMessageId.userId =
                        await redisUtils.getShortUserInfo(
                            message.replyMessageId.userId + '',
                        );
                }
                // Get Manipulated  - option redis
                message.manipulatedUserIds = await Promise.all(
                    message.manipulatedUserIds.map(async (userId) => {
                        try {
                            return await redisUtils.getShortUserInfo(userId);
                        } catch (error) {
                            return {
                                id: userId,
                                name: 'Talo User',
                                avatar: {},
                            };
                        }
                    }),
                );
                if (message.pollId) {
                    let poll = await Poll.findById(message.pollId)
                        .select('-_id question options')
                        .lean();
                    for (let option of poll.options) {
                        option.userIds = await Promise.all(
                            option.userIds.map(async (userId) => {
                                return redisUtils.getShortUserInfo(userId);
                            }),
                        );
                    }
                    message.pollId = poll;
                }
                return messageUtils.convertMessageOfGroup(message);
            case 'DUAL':
                // Reply
                if (message.replyMessageId) {
                    message.replyMessageId = await Message.findById(
                        message.replyMessageId,
                    ).lean();
                    message.replyMessageId.userId =
                        await redisUtils.getShortUserInfo(
                            message.replyMessageId.userId + '',
                        );
                }
                // Member
                message.conversationId = await redisUtils.getConversation(
                    message.conversationId + '',
                );
                message.conversationId.members = await Promise.all(
                    message.conversationId.members.map(async (memberId) => {
                        return await redisUtils.getShortUserInfo(memberId + '');
                    }),
                );
                return messageUtils.convertMessageDual(message);
            case 'SINGLE':
                // Reply
                if (message.replyMessageId) {
                    message.replyMessageId = await Message.findById(
                        message.replyMessageId,
                    ).lean();
                    message.replyMessageId.userId =
                        await redisUtils.getShortUserInfo(
                            message.replyMessageId.userId + '',
                        );
                }
                return messageUtils.convertMessageDual(message);
            default:
                return null;
        }
    }

    async deleteByConversationId(conversationId) {
        return await Message.deleteMany({ conversationId });
    }

    async deleteByConversationIdAndUserId(conversationId, userId) {
        redisUtils.removeConversation(conversationId);
        return await Message.updateMany(
            { conversationId, deletedUserIds: { $nin: [userId] } },
            { $push: { deletedUserIds: userId } },
        );
    }

    async findByConversationId(conversationId, userId, page, size) {
        MessageValidate.validatePageSize(page, size);
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        // Pagination
        const totalMessages = await Message.countDocuments({
            conversationId,
            deletedUserIds: {
                $nin: [userId],
            },
        });
        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            totalMessages,
        );
        //  Find message
        let messages = await Message.aggregate([
            {
                $match: {
                    conversationId: ObjectId(conversationId),
                    deletedUserIds: {
                        $nin: [ObjectId(userId)],
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);
        messages = await Promise.all(
            messages.map(async (message) => {
                return this.getByMessage(message, conversation.type);
            }),
        );
        // Update last view
        await MemberService.updateLastView(conversationId, userId);

        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }

    async findByChannelId(channelId, userId, page, size) {
        // Validate channel
        MessageValidate.validatePageSize(page, size);
        ConversationValidate.validateId(channelId);
        const channel = await redisUtils.getChannel(channelId);
        MessageValidate.validateChannel(channel);
        // Validate conversation
        const { conversationId } = channel;
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        // Pagination
        const totalMessages = await Message.countDocuments({
            channelId,
            deletedUserIds: {
                $nin: [userId],
            },
        });
        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            totalMessages,
        );
        //  Find message
        let messages = await Message.aggregate([
            {
                $match: {
                    channelId: ObjectId(channelId),
                    deletedUserIds: {
                        $nin: [ObjectId(userId)],
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $sort: {
                    createdAt: 1,
                },
            },
        ]);
        messages = await Promise.all(
            messages.map(async (message) => {
                return this.getByMessage(message, conversation.type);
            }),
        );
        // Update last view
        await MemberService.updateLastView(conversationId, userId);

        return {
            data: messages,
            page,
            size,
            totalPages,
            conversationId,
        };
    }

    async findFiles(
        conversationId,
        userId,
        type,
        userIdSend,
        startTime,
        endTime,
    ) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        MessageValidate.validateTypeFiles(type);
        // Find all files
        if (type === 'ALL') {
            const promises = await Promise.all([
                Message.findByTypeAndConversationId(
                    'IMAGE',
                    conversationId,
                    userId,
                    0,
                    12,
                ),
                Message.findByTypeAndConversationId(
                    'VIDEO',
                    conversationId,
                    userId,
                    0,
                    12,
                ),
                Message.findByTypeAndConversationId(
                    'FILE',
                    conversationId,
                    userId,
                    0,
                    12,
                ),
            ]);
            return {
                images: promises[0],
                videos: promises[1],
                files: promises[2],
            };
        }
        // Find by type files
        const query = {
            conversationId,
            isDeleted: false,
            type,
            deletedUserIds: { $nin: [userId] },
        };
        if (userIdSend) {
            ConversationValidate.validateConversation(conversation, userIdSend);
            query.userId = userIdSend;
        }
        if (startTime && endTime) {
            const startDate = dateUtils.toDate(startTime);
            const endDate = dateUtils.toDate(endTime);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        return await Message.find(query, {
            userId: 1,
            content: 1,
            type: 1,
            createdAt: 1,
        }).lean();
    }

    async addFile(conversationId, type, file, userId, channelId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        await MessageValidate.validateFileMessage(
            file,
            type,
            conversationId,
            channelId,
        );

        // Upload file
        let content;
        switch (type) {
            case 'IMAGE':
                content = await uploadFileToCloud(
                    process.env.CLOUD_BUCKET_GROUP_IMAGE,
                    file,
                );
                break;
            case 'VIDEO':
                content = await uploadFileToCloud(
                    process.env.CLOUD_BUCKET_GROUP_VIDEO,
                    file,
                );
                break;
            case 'FILE':
                content = await uploadFileToCloud(
                    process.env.CLOUD_BUCKET_GROUP_FILE,
                    file,
                );
                break;
            default:
                break;
        }
        // Add message

        let message = {
            userId,
            content,
            type,
        };
        if (channelId) {
            message.channelId = channelId;
        } else message.conversationId = conversationId;
        message = await new Message({
            ...message,
            userId,
        }).save();
        return this.updateNewMessage(message, conversationId, userId);
    }

    // return conversationId, channelId, user
    async reactById(id, type, userId) {
        // Check message
        const message = await Message.findById(id);
        MessageValidate.validateReact(message, type, userId);
        const { channelId } = message;
        // Check conversation exist user
        let result = {
            conversationId: message.conversationId,
            channelId,
        };
        if (channelId) {
            const channel = await redisUtils.getChannel(channelId);
            result.conversationId = channel.conversationId;
        }
        const conversation = await redisUtils.getConversation(
            result.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);
        // React
        message.reacts.pull({ userId });
        await message.save();
        message.reacts.push({ userId, type });
        await message.save();
        result.user = await redisUtils.getShortUserInfo(userId);

        return result;
    }

    async forwardById(id, conversationId, userId) {
        // Check conversation exist user
        let conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        //  Check message
        const message = await Message.findById(id).lean();
        MessageValidate.validateMessage(message);
        conversation = await redisUtils.getConversation(message.conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        MessageValidate.validateTypeForward(message.type);
        //  Forward message
        const saveMessage = await new Message({
            userId,
            content: message.content,
            type: message.type,
            conversationId,
        }).save();

        return await this.updateNewMessage(saveMessage, conversationId, userId);
    }

    // return conversationId, channelId
    async unsendById(id, userId) {
        // Unsend
        const message = await Message.findById(id);
        MessageValidate.validateUnsend(message, userId);
        message.isDeleted = true;
        message.save();
        // Result
        const { channelId } = message;
        let result = {
            conversationId: message.conversationId,
            channelId,
        };
        if (channelId) {
            const channel = await redisUtils.getChannel(channelId);
            result.conversationId = channel.conversationId;
        }

        return result;
    }

    async unsendJustMeById(id, userId) {
        const message = await Message.findById(id);
        MessageValidate.validateMessage(message);

        if (message.isDeleted) return;
        message.deletedUserIds.addToSet(userId);
        await message.save();
    }
}

module.exports = new MessageService();
