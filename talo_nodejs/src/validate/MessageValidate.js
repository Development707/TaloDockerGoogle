const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Channel = require('../models/Channel');

const CustomError = require('../exceptions/CustomError');
const NotFoundError = require('../exceptions/NotFoundError');
const ForbidError = require('../exceptions/ForbidError');
const {
    ErrorType,
    Permission,
    TypeMessageText,
    TypeReacts,
    TypeImage,
    TypeVideo,
    TypeDocument,
} = require('../lib/Constants');
const ObjectId = require('mongoose').Types.ObjectId;

const MessageValidate = {
    validateMessage: (message) => {
        if (!message) throw new NotFoundError(ErrorType.MESSAGE_NOT_FOUND);
    },

    validateTextMessage: async function (userId, message) {
        const {
            content,
            type,
            replyMessageId,
            tags,
            conversationId,
            channelId,
        } = message;
        // Valid
        if (!type || !TypeMessageText.includes(type))
            throw new CustomError(ErrorType.MESSAGE_TYPE_INVALID);
        if (!content) throw new CustomError(ErrorType.MESSAGE_CONTENT_MISSING);
        // check tag
        let userIds = [];
        if (tags && Array.isArray(tags)) {
            userIds = [...new Set(tags)];
            for (let userId of userIds) {
                this.validateTag(userId);
            }
        }
        userIds.push(userId);
        await Conversation.existsByUserIds(conversationId, userIds);
        // Check channel
        if (channelId) {
            this.validateChannel(channelId);
            await Channel.findByIdAndConversationId(channelId, conversationId);
        }
        // check replyMessageId
        if (replyMessageId) {
            this.validateReplymessage(replyMessageId);
            if (channelId)
                await Message.findByIdAndChannelId(replyMessageId, channelId);
            else
                await Message.findByIdAndConversationId(
                    replyMessageId,
                    conversationId,
                );
        }
    },

    validateFileMessage: async function (
        file,
        type,
        conversationId,
        channelId,
    ) {
        if (!file) throw new NotFoundError(ErrorType.FILE_NOT_FOUND);

        switch (type) {
            case 'IMAGE':
                if (!TypeImage.includes(file.mimetype))
                    throw new CustomError(ErrorType.MESSAGE_TYPE_FILE_INVALID);
                break;
            case 'VIDEO':
                if (!TypeVideo.includes(file.mimetype))
                    throw new CustomError(ErrorType.MESSAGE_TYPE_FILE_INVALID);
                break;
            case 'FILE':
                if (!TypeDocument.includes(file.mimetype))
                    throw new CustomError(ErrorType.MESSAGE_TYPE_FILE_INVALID);
                break;
            default:
                throw new CustomError(ErrorType.MESSAGE_TYPE_INVALID);
        }
        if (channelId) {
            this.validateChannel(channelId);
            await Channel.findByIdAndConversationId(channelId, conversationId);
        }
    },

    validateUnsend: function (message, userId) {
        this.validateMessage(message);
        if (
            message.userId != userId ||
            message.type === 'NOTIFY' ||
            message.type === 'VOTE'
        )
            throw new ForbidError(Permission.MESSAGE_PERMISSION_DENIED);
    },

    validateReact: function (message, type, userId) {
        if (!TypeReacts.includes(type))
            throw new CustomError(ErrorType.MESSAGE_REACT_INVALID);
        this.validateMessage(message);
        const { isDeleted, deletedUserIds } = message;
        if (isDeleted || deletedUserIds.includes(userId))
            throw new CustomError(ErrorType.MESSAGE_IS_DELETED);
    },

    validateTypeForward: function (type) {
        if (type === 'NOTIFY' || type === 'VOTE')
            throw new CustomError(ErrorType.MESSAGE_TYPE_INVALID);
    },

    validatePinMessage: function (pinMessageIds, messageId) {
        if (
            pinMessageIds.findIndex(
                (pinMessageId) => pinMessageId + '' == messageId,
            ) != -1 ||
            pinMessageIds.length >= 3
        )
            throw new CustomError(ErrorType.MESSAGE_PIN_INVALID);
    },

    validateRemovePinMessage: function (pinMessageIds, messageId) {
        if (
            pinMessageIds.findIndex(
                (pinMessageId) => pinMessageId + '' == messageId,
            ) == -1
        )
            throw new CustomError(ErrorType.MESSAGE_PIN_INVALID);
    },

    validatePoll: function (question, options) {
        if (!question || question.length > 500)
            throw new CustomError(ErrorType.MESSAGE_QUESTION_MISSING);
        if (!options || options.length < 2)
            throw new CustomError(ErrorType.MESSAGE_OPTIONS_INVALID);
    },

    vliadteAddOptions: function (message, options) {
        if (!options || options.length === 0 || !Array.isArray(options))
            throw new CustomError(ErrorType.MESSAGE_OPTIONS_INVALID);
        this.validateMessage(message);
        if (message.type !== 'VOTE')
            throw new CustomError(ErrorType.MESSAGE_TYPE_INVALID);
    },

    validatePageSize: (page, size) => {
        if (page < 0 || size <= 0)
            throw new CustomError(ErrorType.MESSAGE_PARAMETER_INVALID);
    },

    validateChannel: (channel) => {
        if (!channel) throw new NotFoundError(ErrorType.CHANNEL_NOT_FOUND);
    },

    validateTag: (id) => {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.CHANNEL_TAG_INVALID);
        }
    },

    validateReplymessage: (id) => {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.CHANNEL_REPLYMESSAGE_INVALID);
        }
    },

    validateTypeFiles: (type) => {
        if (['IMAGE', 'VIDEO', 'FILE', 'ALL'].indexOf(type) === -1)
            throw new CustomError(ErrorType.MESSAGE_TYPE_INVALID);
    },
};

module.exports = MessageValidate;
