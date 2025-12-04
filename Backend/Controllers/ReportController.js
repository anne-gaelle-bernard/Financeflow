const Report = require('../Models/ReportModel');

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'username email');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reports' });
    }
};

// Get reports by user ID
exports.getReportsByUser = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.params.userId })
            .sort({ year: -1, month: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reports' });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('userId', 'username email');
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching report' });
    }
};

// Create a new report
exports.createReport = async (req, res) => {
    try {
        const { userId, month, year, totalIncome, totalExpense } = req.body;
        const balance = totalIncome - totalExpense;
        const newReport = new Report({
            userId,
            month,
            year,
            totalIncome,
            totalExpense,
            balance
        });
        await newReport.save();
        res.status(201).json({ message: 'Report created successfully', report: newReport });
    } catch (error) {
        res.status(500).json({ error: 'Error creating report' });
    }
};

// Update report by ID
exports.updateReport = async (req, res) => {
    try {
        const { totalIncome, totalExpense } = req.body;
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        if (totalIncome !== undefined) report.totalIncome = totalIncome;
        if (totalExpense !== undefined) report.totalExpense = totalExpense;
        report.balance = report.totalIncome - report.totalExpense;
        await report.save();
        res.status(200).json({ message: 'Report updated successfully', report });
    } catch (error) {
        res.status(500).json({ error: 'Error updating report' });
    }
};

// Delete report by ID
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting report' });
    }
};
