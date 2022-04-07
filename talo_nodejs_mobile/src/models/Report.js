const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { TypeReport } = require('../lib/Constants');

const reportSchema = new mongoose.Schema(
    {
        userId: { type: ObjectId, ref: 'User' },
        type: { type: String, enum: TypeReport },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        conversationIsReport: { type: ObjectId, ref: 'Conversation' },
        userIsReport: { type: ObjectId, ref: 'User' },
    },
    { timestamps: true, versionKey: false }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
