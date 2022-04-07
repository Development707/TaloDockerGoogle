const Conversation = require('../models/Conversation');
const ObjectId = require('mongoose').Types.ObjectId;
const MemberService = require('../services/MemberService');
const MessageService = require('../services/MessageService');
const ChannelService = require('../services/ChannelService');

const redisUtils = require('../utils/redisUtils');
const { deleteFile } = require('../middlewares/uploadFile');
const ConversationValidate = require('../validate/ConversationValidate');
const { Notification, ErrorType } = require('../lib/Constants');

class ConversationService {
    async findAll(userId, name) {
        let listResult = await Conversation.find({
            members: { $in: [userId] },
        }).sort({ updatedAt: -1 });

        listResult = await Promise.all(
            listResult.map(async (result) => {
                return await this.getSummaryByUserIdConversation(
                    userId,
                    result,
                );
            }),
        );

        if (name.length > 0) {
            listResult = listResult.filter(
                (result) =>
                    result.name.toUpperCase().indexOf(name.toUpperCase()) > -1,
            );
        }

        return listResult;
    }

    async findDual(userId, name) {
        let listResult = await Conversation.find({
            members: { $in: [userId] },
            type: 'DUAL',
        }).sort({ updatedAt: -1 });

        listResult = await Promise.all(
            listResult.map(async (result) => {
                return await this.getSummaryByUserIdConversation(
                    userId,
                    result,
                );
            }),
        );
        if (name.length > 0) {
            listResult = listResult.filter(
                (result) =>
                    result.name.toUpperCase().indexOf(name.toUpperCase()) > -1,
            );
        }

        return listResult;
    }

    async findGroup(userId, name) {
        let listResult = await Conversation.find({
            members: { $in: [userId] },
            type: 'GROUP',
        }).sort({ updatedAt: -1 });

        listResult = await Promise.all(
            listResult.map(async (result) => {
                return await this.getSummaryByUserIdConversation(
                    userId,
                    result,
                );
            }),
        );
        if (name.length > 0) {
            listResult = listResult.filter(
                (result) =>
                    result.name.toUpperCase().indexOf(name.toUpperCase()) > -1,
            );
        }

        return listResult;
    }

    // return {Sumary, managers, leader}
    async getByUserIdAndConversationId(userId, conversationId) {
        // Check valid
        ConversationValidate.validateId(conversationId);
        // Get conversation
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateExists(conversation);
        let summary = await this.getSummaryByUserIdConversation(
            userId,
            conversation,
        );
        return summary;
    }

    // return id, name, avatar, type, members, totalMembers, numberUnread, isNotify, isJoinFromLink, lastMessage
    async getSummaryByUserIdConversation(userId, conversation) {
        const {
            _id,
            lastMessageId,
            type,
            isJoinFromLink,
            leaderId,
            managerIds,
        } = conversation;
        let { name, avatar, members } = conversation;
        const totalMembers = members.length;
        // Get lastView vs isNotify
        const member = await MemberService.findByConversationIdAndUserId(
            _id,
            userId,
        );
        const { lastView, isNotify } = member;
        // Get lastMessage
        const lastMessage = lastMessageId
            ? await MessageService.getById(lastMessageId, type)
            : null;
        //  Count unread
        const numberUnread = await MessageService.countUnread(lastView, _id);
        // Name vs Avatar
        members = await Promise.all(
            members.map(async (userId) => {
                return await redisUtils.getShortUserInfo(userId);
            }),
        );
        switch (type) {
            case 'GROUP':
                if (name.length === 0)
                    name = members
                        .map((member) => {
                            return member.name;
                        })
                        .join(', ');
                if (!avatar)
                    avatar = members.map((member) => {
                        return member.avatar;
                    });
                break;
            case 'DUAL':
                members = members.filter((member) => member.id + '' != userId);
                const memberDual =
                    await MemberService.findByConversationIdAndUserId(
                        _id,
                        members[0].id,
                    );
                name = memberDual.name;
                avatar = members[0].avatar;
                break;
            case 'SINGLE':
                const memberSingle =
                    await MemberService.findByConversationIdAndUserId(
                        _id,
                        userId,
                    );
                name = memberSingle.name;
                avatar = members[0].avatar;
                break;
            default:
                break;
        }

        return {
            id: _id,
            name,
            avatar,
            type,
            members,
            totalMembers,
            numberUnread,
            isNotify,
            isJoinFromLink,
            lastMessage,
            leaderId,
            managerIds,
        };
    }

