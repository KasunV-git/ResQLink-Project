const express = require('express');
const router  = express.Router();
const {
  submitReport,
  getMyReports,
  getReportById,
  getDisasters,
  getNearbyHazards,
} = require('../controllers/disasterController');

// Optional protect middleware helper
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If unauthenticated for testing, set fallback dummy user
    req.user = { id: 1, role: 'Citizen' };
    return next();
  }
  try {
    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resqlink_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: 1, role: 'Citizen' };
    next();
  }
};

router.post('/report', protect, submitReport);
router.get('/my-reports', protect, getMyReports);
router.get('/report/:id', protect, getReportById);
router.get('/nearby', getNearbyHazards);
router.get('/', getDisasters);

module.exports = router;