const Classify = require('../models/Classify');
const ObjectId = require('mongoose').Types.ObjectId;

const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');
const Regex = require('../lib/Regex');

const ClassifyValidate = {
    validateAdd: async function (userId, classify) {
        const { name, color } = classify;

        // Check color
        this.validateColor(color);

        // Check name
        this.validateName(name);

        //  Check exist
        const classifyExist = await Classify.findOne({
            name,
            color,
            userId,
        });
        if (classifyExist) throw new CustomError(ErrorType.CLASSIFY_EXIST);
    },

    validateUpdate: async function (userId, classify) {
        const { id, name, color } = classify;

        // Check color
        this.validateColor(color);

        // Check name
        this.validateName(name);

        //  Check id
        this.validateId(id);

        //  Check exist
        const classifyExist = await Classify.findOne({ _id: id, userId });
        if (!classifyExist) throw new CustomError(ErrorType.CLASSIFY_NOT_EXIST);
    },

    validateFindByIdAndUser: async function (classifyId, userId) {
        //  Check id
        this.validateId(classifyId);

        //  Check exist
        const classifyExist = await Classify.findOne({
            _id: classifyId,
            userId,
        }).lean();
        if (!classifyExist) throw new CustomError(ErrorType.CLASSIFY_NOT_EXIST);
        return classifyExist;
    },

    validateColor: (color) => {
        if (!color || !Regex.COLOR_REGEX.test(color))
            throw new CustomError(ErrorType.CLASSIFY_COLOR_INVALID);
    },

    validateName: (name) => {
        if (!name || name.length < 1 || name.length > 50)
            throw new CustomError(ErrorType.CLASSIFY_NAME_INVALID);
    },

    validateId: (id) => {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.CLASSIFY_ID_INVALID);
        }
    },
};

module.exports = ClassifyValidate;
