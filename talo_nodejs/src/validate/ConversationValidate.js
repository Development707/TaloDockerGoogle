const CustomError = require('../exceptions/CustomError');
const ForbidError = require('../exceptions/ForbidError');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType, Permission } = require('../lib/Constants');
const ObjectId = require('mongoose').Types.ObjectId;

const ConversationValidate = {
    validateGroup: function (userIds) {
        if (userIds.length < 2)
            throw new CustomError(ErrorType.CONVERSATION_USERIDS_INVALID);
        for (let userId of userIds) {
            this.validateId(userId);
        }
    },
    validateDual: function (userId1, userId2) {
        this.validateId(userId1);
        this.validateId(userId2);
        if (userId1 == userId2)
            throw new CustomError(ErrorType.CONVERSATION_DUAL_USERID_INVALID);
    },
    validateDeleted: function (userId, conversation) {
        this.validateConversation(conversation, userId);
        const { type, leaderId } = conversation;
        if (type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        if (leaderId + '' != userId)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
    },
    validateChangeName: function (conversationId, name) {
        this.validateExists(conversationId);
        this.validateId(conversationId);
        if (!name || name.length > 50)
            throw new CustomError(ErrorType.NAME_INVALID);
    },
    validateChangeNotify: function (conversationId, isNotify) {
        this.validateExists(conversationId);
        this.validateId(conversationId);
        if (!this.validateIsBoolean(isNotify))
            throw new CustomError(ErrorType.MEMBER_NOTIFY_INVALID);
    },
    validateChangeJoinWithLink: function (conversationId, isStatus) {
        this.validateExists(conversationId);
        this.validateId(conversationId);
        if (!this.validateIsBoolean(isStatus))
            throw new CustomError(ErrorType.MEMBER_STATUS_INVALID);
    },
    validateJoinWithLink: function (conversation, userId) {
        this.validateExists(conversation);
        if (conversation.type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        if (!conversation.isJoinFromLink)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
        if (this.validateIsExistUserId(conversation, userId))
            throw new CustomError(ErrorType.CONVERSATION_EXIST_MEMBER);
    },
    validateAddMembers: function (conversation, memberIds) {
        this.validateExists(conversation);
        if (conversation.type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        for (let memberId of memberIds) {
            if (this.validateIsExistUserId(conversation, memberId))
                throw new CustomError(ErrorType.CONVERSATION_EXIST_MEMBER);
        }
    },
    validateLeftTheGroup: function (conversation, userId) {
        this.validateConversation(conversation, userId);
        if (
            conversation.type !== 'GROUP' ||
            conversation.leaderId + '' === userId
        )
            throw new CustomError(ErrorType.CONVERSATION_NOT_LEFT_GROUP);
    },
    validateRemoveMember: function (conversation, memberId, userId) {
        if (conversation.leaderId == memberId)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
        if (userId == memberId)
            throw new CustomError(ErrorType.CONVERSATION_REMOVED_YOU);
        if (!this.validateIsExistUserId(conversation, memberId))
            throw new CustomError(ErrorType.CONVERSATION_NOT_EXIST_USER);
        this.validateIsManagerOrLeader(conversation, userId);
        this.validateConversation(conversation, memberId);
    },
    validateAddManagers: function (conversation, managerIds, userId) {
        this.validateConversation(conversation, userId);
        const { type, leaderId } = conversation;
        if (type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        if (leaderId + '' != userId)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
        for (let managerId of managerIds) {
            if (
                conversation.managerIds.findIndex(
                    (manager) => manager + '' == managerId,
                ) !== -1
            )
                throw new CustomError(ErrorType.CONVERSATION_EXIST_MANAGER);
            this.validateConversation(conversation, managerId);
        }
    },
    validateRemoveManagers: function (conversation, managerIds, userId) {
        this.validateConversation(conversation, userId);
        const { type, leaderId } = conversation;
        if (type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        if (leaderId != userId)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
        for (let managerId of managerIds) {
            if (
                conversation.managerIds.findIndex(
                    (manager) => manager + '' == managerId,
                ) === -1
            )
                throw new CustomError(ErrorType.CONVERSATION_NOT_EXIST_MANAGER);
        }
    },
    validateConversation: function (conversation, userId) {
        this.validateExists(conversation);
        if (!this.validateIsExistUserId(conversation, userId))
            throw new CustomError(ErrorType.CONVERSATION_NOT_EXIST_USER);
    },
    validateIsManagerOrLeader: function (conversation, userId) {
        this.validateConversation(conversation, userId);
        const { type, leaderId, managerIds } = conversation;
        const isManager =
            managerIds.findIndex((mangerId) => mangerId + '' == userId) !== -1;
        if (type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
        if (leaderId + '' != userId && !isManager)
            throw new ForbidError(Permission.CONVERSATION_PERMISSION_DENIED);
    },
    validateIsExistUserId(conversation, userId) {
        return (
            conversation.members.findIndex(
                (member) => member + '' == userId,
            ) !== -1
        );
    },
    validateIsBoolean: (value) => 'boolean' === typeof value,
    validateId: (id) => {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.CLASSIFY_ID_INVALID);
        }
    },
    validateExists: (item) => {
        if (!item) throw new NotFoundError(ErrorType.CONVERSATION_NOT_FOUND);
    },
    validateIsGroup: (type) => {
        if (type != 'GROUP')
            throw new CustomError(ErrorType.CONVERSATION_NOT_GROUP);
    },
};

module.exports = ConversationValidate;
