const CustomError = require('../exceptions/CustomError');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType } = require('../lib/Constants');

const StickerValidate = {
    validateSticker: function (name, description) {
        if (!name || name.length < 5 || name.length > 100)
            throw new CustomError(ErrorType.STICKER_NAME_INVALID);
        if (description.length > 100)
            throw new CustomError(ErrorType.STICKER_DESCRIPTION_INVALID);
    },

    validateDeleteSticker: function (sticker) {
        this.validateExists(sticker);
        if (sticker.emojis.length > 0)
            throw new CustomError(ErrorType.STICKER_CANNOT_DELETE);
    },

    validateExists: (sticker) => {
        if (!sticker) throw new NotFoundError(ErrorType.STICKER_NOT_FOUND);
    },
};
module.exports = StickerValidate;
