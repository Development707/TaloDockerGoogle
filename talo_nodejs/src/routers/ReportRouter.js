const router = require('express').Router();
const ReportController = require('../controllers/ReportController');

router.post('/app', ReportController.app);
router.post('/conversation', ReportController.conversation);
router.post('/user', ReportController.user);

module.exports = router;
