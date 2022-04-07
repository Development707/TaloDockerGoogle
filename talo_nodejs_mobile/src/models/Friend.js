const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType, TypeRelationship } = require('../lib/Constants');

const friendSchema = new mongoose.Schema({
    userIds: [{ type: ObjectId, ref: 'User' }],
    relationship: {
        type: String,
        enum: TypeRelationship,
        default: 'FRIEND',
    },
});

friendSchema.statics.existsByIds = async (userId1, userId2) => {
    const isExists = await Friend.exists({
        userIds: { $all: [userId1, userId2] },
    });
    return isExists;
};

friendSchema.statics.deleteByIds = async (userId1, userId2) => {
    const queryResult = await Friend.deleteOne({
        userIds: { $all: [userId1, userId2] },
    });
    if (queryResult.deletedCount === 0)
        throw new NotFoundError(ErrorType.FRIEND_NOT_FOUND);
};

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
