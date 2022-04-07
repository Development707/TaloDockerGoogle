const SearchService = require('../services/SearchService');

class SearchController {
    // [GET] /conversation
    async conversation(req, res, next) {
        const userId = req.id;
        const { q, page = 0, size = 20 } = req.query;
        try {
            const conversations = await SearchService.conversation(
                userId,
                q,
                parseInt(page),
                parseInt(size)
            );

            res.json(conversations);
        } catch (err) {
            next(err);
        }
    }
    // [GET] /coversation
    async message(req, res, next) {
        const userId = req.id;
        const { q, page = 0, size = 20 } = req.query;

        try {
            const coversations = await SearchService.message(
                userId,
                q,
                parseInt(page),
                parseInt(size)
            );

            res.json(coversations);
        } catch (err) {
            next(err);
        }
    }
    // [GET] /coversation
    async file(req, res, next) {
        const id = req.id;
        const { q, page = 0, size = 20 } = req.query;

        try {
            const coversations = await SearchService.file(
                id,
                q,
                parseInt(page),
                parseInt(size)
            );

            res.json(coversations);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SearchController();
