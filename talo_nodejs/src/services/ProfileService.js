const User = require('../models/User');
const UserSevice = require('../services/UserSevice');
const AuthService = require('../services/AuthService');
const UserValidate = require('../validate/UserValidate');
const { deleteFile } = require('../middlewares/uploadFile');
const { ErrorType } = require('../lib/Constants');
const CustomError = require('../exceptions/CustomError');

class ProfileService {
    async updateProfile(id, profile) {
        const profileWasValidate = UserValidate.validateProfile(profile);

        await User.updateOne({ _id: id }, { ...profileWasValidate });
    }

    async updateAvatar(_id, url, name, oldName) {
        deleteFile(process.env.CLOUD_BUCKET_AVATAR, oldName).catch((err) =>
            console.warn(ErrorType.FILE_AVATAR_NOT_FOUND, err.message),
        );
        await User.updateOne({ _id }, { avatar: { url, name } });
    }

    async updateCoverPhoto(_id, url, name, oldName) {
        deleteFile(process.env.CLOUD_BUCKET_COVER_PHOTO, oldName).catch((err) =>
            console.warn(ErrorType.FILE_COVER_PHOTO_NOT_FOUND, err.message),
        );
        await User.updateOne({ _id }, { coverPhoto: { url, name } });
    }

    async getContacts(id) {
        const user = await User.checkById(id);
        const contacts = user.contacts;

        const result = [];
        for (const userContact of contacts) {
            const { name, phone } = userContact;

            try {
                const searchUser = await UserSevice.getStatusFriend(id, phone);

                result.push({ ...searchUser, phone: phone, isExists: true });
            } catch (err) {
                result.push({ name, phone: phone, isExists: false });
            }
        }

        return result;
    }

    async syncContacts(_id, contacts) {
        UserValidate.validateContacts(contacts);
        for (let contact of contacts) {
            if (/^([0])+([0-9]{9})\b/.test(contact.phone))
                contact.phone = '+84' + contact.phone.substring(1);
        }
        await User.checkById(_id);
        await User.updateOne({ _id }, { $set: { contacts } });
    }

    async changePassword(id, currentPassword, newPassword) {
        UserValidate.validateChangePassword(currentPassword, newPassword);
        const { password } = await User.checkById(id);
        if (!(await User.checkPassword(password, currentPassword))) {
            throw new CustomError(ErrorType.INCORRECT_PASSWORD);
        }
        await User.changePassword(id, newPassword);
    }

    async logoutAll(_id, currentPassword, userAgent) {
        const { password } = await User.checkById(_id);
        if (!User.checkPassword(password, currentPassword)) {
            throw new CustomError(ErrorType.INCORRECT_PASSWORD);
        }

        await User.updateOne(
            { _id },
            { $set: { timeLogoutAll: new Date(), refreshTokens: [] } },
        );

        return await AuthService.generateToken(_id, userAgent);
    }
}

module.exports = new ProfileService();
