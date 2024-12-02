import { verifyToken } from '../middleware/verify-token.js';
import Coupon from '../models/coupon.model.js';
import express from 'express';

const router = express.Router();

// Get the active coupon for the user
router.get('/', verifyToken, async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.userId, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json(coupon);
    } catch (err) {
        console.log("Error in getCoupon controller");
        res.status(400).json({ message: err.message });
    }
});

// Validate a coupon
router.post('/validate', verifyToken, async (req, res) => {
    try {
        const { couponCode } = req.body;
        console.log(couponCode);
        const coupon = await Coupon.findOne({ code: couponCode, userId: req.userId, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or expired' });
        }
        if (coupon.expirationDate < Date.now()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: 'Coupon expired' });
        }
        res.json({
            message: 'Coupon valid',
            discount: coupon.discountPercentage,
            code: coupon.code
        });
    } catch (err) {
        console.log("Error in validateCoupon controller");
        res.status(400).json({ message: err.message });
    }
});

export default router;
