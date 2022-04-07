const router = require('express').Router();
const SearchController = require('../controllers/SearchController');

router.get('/conversation', SearchController.conversation);
router.get('/message', SearchController.message);
router.get('/file', SearchController.file);

module.exports = router;
