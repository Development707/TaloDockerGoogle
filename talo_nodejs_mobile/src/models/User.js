const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dateUtils = require('../utils/dateUtils');

const NotFoundError = require('../exceptions/NotFoundError');
const CustomError = require('../exceptions/CustomError');
const { ErrorType, TypeRole } = require('../lib/Constants');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: { url: String, name: String },
            default: {},
            _id: false,
        },
        coverPhoto: {
            type: { url: String, name: String },
            default: {},
            _id: false,
        },
        type: Boolean,
        dateOfBirth: {
            type: Date,
            default: new Date('2000-01-01'),
        },
        gender: {
            type: Boolean,
            default: false,
        },
        tokens: {
            type: [
                {
                    token: String,
                    userAgent: String,
                },
            ],
            default: [],
        },
        contacts: {
            type: [{ name: String, phone: String }],
            default: [],
        },
        otp: String,
        otpTime: Date,
        isActived: Boolean,
        isDeleted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: TypeRole,
            default: 'USER',
        },
        timeLogoutAll: {
            type: Date,
            default: new Date(),
        },
    },
    { timestamps: true }
);

userSchema.index({ name: 'text', username: 'text' });

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// isActived: true, isDeleted: false
userSchema.statics.checkById = async (_id) => {
    const user = await User.findOne({ _id, isActived: true, isDeleted: false });

    if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

    return user;
};
// isActived: true
userSchema.statics.findByIdIsActive = async (_id) => {
    let user = await User.findOne(
        { _id, isActived: true },
        '-_id name username avatar coverPhoto dateOfBirth gender isActived'
    ).lean();

    if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);
    user.dateOfBirth = dateUtils.toObject(user.dateOfBirth);
    return user;
};
// isActived: true
userSchema.statics.findByUsername = async (username) => {
    const user = await User.findOne(
        {
            username,
            isActived: true,
        },
        '_id name avatar coverPhoto dateOfBirth gender'
    ).lean();

    if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);
    user.dateOfBirth = dateUtils.toObject(user.dateOfBirth);
    return user;
};
// isActived: false,
userSchema.statics.findByUsernameNotActived = async (username) => {
    const user = await User.findOne({
        username,
        isActived: false,
    }).lean();

    if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

    return user;
};
// isActived: true, isDeleted: false
userSchema.statics.findByUsernameAndPassword = async (username, password) => {
    const user = await User.findOne({
        username,
        isActived: true,
        isDeleted: false,
    }).lean();

    if (!user) throw new NotFoundError(ErrorType.USERNAME_NOT_FOUND);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new CustomError(ErrorType.INCORRECT_PASSWORD);

    return user;
};
userSchema.statics.checkPassword = async (userPassword, currentPassword) => {
    return await bcrypt.compare(currentPassword, userPassword);
};
userSchema.statics.changePassword = async (_id, newPassword) => {
    newPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id }, { $set: { password: newPassword } });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
