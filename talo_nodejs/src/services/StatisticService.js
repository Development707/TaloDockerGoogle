const redisUtils = require('../utils/redisUtils');
const UserValidate = require('../validate/UserValidate');
const User = require('../models/User');
const CustomError = require('../exceptions/CustomError');

class StatisticService {
    async general(userId) {
        const me = await User.findById(userId);
        const users = await redisUtils.getAllUser();
        let redisDBsize;
        try {
            redisDBsize = await redisUtils.sizeDb();
        } catch (error) {
            redisDBsize = 'Redis error';
        }

        let userPhone = 0,
            redisUserError = 0,
            userEmail = 0,
            userIsDelete = 0,
            userNotActive = 0;
        for (let user of users) {
            if (user) {
                if (UserValidate.validateEmail(user.username)) userEmail++;
                if (UserValidate.validatePhone(user.username)) userPhone++;
                if (user.isDeleted) userIsDelete++;
                if (!user.isActived) userNotActive++;
            } else redisUserError++;
        }
        const conversations = await redisUtils.getAllConversations();
        let groupUsings = 0,
            redisConversationError = 0,
            largeGroup = 0;
        for (let conversation of conversations) {
            if (conversation) {
                if (conversation.type == 'GROUP') groupUsings++;
                if (conversation.members.length > 10) largeGroup++;
            } else redisConversationError++;
        }

        return {
            redisDBsize,
            redisUserError,
            redisConversationError,
            userUsings: users.length,
            userPhone,
            userEmail,
            userIsDelete,
            userNotActive,
            groupUsings,
            largeGroup,
            numMeDrive: me.tokens.length,
            meRole: me.role,
            meLogoutAll: me.timeLogoutAll,
        };
    }

    async clearRedis(type) {
        switch (type.toUpperCase()) {
            case 'ALL':
                await redisUtils.cleanAll();
                break;
            case 'USER':
                await redisUtils.removeAllProfiles();
                break;
            case 'CONVERSATION':
                await redisUtils.removeAllConversations();
                break;
            case 'CHANNEL':
                await redisUtils.removeAllChannels();
                break;
            case 'MEMBER':
                await redisUtils.removeAllMembers();
                break;
            case 'STICKER':
                await redisUtils.removeAllSticker();
                break;

            default:
                throw new CustomError(
                    'Type: invalid (ALL, USER, CONVERSATION, CHANNEL, MEMBER, STICKER)',
                );
        }
    }
}

module.exports = new StatisticService();
