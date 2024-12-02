import express from 'express';
import Categorie from '../models/categorie.js';

const router = express.Router();

// Create a new category
router.post("/", async (req, res) => {
    const cat1 = new Categorie(req.body);
    try {
        await cat1.save();
        res.status(200).json(cat1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Update a category by ID
router.put("/:id", async (req, res) => {
    try {
        const cat1 = await Categorie.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(cat1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const cat = await Categorie.find({}, null, { sort: { '_id': -1 } });
        res.status(200).json(cat);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get a category by ID
router.get("/:id", async (req, res) => {
    try {
        const cat = await Categorie.findById(req.params.id);
        res.status(200).json(cat);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
    try {
        await Categorie.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Catégorie supprimée" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;
