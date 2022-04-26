const userRouter = require('./UserRouter');
const authRouter = require('./AccountRouter');
const profileRouter = require('./ProfileRouter');
const friendRouter = require('./FriendRouter');
const classifyRouter = require('./ClassifyRouter');
const conversationRouter = require('./ConversationRouter');
const channelRouter = require('./ChannelRouter');
const messageRouter = require('./MessageRouter');
const stickerRouter = require('./StickerRouter');
const searchRouter = require('./SearchRouter');
const reportRouter = require('./ReportRouter');
const statisticRouter = require('./StatisticRouter');
const firebaseRouter = require('./FirebaseRouter');

const auth = require('../middlewares/auth');

const route = (app, io, io2) => {
    app.use('/account', authRouter);
    app.use('/profile', auth, profileRouter(io));
    app.use('/users', auth, userRouter);
    app.use('/friend', auth, friendRouter(io, io2));
    app.use('/classify', auth, classifyRouter);
    app.use('/conversations', auth, conversationRouter(io, io2));
    app.use('/channels', auth, channelRouter(io));
    app.use('/message', auth, messageRouter(io, io2));
    app.use('/sticker', auth, stickerRouter);
    // Other API
    app.use('/search', auth, searchRouter);
    app.use('/report', auth, reportRouter);
    app.use('/statistic', auth, statisticRouter);
    // Third-party API
    app.use('/firebase', firebaseRouter);
    // Test Api
    app.use('/', (req, res) => res.send('Welcome to TALO-API'));
};

module.exports = route;
