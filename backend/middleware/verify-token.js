import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

/**
 *
 * Middleware function that checks if the user has a valid token and can access the resource.
 *
 * @param {string} token - Authorization token provided by the request sender
 *
 * @return
 * @status 403 No token provided
 * @status 403 Invalid token
 *
 */

const verifyToken = async (req, res, next) => {
    const token = req.cookies.accessToken;

    console.log('checkAuth');
    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify token
    try {
        const decoded = await jwt.verify(token, process.env.SECRET);
        const user = await User.findById(decoded.id);
        req.userId = user._id;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Token verification failed' });
    }
};

export { verifyToken };
