const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/financeflow').then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.log('MongoDB connection error:', err);
});

// Routes
const usersRoute = require('./Route/UsersRoute');
const transactionRoute = require('./Route/TransactionRoute');
const categoryRoute = require('./Route/CategoryRoute');
const budgetRoute = require('./Route/BudgetRoute');
const reportRoute = require('./Route/ReportRoute');

app.get('/', (req, res) => {
    res.status(200).send('Financeflow Backend is running');
});

// API Routes
app.use('/api/users', usersRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/budgets', budgetRoute);
app.use('/api/reports', reportRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});