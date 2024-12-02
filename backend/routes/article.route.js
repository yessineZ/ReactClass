import express from 'express';
import Article from '../models/article.js';
import { verifyToken } from '../middleware/verify-token.js';

const router = express.Router();

router.post("/", async (req, res) => {
    const art1 = new Article(req.body);
    try {
        await art1.save();
        res.status(200).json(art1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const art1 = await Article.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(art1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const art = await Article.find({}, null, { sort: { '_id': -1 } }).populate("scategorieID");
        res.status(200).json(art);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const art = await Article.findById(req.params.id).populate("scategorieID");
        res.status(200).json(art);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Article supprimée avec succès" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/art/pagination', async (req, res) => {
    const filtre = req.query.filtre || ""; 
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    
    // Calculate the start and end indexes for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const articles = await Article.find({ designation: { $regex: filtre, $options: "i" } }, null, { sort: { '_id': -1 } }).populate("scategorieID").exec();
    // Slice the products array based on the indexes
    const paginatedProducts = articles.slice(startIndex, endIndex);
    
    // Calculate the total number of pages
    const totalPages = Math.ceil(articles.length / pageSize);
    
    // Send the paginated products and total pages as the API response
    res.json({ products: paginatedProducts, totalPages });
});

router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        console.log(category);
        const articles = await Article.find().populate("scategorieID");
        console.log(articles);
        const filteredArticles = articles.filter(article => article.scategorieID.nomscategorie === category);
        res.json({ products: filteredArticles });
    } catch (err) {
        console.log(err.message);
    }
});

export default router;
