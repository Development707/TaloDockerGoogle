const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema(
    {
        name: String,
        description: {
            type: String,
            default: '',
        },
        emojis: {
            type: [{ type: { url: String, name: String, _id: false } }],
            default: [],
        },
    },
    { versionKey: false }
);

const Sticker = mongoose.model('Sticker', stickerSchema);

module.exports = Sticker;
