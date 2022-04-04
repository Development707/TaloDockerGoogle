const router = require('express').Router();
const accountController = require('../controllers/AccountController');

router.post('/login', accountController.login);
router.post('/register', accountController.registry);
router.post('/forgot-password', accountController.forgotPassword);
router.post('/verify-account', accountController.verifyAccount);
router.post('/refresh-token', accountController.refreshToken);
router.post('/reset-otp', accountController.resetOtp);
router.get('/info/:username', accountController.userInfo);

module.exports = router;
