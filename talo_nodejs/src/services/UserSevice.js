const User = require('../models/User');
const Friend = require('../models/Friend');
const FriendRequest = require('../models/FriendRequest');
const Conversation = require('../models/Conversation');
const ObjectId = require('mongoose').Types.ObjectId;

const NotFoundError = require('../exceptions/NotFoundError');
const CustomError = require('../exceptions/CustomError');
const { ErrorType, FRIEND_STATUS } = require('../lib/Constants');
const commonUtils = require('../utils/commonUtils');

class UserService {
    async checkById(id) {
        try {
            return await User.checkById(id);
        } catch (error) {
            throw new NotFoundError(ErrorType.ID_NOT_FOUND);
        }
    }

    async getShortUserInfo(username) {
        const user = await User.findOne(
            { username },
            '-_id name username avatar isActived'
        );

        if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

        return user;
    }

    async getStatusFriend(_id, phone) {
        await User.checkById(_id);
        const UserResult = await User.findByUsername(phone);
        UserResult.id = UserResult._id;
        delete UserResult._id;
        const UserResultId = UserResult.id + '';

        UserResult.status = await this.getFriendStatus(_id, UserResultId);
        UserResult.numberMutualGroup = await this.countMutualGroup(
            _id,
            UserResultId
        );
        UserResult.numberMutualFriend = await this.countMutualFriend(
            _id,
            UserResultId
        );

        return UserResult;
    }

    async getStatusFriendById(_id, userId) {
        const UserResult = await User.findByIdIsActive(userId);
        const UserResultId = UserResult._id;

        UserResult.status = await this.getFriendStatus(_id, UserResultId);
        UserResult.numberMutualGroup = await this.countMutualGroup(
            _id,
            UserResultId
        );
        UserResult.numberMutualFriend = await this.countMutualFriend(
            _id,
            UserResultId
        );

        return UserResult;
    }

    async getFriendStatus(myId, userId) {
        if (await Friend.existsByIds(myId, userId)) {
            return FRIEND_STATUS[1];
        }
        if (await FriendRequest.existsByIds(userId, myId)) {
            return FRIEND_STATUS[2];
        }
        if (await FriendRequest.existsByIds(myId, userId)) {
            return FRIEND_STATUS[3];
        }
        return FRIEND_STATUS[0];
    }

    async countMutualGroup(myId, userId) {
        return await Conversation.countDocuments({
            type: 'GROUP',
            members: { $all: [myId, userId] },
        });
    }

    async countMutualFriend(myId, searchUserId) {
        let friendIdsOfSearchUser = await Friend.aggregate([
            { $match: { userIds: { $in: [ObjectId(searchUserId)] } } },
            { $unset: '_id' },
            { $unwind: '$userIds' },
            { $match: { userIds: { $ne: ObjectId(searchUserId) } } },
        ]);
        friendIdsOfSearchUser = friendIdsOfSearchUser
            .filter((friendIdEle) => friendIdEle.userIds + '' != myId)
            .map((friendIdEle) => {
                return friendIdEle.userIds;
            });
        return await Friend.countDocuments({
            $and: [
                { userIds: { $in: [...friendIdsOfSearchUser] } },
                { userIds: { $in: [myId] } },
            ],
        });
    }

    async findAll(q, page, size) {
        let users = [];
        let pagination;
        if (q) {
            pagination = commonUtils.getPagination(
                page,
                size,
                await User.countDocuments({ $text: { $search: q } })
            );

            users = await User.aggregate([
                { $match: { $text: { $search: q } } },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: 1,
                        avatar: 1,
                        username: 1,
                        gender: 1,
                        isActived: 1,
                        isDeleted: 1,
                        role: 1,
                    },
                },
                { $skip: pagination.skip },
                { $limit: pagination.limit },
            ]);

            return {
                data: users,
                page,
                size,
                totalPages: pagination.totalPages,
            };
        } else {
            pagination = commonUtils.getPagination(
                page,
                size,
                await User.countDocuments()
            );

            users = await User.aggregate([
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: 1,
                        avatar: 1,
                        username: 1,
                        gender: 1,
                        isActived: 1,
                        isDeleted: 1,
                        role: 1,
                    },
                },
                { $skip: pagination.skip },
                { $limit: pagination.limit },
            ]);
        }
        return {
            data: users,
            page,
            size,
            totalPages: pagination.totalPages,
        };
    }

    async updateUser(myId, body, userId) {
        if (myId == userId) throw new CustomError(ErrorType.USER_NOT_UPDATE_ME);
        const { isActived, isDeleted } = body;
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError(ErrorType.ID_NOT_FOUND);
        // Update
        if ('boolean' === typeof isActived) {
            user.isActived = isActived;
        }
        if ('boolean' === typeof isDeleted) {
            user.isDeleted = isDeleted;
        }
        await user.save();
    }

    async resetPassword(myId, userId) {
        if (myId == userId) throw new CustomError(ErrorType.USER_NOT_UPDATE_ME);

        const user = await User.findById(userId);
        if (!user) throw new NotFoundError(ErrorType.ID_NOT_FOUND);
        // Update
        user.password = user.username;
        await user.save();
    }
}

module.exports = new UserService();
