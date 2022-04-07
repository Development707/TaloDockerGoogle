const router = require('express').Router();
const StickerController = require('../controllers/StickerController');
const { roles } = require('../middlewares/permission');
const { validFile } = require('../middlewares/uploadFile');

router
    .route('')
    .get(StickerController.findAll)
    .post(roles(['ADMIN', 'USER']), StickerController.addSticker);

router
    .route('/:id')
    .put(roles(['ADMIN', 'USER']), StickerController.updateSticker)
    .delete(roles(['ADMIN', 'USER']), StickerController.deleteSticker);

router
    .route('/:id/emoji')
    .post(roles(['ADMIN', 'USER']), validFile, StickerController.addEmoji)
    .delete(roles(['ADMIN', 'USER']), StickerController.deleteEmoji);

module.exports = router;
