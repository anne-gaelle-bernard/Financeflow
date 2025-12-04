const Transaction = require('../Models/TransactionModel');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('userId', 'username email')
            .populate('categoryId', 'name');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// Get transactions by user ID
exports.getTransactionsByUser = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId })
            .populate('categoryId', 'name')
            .sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('userId', 'username email')
            .populate('categoryId', 'name');
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction' });
    }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { userId, categoryId, amount, type, description, date } = req.body;
        const newTransaction = new Transaction({
            userId,
            categoryId,
            amount,
            type,
            description,
            date: date || new Date()
        });
        await newTransaction.save();
        res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ error: 'Error creating transaction' });
    }
};

// Update transaction by ID
exports.updateTransaction = async (req, res) => {
    try {
        const { categoryId, amount, type, description, date } = req.body;
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        if (categoryId) transaction.categoryId = categoryId;
        if (amount) transaction.amount = amount;
        if (type) transaction.type = type;
        if (description) transaction.description = description;
        if (date) transaction.date = date;
        await transaction.save();
        res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        res.status(500).json({ error: 'Error updating transaction' });
    }
};

// Delete transaction by ID
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
};
