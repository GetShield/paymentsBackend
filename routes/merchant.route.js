// routes/merchantRoutes.js
// @ts-nocheck
const express = require('express');
const router = express.Router();
const MerchantService = require('../services/merchantService');
import authorize from '../middlewares/authorize';

router.get('/', authorize, async (req, res) => {
    const merchants = await MerchantService.getMerchants();
    res.json(merchants);
});

router.get('/:id', authorize, async (req, res) => {
    const merchant = await MerchantService.getMerchantById(req.params.id);
    res.json(merchant);
});

router.post('/', authorize, async (req, res) => {
    const newMerchant = await MerchantService.createMerchant(req.body);
    res.json(newMerchant);
});

router.put('/:id', authorize, async (req, res) => {
    const updatedMerchant = await MerchantService.updateMerchant(req.params.id, req.body);
    res.json(updatedMerchant);
});

router.delete('/:id', authorize, async (req, res) => {
    await MerchantService.deleteMerchant(req.params.id);
    res.json({ message: 'Merchant deleted' });
});

export default router;
