import express from 'express';
import { verifyToken } from '../middleware/verify-token.js';
import stripe from '../utils/stripe.js';
import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/create-checkout-session', verifyToken, async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        let totalAmount = 0;

        const lineItems = products.map((item) => {
            const amount = Math.round(item.product.prix * 100); // Stripe expects amount in cents
            totalAmount += amount * item.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.designation,
                        images: [item.product.imageart],
                    },
                    unit_amount: amount,
                },
                quantity: item.quantity || 1,
            };
        });

        console.log(lineItems);
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.userId, isActive: true });
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                ? [
                    {
                        coupon: await createStripeCoupon(coupon.discountPercentage),
                    },
                ]
                : [],
            metadata: {
                userId: req.userId.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p.product._id,
                        quantity: p.quantity,
                        price: p.product.prix,
                    }))
                ),
            },
        });

        if (totalAmount >= 20000) {
            await createNewCoupon(req.userId);
        }

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
});

async function createStripeCoupon(discountPercentage) {
    const stripeCoupon = await stripe.coupons.create({
        duration: 'once',
        percent_off: discountPercentage,
    });
    return stripeCoupon.id;
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });
    const coupon = await Coupon.create({
        userId,
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        isActive: true,
        expirationDate: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days from now
    });
    await coupon.save();
    return coupon;
}

router.post('/checkout-success', verifyToken, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(session);
        if (session.payment_status === 'paid') {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode, userId: session.metadata.userId },
                    { isActive: false }
                );
            }
        }

        const products = JSON.parse(session.metadata.products);
        console.log(products);

        const newOrder = await Order.create({
            user: session.metadata.userId,
            products: products.map(item => ({
                article: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: session.amount_total / 100, // convert from cents to dollars
            status: 'pending',
            stripeSessionId: sessionId
        });
        console.log(newOrder);

        if (newOrder) {
            const userId = req.userId;
            const user = await User.findById(userId);
            user.cartItems = []; // Reset the user's cart items
            await user.save();
        }

        res.json({ message: 'Order Created, products removed from the cart, and coupon is not active anymore', newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in checkout success' });
    }
});

export default router;
