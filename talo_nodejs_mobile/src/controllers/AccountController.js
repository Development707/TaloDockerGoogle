const AuthService = require('../services/AuthService');
const UserService = require('../services/UserSevice');

class AuthController {
    // [POST] /registry
    async registry(req, res, next) {
        try {
            await AuthService.registry(req.body);

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /verify-account
    async verifyAccount(req, res, next) {
        const { username, otp } = req.body;

        try {
            await AuthService.verifyAccount(username, otp);

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /login
    async login(req, res, next) {
        const { username, password } = req.body;
        const userAgent = req.headers['user-agent'];

        try {
            const { token, refreshToken } = await AuthService.login(
                username,
                password,
                userAgent
            );
            res.json({ token, refreshToken });
        } catch (err) {
            next(err);
        }
    }

    // [POST] /forgot-password
    async forgotPassword(req, res, next) {
        const { username, otp, password } = req.body;
        try {
            await AuthService.forgotPassword(username, otp + '', password);

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /refresh-token
    async refreshToken(req, res, next) {
        const { refreshToken } = req.body;
        const userAgent = req.headers['user-agent'];

        try {
            const token = await AuthService.refreshToken(
                refreshToken,
                userAgent
            );

            res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    // [POST] /reset-otp
    async resetOtp(req, res, next) {
        const { username } = req.body;
        try {
            await AuthService.resetOTP(username);

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /info/:username
    async userInfo(req, res, next) {
        const { username } = req.params;

        try {
            const user = await UserService.getShortUserInfo(username);

            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
