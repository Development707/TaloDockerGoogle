const ReportService = require('../services/ReportService');

class ReportController {
    // [GET] /
    async findAll(req, res, next) {
        try {
            const result = await ReportService.findAll();
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
    // [POST] /app
    async app(req, res, next) {
        const userId = req.id;
        try {
            const report = await ReportService.createReport(
                userId,
                req.body,
                'APP',
            );
            res.status(201).json(report);
        } catch (err) {
            next(err);
        }
    }
    // [POST] /conversation
    async conversation(req, res, next) {
        const userId = req.id;
        try {
            const report = await ReportService.createReport(
                userId,
                req.body,
                'CONVERSATION',
            );
            res.status(201).json(report);
        } catch (err) {
            next(err);
        }
    }
    // [POST] /user
    async user(req, res, next) {
        const userId = req.id;
        try {
            const report = await ReportService.createReport(
                userId,
                req.body,
                'USER',
            );
            res.status(201).json(report);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ReportController();
