const ChannelService = require('../services/ChannelService');

const { Emit } = require('../lib/ConstantsSocket');

class ChannelController {
    constructor(io) {
        this.io = io;
        this.addChannel = this.addChannel.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
    }

    // [GET] /:conversationId
    async findByConversationId(req, res, next) {
        const userId = req.id;
        const { conversationId } = req.params;

        try {
            const channels = await ChannelService.findByConversationId(
                conversationId,
                userId,
            );

            res.json(channels);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:conversationId
    async addChannel(req, res, next) {
        const userId = req.id;
        const { conversationId } = req.params;

        try {
            const { channel, message } = await ChannelService.addChannel(
                conversationId,
                req.body,
                userId,
            );

            this.io.to(conversationId).emit(Emit.CHANNEL_CREATE, channel);
            this.io
                .to(conversationId)
                .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.status(201).json({ channel, message });
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /:channelId
    async updateChannel(req, res, next) {
        const userId = req.id;
        const { channelId } = req.params;

        try {
            const { channel, message } = await ChannelService.updateChannel(
                channelId,
                req.body,
                userId,
            );
            const { conversationId } = channel;
            this.io.to(conversationId).emit(Emit.CHANNEL_UPDATE, channel);
            this.io
                .to(conversationId)
                .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.json({ channel, message });
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:channelId
    async deleteChannel(req, res, next) {
        const userId = req.id;
        const { channelId } = req.params;

        try {
            const { conversationId, message } =
                await ChannelService.deleteChannel(channelId, userId);
            this.io
                .to(conversationId)
                .emit(Emit.CHANNEL_DELETE, { conversationId, channelId });
            this.io
                .to(conversationId)
                .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.json(message);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:channelId/view-last
    async getViewLast(req, res, next) {
        const userId = req.id;
        const { channelId } = req.params;

        try {
            const lastViews = await ChannelService.getViewLast(
                channelId,
                userId,
            );

            res.json(lastViews);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ChannelController;
