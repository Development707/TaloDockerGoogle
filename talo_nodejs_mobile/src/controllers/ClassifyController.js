const ClassifyService = require('../services/ClassifyService');

class ClassifyController {
    // [GET] /
    async findAll(req, res, next) {
        const id = req.id;

        try {
            const listResult = await ClassifyService.findAll(id);

            res.json(listResult);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /
    async add(req, res, next) {
        const id = req.id;
        const classify = req.body;

        try {
            const result = await ClassifyService.add(id, classify);

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /
    async update(req, res, next) {
        const id = req.id;
        const classify = req.body;

        try {
            const result = await ClassifyService.update(id, classify);

            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /
    async delete(req, res, next) {
        const id = req.id;
        const classifyId = req.params.id;

        try {
            await ClassifyService.delete(id, classifyId);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /conversations/:id
    async findById(req, res, next) {
        const userId = req.id;
        const classifyId = req.params.id;

        try {
            const conversations = await ClassifyService.findByIdAndUserId(
                classifyId,
                userId
            );

            res.json(conversations);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /conversations
    async addConversation(req, res, next) {
        const userId = req.id;
        const { id, conversationId } = req.params;

        try {
            await ClassifyService.addConversation(userId, id, conversationId);

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /conversations
    async deleteConversation(req, res, next) {
        const userId = req.id;
        const { id, conversationId } = req.params;

        try {
            await ClassifyService.deleteConversation(
                userId,
                id,
                conversationId
            );

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ClassifyController();
