const router = require('express').Router();
const FriendController = require('../controllers/FriendController');

const friendRouter = (io, io2) => {
    const friendController = new FriendController(io, io2);

    router.get('/', friendController.findByName);
    router.delete('/:userId', friendController.delete);

    router
        .route('/requests')
        .get(friendController.getListRequest)
        .post(friendController.acceptFriendRequest);
    router.delete('/requests/:userId', friendController.deleteFriendRequest);

    router
        .route('/requests/me')
        .get(friendController.getListRequestsByMe)
        .post(friendController.sendRequest);
    router.delete('/requests/me/:userId', friendController.deleteRequest);

    router.get('/suggest', friendController.getSuggest);

    return router;
};

module.exports = friendRouter;