    // return { conversationId, isExists }
    async createDual(userId1, userId2) {
        ConversationValidate.validateDual(userId1, userId2);
        // Check conversation exist
        let conversation = await Conversation.existsDualConversation(
            userId1,
            userId2,
        );
        if (conversation)
            return { conversationId: conversation._id, isExists: true }; // Exist
        // Check user exists
        const users = await Promise.all([
            redisUtils.getShortUserInfo(userId1),
            redisUtils.getShortUserInfo(userId2),
        ]);
        // add conversation
        conversation = new Conversation({
            members: [userId1, userId2],
            type: 'DUAL',
        });
        conversation = await conversation.save();
        // add 2 member
        await MemberService.addMember(
            conversation._id,
            users[0].id,
            users[0].name,
        );
        await MemberService.addMember(
            conversation._id,
            users[1].id,
            users[1].name,
        );

        return { conversationId: conversation._id, isExists: false }; // Not exist
    }

    // return { conversationId, isExists }
    async createSingle(userId1) {
        // Check conversation exist
        let conversation = await Conversation.findOne({
            type: 'SINGLE',
            members: { $all: [ObjectId(userId1)] },
        }).lean();
        if (conversation)
            return { conversationId: conversation._id, isExists: true }; // Exist
        // Check user exists
        const user = await redisUtils.getShortUserInfo(userId1);
        // add conversation
        conversation = new Conversation({
            members: [user.id],
            type: 'SINGLE',
        });
        conversation = await conversation.save();
        // add 1 member
        await MemberService.addMember(conversation._id, user.id, user.name);

        return { conversationId: conversation._id, isExists: false }; // Not exist
    }

    // return { conversationId }
    async createGroup(leaderId, name, userIds) {
        // Check input
        ConversationValidate.validateGroup(userIds);
        userIds = new Set(userIds);
        // Check userIds
        const members = [leaderId, ...userIds];
        for (let userId of members) {
            await redisUtils.getShortUserInfo(userId);
        }
        // Create conversation group
        let conversationGroup = new Conversation({
            name,
            leaderId,
            members,
            type: 'GROUP',
        });
        conversationGroup = await conversationGroup.save();
        const conversationId = conversationGroup._id;
        // Create message create group
        MessageService.addText(
            leaderId,
            {
                userId: leaderId,
                content: Notification.WE_WERE_GROUP,
                type: 'NOTIFY',
                conversationId,
            },
            false,
        );
        // Create members
        for (const userId of members) {
            await MemberService.addMember(conversationId, userId, null, []);
        }
        // Create message add members
        MessageService.addText(leaderId, {
            userId: leaderId,
            manipulatedUserIds: [...userIds],
            content: Notification.ADD_YOU_TO_GROUP,
            type: 'NOTIFY',
            conversationId,
        });

        return conversationId;
    }

    async ortheFriends(id, friendIds) {
        return await Conversation.aggregate([
            { $match: { type: true, members: { $in: [ObjectId(id)] } } },
            {
                $project: {
                    _id: 0,
                    members: 1,
                },
            },
            {
                $unwind: '$members',
            },
            {
                $match: {
                    members: { $ne: ObjectId(id), $nin: friendIds },
                },
            },
            {
                $group: {
                    _id: '$members',
                },
            },
        ]);
    }

    async deleteByUserIdAndConversationId(userId, conversationId) {
        const conversation = await redisUtils.getConversation(conversationId);
        // Valid is leader
        ConversationValidate.validateDeleted(userId, conversation);

        await Promise.all([
            MemberService.deleteByConversationId(conversationId),
            MessageService.deleteByConversationId(conversationId),
            ChannelService.deleteByConversationId(conversationId),
            Conversation.deleteOne({ _id: conversationId }),
            redisUtils.removeConversation(conversationId),
        ]);
    }

