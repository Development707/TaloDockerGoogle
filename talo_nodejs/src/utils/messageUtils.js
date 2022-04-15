const messageUtils = {
    // React result react by me
    convertMessageOfGroup: function (message) {
        const { _id, isDeleted } = message;
        let { replyMessageId, reacts, pollId } = message;
        const user = message.userId;

        if (isDeleted)
            return {
                id: _id,
                user,
                isDeleted,
                createdAt: message.createdAt,
            };

        if (replyMessageId)
            message.replyMessageId = this.checkReplyMessage(replyMessageId);

        if (reacts.length > 0) {
            reacts = reacts.filter((react) => react.userId.id + '' == user.id);
        }

        if (pollId) {
            message.question = pollId.question;
            message.options = pollId.options;
            delete message.pollId;
        }

        message.id = message._id;
        delete message._id;
        delete message.isDeleted;
        delete message.userId;
        delete message.__v;
        delete message.updatedAt;

        return { ...message, user };
    },

    // result user = member
    convertMessageDual: function (message) {
        const { _id, userId, isDeleted } = message;
        let { replyMessageId } = message;
        const conversation = message.conversationId;

        const user = this.getUserDualConversation(conversation, userId);

        if (isDeleted)
            return {
                id: _id,
                isDeleted,
                user,
                createdAt: message.createdAt,
            };

        if (replyMessageId)
            message.replyMessageId = this.checkReplyMessage(replyMessageId);

        message.id = message._id;
        delete message._id;
        delete message.isDeleted;
        delete message.userId;
        delete message.__v;
        delete message.updatedAt;

        return {
            ...message,
            user,
        };
    },

    getUserDualConversation: (conversation, userId) => {
        let members = conversation.members.find(
            (member) => member.id == userId,
        );

        return members;
    },

    checkReplyMessage: (replyMessageId) => {
        const { _id, userId, isDeleted, content, type, createdAt } =
            replyMessageId;
        if (isDeleted) {
            return { id: _id, userId, isDeleted, createdAt };
        } else {
            return { id: _id, userId, content, type, createdAt };
        }
    },
};

module.exports = messageUtils;
