const router = require('express').Router();
const FirebaseController = require('../controllers/FirebaseController');
const authFirebase = require('../middlewares/firebaseAuth');

router.post('/auth/email', authFirebase, FirebaseController.verifyByEmail);
router.post('/auth/phone', authFirebase, FirebaseController.verifyByPhone);
router.post('/auth/id-token', authFirebase, FirebaseController.loginByIdToken);

module.exports = router;
