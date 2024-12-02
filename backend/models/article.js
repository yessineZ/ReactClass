import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true },
    designation: { type: String, required: true, unique: true },
    prix: { type: Number, required: false },
    marque: { type: String, required: true },
    qtestock: { type: Number, required: false },
    imageart: { type: String, required: false },
    scategorieID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scategorie',
    },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
