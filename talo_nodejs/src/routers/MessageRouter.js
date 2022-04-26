const router = require('express').Router();
const MessageController = require('../controllers/MessageController');
const PinMessageController = require('../controllers/PinMessageController');
const PollController = require('../controllers/PollController');
const { validFile } = require('../middlewares/uploadFile');

const messageRouter = (io, io2) => {
    const messageController = new MessageController(io, io2);
    const pinMessageController = new PinMessageController(io);
    const pollController = new PollController(io);

    router.get('/:conversationId', messageController.findByConversationId);
    router.get('/channel/:channelId', messageController.findByChannelId);
    router.get('/:conversationId/files', messageController.findFiles);

    router.post('/:conversationId/text', messageController.addText);
    router.post('/:conversationId/file', validFile, messageController.addFile);
    router.post('/forward/:id/:conversationId', messageController.forwardById);
    router.post('/reacts/:id/:type', messageController.reactById);

    router.delete('/unsend/:id', messageController.unsendById);
    router.delete('/unsend/:id/just-me', messageController.unsendJustMeById);

    // Pin messsage
    router
        .route('/pin/:id')
        .get(pinMessageController.findByConversationId)
        .post(pinMessageController.addPinMessage)
        .delete(pinMessageController.deletePinMessage);

    // Polls
    router
        .route('/polls/:conversationId')
        .get(pollController.findByConversationId)
        .post(pollController.addPoll);
    router
        .route('/polls/:messageId/options')
        .post(pollController.addOptions)
        .delete(pollController.deleteOptions);

    router
        .route('/polls/:messageId/choose')
        .post(pollController.addChoose)
        .delete(pollController.deleteChoose);

    return router;
};

module.exports = messageRouter;
