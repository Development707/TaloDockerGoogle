const router = require('express').Router();
const ProfileController = require('../controllers/ProfileController');
const {
    validFile,
    uploadToCloud,
    uploadToCloudBase64,
} = require('../middlewares/uploadFile');

const profileRoute = (io) => {
    const profileController = new ProfileController(io);
    router.get('/', profileController.getProfile);
    router.put('/', profileController.updateProfile);
    router.patch(
        '/avatar',
        validFile,
        uploadToCloud(process.env.CLOUD_BUCKET_AVATAR),
        profileController.updateAvatar,
    );
    router.patch(
        '/avatar/base64',
        uploadToCloudBase64(process.env.CLOUD_BUCKET_AVATAR),
        profileController.updateAvatar,
    );
    router.patch(
        '/cover-photo',
        validFile,
        uploadToCloud(process.env.CLOUD_BUCKET_COVER_PHOTO),
        profileController.updateCoverPhoto,
    );
    router.patch(
        '/cover-photo/base64',
        uploadToCloudBase64(process.env.CLOUD_BUCKET_COVER_PHOTO),
        profileController.updateCoverPhoto,
    );
    router.post('/contacts', profileController.syncContacts);
    router.get('/contacts', profileController.getContacts);
    router.patch('/change-password', profileController.changePassword);
    router.delete('/logout-all', profileController.logoutAll);

    return router;
};

module.exports = profileRoute;
