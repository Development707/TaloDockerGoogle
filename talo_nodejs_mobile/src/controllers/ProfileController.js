const ProfileService = require('../services/ProfileService.js');
const redisUtils = require('../utils/redisUtils');
const { Emit } = require('../lib/ConstantsSocket');

class ProfileController {
    constructor(io) {
        this.io = io;
        this.logoutAll = this.logoutAll.bind(this);
    }

    // [GET] /
    async getProfile(req, res, next) {
        const id = req.id;
        try {
            let user = await redisUtils.getUserProfile(id);
            user.id = id;
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /
    async updateProfile(req, res, next) {
        const id = req.id;

        try {
            await ProfileService.updateProfile(id, req.body);
            await redisUtils.removeProfile(id);
            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /avatar
    async updateAvatar(req, res, next) {
        const id = req.id;
        try {
            let cacheUser = await redisUtils.getUserProfile(id);

            await ProfileService.updateAvatar(
                id,
                req.file.publicUrl,
                req.file.filename,
                cacheUser.avatar.name
            );
            await redisUtils.removeProfile(id);

            return res.json({
                filename: req.file.filename,
                publicUrl: req.file.publicUrl,
            });
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /cover-photo
    async updateCoverPhoto(req, res, next) {
        const id = req.id;
        try {
            let cacheUser = await redisUtils.getUserProfile(id);

            await ProfileService.updateCoverPhoto(
                id,
                req.file.publicUrl,
                req.file.filename,
                cacheUser.coverPhoto.name
            );
            await redisUtils.removeProfile(id);

            return res.json({
                filename: req.file.filename,
                publicUrl: req.file.publicUrl,
            });
        } catch (err) {
            next(err);
        }
    }

    // [POST] /contacts
    async syncContacts(req, res, next) {
        const id = req.id;
        const contacts = req.body;

        try {
            await ProfileService.syncContacts(id, contacts);

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /contacts
    async getContacts(req, res, next) {
        const id = req.id;

        try {
            const phoneBooks = await ProfileService.getContacts(id);

            res.json(phoneBooks);
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /change-password
    async changePassword(req, res, next) {
        const id = req.id;
        const { currentPassword, newPassword } = req.body;

        try {
            await ProfileService.changePassword(
                id,
                currentPassword,
                newPassword
            );

            res.status(200).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /logout-all
    async logoutAll(req, res, next) {
        const id = req.id;
        const { password, key } = req.body;
        const userAgent = req.headers['user-agent'];

        try {
            const tokenAndRefreshToken = await ProfileService.logoutAll(
                id,
                password,
                userAgent
            );

            this.io.to(id).emit(Emit.USER_LOGOUT_ALL, { key });

            res.status(200).json(tokenAndRefreshToken);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProfileController;
