const User = require('../models/User');
const AuthService = require('../services/AuthService');
const NotFoundError = require('../exceptions/NotFoundError');
const { ErrorType } = require('../lib/Constants');

class FirebaseService {
    async verifyByEmail(userFirebase, password, userAgent) {
        let user = await User.findOne({ username: userFirebase.email }).lean();
        if (!user) {
            if (!password) password = userFirebase.email;
            user = await new User({
                name: userFirebase.name,
                username: userFirebase.email,
                isActived: userFirebase.email_verified,
                avatar: {
                    url: userFirebase.picture,
                    name: 'firebase-avatar.jpg',
                },
                password: password,
            }).save();
        }
        return await AuthService.generateToken(user._id + '', userAgent);
    }

    async verifyByPhone(userFirebase, password, userAgent) {
        let user = await User.findOne({
            username: userFirebase.phone_number,
        }).lean();
        if (!user) {
            if (!password) password = userFirebase.phone_number;
            user = await new User({
                name: userFirebase.phone_number,
                username: userFirebase.phone_number,
                password: password,
                isActived: true,
            }).save();
        }
        return await AuthService.generateToken(user._id + '', userAgent);
    }

    async loginByIdToken(userFirebase, userAgent) {
        let user = await User.findOne({
            username: { $in: [userFirebase.phone_number, userFirebase.email] },
        }).lean();
        if (user)
            return await AuthService.generateToken(user._id + '', userAgent);
        else throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);
    }
}

module.exports = new FirebaseService();
