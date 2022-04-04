const jwt = require('jsonwebtoken');
const CustomError = require('../exceptions/CustomError');
const { ErrorType } = require('../lib/Constants');

// Data, JwtPayload: { id, userAgent }
const tokenUtils = {
    generateToken: async (data, tokenLife) => {
        if (!data) return null;
        return await jwt.sign(
            { ...data, createdAt: new Date() },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: tokenLife,
            }
        );
    },
    verifyToken: (token) => {
        if (!token) return new CustomError(ErrorType.TOKEN_INVALID);
        try {
            return jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return new CustomError(ErrorType.TOKEN_EXPIRED);
            }
            throw error;
        }
    },
};

module.exports = tokenUtils;
