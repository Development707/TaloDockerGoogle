const PinMessageService = require('../services/PinMessageService');

const { Emit } = require('../lib/ConstantsSocket');

class PinMessageController {
    constructor(io) {
        this.io = io;

        this.addPinMessage = this.addPinMessage.bind(this);
        this.deletePinMessage = this.deletePinMessage.bind(this);
    }

    // [GET] /pin/:id
    async findByConversationId(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const pinMessages = await PinMessageService.findByConversationId(
                conversationId,
                userId,
            );

            res.json(pinMessages);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /pin/:id
    async addPinMessage(req, res, next) {
        const userId = req.id;
        const messageId = req.params.id;

        try {
            const message = await PinMessageService.addPinMessage(
                messageId,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_PIN_ADD, conversationId);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /pin/:id
    async deletePinMessage(req, res, next) {
        const userId = req.id;
        const messageId = req.params.id;

        try {
            const message = await PinMessageService.deletePinMessage(
                messageId,
                userId,
            );
            const conversationId = message.conversationId;

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_PIN_DELETE, conversationId);

            res.status(200).json({ conversationId, message });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = PinMessageController;
