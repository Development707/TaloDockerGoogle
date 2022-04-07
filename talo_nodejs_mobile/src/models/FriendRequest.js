const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const NotFoundError = require('../exceptions/NotFoundError');
const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');

const friendRequestSchema = new mongoose.Schema(
    {
        userIdSend: { type: ObjectId, ref: 'User' },
        userIdReceiver: { type: ObjectId, ref: 'User' },
        message: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

friendRequestSchema.statics.existsByIds = async (
    userIdSend,
    userIdReceiver
) => {
    const isExists = await FriendRequest.findOne({
        userIdSend,
        userIdReceiver,
    }).lean();

    return isExists ? true : false;
};

friendRequestSchema.statics.deleteByIds = async (
    userIdSend,
    userIdReceiver
) => {
    if (!userIdSend || !userIdReceiver)
        throw new CustomError(ErrorType.FRIEND_REQUEST_INVALID);

    const queryResult = await FriendRequest.deleteOne({
        userIdSend,
        userIdReceiver,
    });
    if (queryResult.deletedCount === 0)
        throw new NotFoundError(ErrorType.FRIEND_REQUEST_NOT_FOUND);
};

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
