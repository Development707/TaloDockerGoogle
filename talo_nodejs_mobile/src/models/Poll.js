const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const pollSchema = new mongoose.Schema(
    {
        userId: { type: ObjectId, ref: 'User' },
        question: { type: String, required: true },
        options: {
            type: [
                {
                    name: { type: String, default: '' },
                    userIds: {
                        type: [{ type: ObjectId, ref: 'User' }],
                        default: [],
                    },
                    _id: false,
                },
            ],
            require: false,
        },
    },
    { timestamps: true }
);

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
