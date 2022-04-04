const StatisticService = require('../services/StatisticService');

class StatisticController {
    // [GET] /
    async general(req, res, next) {
        const userId = req.id;
        try {
            const result = await StatisticService.general(userId);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /clear-cache
    async clearRedis(req, res, next) {
        const { type = 'ALL' } = req.query;
        try {
            await StatisticService.clearRedis(type);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StatisticController();
