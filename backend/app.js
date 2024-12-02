import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import categorieRouter from './routes/categorie.route.js';
import scategorieRouter from './routes/scategorie.route.js';
import articleRouter from './routes/article.route.js';
import paymentRouter from './routes/payment.route.js';
import userRouter from './routes/user.route.js';
import connectionToDb from './utils/ConnectionToDatabase.js';
import cartRouter from './routes/cart.route.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("page accueil");
});

app.get("/contact", (req, res) => {
    res.send("page contact");
});

app.use("/api/categories", categorieRouter);
app.use("/api/scategories", scategorieRouter);
app.use("/api/articles", articleRouter);
app.use('/api/payment', paymentRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);

app.listen(process.env.PORT, () => {
    connectionToDb();
    console.log("Serveur démarré sur le port " + process.env.PORT);
});
