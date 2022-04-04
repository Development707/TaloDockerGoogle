const CustomError = require('../exceptions/CustomError');
const ForbidError = require('../exceptions/ForbidError');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType, Permission } = require('../lib/Constants');
const ObjectId = require('mongoose').Types.ObjectId;

const ChannelValidate = {
    validateId: (id) => {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.CHANNEL_ID_INVALID);
        }
    },

    validateExistChannel: (channel) => {
        if (!channel) throw new NotFoundError(ErrorType.CHANNEL_NOT_FOUND);
    },

    validateAddChannel: (name, description) => {
        if (!name || name.length < 5 || name.length > 100)
            throw new CustomError(ErrorType.CHANNEL_NAME_INVALID);
        if (!description || description.length > 100)
            throw new CustomError(ErrorType.CHANNEL_DESCRIPTION_INVALID);
    },
};

module.exports = ChannelValidate;