    // return message
    async changeName(conversationId, name, userId) {
        ConversationValidate.validateChangeName(conversationId, name);

        const conversation = await this.getByUserIdAndConversationId(
            userId,
            conversationId,
        );
        switch (conversation.type) {
            // Change name group
            case 'GROUP':
                const message = await MessageService.addText(userId, {
                    content: `${Notification.CHANGE_NAME_OF_GROUP} <b>"${name}"</b> `,
                    type: 'NOTIFY',
                    conversationId,
                });
                // change name view
                Promise.all([
                    Conversation.updateOne({ _id: conversationId }, { name }),
                    redisUtils.removeConversation(conversationId),
                ]);
                return message;
            //  Change name friend
            case 'DUAL':
                let members = conversation.members;
                members = members.filter((member) => member.id != userId);
                await MemberService.updateName(
                    conversationId,
                    members[0].id,
                    name,
                );
                return;
            // Change my name
            case 'SINGLE':
                await MemberService.updateName(conversationId, userId, name);
                return;
            default:
                return;
        }
    }

    // return {avatar, lastMessage}
    async changeAvatar(conversationId, publicUrl, filename, userId) {
        ConversationValidate.validateExists(conversationId);

        const conversation = await this.getByUserIdAndConversationId(
            userId,
            conversationId,
        );
        const { type, avatar } = conversation;

        switch (type) {
            case 'GROUP':
                deleteFile(
                    process.env.CLOUD_BUCKET_GROUP_AVATAR,
                    avatar.name,
                ).catch((err) =>
                    console.warn(ErrorType.FILE_AVATAR_NOT_FOUND, err.message),
                );
                const message = await MessageService.addText(userId, {
                    userId,
                    content: Notification.CHANGE_AVATAR_OF_GROUP,
                    type: 'NOTIFY',
                    conversationId,
                });
                Promise.all([
                    Conversation.updateOne(
                        { _id: conversationId },
                        {
                            avatar: { url: publicUrl, name: filename },
                            lastMessageId: message._id,
                        },
                    ),
                    redisUtils.removeConversation(conversationId),
                ]);
                return {
                    avatar: { url: publicUrl, name: filename },
                    lastMessage: message,
                };

            default:
                deleteFile(
                    process.env.CLOUD_BUCKET_GROUP_AVATAR,
                    filename,
                ).catch((err) =>
                    console.warn(ErrorType.FILE_AVATAR_NOT_FOUND, err.message),
                );
                return;
        }
    }

    async changeNotify(conversationId, isNotify, userId) {
        ConversationValidate.validateChangeNotify(conversationId, isNotify);
        await MemberService.updateIsNotify(conversationId, isNotify, userId);
        return;
    }

    async changeJoinWithLink(conversationId, isStatus, userId) {
        ConversationValidate.validateChangeJoinWithLink(
            conversationId,
            isStatus,
        );

        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateIsManagerOrLeader(conversation, userId);
        await Promise.all([
            Conversation.updateOne(
                { _id: conversationId },
                { isJoinFromLink: isStatus },
            ),
            redisUtils.removeConversation(conversationId),
        ]);
    }

