const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');
const ConversationService = require('../services/ConversationService');
const MessageService = require('../services/MessageService');
const UserSevice = require('../services/UserSevice');

const CustomError = require('../exceptions/CustomError');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType, Notification } = require('../lib/Constants');
const redisUtils = require('../utils/redisUtils');
const ObjectId = require('mongoose').Types.ObjectId;

class FriendService {
    async findByName(id, name) {
        await redisUtils.getShortUserInfo(id);
        let friends = await Friend.aggregate([
            { $project: { _id: 0, userIds: 1 } },
            {
                $match: {
                    userIds: { $in: [ObjectId(id)] },
                },
            },
            { $unwind: '$userIds' },
            {
                $match: {
                    userIds: { $ne: ObjectId(id) },
                },
            },
        ]);

        let result = await Promise.all(
            friends.map(async (friend) => {
                try {
                    return await redisUtils.getUserOnline(friend.userIds + '');
                } catch (error) {
                    return {
                        id: friend.userIds,
                        name: 'Talo User',
                        avatar: {},
                        isOnline: false,
                        lastLogin: null,
                    };
                }
            }),
        );
        if (name != '') {
            result = result.filter(
                (friend) =>
                    friend.name.toUpperCase().indexOf(name.toUpperCase()) > -1,
            );
        }

        return result;
    }

    async getListRequest(userIdSend) {
        let listRequest = await FriendRequest.find({
            userIdReceiver: ObjectId(userIdSend),
        }).lean();

        listRequest = Promise.all(
            listRequest.map(async (request) => {
                const userIdSend = request.userIdSend;
                const userIdReceiver = request.userIdReceiver;

                const numberMutualGroup = await UserSevice.countMutualGroup(
                    userIdSend,
                    userIdReceiver,
                );
                const numberMutualFriend = await UserSevice.countMutualFriend(
                    userIdSend,
                    userIdReceiver,
                );
                const { id, name, avatar } = await redisUtils.getShortUserInfo(
                    userIdSend,
                );

                return {
                    id,
                    name,
                    avatar,
                    message: request.message,
                    numberMutualGroup,
                    numberMutualFriend,
                };
            }),
        );

        return listRequest;
    }

    async acceptFriendRequest(id, userIdSend) {
        if (!(await FriendRequest.existsByIds(userIdSend, id)))
            throw new NotFoundError(ErrorType.FRIEND_REQUEST_NOT_FOUND);

        if (await Friend.existsByIds(id, userIdSend))
            throw new CustomError(ErrorType.FRIEND_EXIST);

        await Friend({ userIds: [id, userIdSend] }).save();

        const { conversationId, isExists } =
            await ConversationService.createDual(id, userIdSend);

        const message = await MessageService.addText(id, {
            content: Notification.WE_WERE_FRIEND,
            type: 'NOTIFY',
            conversationId,
        });

        await FriendRequest.deleteOne({ userIdSend, userIdReceiver: id });

        return { conversationId, isExists, message };
    }

    async delete(_id, userId) {
        await Friend.deleteByIds(_id, userId);
    }

    async deleteRequest(userIdSend, userIdReceiver) {
        await FriendRequest.deleteByIds(userIdSend, userIdReceiver);
    }

    async getListRequestsByMe(userIdSend) {
        // check userIdSend
        await redisUtils.getShortUserInfo(userIdSend);

        let listRequest = await FriendRequest.find({
            userIdSend: ObjectId(userIdSend),
        }).lean();

        listRequest = await Promise.all(
            listRequest.map(async (request) => {
                const userIdReceiver = request.userIdReceiver;
                const numberMutualGroup = await UserSevice.countMutualGroup(
                    userIdSend,
                    userIdReceiver,
                );
                const numberMutualFriend = await UserSevice.countMutualFriend(
                    userIdSend,
                    userIdReceiver,
                );
                const { id, name, avatar } = await redisUtils.getShortUserInfo(
                    userIdReceiver,
                );

                return {
                    id,
                    name,
                    avatar,
                    message: request.message,
                    numberMutualGroup,
                    numberMutualFriend,
                };
            }),
        );
        return listRequest;
    }

    async sendRequest(id, userId, message) {
        await UserSevice.checkById(userId);

        // Check userrId not me
        if (userId === id)
            throw new CustomError(ErrorType.FRIEND_REQUEST_INVALID);

        // Check exist friend
        if (await Friend.existsByIds(id, userId))
            throw new CustomError(ErrorType.FRIEND_EXIST);

        // Check request friend
        if (
            (await FriendRequest.existsByIds(id, userId)) ||
            (await FriendRequest.existsByIds(userId, id))
        )
            throw new CustomError(ErrorType.FRIEND_REQUEST_EXIST);

        const friendRequest = new FriendRequest({
            userIdSend: id,
            userIdReceiver: userId,
            message,
        });

        await friendRequest.save();
    }

    async getSuggest(userId, page, size) {
        if (!size || page < 0 || size <= 0)
            throw new CustomError(ErrorType.FRIEND_SUGGEST_INVALID);
        // list friends
        const friendIds = await Friend.aggregate([
            { $match: { userIds: { $in: [ObjectId(userId)] } } },
            { $unwind: '$userIds' },
            { $match: { userIds: { $ne: ObjectId(userId) } } },
            { $project: { _id: 0, userIds: 1 } },
        ]);
        // list friend of friend
        let friendOfFriend = [];
        for (let friend of friendIds) {
            const friends = (
                await Friend.aggregate([
                    {
                        $match: {
                            userIds: { $in: [ObjectId(friend.userIds)] },
                        },
                    },
                    { $unwind: '$userIds' },
                    {
                        $match: {
                            $and: [
                                { userIds: { $ne: ObjectId(friend.userIds) } },
                                { userIds: { $ne: ObjectId(userId) } },
                            ],
                        },
                    },
                ])
            ).map((fr) => fr.userIds + '');
            friendOfFriend.push(...friends);
        }
        friendOfFriend = [...new Set(friendOfFriend)];
        // Get data
        const result = await Promise.all(
            friendOfFriend.map(async (friend) => {
                try {
                    const status = await UserSevice.getStatusFriendById(
                        userId,
                        friend,
                    );
                    return {
                        id: friend,
                        ...status,
                    };
                } catch (error) {}
            }),
        );
        //  Sort list user
        const sortResult = result
            .filter((user) => user && user.status == 'NOT_FRIEND')
            .sort((first, next) => {
                if (
                    first.numberMutualGroup + first.numberMutualFriend >=
                    next.numberMutualGroup + next.numberMutualFriend
                )
                    return -1;
                return 1;
            });
        // Pagination list user
        const start = page * size;
        const end = start + size;
        return sortResult.slice(start, end);
    }
}

module.exports = new FriendService();
