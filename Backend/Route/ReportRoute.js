const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/ReportController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// All report routes are protected
router.use(verifyToken);

// Get all reports
router.get('/', reportController.getAllReports);

// Get reports by user ID
router.get('/user/:userId', reportController.getReportsByUser);

// Get report by ID
router.get('/:id', reportController.getReportById);

// Create a new report
router.post('/', reportController.createReport);

// Update report by ID
router.put('/:id', reportController.updateReport);

// Delete report by ID
router.delete('/:id', reportController.deleteReport);

module.exports = router;
