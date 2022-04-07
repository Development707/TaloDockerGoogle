const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const commonUtils = require('../utils/commonUtils');
const { ErrorType } = require('../lib/Constants');
const CustomError = require('../exceptions/CustomError');
const ObjectId = require('mongoose').Types.ObjectId;

function validateQuery(query) {
    if (!query) throw new CustomError(ErrorType.SEARCH_QUERY_INVALID);
}

class SearchService {
    async conversation(userId, q, page, size) {
        validateQuery(q);

        const total = await Conversation.countDocuments({
            $text: { $search: q },
            members: userId,
        });

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            total
        );

        let conversations = await Conversation.aggregate([
            { $match: { $text: { $search: q }, members: ObjectId(userId) } },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: 1,
                    avatar: 1,
                    type: 1,
                    numMembers: { $size: '$members' },
                },
            },
            { $skip: skip },
            { $limit: limit },
        ]);
        return { data: conversations, page, size, totalPages };
    }

    async message(userId, q, page, size) {
        validateQuery(q);

        const total = await Message.countDocuments({
            userId,
            type: 'TEXT',
            isDeleted: false,
            $text: { $search: q },
        });

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            total
        );

        const messages = await Message.aggregate([
            {
                $match: {
                    userId: ObjectId(userId),
                    type: 'TEXT',
                    isDeleted: false,
                    $text: { $search: q },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    content: 1,
                    conversationId: 1,
                    channelId: 1,
                },
            },
            { $skip: skip },
            { $limit: limit },
        ]);
        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }

    async file(userId, q, page, size) {
        validateQuery(q);

        const total = await Message.countDocuments({
            userId,
            type: 'FILE',
            isDeleted: false,
            $text: { $search: q },
        });

        const { skip, limit, totalPages } = commonUtils.getPagination(
            page,
            size,
            total
        );

        const messages = await Message.aggregate([
            {
                $match: {
                    userId: ObjectId(userId),
                    type: 'FILE',
                    isDeleted: false,
                    $text: { $search: q },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    content: 1,
                    conversationId: 1,
                    channelId: 1,
                },
            },
            { $skip: skip },
            { $limit: limit },
        ]);
        return {
            data: messages,
            page,
            size,
            totalPages,
        };
    }
}

module.exports = new SearchService();
