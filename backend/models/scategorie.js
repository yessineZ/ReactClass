import mongoose from 'mongoose';

const scategorieSchema = new mongoose.Schema({
    nomscategorie: { type: String, required: true },
    imagescat: { type: String, required: false },
    categorieID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
    },
});

const Scategorie = mongoose.model('Scategorie', scategorieSchema);

export default Scategorie;
