const PollService = require('../services/PollService');
const { Emit } = require('../lib/ConstantsSocket');

class PollController {
    constructor(io) {
        this.io = io;
        this.addPoll = this.addPoll.bind(this);
        this.addOptions = this.addOptions.bind(this);
        this.deleteOptions = this.deleteOptions.bind(this);
        this.addChoose = this.addChoose.bind(this);
        this.deleteChoose = this.deleteChoose.bind(this);
    }

    // [GET] /polls/:conversationId
    async findByConversationId(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;
        const { page = 0, size = 10 } = req.query;

        try {
            const votes = await PollService.findByConversationId(
                conversationId,
                parseInt(page),
                parseInt(size),
                userId,
            );

            res.json(votes);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /polls/:conversationId
    async addPoll(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;

        try {
            const message = await PollService.addPoll(
                conversationId,
                req.body,
                userId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /polls/:messageId/options
    async addOptions(req, res, next) {
        const userId = req.id;
        const messageId = req.params.messageId;

        try {
            const message = await PollService.addOptions(
                messageId,
                req.body,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.POLL_OPTION_UPDATE, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /polls/:messageId/options
    async deleteOptions(req, res, next) {
        const userId = req.id;
        const messageId = req.params.messageId;

        try {
            const message = await PollService.deleteOptions(
                messageId,
                req.body,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.POLL_OPTION_UPDATE, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /polls/:messageId/choose
    async addChoose(req, res, next) {
        const userId = req.id;
        const messageId = req.params.messageId;

        try {
            const message = await PollService.addChoose(
                messageId,
                req.body,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.POLL_CHOOSE_UPDATE, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /polls/:messageId/choose
    async deleteChoose(req, res, next) {
        const userId = req.id;
        const messageId = req.params.messageId;

        try {
            const message = await PollService.deleteChoose(
                messageId,
                req.body,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.POLL_CHOOSE_UPDATE, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = PollController;
