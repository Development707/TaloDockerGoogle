const Member = require('../models/Member');

const redisUtils = require('../utils/redisUtils');

class MemberService {
    async addMember(
        conversationId,
        userId,
        name = null,
        lastViewOfChannels = [],
    ) {
        await new Member({
            conversationId,
            userId,
            name,
            lastViewOfChannels,
        }).save();
    }

    async updateLastView(conversationId, userId, lastView = new Date()) {
        const member = await this.findByConversationIdAndUserId(
            conversationId,
            userId,
        );
        member.lastView = lastView;
        member.save();
        redisUtils.removeMember(member._id);
    }

    async updateLastViewByChannelId(conversationId, userId, channelId) {
        const member = await this.findByConversationIdAndUserId(
            conversationId,
            userId,
        );

        let lastViewOfChannels = member.lastViewOfChannels;

        const index = lastViewOfChannels.findIndex(
            (lastViewOfChannel) =>
                lastViewOfChannel.channelId + '' == channelId + '',
        );

        // not exists
        if (index === -1) return;

        lastViewOfChannels[index].lastView = new Date();

        await member.save();
        redisUtils.removeMember(member._id);
    }

    async updateName(conversationId, userId, name) {
        const member = await this.findByConversationIdAndUserId(
            conversationId,
            userId,
        );
        member.name = name;
        member.save();
        redisUtils.removeMember(member._id);
    }

    async updateIsNotify(conversationId, isNotify, userId) {
        const member = await this.findByConversationIdAndUserId(
            conversationId,
            userId,
        );
        member.isNotify = isNotify;
        member.save();
        redisUtils.removeMember(member._id);
    }

    // Using find by update name, isNotify,...
    async findByConversationIdAndUserId(conversationId, userId) {
        return await Member.findByConversationIdAndUserId(
            conversationId,
            userId,
        );
    }

    async findByConversationId(conversationId) {
        return await Member.find({ conversationId }).lean();
    }

    async deleteByConversationId(conversationId) {
        redisUtils.removeAllMembers().then();
        return await Member.deleteMany({ conversationId });
    }

    async deleteByConversationIdAndUserId(conversationId, userId) {
        return await Member.deleteOne({ conversationId, userId });
    }
}

module.exports = new MemberService();
