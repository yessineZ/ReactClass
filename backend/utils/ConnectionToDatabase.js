import mongoose from 'mongoose';

const connectionToDb = () => {
    try {
        mongoose.connect(process.env.DATABASE_URL).then(() => {
            console.log('Connected to database');
        });
    } catch (err) {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    }
};

export default connectionToDb;
