import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import { verifyToken } from '../middleware/verify-token.js';
import { generateToken, setCookies } from '../utils/generateToken.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hsan.hachicha@gmail.com',
        pass: 'wmjc bdal dtxp grjr',
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
        let { email, password, firstname, lastname } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(404).send({ success: false, message: "User already exists" });

        const newUser = new User({ email, password, firstname, lastname });
        const createdUser = await newUser.save();

        // Envoyer l'e-mail de confirmation de l'inscription
        const mailOption = {
            from: '"Verify Your Email" <esps421@gmail.com>',
            to: newUser.email,
            subject: 'Activation du compte',
            html: `<h2>${newUser.firstname}! Thank you for registering on our website</h2>
                <h4>Please verify your email to proceed...</h4>
                <a href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">Click here</a>`,
        };

        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Verification email sent to your Gmail account');
            }
        });

        const token = generateToken(createdUser._id);
        setCookies(res, token);

        return res.status(201).send({ success: true, message: "Account created successfully", user: createdUser });
    } catch (err) {
        console.log(err);
        res.status(404).send({ success: false, message: err.message });
    }
});

// Afficher la liste des utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Activer / Désactiver un compte
router.get('/status/edit/', async (req, res) => {
    try {
        let email = req.query.email;
        let user = await User.findOne({ email });
        user.isActive = true;
        await user.save();
        res.status(200).send({ success: true, user });
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

// Se connecter
router.post('/login', async (req, res) => {
    try {
        console.log("hello") ; 
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({ success: false, message: "All fields are required" });
        }

        let user = await User.findOne({ email }).select('+password').select('+isActive');
        if (!user) {
            return res.status(404).send({ success: false, message: "Account doesn't exist" });
        } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                delete user._doc.password;
                const token = generateToken(user._id) ;
                setCookies(res, token) ;
                return res.status(200).send({ success: true, user, token ,message  : "Logged In Succesfully" });
            } else {
                return res.status(404).send({ success: false, message: "Please verify your credentials" });
            }
        }
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message });
    }
});

// Get logged in user data
const getMe = async (req, res) => {
    try {
        const UserId = req.userId;
        const user = await User.findById(UserId).select('-password');
        if (!user) {
            return res.json({ message: 'User Not Found' });
        }

        res.json({ user });
    } catch (err) {
        console.log(err.message);
    }
};

router.get('/getMe', verifyToken, getMe);

export default router;
