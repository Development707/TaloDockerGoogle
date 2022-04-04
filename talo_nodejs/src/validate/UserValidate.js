const User = require('../models/User');
const commonUtils = require('../utils/commonUtils');
const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');
const Regex = require('../lib/Regex');
const dateUtils = require('../utils/dateUtils');

const UserValidate = {
    validateUsername: function (username) {
        if (
            !username ||
            (!this.validateEmail(username) && !this.validatePhone(username))
        )
            return false;

        return true;
    },

    validatePassword: (password) => {
        if (!password || password.length < 8 || password.length > 50)
            return false;

        return true;
    },

    validatePhone: (phone) => {
        if (!phone) return false;
        return Regex.PHONE_REGEX.test(phone);
    },

    validateContacts: function (contacts) {
        if (!contacts || !Array.isArray(contacts))
            throw new CustomError(ErrorType.CONTACTS_INVALID);

        contacts.forEach((phone) => {
            if (!phone.name || !phone.phone || !this.validatePhone(phone.phone))
                throw new CustomError(ErrorType.PHONE_INVALID);
        });
    },

    validateEmail: (email) => {
        if (!email) return false;

        return Regex.EMAIL_REGEX.test(String(email).toLowerCase());
    },

    validateDateOfBirth: (date) => {
        if (!date) return false;

        const { day, month, year } = date;
        if (!day || !month || !year) return false;

        const newDate = Date.parse(year + '/' + month + '/' + day);
        if (isNaN(newDate)) {
            return false;
        }

        // check năm phải >=1900s
        if (year < 1900) return false;
        // check tuổi phải >3
        if (newDate + 3 * 365 * 24 * 60 * 60 * 1000 > new Date()) return false;

        return true;
    },

    validateOTP: (otp) => {
        if (!otp) return false;
        const regex = /^[0-9]{6}$/g;

        return regex.test(otp);
    },

    validateOtpVerify: (otpVerify, OTP, otpTime) => {
        if (!OTP) throw new CustomError(ErrorType.OTP_INVALID);
        if (new Date() > otpTime) throw new CustomError(ErrorType.OTP_TIMEOUT);
        if (otpVerify !== OTP) throw new CustomError(ErrorType.OTP_INVALID);
    },

    validateLogin: function (username, password) {
        if (
            !this.validateUsername(username) ||
            !this.validatePassword(password)
        )
            throw new CustomError(ErrorType.LOGIN_INVALID);
    },

    validateRegister: async function (userInfo) {
        const { name, username, password } = userInfo;
        const error = {};

        if (!name || !Regex.NAME_REGEX.test(name))
            error.name = ErrorType.NAME_INVALID;

        if (!this.validateUsername(username))
            error.username = ErrorType.USERNAME_INVALID;
        else if (await User.findOne({ username }))
            error.username = ErrorType.USERNAME_EXISTS_INVALID;

        if (!this.validatePassword(password))
            error.password = ErrorType.PASSWORD_INVALID;

        if (!commonUtils.isEmpty(error)) throw new CustomError(error);

        return { name, username, password };
    },

    validateForgotPassword(username, otp, password) {
        if (!this.validatePassword(password))
            throw new CustomError(ErrorType.PASSWORD_INVALID);
        if (!this.validateUsername(username) || !this.validateOTP(otp))
            throw new CustomError(ErrorType.VERIFY_ACCOUNT_INVALID);
    },

    validateVerifyAccount: function (username, otp) {
        if (!this.validateUsername(username) || !this.validateOTP(otp))
            throw new CustomError(ErrorType.VERIFY_ACCOUNT_INVALID);
    },

    validateProfile: function (profile) {
        if (!profile) throw new CustomError(ErrorType.PROFILE_INVALID);

        const { name, dateOfBirth, gender } = profile;
        const error = {};

        if (!name || !Regex.NAME_REGEX.test(name))
            error.name = ErrorType.NAME_INVALID;
        if (!this.validateDateOfBirth(dateOfBirth))
            error.dateOfBirth = ErrorType.DATE_INVALID;
        if (gender !== 0 && gender !== 1)
            error.gender = ErrorType.GENDER_INVALID;

        if (!commonUtils.isEmpty(error)) throw new CustomError(error);

        return {
            name,
            dateOfBirth: dateUtils.toDateFromObject(dateOfBirth),
            gender: new Boolean(gender),
        };
    },

    validateAvatar: (file) => {
        const { mimetype } = file;

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png')
            throw new CustomError(ErrorType.AVATAR_INVALID);
    },

    validateChangePassword: function (currentPassword, newPassword) {
        if (
            !this.validatePassword(currentPassword) ||
            !this.validatePassword(newPassword)
        )
            throw new CustomError(ErrorType.PASSWORD_INVALID);
        if (currentPassword == newPassword) {
            throw new CustomError(ErrorType.NEW_PASSWORD_INVALID);
        }
    },
};

module.exports = UserValidate;
