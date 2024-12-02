import Stripe from 'stripe';  // Use import instead of require
import dotenv from 'dotenv';   // Use import for dotenv

dotenv.config();  // Load environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize Stripe

export default stripe;  // Export using ES module syntax
