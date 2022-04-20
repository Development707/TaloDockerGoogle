const FirebaseService = require('../services/FirebaseService');

class FirebaseController {
    async verifyByEmail(req, res, next) {
        const user = req.user;
        const userAgent = req.headers['user-agent'];
        const { password } = req.body;
        try {
            const result = await FirebaseService.verifyByEmail(
                user,
                password,
                userAgent,
            );
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async verifyByPhone(req, res, next) {
        const user = req.user;
        const userAgent = req.headers['user-agent'];
        const { password } = req.body;
        try {
            const result = await FirebaseService.verifyByPhone(
                user,
                password,
                userAgent,
            );
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async loginByIdToken(req, res, next) {
        const user = req.user;
        const userAgent = req.headers['user-agent'];
        try {
            const result = await FirebaseService.loginByIdToken(
                user,
                userAgent,
            );
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new FirebaseController();
