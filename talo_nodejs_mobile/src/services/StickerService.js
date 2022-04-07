const Sticker = require('../models/Sticker');

const redisUtils = require('../utils/redisUtils');
const StickerValidate = require('../validate/StickerValidate');
const { deleteFile, uploadFileToCloud } = require('../middlewares/uploadFile');

class StickerService {
    async findAll() {
        let stickers = await redisUtils.getAllSticker();
        if (stickers.length === 0) {
            stickers = await Sticker.find().lean();
            for (let sticker of stickers) {
                redisUtils.addSticker(sticker);
            }
        }
        stickers.forEach(function (sticker) {
            sticker.id = sticker._id;
            delete sticker._id;
        });
        return stickers;
    }

    async addSticker(body) {
        const { name, description = '' } = body;
        StickerValidate.validateSticker(name, description);

        const sticker = await new Sticker({ name, description }).save();
        let result = await redisUtils.getSticker(sticker._id);
        result.id = result._id;
        delete result._id;
        return result;
    }

    async updateSticker(id, body) {
        const { name, description = '' } = body;
        StickerValidate.validateSticker(name, description);
        let sticker = await redisUtils.getSticker(id);
        StickerValidate.validateExists(sticker);

        await Sticker.updateOne({ _id: id }, { name, description });
        sticker = await Sticker.findById(id).lean();
        await redisUtils.addSticker(sticker);
    }

    async deleteSticker(id) {
        const sticker = await redisUtils.getSticker(id);
        StickerValidate.validateDeleteSticker(sticker);
        await Promise.all([
            Sticker.deleteOne({ _id: id }),
            redisUtils.removeSticker(id),
        ]);
    }

    async addEmoji(id, file) {
        let sticker = await redisUtils.getSticker(id);
        StickerValidate.validateExists(sticker);

        const publicUrl = await uploadFileToCloud(
            process.env.CLOUD_BUCKET_STICKER,
            file,
        );
        await Sticker.updateOne(
            { _id: id },
            { $push: { emojis: { url: publicUrl, name: file.filename } } },
        );

        sticker = await Sticker.findById(id).lean();
        await redisUtils.addSticker(sticker);
    }

    async deleteEmoji(id, name) {
        let sticker = await Sticker.findById(id);
        StickerValidate.validateExists(sticker);

        const { nModified } = await Sticker.updateOne(
            { _id: id },
            { $pull: { emojis: { name } } },
        );
        if (nModified !== 0) deleteFile(process.env.CLOUD_BUCKET_STICKER, name);

        sticker = await Sticker.findById(id).lean();
        await redisUtils.addSticker(sticker);
    }
}

module.exports = new StickerService();
