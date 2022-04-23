const router = require('express').Router();
const StickerController = require('../controllers/StickerController');
const { role } = require('../middlewares/permission');
const { validFile } = require('../middlewares/uploadFile');

router
    .route('')
    .get(StickerController.findAll)
    .post(role('ADMIN'), StickerController.addSticker);

router
    .route('/:id')
    .put(role('ADMIN'), StickerController.updateSticker)
    .delete(role('ADMIN'), StickerController.deleteSticker);

router
    .route('/:id/emoji')
    .post(role('ADMIN'), validFile, StickerController.addEmoji)
    .delete(role('ADMIN'), StickerController.deleteEmoji);

module.exports = router;