    // return message
    async joinWithLink(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateJoinWithLink(conversation, userId);
        // Add conversation group
        await Conversation.updateOne(
            { _id: conversationId },
            { $push: { members: userId } },
        );
        await MemberService.addMember(conversationId, userId);
        // Create messages
        const message = await MessageService.addText(userId, {
            userId,
            content: Notification.JOIN_WITH_LINK_TO_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        // Update view
        await redisUtils.removeConversation(conversationId);
        return message;
    }

    // return [{id, name, avatar}...]
    async findAllMembers(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);

        const members = await Promise.all(
            conversation.members.map(async (userId) => {
                return await redisUtils.getShortUserInfo(userId);
            }),
        );
        return members;
    }

    // return message
    async addMembers(conversationId, memberIds, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateAddMembers(conversation, memberIds);

        // Add member to conversation
        await Conversation.updateOne(
            { _id: conversationId },
            { $push: { members: memberIds } },
        );
        // Add memssage
        const message = await MessageService.addText(userId, {
            userId,
            manipulatedUserIds: memberIds,
            content: Notification.ADD_YOU_TO_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        //  Add member, update lassMessageId, update lastView
        Promise.all(
            memberIds.map((memberId) => {
                MemberService.addMember(conversationId, memberId);
            }),
        );
        await redisUtils.removeConversation(conversationId);

        return message;
    }

    // return message
    async leftTheGroup(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateLeftTheGroup(conversation, userId);
        //  Add message
        const message = await MessageService.addText(userId, {
            userId,
            content: Notification.LEFT_MEMBER_FROM_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        // Remove user in conversation
        await Conversation.updateOne(
            { _id: conversationId },
            { $pull: { members: userId, managerIds: userId } },
        );
        //  Remove member, update lassMessageId, update lastView
        Promise.all([
            MemberService.deleteByConversationIdAndUserId(
                conversationId,
                userId,
            ),
            redisUtils.removeConversation(conversationId),
        ]);

        return message;
    }

    // return message
    async removeMember(conversationId, memberId, userId) {
        ConversationValidate.validateId(conversationId);
        ConversationValidate.validateId(memberId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateRemoveMember(
            conversation,
            memberId,
            userId,
        );
        // Remove memberId
        await Conversation.updateOne(
            { _id: conversationId },
            { $pull: { members: memberId } },
        );
        // Add message
        const message = await MessageService.addText(userId, {
            userId,
            manipulatedUserIds: [memberId],
            content: Notification.REMOVE_MEMBER_FROM_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        //  Remove member, update lassMessageId, update lastView
        Promise.all([
            MemberService.deleteByConversationIdAndUserId(
                conversationId,
                memberId,
            ),
            redisUtils.removeConversation(conversationId),
        ]);

        return message;
    }

    // return message
    async addManagers(conversationId, managerIds, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateAddManagers(
            conversation,
            managerIds,
            userId,
        );
        // Add mamagers
        await Conversation.updateOne(
            { _id: conversationId },
            { $push: { managerIds: managerIds } },
        );
        // Add message
        const message = await MessageService.addText(userId, {
            userId,
            manipulatedUserIds: managerIds,
            content: Notification.ADD_MANAGER_TO_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        //  Update lassMessageId, update lastView
        await redisUtils.removeConversation(conversationId);

        return message;
    }

    // return message
    async removeManagers(conversationId, managerIds, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateRemoveManagers(
            conversation,
            managerIds,
            userId,
        );
        // Remove mamagers
        await Conversation.updateOne(
            { _id: conversationId },
            { $pull: { managerIds: { $in: managerIds } } },
            { multi: true },
        );
        // Add message
        const message = await MessageService.addText(userId, {
            userId,
            manipulatedUserIds: managerIds,
            content: Notification.REMOVE_MANAGER_TO_GROUP,
            type: 'NOTIFY',
            conversationId,
        });
        //  Update lassMessageId, update lastView
        await redisUtils.removeConversation(conversationId);

        return message;
    }

    // return id, name, avatar, user
    async getShortInfo(conversationId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getShortConversationInfo(
            conversationId,
        );
        ConversationValidate.validateExists(conversation);
        return conversation;
    }

    async getLastView(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);

        let members = await MemberService.findByConversationId(conversationId);

        members = await Promise.all(
            members.map(async (member) => {
                const user = await redisUtils.getShortUserInfo(member.userId);
                return {
                    id: member._id,
                    user,
                    lastView: member.lastView,
                };
            }),
        );

        return members;
    }

    async deleteAllMessage(conversationId, userId) {
        ConversationValidate.validateId(conversationId);
        const conversation = await redisUtils.getConversation(conversationId);
        ConversationValidate.validateConversation(conversation, userId);

        await MessageService.deleteByConversationIdAndUserId(
            conversation,
            userId,
        );
    }
}

module.exports = new ConversationService();
