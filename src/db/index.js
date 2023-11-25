require('dotenv').config();

const mongoose = require('mongoose');

module.exports = async client => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URI);
        console.log(`Database connected`);
    } catch (error) {
        console.log(`Error connecting to the database: ${error}`);
    }
};
