const Budget = require('../Models/BudgetModel');

// Get all budgets
exports.getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find()
            .populate('userId', 'username')
            .populate('categoryId', 'name');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching budgets' });
    }
};

// Get budgets by user ID
exports.getBudgetsByUser = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.params.userId })
            .populate('categoryId', 'name');
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching budgets' });
    }
};

// Get budget by ID
exports.getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id)
            .populate('userId', 'username')
            .populate('categoryId', 'name');
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching budget' });
    }
};

// Create a new budget
exports.createBudget = async (req, res) => {
    try {
        const { userId, categoryId, amount, month, year } = req.body;
        const newBudget = new Budget({
            userId,
            categoryId,
            amount,
            month,
            year
        });
        await newBudget.save();
        res.status(201).json({ message: 'Budget created successfully', budget: newBudget });
    } catch (error) {
        res.status(500).json({ error: 'Error creating budget' });
    }
};

// Update budget by ID
exports.updateBudget = async (req, res) => {
    try {
        const { categoryId, amount, month, year } = req.body;
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        if (categoryId) budget.categoryId = categoryId;
        if (amount) budget.amount = amount;
        if (month) budget.month = month;
        if (year) budget.year = year;
        await budget.save();
        res.status(200).json({ message: 'Budget updated successfully', budget });
    } catch (error) {
        res.status(500).json({ error: 'Error updating budget' });
    }
};

// Delete budget by ID
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting budget' });
    }
};
