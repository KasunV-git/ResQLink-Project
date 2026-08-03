const express = require('express');
const router  = express.Router();
const {
  submitReport,
  getMyReports,
  getReportById,
  getDisasters,
  getNearbyHazards,
  getAllReports,
  updateReportStatus,
} = require('../controllers/disasterController');
const { uploadReport } = require('../config/multer');

// Optional protect middleware helper
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No authentication token provided.' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resqlink_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

router.post('/report', protect, uploadReport.array('media', 3), submitReport);
router.get('/my-reports', protect, getMyReports);
router.get('/report/:id', protect, getReportById);
router.get('/nearby', getNearbyHazards);
router.get('/', getDisasters);

// Admin Routes
router.get('/admin/reports', protect, getAllReports);
router.put('/admin/report/:id/status', protect, updateReportStatus);

module.exports = router;