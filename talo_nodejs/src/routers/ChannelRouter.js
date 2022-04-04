const router = require('express').Router();
const ChannelController = require('../controllers/ChannelController');

const channelRouter = (io) => {
    const channelController = new ChannelController(io);

    router
        .route('/:conversationId')
        .get(channelController.findByConversationId)
        .post(channelController.addChannel);

    router
        .route('/:channelId')
        .put(channelController.updateChannel)
        .delete(channelController.deleteChannel);

    router.get('/:channelId/view-last', channelController.getViewLast);

    return router;
};

module.exports = channelRouter;
