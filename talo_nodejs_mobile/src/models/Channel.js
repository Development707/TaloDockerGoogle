const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType } = require('../lib/Constants');

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        conversationId: { type: ObjectId, ref: 'Conversation' },
    },
    { timestamps: true, versionKey: false }
);

channelSchema.statics.findByIdAndConversationId = async (
    _id,
    conversationId
) => {
    const channel = await Channel.findOne({ _id, conversationId }).lean();
    if (!channel) throw new NotFoundError(ErrorType.CHANNEL_NOT_FOUND);

    return channel;
};

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
