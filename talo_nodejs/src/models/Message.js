const mongoose = require('mongoose');
const { TypeMessage, TypeReacts, ErrorType } = require('../lib/Constants');
const NotFoundError = require('../exceptions/NotFoundError');
const ObjectId = mongoose.Types.ObjectId;

const messageSchema = new mongoose.Schema(
    {
        userId: { type: ObjectId, ref: 'User' },
        handledUserIds: {
            type: [{ type: ObjectId, ref: 'User' }],
            default: [],
        },
        content: {
            type: String,
            require: true,
        },
        tags: {
            type: [{ type: ObjectId, ref: 'User' }],
            default: [],
        },
        replyMessageId: ObjectId,
        type: {
            type: String,
            enum: TypeMessage,
            require: true,
        },
        reacts: {
            type: [
                {
                    userId: { type: ObjectId, ref: 'User' },
                    type: {
                        type: String,
                        enum: TypeReacts,
                    },
                    _id: false,
                },
            ],
            default: [],
        },
        pollId: { type: ObjectId, ref: 'Poll' },
        deletedUserIds: {
            type: [{ type: ObjectId, ref: 'User' }],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        conversationId: { type: ObjectId, ref: 'Conversation' },
        channelId: { type: ObjectId, ref: 'Channel' },
    },
    { timestamps: true }
);

messageSchema.index({ content: 'text' });

messageSchema.statics.findByIdAndChannelId = async (_id, channelId) => {
    const messageResult = await Message.findOne({
        _id,
        channelId,
    }).lean();

    if (!messageResult) throw new NotFoundError(ErrorType.MESSAGE_NOT_FOUND);

    return messageResult;
};

messageSchema.statics.findByIdAndConversationId = async (
    _id,
    conversationId
) => {
    const messageResult = await Message.findOne({
        _id,
        conversationId,
    }).lean();

    if (!messageResult) throw new NotFoundError(ErrorType.MESSAGE_NOT_FOUND);

    return messageResult;
};

messageSchema.statics.findByTypeAndConversationId = async (
    type,
    conversationId,
    userId,
    skip,
    limit
) => {
    const files = await Message.find(
        {
            conversationId,
            type,
            isDeleted: false,
            deletedUserIds: { $nin: [userId] },
        },
        {
            _id: 0,
            id: '$_id',
            userId: 1,
            content: 1,
            type: 1,
            createdAt: 1,
        }
    )
        .skip(skip)
        .limit(limit);

    return files;
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
