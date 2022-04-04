const router = require('express').Router();
const ClassifyController = require('../controllers/ClassifyController');

router
    .route('/')
    .get(ClassifyController.findAll)
    .post(ClassifyController.add)
    .put(ClassifyController.update);
router.delete('/:id', ClassifyController.delete);

router.get('/conversations/:id', ClassifyController.findById);

router
    .route('/conversations/:id/:conversationId')
    .post(ClassifyController.addConversation)
    .delete(ClassifyController.deleteConversation);

module.exports = router;
