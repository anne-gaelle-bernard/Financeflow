const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with proper configuration
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/financeflow';

mongoose.connect(mongoURL)
    .then(() => {
        console.log('✅ MongoDB connected successfully to:', mongoURL);
        console.log('📊 Database: financeflow');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Make sure MongoDB is running on localhost:27017');
        process.exit(1);
    });

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err);
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