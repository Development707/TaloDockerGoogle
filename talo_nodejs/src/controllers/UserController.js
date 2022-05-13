const UserService = require('../services/UserSevice');

class UserController {
    // [GET] /find/username/:username
    async getByUsername(req, res, next) {
        const id = req.id;
        const { username } = req.params;

        try {
            const user = await UserService.getStatusFriend(id, username);

            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /find/id/:userId
    async getById(req, res, next) {
        const id = req.id;
        const { userId } = req.params;

        try {
            const user = await UserService.getStatusFriendById(id, userId);

            res.json({id: userId, ...user});
        } catch (err) {
            next(err);
        }
    }

    // [GET]
    async findAll(req, res, next) {
        const { q, page = 0, size = 20 } = req.query;

        try {
            const users = await UserService.findAll(
                q,
                parseInt(page),
                parseInt(size),
            );

            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /:userId
    async updateUser(req, res, next) {
        const myId = req.id;
        const { userId } = req.params;

        try {
            await UserService.updateUser(myId, req.body, userId);

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /:userId/reset-password
    async resetPassword(req, res, next) {
        const myId = req.id;
        const { userId } = req.params;

        try {
            await UserService.resetPassword(myId, userId);

            res.json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();
