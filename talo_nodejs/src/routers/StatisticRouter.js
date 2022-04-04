const router = require('express').Router();
const StatisticController = require('../controllers/StatisticController');

const { roles } = require('../middlewares/permission');

router.get('/', roles(['ADMIN']), StatisticController.general);
router.delete(
    '/clear-cache',
    roles(['ADMIN', 'USER']),
    StatisticController.clearRedis,
);

module.exports = router;
