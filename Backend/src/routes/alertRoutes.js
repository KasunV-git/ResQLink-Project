// backend/src/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAlerts, getAlertById, acknowledgeAlert,
} = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAlerts);
router.get('/:id', protect, getAlertById);
router.post('/:id/acknowledge', protect, acknowledgeAlert);

module.exports = router;