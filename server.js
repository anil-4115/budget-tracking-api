
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import Transaction model
const Transaction = require('./Transaction');

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'Budget Tracking REST API is running'
    });
});

// CREATE - Add a new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// READ - Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({
            createdAt: -1
        });

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({
            error: 'Server error while fetching transactions'
        });
    }
});

// READ - Get a single transaction by ID
app.get('/api/transactions/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid transaction ID'
            });
        }

        const transaction = await Transaction.findById(
            req.params.id
        );

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({
            error: 'Server error while fetching transaction'
        });
    }
});

// UPDATE - Update a transaction by ID
app.put('/api/transactions/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid transaction ID'
            });
        }

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// DELETE - Delete a transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: 'Invalid transaction ID'
            });
        }

        const transaction = await Transaction.findByIdAndDelete(
            req.params.id
        );

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        res.status(200).json({
            message: 'Transaction deleted successfully',
            transaction
        });
    } catch (err) {
        res.status(500).json({
            error: 'Server error while deleting transaction'
        });
    }
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Start server only after MongoDB connects
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected successfully');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Startup failed:', err.message);
        process.exit(1);
    }
}

startServer();
