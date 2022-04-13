const MessageService = require('../services/MessageService');

const { Emit } = require('../lib/ConstantsSocket');

class MessageController {
    constructor(io) {
        this.io = io;

        this.findByConversationId = this.findByConversationId.bind(this);
        this.findByChannelId = this.findByChannelId.bind(this);
        this.addText = this.addText.bind(this);
        this.addFile = this.addFile.bind(this);
        this.unsendById = this.unsendById.bind(this);
        this.reactById = this.reactById.bind(this);
        this.forwardById = this.forwardById.bind(this);
    }

    // [GET] /:conversationId
    async findByConversationId(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;
        const { page = 0, size = 20 } = req.query;

        try {
            const messages = await MessageService.findByConversationId(
                conversationId,
                userId,
                parseInt(page),
                parseInt(size),
            );

            this.io.to(conversationId + '').emit(Emit.MESSAGE_VIEW_LAST, {
                conversationId,
                userId,
                lastView: new Date(),
            });

            res.json(messages);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /channel/:channelId
    async findByChannelId(req, res, next) {
        const userId = req.id;
        const channelId = req.params.channelId;
        const { page = 0, size = 20 } = req.query;

        try {
            let messages = await MessageService.findByChannelId(
                channelId,
                userId,
                parseInt(page),
                parseInt(size),
            );

            const { conversationId } = messages;

            this.io.to(conversationId + '').emit(Emit.MESSAGE_VIEW_LAST, {
                conversationId,
                channelId,
                userId,
                lastView: new Date(),
            });
            delete messages.conversationId;

            res.json(messages);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /:conversationId/files
    async findFiles(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;
        const { userIdSend, type = 'ALL', startTime, endTime } = req.query;

        try {
            const files = await MessageService.findFiles(
                conversationId,
                userId,
                type,
                userIdSend,
                startTime,
                endTime,
            );

            res.json(files);
        } catch (err) {
            next(err);
        }
    }

    //[POST] /:conversationId/text
    async addText(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;

        try {
            const { content, tags, replyMessageId, type, channelId } = req.body;
            let message = {
                conversationId,
                content,
                type,
                tags,
                replyMessageId,
                channelId,
            };
            message = await MessageService.addText(userId, message);

            if (channelId) {
                this.io
                    .to(conversationId)
                    .emit(
                        Emit.MESSAGE_NEW_CHANNEL,
                        conversationId,
                        channelId,
                        message,
                    );
            } else
                this.io
                    .to(conversationId)
                    .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    //[POST] /:conversationId/file
    async addFile(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.conversationId;
        const { type, channelId } = req.body;

        try {
            const message = await MessageService.addFile(
                conversationId,
                type,
                req.file,
                userId,
                channelId,
            );

            if (channelId) {
                this.io
                    .to(conversationId)
                    .emit(
                        Emit.MESSAGE_NEW_CHANNEL,
                        conversationId,
                        channelId,
                        message,
                    );
            } else
                this.io
                    .to(conversationId)
                    .emit(Emit.MESSAGE_NEW, conversationId, message);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /reacts/:id/:type
    async reactById(req, res, next) {
        const userId = req.id;
        const { id, type } = req.params;

        try {
            const { conversationId, channelId, user } =
                await MessageService.reactById(id, type, userId);

            this.io.to(conversationId + '').emit(Emit.MESSAGE_REACT_ADD, {
                conversationId,
                channelId,
                messageId: id,
                type,
                user,
            });

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /forward/:id/:conversationId
    async forwardById(req, res, next) {
        const userId = req.id;
        const { id, conversationId } = req.params;

        try {
            const message = await MessageService.forwardById(
                id,
                conversationId,
                userId,
            );

            this.io
                .to(conversationId)
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /unsend/:id
    async unsendById(req, res, next) {
        const userId = req.id;
        const messageId = req.params.id;

        try {
            const { conversationId, channelId } =
                await MessageService.unsendById(messageId, userId);

            this.io.to(conversationId + '').emit(Emit.MESSAGE_DELETE, {
                conversationId,
                channelId,
                messageId,
            });
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /unsend/:id/just-me
    async unsendJustMeById(req, res, next) {
        const userId = req.id;
        const messageId = req.params.id;

        try {
            await MessageService.unsendJustMeById(messageId, userId);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MessageController;
