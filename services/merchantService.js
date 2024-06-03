// services/merchantService.js
// @ts-nocheck
const Merchant = require('../models/Merchant');


export class MerchantService {
    static getMerchants = async () => {
        return await Merchant.find();
    };

    static getMerchantById = async (id) => {
        return await Merchant.findById(id);
    };

    static createMerchant = async (merchantData) => {
        const merchant = new Merchant(merchantData);
        return await merchant.save();
    };

    static updateMerchant = async (id, merchantData) => {
        return await Merchant.findByIdAndUpdate(id, merchantData, { new: true });
    };

    static deleteMerchant = async (id) => {
        return await Merchant.findByIdAndDelete(id);
    };

}

