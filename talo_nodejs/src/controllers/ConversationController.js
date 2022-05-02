const ConversationService = require('../services/ConversationService');

const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');
const { Emit } = require('../lib/ConstantsSocket');

class ConversationController {
    constructor(io, io2) {
        this.io = io;
        this.io2 = io2;

        this.createGroup = this.createGroup.bind(this);
        this.deleteById = this.deleteById.bind(this);
        this.createDual = this.createDual.bind(this);
        this.createSingle = this.createSingle.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
        this.joinWithLink = this.joinWithLink.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.leftTheGroup = this.leftTheGroup.bind(this);
        this.removeMember = this.removeMember.bind(this);
        this.addManagers = this.addManagers.bind(this);
        this.removeManagers = this.removeManagers.bind(this);
    }

    // [GET] /?name&type
    async findAll(req, res, next) {
        const id = req.id;
        const { name = '', type = 'ALL' } = req.query;
        let conversations;
        try {
            switch (type) {
                case 'ALL':
                    conversations = await ConversationService.findAll(id, name);
                    break;
                case 'DUAL':
                    conversations = await ConversationService.findDual(
                        id,
                        name,
                    );
                    break;
                case 'GROUP':
                    conversations = await ConversationService.findGroup(
                        id,
                        name,
                    );
                    break;
                default:
                    throw new CustomError(ErrorType.CONVERSATION_TYPE_INVALID);
            }

            res.json(conversations);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /
    async createGroup(req, res, next) {
        const id = req.id;
        const { name = '', userIds } = req.body;

        try {
            if (!Array.isArray(userIds)) {
                throw new CustomError(ErrorType.CONVERSATION_USERIDS_INVALID);
            }
            const conversationId = await ConversationService.createGroup(
                id,
                name,
                userIds,
            );

            const members = [id, ...new Set(userIds)];
            members.forEach((userId) => {
                this.io
                    .to(userId + '')
                    .emit(Emit.CONVERSATION_GROUP_CREATE, conversationId);
                this.io2
                    .to(userId + '')
                    .emit(Emit.CONVERSATION_GROUP_CREATE, conversationId);
            });

            res.status(201).json({ id: conversationId });
        } catch (err) {
            next(err);
        }
    }

    // [POST] /dual/:userId
    async createDual(req, res, next) {
        const id = req.id;
        const userId = req.params.userId;

        try {
            const result = await ConversationService.createDual(id, userId);

            if (!result.isExists) {
                this.io
                    .to(userId)
                    .emit(Emit.CONVERSATION_DUA_CREATE, result.conversationId);
                this.io2
                    .to(userId)
                    .emit(Emit.CONVERSATION_DUA_CREATE, result.conversationId);
            }

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /cloud
    async createSingle(req, res, next) {
        const userId = req.id;

        try {
            const result = await ConversationService.createSingle(userId);

            if (!result.isExists)
                this.io
                    .to(userId)
                    .emit(Emit.CONVERSATION_DUA_CREATE, result.conversationId);

            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:id
    async findById(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const conversation =
                await ConversationService.getByUserIdAndConversationId(
                    userId,
                    conversationId,
                );

            res.json(conversation);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id
    async deleteById(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            await ConversationService.deleteByUserIdAndConversationId(
                userId,
                conversationId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.CONVERSATION_DELETE, conversationId);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    //[PATCH]  /:id/name
    async changeName(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const name = req.body.name;

        try {
            const message = await ConversationService.changeName(
                conversationId,
                name,
                userId,
            );

            if (message) {
                this.io
                    .to(conversationId + '')
                    .emit(
                        Emit.CONVERSATION_CHANGE_NAME,
                        conversationId,
                        name,
                        message,
                    );
            }

            res.json();
        } catch (err) {
            next(err);
        }
    }

    //[PATCH] /:id/avatar
    // [PATCH] /:id/avatar/base64
    async changeAvatar(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const publicUrl = req.file.publicUrl;
        const filename = req.file.filename;

        try {
            const result = await ConversationService.changeAvatar(
                conversationId,
                publicUrl,
                filename,
                userId,
            );
            if (result) {
                const { avatar, lastMessage } = result;
                this.io
                    .to(conversationId + '')
                    .emit(
                        Emit.CONVERSATION_CHANGE_AVATAR,
                        conversationId,
                        avatar,
                        lastMessage,
                    );
                this.io
                    .to(conversationId + '')
                    .emit(Emit.MESSAGE_NEW, conversationId, lastMessage);
                res.json({ avatar, lastMessage });
            }
            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /:id/notify
    async changeNotify(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const isNotify = req.body.isNotify;

        try {
            await ConversationService.changeNotify(
                conversationId,
                isNotify,
                userId,
            );

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /:id/join-with-link
    async changeJoinWithLink(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const isStatus = req.body.isStatus;

        try {
            await ConversationService.changeJoinWithLink(
                conversationId,
                isStatus,
                userId,
            );

            res.json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/join-with-link
    async joinWithLink(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const message = await ConversationService.joinWithLink(
                conversationId,
                userId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(userId)
                .emit(Emit.CONVERSATION_MEMBER_ADD, conversationId);
            this.io
                .to(conversationId + '')
                .emit(Emit.CONVERSATION_MEMBER_UPDATE, conversationId);

            res.status(200).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:id/members
    async findAllMembers(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const users = await ConversationService.findAllMembers(
                conversationId,
                userId,
            );

            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/members
    async addMembers(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const body = req.body;

        try {
            if (!Array.isArray(body)) {
                throw new CustomError(
                    ErrorType.CONVERSATION_USERIDS_ADD_INVALID,
                );
            }
            const memberIds = [...new Set(body)].filter(
                (memberId) => memberId != userId,
            );
            const message = await ConversationService.addMembers(
                conversationId,
                memberIds,
                userId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            memberIds.forEach((memberId) =>
                this.io
                    .to(memberId)
                    .emit(Emit.CONVERSATION_MEMBER_ADD, conversationId),
            );
            this.io
                .to(conversationId + '')
                .emit(Emit.CONVERSATION_MEMBER_UPDATE, conversationId);

            res.status(201).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id/members
    async leftTheGroup(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const message = await ConversationService.leftTheGroup(
                conversationId,
                userId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(Emit.CONVERSATION_MEMBER_UPDATE, conversationId);

            res.status(204).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:conversationId/members/:memberId
    async removeMember(req, res, next) {
        const userId = req.id;
        const { conversationId, memberId } = req.params;

        try {
            const message = await ConversationService.removeMember(
                conversationId,
                memberId,
                userId,
            );

            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(Emit.CONVERSATION_MEMBER_UPDATE, conversationId);
            this.io
                .to(memberId)
                .emit(Emit.CONVERSATION_REMOVE_YOU, conversationId);
            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }

    // [POST] /:id/managers
    async addManagers(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const body = req.body;

        try {
            if (!Array.isArray(body)) {
                throw new CustomError(
                    ErrorType.CONVERSATION_USERIDS_ADD_INVALID,
                );
            }
            const managerIds = [...new Set(body)];
            const message = await ConversationService.addManagers(
                conversationId,
                managerIds,
                userId,
            );
            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(
                    Emit.CONVERSATION_MANAGER_ADD,
                    conversationId,
                    managerIds,
                );
            res.status(200).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id/managers
    async removeManagers(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;
        const body = req.body;

        try {
            if (!Array.isArray(body)) {
                throw new CustomError(
                    ErrorType.CONVERSATION_USERIDS_ADD_INVALID,
                );
            }
            const managerIds = [...new Set(body)];
            const message = await ConversationService.removeManagers(
                conversationId,
                managerIds,
                userId,
            );
            this.io
                .to(conversationId + '')
                .emit(Emit.MESSAGE_NEW, conversationId, message);
            this.io
                .to(conversationId + '')
                .emit(
                    Emit.CONVERSATION_MANAGER_DELETE,
                    conversationId,
                    managerIds,
                );
            res.status(200).json(message);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:id/short-info
    async getShortInfo(req, res, next) {
        const conversationId = req.params.id;

        try {
            const result = await ConversationService.getShortInfo(
                conversationId,
            );

            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    // [GET] /:id/view-last
    async getLastView(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            const lastViewOfMembers = await ConversationService.getLastView(
                conversationId,
                userId,
            );

            res.json(lastViewOfMembers);
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /:id/messages
    async deleteAllMessage(req, res, next) {
        const userId = req.id;
        const conversationId = req.params.id;

        try {
            await ConversationService.deleteAllMessage(conversationId, userId);

            res.status(204).json();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ConversationController;
