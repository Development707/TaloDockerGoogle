const router = require('express').Router();
const ConversationController = require('../controllers/ConversationController');
const {
    validFile,
    uploadToCloud,
    uploadToCloudBase64,
} = require('../middlewares/uploadFile');

const conversationRouter = (io) => {
    const conversationController = new ConversationController(io);
    // Basic API
    router
        .route('/')
        .get(conversationController.findAll)
        .post(conversationController.createGroup);
    router.post('/dual/:userId', conversationController.createDual);
    router.post('/cloud', conversationController.createSingle);
    router
        .route('/:id')
        .get(conversationController.findById)
        .delete(conversationController.deleteById);
    // Edit info
    router.patch('/:id/name', conversationController.changeName);
    router.patch(
        '/:id/avatar',
        validFile,
        uploadToCloud(process.env.CLOUD_BUCKET_GROUP_AVATAR),
        conversationController.changeAvatar
    );
    router.patch(
        '/:id/avatar/base64',
        uploadToCloudBase64(process.env.CLOUD_BUCKET_GROUP_AVATAR),
        conversationController.changeAvatar
    );
    router.patch('/:id/notify', conversationController.changeNotify);
    // Edit link
    router.patch(
        '/:id/join-with-link',
        conversationController.changeJoinWithLink
    );
    router.post('/:id/join-with-link', conversationController.joinWithLink);
    // Edit member
    router
        .route('/:id/members')
        .get(conversationController.findAllMembers)
        .post(conversationController.addMembers)
        .delete(conversationController.leftTheGroup);
    router.delete(
        '/:conversationId/members/:memberId',
        conversationController.removeMember
    );
    // Edit manager
    router
        .route('/:id/managers')
        .post(conversationController.addManagers)
        .patch(conversationController.removeManagers);
    // Other
    router.get('/:id/short-info', conversationController.getShortInfo);
    router.get('/:id/view-last', conversationController.getLastView);
    router.delete('/:id/messages', conversationController.deleteAllMessage);

    return router;
};

module.exports = conversationRouter;
