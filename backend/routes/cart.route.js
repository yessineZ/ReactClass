import express from 'express';
import User from '../models/user.js';
import { verifyToken } from '../middleware/verify-token.js';
import Article from '../models/article.js';  // Assuming Article is another model.

const router = express.Router();

router.get('/getCartProducts', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        const products = await Article.find({ _id: { $in: user.cartItems.map(item => item.product) } });
        const cartItems = products.map((product) => {
            const item = user.cartItems.find(cartItem => cartItem.product.equals(product._id));
            return {
                product,
                quantity: item.quantity,
            };
        });

        return res.json({ cartItems });
    } catch (err) {
        console.log('Error in getCartProducts controller:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/addToCart', verifyToken, async (req, res) => {
    try {
        console.log("helo") ; 
        const { productId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        const existingItem = user.cartItems.find((item) => item.product.equals(productId));
        if (existingItem) {
            existingItem.quantity++;
        } else {
            user.cartItems.push({ product: productId, quantity: 1 });
        }
        await user.save();
        return res.json(user.cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

router.get('/removeAllFromCart', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        const { productId } = req.body;

        if (!productId) return res.json('Product Not found');
        else {
            user.cartItems = user.cartItems.filter(item => !item.product.equals(productId));
        }
        await user.save();
        return res.json(user.cartItems);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Failed to remove from cart' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        
        const existingItem = user.cartItems.find((item) => item.product.equals(productId));

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => !item.product.equals(productId));
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
