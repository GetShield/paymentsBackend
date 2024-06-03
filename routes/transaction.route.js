import {
    getTransactions,
    getTransactionById,
    createTransaction,
} from '../services/TransactionBlockChainService';
// @ts-nocheck
// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const transactions = await getTransactions();
    res.json(transactions);
});

router.get('/:id', async (req, res) => {
    const transaction = await getTransactionById(req.params.id);
    res.json(transaction);
});

router.post('/', async (req, res) => {
    const newTransaction = await createTransaction(req.body);
    res.json(newTransaction);
});

router.put('/:id', async (req, res) => {
    // const updatedTransaction = await updateTransaction(req.params.id, req.body);
    // res.json(updatedTransaction);
});

router.delete('/:id', async (req, res) => {
    // await deleteTransaction(req.params.id);
    // res.json({ message: 'Transaction deleted' });
});

export default router;