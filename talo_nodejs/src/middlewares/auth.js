const User = require('../models/User');
const tokenUtils = require('../utils/tokenUtils');
const { ErrorType } = require('../lib/Constants');

const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error(ErrorType.TOKEN_NOT_FOUND);
        }
        const token = req.header('Authorization').replace('Bearer ', '');
        const source = req.headers['user-agent'];
        const JwtPayload = tokenUtils.verifyToken(token);
        const user = await User.checkById(JwtPayload.id);

        if (!user || !JwtPayload.userAgent || !JwtPayload.createdAt)
            throw new Error(ErrorType.TOKEN_INVALID);
        if (source !== JwtPayload.userAgent)
            throw new Error(ErrorType.TOKEN_INVALID);
        if (new Date(JwtPayload.createdAt) < new Date(user.timeLogoutAll))
            throw new Error(ErrorType.TOKEN_EXPIRED);

        req.id = JwtPayload.id;
        req.role = user.role;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: err.message,
        });
    }
};
module.exports = auth;
