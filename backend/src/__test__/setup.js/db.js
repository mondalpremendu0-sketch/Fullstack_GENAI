const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    // 1. Start the in-memory server
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // 2. Connect Mongoose to this temporary URI
    await mongoose.connect(process.env.MONGO_URI);
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    if (mongod) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }
};

/**
 * Remove all data from all collections.
 * We run this after every single test so they don't interfere with each other!
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};
