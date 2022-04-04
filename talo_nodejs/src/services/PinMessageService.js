const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const MessageService = require('../services/MessageService');

const redisUtils = require('../utils/redisUtils');
const ConversationValidate = require('../validate/ConversationValidate');
const MessageValidate = require('../validate/MessageValidate');
const { Notification } = require('../lib/Constants');

class PinMessageService {
    async findByConversationId(conversationId, userId) {
        // Check valid
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);
        const { type, pinMessageIds } = conversation;
        ConversationValidate.validateIsGroup(type);
        // Get data
        const result = await Promise.all(
            pinMessageIds.map(async (messageId) => {
                return MessageService.getById(messageId, type);
            }),
        );

        return result;
    }

    async addPinMessage(messageId, userId) {
        // Check message
        const message = await Message.findById(messageId).lean();
        MessageValidate.validateMessage(message);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);
        const { _id, type, pinMessageIds } = conversation;
        ConversationValidate.validateIsGroup(type);
        MessageValidate.validatePinMessage(pinMessageIds, messageId);

        await Conversation.updateOne(
            { _id },
            { $push: { pinMessageIds: messageId } },
        );

        const result = await MessageService.addText(userId, {
            content: Notification.MESSAGE_PIN_ADD,
            userId,
            type: 'NOTIFY',
            conversationId: _id,
        });

        return result;
    }

    async deletePinMessage(messageId, userId) {
        // Check message
        const message = await Message.findById(messageId).lean();
        MessageValidate.validateMessage(message);
        // Check user in conversation
        const conversation = await redisUtils.getConversation(
            message.conversationId,
        );
        ConversationValidate.validateConversation(conversation, userId);
        const { _id, type, pinMessageIds } = conversation;
        ConversationValidate.validateIsGroup(type);
        MessageValidate.validateRemovePinMessage(pinMessageIds, messageId);

        await Conversation.updateOne(
            { _id },
            { $pull: { pinMessageIds: messageId } },
        );

        const result = await MessageService.addText(userId, {
            content: Notification.REMOVE_PIN_MESSAGE,
            userId,
            type: 'NOTIFY',
            conversationId: _id,
        });

        return result;
    }
}

module.exports = new PinMessageService();
