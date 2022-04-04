const messageUtils = {
    convertMessageOfGroup: (message) => {
        const { _id, isDeleted } = message;
        let { replyMessageId, reacts, pollId } = message;
        const user = message.userId;

        if (isDeleted)
            return {
                _id,
                isDeleted,
                user,
                createdAt: message.createdAt,
            };

        if (replyMessageId) {
            if (replyMessageId.isDeleted) {
                const { _id, userId, content, isDeleted, createdAt } =
                    replyMessageId;
                replyMessageId = { _id, userId, content, isDeleted, createdAt };
            } else {
                const { _id, userId, content, type, createdAt } =
                    replyMessageId;
                replyMessageId = { _id, userId, content, type, createdAt };
            }
        }

        if (reacts) {
            reacts = reacts.filter((react) => {
                react.userId + '' == user._id;
            });
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
        delete message.conversationId;
        delete message.__v;
        delete message.updatedAt;

        return { ...message, user };
    },

    // return {user, message}
    convertMessageDual: function (message) {
        const { _id, userId, isDeleted } = message;
        let { replyMessageId, reacts } = message;
        const conversation = message.conversationId;

        const user = this.getUserDualConversation(conversation, userId);

        if (isDeleted)
            return {
                _id,
                isDeleted,
                user,
                createdAt: message.createdAt,
            };

        if (replyMessageId) {
            if (replyMessageId.isDeleted) {
                const { _id, userId, content, isDeleted, createdAt } =
                    replyMessageId;
                replyMessageId = { _id, userId, content, isDeleted, createdAt };
            } else {
                const { _id, userId, content, type, createdAt } =
                    replyMessageId;
                replyMessageId = { _id, userId, content, type, createdAt };
            }
        }

        if (reacts) {
            reacts = reacts.map(function (react) {
                return {
                    user: getUserDualConversation(conversation, react.userId),
                    type: react.type,
                };
            });
        }

        message.id = message._id;
        delete message._id;
        delete message.isDeleted;
        delete message.userId;
        delete message.conversationId;
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
};

module.exports = messageUtils;
