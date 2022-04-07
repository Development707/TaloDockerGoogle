const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Poll = require('../models/Poll');
const ObjectId = require('mongoose').Types.ObjectId;

const MessageService = require('../services/MessageService');

const redisUtils = require('../utils/redisUtils');
const commonUtils = require('../utils/commonUtils');
const ConversationValidate = require('../validate/ConversationValidate');
const MessageValidate = require('../validate/MessageValidate');
const { Notification } = require('../lib/Constants');

class PollService {
    async findByConversationId(conversationId, page, size, userId) {
        // Check valid
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        MessageValidate.validatePageSize(page, size);
        ConversationValidate.validateIsGroup(conversation.type);
        // Pagination
        const total = await Message.countDocuments({
            conversationId,
            type: 'VOTE',
            deletedUserIds: {
                $nin: [ObjectId(userId)],
            },
        });
        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            total,
        );
        // Get data
        let messages = await Message.aggregate([
            {
                $match: {
                    conversationId: ObjectId(conversationId),
                    type: 'VOTE',
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
                return MessageService.getByMessage(message, conversation.type);
            }),
        );

        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }

    async addPoll(conversationId, body, userId) {
        // Check valid
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        ConversationValidate.validateIsGroup(conversation.type);
        const { question, options } = body;
        MessageValidate.validatePoll(question, options);
        let content = body.content;
        if (!content) content = question;
        // Create poll
        const poll = await new Poll({
            userId,
            question,
            options: options.map((option) => {
                return {
                    name: option,
                    userIds: [],
                };
            }),
        }).save();
        // Add message
        const message = await new Message({
            userId,
            content,
            type: 'VOTE',
            pollId: poll,
            conversationId,
        }).save();

        return await MessageService.updateNewMessage(
            message,
            conversationId,
            userId,
        );
    }

    async addOptions(messageId, body, userId) {
        // Check messsage
        const message = await Message.findById(messageId).lean();
        MessageValidate.vliadteAddOptions(message, body);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);

        const options = [...new Set(body)];
        const poll = await Poll.findById(message.pollId);
        for (let option of options) {
            poll.options.addToSet({
                name: option,
                userIds: [],
            });
        }
        await poll.save();
        return await MessageService.getById(messageId, conversation.type);
    }

    async deleteOptions(messageId, body, userId) {
        // Check messsage
        const message = await Message.findById(messageId).lean();
        MessageValidate.vliadteAddOptions(message, body);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);

        const options = [...new Set(body)];
        const poll = await Poll.findById(message.pollId);
        poll.options = poll.options.filter((op) => !options.includes(op.name));
        await poll.save();
        return await MessageService.getById(messageId, conversation.type);
    }

    async addChoose(messageId, body, userId) {
        // Check messsage
        const message = await Message.findById(messageId).lean();
        MessageValidate.vliadteAddOptions(message, body);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);

        const options = [...new Set(body)];
        const poll = await Poll.findById(message.pollId);
        poll.options = poll.options.map((op) => {
            const { name, userIds } = op;

            if (options.includes(name) && !userIds.includes(userId))
                userIds.push(userId);

            return {
                name,
                userIds,
            };
        });
        await poll.save();
        return await MessageService.getById(messageId, conversation.type);
    }

    async deleteChoose(messageId, body, userId) {
        // Check messsage
        const message = await Message.findById(messageId).lean();
        MessageValidate.vliadteAddOptions(message, body);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);

        const options = [...new Set(body)];
        const poll = await Poll.findById(message.pollId);
        poll.options = poll.options.map((op) => {
            const { name, userIds } = op;

            const index = userIds.findIndex((user) => user == userId);
            if (options.includes(name) && index !== -1)
                userIds.splice(index, 1);

            return {
                name,
                userIds,
            };
        });
        await poll.save();
        return await MessageService.getById(messageId, conversation.type);
    }
}

module.exports = new PollService();
