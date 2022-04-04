const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const classifySchema = new mongoose.Schema(
    {
        name: String,
        conversationIds: [{ type: ObjectId, ref: 'Conversation' }],
        color: {
            type: String,
            required: true,
        },
        userId: { type: ObjectId, ref: 'User' },
    },
    { versionKey: false }
);

const Classify = mongoose.model('Classify', classifySchema);

module.exports = Classify;
