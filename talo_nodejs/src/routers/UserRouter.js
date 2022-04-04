const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { role } = require('../middlewares/permission');

router.get('/find/username/:username', UserController.getByUsername);
router.get('/find/id/:userId', UserController.getById);

router.get('', role('ADMIN'), UserController.findAll);
router.patch('/:userId', role('ADMIN'), UserController.updateUser);
router.patch(
    '/:userId/reset-password',
    role('ADMIN'),
    UserController.resetPassword
);

module.exports = router;
