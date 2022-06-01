const Report = require('../models/Report');

const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');
const validateConversation = require('../validate/ConversationValidate');
const redisUtils = require('../utils/redisUtils');

class ReportService {
    async findAll() {
        let reports = await Report.find().sort({ createdAt: -1 }).lean();
        const result = await Promise.all(
            reports.map(async (report) => {
                const user = await redisUtils.getShortUserInfo(report.userId);
                return {
                    id: report._id,
                    user: user,
                    type: report.type,
                    title: report.title,
                    description: report.description,
                    date: report.createdAt,
                };
            }),
        );
        return result;
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
                await redisUtils.getUserProfile(userIsReport);
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
                validateConversation.validateId(conversationId);
                const conversation = await redisUtils.getConversation(
                    conversationId,
                );
                validateConversation.validateIsExistUserId(
                    conversation,
                    userId,
                );
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
}

module.exports = new ReportService();
