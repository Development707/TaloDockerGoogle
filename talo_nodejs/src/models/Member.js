const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { ErrorType } = require('../lib/Constants');
const NotFoundError = require('../exceptions/NotFoundError');

const memberSchema = new mongoose.Schema({
    conversationId: { type: ObjectId, ref: 'Conversation' },
    userId: { type: ObjectId, ref: 'User' },
    lastView: {
        type: Date,
        default: new Date(),
    },
    name: String,
    lastViewOfChannels: [
        {
            channelId: { type: ObjectId, ref: 'Channel' },
            lastView: Date,
            _id: false,
        },
    ],
    isNotify: {
        type: Boolean,
        default: true,
    },
});

memberSchema.statics.findByConversationIdAndUserId = async (
    conversationId,
    userId,
) => {
    const member = await Member.findOne({
        conversationId,
        userId,
    });

    if (!member) throw new NotFoundError(ErrorType.MEMBER_NOT_FOUND);

    return member;
};

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
