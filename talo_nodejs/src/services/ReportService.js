const Report = require('../models/Report');

const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');

class ReportService {
    async findAll() {
        let reports = await Report.find().lean();
        return reports;
    }

    async createReport(userId, body, type) {
        const { title, description = '' } = body;
        if (!title || title.length < 5)
            throw new CustomError(ErrorType.REPORT_TILE_INVALID);

        switch (type) {
            case 'APP':
                await new Report({ userId, title, description, type }).save();
                break;
            case 'USER':
                const userIsReport = body.userId;
                if (!userIsReport)
                    throw new CustomError(ErrorType.REPORT_USER_INVALID);
                this.validateId(userIsReport);
                await new Report({
                    userId,
                    title,
                    description,
                    userIsReport,
                    type,
                }).save();
                break;
            case 'CONVERSATION':
                const { conversationId } = body;
                if (!conversationId)
                    throw new CustomError(
                        ErrorType.REPORT_CONVERSATION_INVALID,
                    );
                this.validateId(conversationId);
                await new Report({
                    userId,
                    title,
                    description,
                    conversationIsReport: conversationId,
                    type,
                }).save();
                break;

            default:
                throw new CustomError(ErrorType.REPORT_TILE_INVALID);
        }
    }

    validateId(id) {
        try {
            ObjectId(id);
        } catch (error) {
            throw new CustomError(ErrorType.REPORT_ID_INVALID);
        }
    }
}

module.exports = new ReportService();
