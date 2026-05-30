require('dotenv').config();
const mongoose = require('mongoose');

// We explicitly name this database so it NEVER touches your real data!
// Change the port if your local Mongo uses something other than 27017
const TEST_URI = 'mongodb+srv://Premendu:NYMTwCRk3wlQEdBh@myfirstdatabase.e04azfr.mongodb.net/PrepGenius_TEST_DB';

module.exports.connect = async () => {
    // Connect Mongoose to the Test Database
    await mongoose.connect(TEST_URI);
};

module.exports.closeDatabase = async () => {
    // Completely delete the Test Database and close the connection
    if (mongoose.connection.readyState === 1) { // If connected
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
};

module.exports.clearDatabase = async () => {
    // Wipe all collections clean after every single test
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
};