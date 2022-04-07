const { auth } = require('../app/firebaseApp');
const { ErrorType } = require('../lib/Constants');

const authFirebase = async (req, res, next) => {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        return res.status(401).json({ message: ErrorType.TOKEN_NOT_FOUND });
    }
    if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
        res.status(401).json({ message: ErrorType.TOKEN_INVALID });
    }

    const token = headerToken.split(' ')[1];
    try {
        const user = await auth.verifyIdToken(token);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            err,
            message: ErrorType.TOKEN_EXPIRED,
        });
    }
};

module.exports = authFirebase;
