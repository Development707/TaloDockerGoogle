const FriendService = require('../services/FriendService');

const { Emit } = require('../lib/ConstantsSocket');
const redisUtils = require('../utils/redisUtils');

class FriendController {
    constructor(io, io2) {
        this.io = io;
        this.io2 = io2;
        this.sendRequest = this.sendRequest.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteFriendRequest = this.deleteFriendRequest.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
    }

    // [GET] /?name
    async findByName(req, res, next) {
        const id = req.id;
        const { name = '' } = req.query;

        try {
            const friends = await FriendService.findByName(id, name);

            res.json(friends);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:userId
    async delete(req, res, next) {
        const id = req.id;
        const userId = req.params.userId;
        try {
            await FriendService.delete(id, userId);

            this.io.to(userId).emit(Emit.FRIEND_DELETE, id);
            this.io2.to(userId).emit(Emit.FRIEND_DELETE, id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /friend-requests
    async getListRequest(req, res, next) {
        const id = req.id;
        try {
            const listRequest = await FriendService.getListRequest(id);

            res.json(listRequest);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /friend-requests
    async acceptFriendRequest(req, res, next) {
        const id = req.id;
        const userId = req.body.userId;

        try {
            const result = await FriendService.acceptFriendRequest(id, userId);
            const { conversationId, isExists, message } = result;

            const { name, avatar } = await redisUtils.getUserProfile(id);

            this.io.to(userId).emit(Emit.FRIEND_ACCEPT, { id, name, avatar });

            if (isExists) {
                this.io
                    .to(conversationId + '')
                    .emit(Emit.MESSAGE_NEW, conversationId, message);
                this.io2
                    .to(conversationId + '')
                    .emit(Emit.MESSAGE_NEW, conversationId, message);
            } else {
                this.io
                    .to(id)
                    .emit(Emit.CONVERSATION_DUA_CREATE, conversationId);
                this.io
                    .to(userId)
                    .emit(Emit.CONVERSATION_DUA_CREATE, conversationId);
                this.io2
                    .to(id)
                    .emit(Emit.CONVERSATION_DUA_CREATE, conversationId);
                this.io2
                    .to(userId)
                    .emit(Emit.CONVERSATION_DUA_CREATE, conversationId);
            }

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /friend-requests/:userId
    async deleteFriendRequest(req, res, next) {
        const id = req.id;
        const userId = req.params.userId;

        try {
            await FriendService.deleteRequest(userId, id);
            this.io.to(userId).emit(Emit.FRIEND_REQUEST_DELETE, id);
            this.io2.to(userId).emit(Emit.FRIEND_REQUEST_DELETE, id);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /friend-requests/me
    async getListRequestsByMe(req, res, next) {
        const id = req.id;
        try {
            const listRequest = await FriendService.getListRequestsByMe(id);

            res.json(listRequest);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /friend-requests/me
    async sendRequest(req, res, next) {
        const id = req.id;
        const { userId, message } = req.body;
        try {
            await FriendService.sendRequest(id, userId, message);

            const { name, avatar } = await redisUtils.getUserProfile(id);
            this.io
                .to(userId)
                .emit(Emit.FRIEND_REQUEST_SEND, { id, message, name, avatar });

            this.io2
                .to(userId)
                .emit(Emit.FRIEND_REQUEST_SEND, { id, message, name, avatar });

            res.status(201).json();
        } catch (err) {
            next(err);
        }
    }

    // [DELETE]  /friend-requests/me/:userId
    async deleteRequest(req, res, next) {
        const id = req.id;
        const userId = req.params.userId;

        try {
            await FriendService.deleteRequest(id, userId);
            this.io.to(userId).emit(Emit.FRIEND_REQUEST_BY_ME_DELETE, id);
            this.io2.to(userId).emit(Emit.FRIEND_REQUEST_BY_ME_DELETE, id);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [GET] /suggest
    async getSuggest(req, res, next) {
        const id = req.id;
        const { page = 0, size = 12 } = req.query;

        try {
            const suggestFriends = await FriendService.getSuggest(
                id,
                parseInt(page),
                parseInt(size),
            );

            res.json(suggestFriends);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = FriendController;
