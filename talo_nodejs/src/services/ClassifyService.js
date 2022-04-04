const Classify = require('../models/Classify');
const ClassifyValidator = require('../validate/ClassifyValidate');
const MemberService = require('../services/MemberService');
const ConversationService = require('../services/ConversationService');
const ObjectId = require('mongoose').Types.ObjectId;

const redisUtils = require('../utils/redisUtils');
const NotFoundError = require('../exceptions/NotFoundError');
const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');

class ClassifyService {
    async findByIdAndConversationId(id, conversationId) {
        const classify = await Classify.findOne({
            _id: id,
            conversationIds: { $in: [conversationId] },
        });
        return classify;
    }

    async findAll(userId) {
        const classify = await Classify.aggregate([
            { $match: { userId: ObjectId(userId) } },
            {
                $project: {
                    id: '$_id',
                    name: 1,
                    color: 1,
                    countConversations: { $size: '$conversationIds' },
                    _id: 0,
                },
            },
        ]);
        return classify;
    }

    async add(userId, classify) {
        await ClassifyValidator.validateAdd(userId, classify);

        const { name, color } = classify;
        const newClassify = new Classify({
            name,
            color,
            userId,
        });
        const result = await newClassify.save();
        return { id: result.id };
    }

    async update(userId, classify) {
        await ClassifyValidator.validateUpdate(userId, classify);

        const { id, name, color } = classify;
        const { modifiedCount, matchedCount } = await Classify.updateOne(
            { _id: id, userId },
            { name, color }
        );
        return modifiedCount === matchedCount;
    }

    async delete(userId, classifyId) {
        ClassifyValidator.validateId(classifyId);

        const queryResult = await Classify.deleteOne({
            _id: classifyId,
            userId,
        });

        if (queryResult.deletedCount === 0)
            throw new NotFoundError(ErrorType.CLASSIFY_NOT_FOUND);
    }

    async findByIdAndUserId(classifyId, userId) {
        // check userId
        let classify = await ClassifyValidator.validateFindByIdAndUser(
            classifyId,
            userId
        );

        classify.id = classify._id;

        classify.conversations = await Promise.all(
            classify.conversationIds.map(async (conversationId) => {
                return await redisUtils.getShortConversationInfo(
                    conversationId
                );
            })
        );

        delete classify._id;
        delete classify.userId;
        delete classify.conversationIds;

        return classify;
    }

    async addConversation(userId, id, conversationId) {
        ClassifyValidator.validateId(id);
        ClassifyValidator.validateId(conversationId);

        // Check member exists
        await MemberService.findByConversationIdAndUserId(
            conversationId,
            userId
        );
        // Check conversation exists classify
        if (await this.findByIdAndConversationId(id, conversationId))
            throw new CustomError(ErrorType.CLASSIFY_CONVERSATION_EXISTS);
        // Update
        const queryResult = await Classify.updateOne(
            { _id: id, userId },
            {
                $push: {
                    conversationIds: conversationId,
                },
            }
        );
        if (queryResult.nModified === 0)
            throw new NotFoundError(ErrorType.CLASSIFY_UPDATE_FAILED);
        //  Remove classify old
        await Classify.updateMany(
            {
                _id: { $ne: id },
                conversationIds: { $in: [conversationId] },
            },
            { $pull: { conversationIds: conversationId } }
        );
    }

    async deleteConversation(userId, id, conversationId) {
        ClassifyValidator.validateId(id);
        ClassifyValidator.validateId(conversationId);

        await MemberService.findByConversationIdAndUserId(
            conversationId,
            userId
        );

        const queryResult = await Classify.updateOne(
            { _id: id, userId },
            {
                $pull: {
                    conversationIds: conversationId,
                },
            }
        );

        if (queryResult.nModified === 0)
            throw new NotFoundError(ErrorType.CLASSIFY_DELETE_FAILED);
    }
}

module.exports = new ClassifyService();
