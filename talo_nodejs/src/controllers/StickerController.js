const StickerService = require('../services/StickerService');

class StickerController {
    // [GET] /
    async findAll(req, res, next) {
        try {
            const stickers = await StickerService.findAll();

            res.json(stickers);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /
    async addSticker(req, res, next) {
        try {
            const sticker = await StickerService.addSticker(req.body);
            res.status(201).json(sticker);
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /:id
    async updateSticker(req, res, next) {
        const { id } = req.params;

        try {
            await StickerService.updateSticker(id, req.body);
            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id
    async deleteSticker(req, res, next) {
        const { id } = req.params;

        try {
            await StickerService.deleteSticker(id);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/emoji
    async addEmoji(req, res, next) {
        const { id } = req.params;

        try {
            await StickerService.addEmoji(id, req.file);
            res.status(201).json(req.file.publicUrl);
        } catch (err) {
            next(err);
        }
    }

    // [DELET] /:id/emoji
    async deleteEmoji(req, res, next) {
        const { id } = req.params;
        const { name = '' } = req.query;

        try {
            await StickerService.deleteEmoji(id, name);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StickerController();
