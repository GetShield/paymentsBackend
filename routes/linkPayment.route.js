// routes/linkPaymentRoutes.js

// @ts-nocheck
import authorize from '../middlewares/authorize';
const express = require('express');
const router = express.Router();
const merchantService = require('../services/merchantService');
const axios = require('axios');
const LinkPaymentService = require('../services/LinkPaymentService');

router.get('/', authorize, async (req, res) => {
    try {
        const linkPayments = await LinkPaymentService.getLinkPayments();
        res.json(linkPayments);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
const getTransactionStatus = async (txHash) => {
    try {
        // URL de la API de TronGrid
        const options = {
            method: 'POST',
            headers: { accept: 'application/json', 'content-type': 'application/json' },
            body: JSON.stringify({ value: txHash })
        };

        let data = await fetch('https://api.trongrid.io/wallet/gettransactioninfobyid', options)
        data = await data.json()
        return data;

    } catch (error) {
        console.error('Error fetching transaction status:', error);
    }
};

router.get('/get/:id', async (req, res) => {
    try {
        const linkPayment = await LinkPaymentService.getLinkPaymentById(req.params.id);
        console.log(linkPayment, "p", req.params.id)
        if (!linkPayment) {
            return res.status(404).json({ message: 'LinkPayment not found' });
        }
        const merchant = await merchantService.getMerchantById(linkPayment.merchantId);
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }
        // Convertir a objeto plano y eliminar la contraseña
        const merchantWithoutPassword = { ...merchant.toObject(), password: undefined };
        // Convertir linkPayment a objeto plano y agregar el merchant
        const linkPaymentWithMerchant = { ...linkPayment.toObject(), merchant: merchantWithoutPassword };

        res.json(linkPaymentWithMerchant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.post('/walletTriedpayment', async (req, res) => {
    try {

        let statusTX = await getTransactionStatus(req.body.id);
        if (statusTX.result == "CONFIRMED") {

            const linkPayment = await LinkPaymentService.addWalletTriedPayment(req.body.id, req.body.wallet);
        } else {

        }
        res.status(200).send({ status: 'success', response: [] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.post('/save/:id', async (req, res) => {
    try {
        const linkPayment = await LinkPaymentService.addWalletTriedPayment(req.params.id, null, req.body.hash);
        res.status(200).send({ status: 'success', response: [] });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/all', authorize, async (req, res) => {
    try {
        const linkPayment = await LinkPaymentService.getLinkPaymentByMerchantId(req.merchant.id);
        if (!linkPayment) {
            return res.status(404).json({ message: 'LinkPayment not found' });
        }
        res.json(linkPayment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/', authorize, async (req, res) => {
    try {
        const merchantId = req.merchant.id; // Obtener merchantId del token
        const newLinkPayment = await LinkPaymentService.createLinkPayment(req.body, merchantId);
        res.json(newLinkPayment);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// router.put('/:id', authorize, async (req, res) => {
//     try {
//         const updatedLinkPayment = await LinkPaymentService.updateLinkPayment(req.params.id, req.body);
//         res.json(updatedLinkPayment);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });

router.delete('/:id', authorize, async (req, res) => {
    // try {
    //     await LinkPaymentService.deleteLinkPayment(req.params.id);
    //     res.json({ message: 'LinkPayment deleted' });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Server Error');
    // }
});

export default router;