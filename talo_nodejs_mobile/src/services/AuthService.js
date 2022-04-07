const User = require('../models/User');

const UserValidate = require('../validate/UserValidate');
const commonUtils = require('../utils/commonUtils');
const mailerUtils = require('../utils/mailerUtils');
const { sendOTP } = require('../app/twilioApp');
const templateUtils = require('../utils/templateUtils');
const tokenUtils = require('../utils/tokenUtils');

const AuthError = require('../exceptions/AuthError');
const CustomError = require('../exceptions/CustomError');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType } = require('../lib/Constants');

class AuthService {
    async login(username, password, userAgent) {
        UserValidate.validateLogin(username, password);
        if (
            UserValidate.validatePhone(username) &&
            /^([0])+([0-9]{9})\b/.test(username)
        )
            username = '+84' + username.substring(1);
        const { _id } = await User.findByUsernameAndPassword(
            username,
            password,
        );

        return await this.generateToken(_id, userAgent);
    }

    async registry(userInfo) {
        const registryInfo = await UserValidate.validateRegister(userInfo);

        // const avatarColor = await classifyService.getRandomColor();
        const newUser = new User({
            ...registryInfo,
            // avatarColor,
            isActived: false,
        });
        const saveUser = await newUser.save();
        const { _id, username } = saveUser;
        this.sendOTP(_id, username);
    }

    async verifyAccount(username, otpVerify) {
        UserValidate.validateVerifyAccount(username, otpVerify);

        const user = await User.findByUsernameNotActived(username);
        const { otp, otpTime } = user;
        UserValidate.validateOtpVerify(otpVerify, otp, otpTime);

        await User.updateOne({ username }, { isActived: true });
    }

    async refreshToken(refreshToken, userAgent) {
        const { id } = tokenUtils.verifyToken(refreshToken);

        const user = await User.findOne({
            _id: id,
            isActived: true,
            tokens: {
                $elemMatch: { token: refreshToken, userAgent },
            },
        });

        if (!user) throw new AuthError(ErrorType.TOKEN_INVALID);

        return await tokenUtils.generateToken(
            { id, userAgent },
            process.env.JWT_LIFE_ACCESS_TOKEN,
        );
    }

    async generateToken(id, userAgent) {
        const token = await tokenUtils.generateToken(
            { id, userAgent },
            process.env.JWT_LIFE_ACCESS_TOKEN,
        );
        const refreshToken = await tokenUtils.generateToken(
            { id, userAgent },
            process.env.JWT_LIFE_REFRESH_TOKEN,
        );

        await User.updateOne({ _id: id }, { $pull: { tokens: { userAgent } } });
        await User.updateOne(
            { _id: id },
            { $push: { tokens: { token: refreshToken, userAgent } } },
        );

        return {
            token,
            refreshToken,
        };
    }

    async sendOTP(_id, username) {
        const Minute = process.env.OTP_EXPIRE_MINUTE * 60000;
        const otp = commonUtils.getRandomOTP();

        const otpTime = new Date();
        otpTime.setTime(otpTime.getTime() + Minute);
        await User.updateOne({ _id }, { otp, otpTime });

        if (UserValidate.validateEmail(username))
            await mailerUtils.sendMail(
                username,
                'TALO - OTP xác nhận tài khoản',
                templateUtils.getOtpHtml(otp, process.env.OTP_EXPIRE_MINUTE),
            );
        if (UserValidate.validatePhone(username)) {
            if (/^([0])+([0-9]{9})\b/.test(username))
                username = '+84' + username.substring(1);
            sendOTP(username, otp);
        }
    }

    async resetOTP(username) {
        if (!UserValidate.validateUsername(username))
            throw new CustomError(ErrorType.USERNAME_INVALID);

        const user = await User.findOne({ username });
        if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

        this.sendOTP(user._id, username);
    }

    async forgotPassword(username, otpVerify, password) {
        UserValidate.validateForgotPassword(username, otpVerify, password);

        const user = await User.findOne({
            username,
            isActived: true,
        });
        if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

        const { otp, otpTime } = user;

        UserValidate.validateOtpVerify(otpVerify, otp, otpTime);

        user.password = password;
        user.save();
    }
}

module.exports = new AuthService();
