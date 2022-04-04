const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { TypeConversation, ErrorType } = require('../lib/Constants');
const NotFoundError = require('../exceptions/NotFoundError');

const conversationSchema = new mongoose.Schema(
    {
        name: String,
        avatar: {
            type: { url: String, name: String },
            default: {},
            _id: false,
        },
        leaderId: { type: ObjectId, ref: 'User' },
        managerIds: {
            type: [{ type: ObjectId, ref: 'User' }],
            default: [],
        },
        lastMessageId: { type: ObjectId, ref: 'Message' },
        pinMessageIds: {
            type: [{ type: ObjectId, ref: 'Message' }],
            default: [],
        },
        members: [{ type: ObjectId, ref: 'User' }],
        isJoinFromLink: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            enum: TypeConversation,
            require: true,
        },
    },
    { timestamps: true }
);

conversationSchema.index({ name: 'text' });

conversationSchema.statics.existsDualConversation = async (
    userId1,
    userId2
) => {
    return await Conversation.findOne({
        type: 'DUAL',
        members: { $all: [ObjectId(userId1), ObjectId(userId2)] },
    });
};

conversationSchema.statics.existsByUserIds = async (_id, userIds) => {
    const conversation = await Conversation.findOne({
        _id,
        members: { $all: [...userIds] },
    });

    if (!conversation)
        throw new NotFoundError(ErrorType.CONVERSATION_NOT_FOUND);

    return conversation;
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
