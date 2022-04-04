const ForbidError = require('../exceptions/ForbidError');
const { Permission } = require('../lib/Constants');

const role = (roleName = 'USER') => {
    return async (req, res, next) => {
        if (req.role == roleName) next();
        else next(new ForbidError(Permission.USER_PERMISSION_DENIED));
    };
};

const roles = (roleNames = ['USER']) => {
    return async (req, res, next) => {
        if (roleNames.includes(req.role)) next();
        else next(new ForbidError(Permission.USER_PERMISSION_DENIED));
    };
};

module.exports = { role, roles };
